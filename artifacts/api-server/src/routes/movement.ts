import { Router } from "express";

const router = Router();

router.get("/movement/testimonies", (_req, res) => {
  res.json({ testimonies: [], featured: null, total: 0 });
});

router.get("/movement/testimonies/:id", (req, res) => {
  res.status(404).json({ error: "Testimony not found", id: req.params.id });
});

router.post("/movement/testimonies", (_req, res) => {
  res.status(201).json({ ok: true });
});

router.post("/movement/testimonies/:id/react", (_req, res) => {
  res.json({ ok: true });
});

router.get("/movement/challenges/:slug", (req, res) => {
  res.status(404).json({ error: "Challenge not found", slug: req.params.slug });
});

router.get("/movement/challenges/:slug/progress", (_req, res) => {
  res.json({ progress: null });
});

router.post("/movement/challenges/:slug/enroll", (_req, res) => {
  res.status(201).json({ ok: true });
});

router.post("/movement/challenges/:slug/progress", (_req, res) => {
  res.json({ ok: true });
});

export default router;
