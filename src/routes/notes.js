import { Router } from "express";

import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => res.sendStatus(501));
router.post("/", requireAuth, async (req, res) => res.sendStatus(501));
router.patch("/:id", requireAuth, async (req, res) => res.sendStatus(501));
router.delete("/:id", requireAuth, async (req, res) => res.sendStatus(501));

export default router;