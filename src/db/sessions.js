import { randomUUID } from "crypto";

import pool from "../db/db.js";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export async function createSessionToken(user_id, duration = SEVEN_DAYS){
    const token = randomUUID();
    const expires_at = new Date(Date.now() + duration);
    await pool.query("INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)", [user_id, token, expires_at]);
    return {token, expires_at};
}

export async function authenticateSessionToken(session_token){
    const result = await pool.query("SELECT id, user_id, expires_at FROM sessions WHERE token = $1", [session_token]);
    if(!result.rows[0]) return {ok: false, code: "invalid_token"};
    const {id, user_id, expires_at} = result.rows[0];
    if(!user_id) return {ok: false, code: "invalid_token"};
    if(new Date() < expires_at) return {ok: true, user_id, expires_at};
    await deleteSession(id);
    return {ok: false, code: "invalid_token"};
}

export async function deleteSessionToken(token){
    await pool.query("DELETE FROM sessions WHERE token = $1",[token]);
}

async function deleteSession(id){
    await pool.query("DELETE FROM sessions WHERE id = $1",[id]);
}