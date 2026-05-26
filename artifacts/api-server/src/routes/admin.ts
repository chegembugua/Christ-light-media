import { Router } from "express";

const router = Router();

router.get("/admin/media", (_req, res) => {
  res.json({ media: [], total: 0 });
});

router.post("/admin/media", (_req, res) => {
  res.status(201).json({ ok: true });
});

router.get("/admin/media/:id", (req, res) => {
  res.status(404).json({ error: "Media not found", id: req.params.id });
});

router.patch("/admin/media/:id", (_req, res) => {
  res.json({ ok: true });
});

router.delete("/admin/media/:id", (_req, res) => {
  res.json({ ok: true });
});

router.get("/admin/devotions", (_req, res) => {
  res.json({ devotions: [], total: 0 });
});

router.post("/admin/devotions", (_req, res) => {
  res.status(201).json({ ok: true });
});

router.get("/admin/devotions/:id", (req, res) => {
  res.status(404).json({ error: "Devotion not found", id: req.params.id });
});

router.patch("/admin/devotions/:id", (_req, res) => {
  res.json({ ok: true });
});

router.delete("/admin/devotions/:id", (_req, res) => {
  res.json({ ok: true });
});

router.get("/admin/news", (_req, res) => {
  res.json({ articles: [], total: 0 });
});

router.post("/admin/news", (_req, res) => {
  res.status(201).json({ ok: true });
});

router.get("/admin/news/:slug", (req, res) => {
  res.status(404).json({ error: "Article not found", slug: req.params.slug });
});

router.patch("/admin/news/:slug", (_req, res) => {
  res.json({ ok: true });
});

router.delete("/admin/news/:slug", (_req, res) => {
  res.json({ ok: true });
});

export default router;
