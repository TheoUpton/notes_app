import pool from "../db/db.js";
import { hashPassword, verifyPassword } from "../utils/passwordHash.js";
import { isValidEmail, isValidPassword } from "../utils/validation.js";

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{ok: boolean, user_id: string, code: "invalid_email" | "invalid_password" | "email_exists"}>}
 */
export async function createUser(email, password){
    if(!isValidEmail(email)) return {ok: false, code: "invalid_email"};
    if(!isValidPassword(password)) return {ok: false, code: "invalid_password"};
    const password_hash = await hashPassword(password);
    try {
        const result = await pool.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id", [email, password_hash]);
        return {ok: true, user_id:result.rows[0].id};
    } catch (err) {
        if (err && err.code === '23505') return {ok: false, code: "email_exists"};
        throw err;
    }
}
/**
 * 
 * @param {string} email 
 * @returns {Promise<null | {id: string, email: string, password_hash: string, created_at: Date}>}
 */
async function findUserByEmail(email) {
  const res = await pool.query('SELECT id, email, password_hash, created_at FROM users WHERE email = $1', [email]);
  return res.rows[0] ?? null;
}

export async function authenticateUser(email, password){
    const row = await findUserByEmail(email);
    if(!row) return {ok: false, code: "invalid_credentials"};
    const passwordMatch = await verifyPassword(password, row.password_hash);
    if(!passwordMatch) return {ok: false, code: "invalid_credentials"};
    return {ok: true, user_id: row.id};
}

