import { Router } from "express";

const router = Router();

router.get("/community/prayers", (_req, res) => {
  res.json({ prayers: [], total: 0 });
});

router.get("/community/prayers/:id", (req, res) => {
  res.status(404).json({ error: "Prayer not found", id: req.params.id });
});

router.post("/community/prayers", (_req, res) => {
  res.status(201).json({ ok: true, id: "new" });
});

router.post("/community/prayers/:id/pray", (_req, res) => {
  res.json({ ok: true });
});

router.get("/community/chat/rooms", (_req, res) => {
  res.json({ rooms: [] });
});

router.get("/community/chat/:roomId/messages", (_req, res) => {
  res.json({ messages: [] });
});

router.post("/community/chat/:roomId/messages", (_req, res) => {
  res.status(201).json({ ok: true });
});

export default router;
