import { Router } from "express";

const router = Router();

router.get("/community/prayers", (_req, res) => {
  res.json({ prayers: [], total: 0 });
});

router.get("/community/prayers/:id", (req, res) => {
  res.status(404).json({ error: "Prayer not found", id: req.params.id });
});

router.post("/community/prayers", (_req, res) => {
  res.status(201).json({ ok: true, id: `prayer-${Date.now()}` });
});

router.post("/community/prayers/:id/pray", (_req, res) => {
  res.json({ ok: true });
});

router.get("/community/chat/rooms", (_req, res) => {
  res.json({ rooms: [] });
});

router.get("/community/chat/:roomId/messages", (_req, res) => {
  res.json({ messages: [], total: 0 });
});

router.post("/community/chat/:roomId/messages", (_req, res) => {
  res.status(201).json({
    message: {
      id: `msg-${Date.now()}`,
      content: "",
      createdAt: new Date().toISOString(),
    },
  });
});

router.delete("/community/chat/:roomId/messages/:messageId", (_req, res) => {
  res.json({ ok: true });
});

export default router;
