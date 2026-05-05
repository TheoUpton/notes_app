import { Router } from "express";

import { authenticateUser, createUser } from "../db/users.js";
import { createSessionToken, deleteSessionToken } from "../db/sessions.js";

const router = Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const {ok, user_id, code} = await createUser(email, password);
    if(ok){
        const {token, expires_at} = await createSessionToken(user_id);
        return attachToken(res, token, expires_at);
    }
    if(code === "invalid_email"){
        return res.status(400).json({
            error: "invalid_input",
            message: "given email is not valid"
        });
    } 
    if (code === "invalid_password"){
        return res.status(400).json({
            error: "invalid_input",
            message: "given password is not valid"
        });
    } 
    if (code === "email_exists"){
        return res.status(409).json({
            error: "email_exists",
            message: "An account with that email already exists"
        });
    }
    return res.status(500).json({
        error: "server_error",
        message: "Something went wrong"
    });
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const {ok, user_id, code} = await authenticateUser(email, password);
    if(!ok && code === "invalid_credentials"){
        return res.status(401).json({
            error: "invalid_credentials",
            message: "Email or password is incorrect"
        });
    }
    if(!ok){
        return res.status(500).json({
            error: "server_error",
            message: "Something went wrong"
        });
    }
    const {token, expires_at} = await createSessionToken(user_id);
    return attachToken(res, token, expires_at);
});
router.post("/logout", async (req, res) => {
    const token = req.cookies.session;
    if(token) await deleteSessionToken(token);
    res.clearCookie("session");
    return res.status(200).json({ message: "Logged out" });
});

/**@param {import("express").Response} res @param {Date} expiresAt */
function attachToken(res, token, expiresAt){
    res.cookie("session", token, {
        httpOnly: true,
        sameSite: "strict",
        expires: expiresAt,
        secure: process.env.NODE_ENV === "production"
    }).json({message: "ok"});
}
export default router;