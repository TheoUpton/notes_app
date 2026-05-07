import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import { createTask, deleteTask, hasTask, listTasks, TaskUpdater } from "../db/notes";

const router = Router();

router.get("/", requireAuth, async (req, res) => res.json(await listTasks(req.userId, req.query.parent_id)));
router.post("/", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const {parent_id, content} = req.body;
    const {ok, id, code} = await createTask(content, user_id, parent_id);
    if(ok && id) return res.json(id);
    if(!ok && code === "not_found") return res.status(404).json({error: code, message: "Task not found"});
    return res.status(500).json({
        error: "server_error",
        message: "Something went wrong"
    });
});
router.patch("/:id", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const id = await hasTask(user_id, req.params.id);
    if(!id) return res.status(404).json({error: "not_found", message: "Task not found"});
    const {parent_id, content} = req.body;
    /**@type {undefined | null | Date} */
    const completed_at = req.body.completed_at != null ? new Date(req.body.completed_at) : req.body.completed_at;
    const isInvalid = 
        (!parent_id && !content && completed_at === undefined) ||
        (content && typeof content !== "string") ||
        (completed_at && isNaN(completed_at.getTime()));
    if(isInvalid) return res.status(400).json({error:"invalid_input", message: "Invalid input"});
    if (parent_id && !await hasTask(user_id, parent_id))
        return res.status(404).json({ error: "not_found", message: "Task not found" });
    const updater = new TaskUpdater(id, user_id);
    if(parent_id !== undefined) updater.setParentId(parent_id);
    if(content !== undefined) updater.setContent(content);
    if(completed_at !== undefined) updater.setCompletedAt(completed_at);
    try { res.json(await updater.execute());}
    catch (err) { res.status(500).json({error: "server_error", message: "Something went wrong"})}
});
router.delete("/:id", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const id = req.params.id;
    if(await deleteTask(id, user_id)) res.sendStatus(204);
    else res.status(404).json({error: "not_found", message: "Task not found"});
});

export default router;