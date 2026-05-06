import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import { createTask, listTasks } from "../db/notes";

const router = Router();

router.get("/", requireAuth, async (req, res) => res.json(await listTasks(req.userId, req.query.parent_id)));
router.post("/", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const {parent_id, content} = req.body;
    const {ok, id, code} = await createTask(content, user_id, parent_id);
    if(ok && id) return res.json(id);
    if(!ok && code === "not_found") return res.status(404).json({code, message: "Task not found"});
    return res.status(500).json({
        error: "server_error",
        message: "Something went wrong"
    });
});
router.patch("/:id", requireAuth, async (req, res) => res.sendStatus(501));
router.delete("/:id", requireAuth, async (req, res) => res.sendStatus(501));

export default router;