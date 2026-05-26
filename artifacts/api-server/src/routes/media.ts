import { Router } from "express";

const router = Router();

router.get("/media", (_req, res) => {
  res.json({ media: [], total: 0 });
});

router.get("/media/artists", (_req, res) => {
  res.json({ artists: [] });
});

router.get("/media/speakers", (_req, res) => {
  res.json({ speakers: [] });
});

router.get("/media/leaders", (_req, res) => {
  res.json({ leaders: [] });
});

router.get("/media/favorites", (_req, res) => {
  res.json({ favorites: [] });
});

router.post("/media/favorites", (_req, res) => {
  res.json({ ok: true });
});

router.delete("/media/favorites/:id", (_req, res) => {
  res.json({ ok: true });
});

export default router;
