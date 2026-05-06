import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import { listTasks } from "../db/notes";

const router = Router();

router.get("/", requireAuth, async (req, res) => res.json(await listTasks(req.userId, req.query.parent_id)));
router.post("/", requireAuth, async (req, res) => res.sendStatus(501));
router.patch("/:id", requireAuth, async (req, res) => res.sendStatus(501));
router.delete("/:id", requireAuth, async (req, res) => res.sendStatus(501));

export default router;