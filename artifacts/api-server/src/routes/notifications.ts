import { Router } from "express";

const router = Router();

router.get("/notifications", (_req, res) => {
  res.json({ notifications: [], unreadCount: 0 });
});

router.post("/notifications", (_req, res) => {
  res.status(201).json({ ok: true });
});

router.post("/notifications/read-all", (_req, res) => {
  res.json({ ok: true });
});

router.patch("/notifications/:id/read", (_req, res) => {
  res.json({ ok: true });
});

export default router;
