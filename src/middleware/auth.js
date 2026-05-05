import { authenticateSessionToken } from "../db/sessions";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
export async function requireAuth(req, res, next) {
    const token = req.cookies.session;
    if(!token) return res.status(401).json({ error: "unauthorized" });
    
    const {ok, user_id} = await authenticateSessionToken(token);
    if(!ok) return res.status(401).json({ error: "unauthorized" });
    
    req.userId = user_id;
    next();
}