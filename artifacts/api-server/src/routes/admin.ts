import { Router } from "express";

const router = Router();

const stubMedia = () => ({
  id: `media-${Date.now()}`,
  title: "",
  type: "SERMON",
  audioUrl: "",
  coverImage: "",
  published: false,
  createdAt: new Date().toISOString(),
});

const stubDevotion = () => ({
  id: `devotion-${Date.now()}`,
  title: "",
  content: "",
  scriptureReference: "",
  published: false,
  createdAt: new Date().toISOString(),
});

const stubArticle = () => ({
  id: `article-${Date.now()}`,
  slug: `article-${Date.now()}`,
  title: "",
  content: "",
  published: false,
  createdAt: new Date().toISOString(),
});

router.get("/admin/media", (_req, res) => {
  res.json({ media: [], total: 0 });
});

router.post("/admin/media", (_req, res) => {
  res.status(201).json({ media: stubMedia() });
});

router.get("/admin/media/:id", (req, res) => {
  res.status(404).json({ error: "Media not found", id: req.params.id });
});

router.patch("/admin/media/:id", (_req, res) => {
  res.json({ media: stubMedia() });
});

router.delete("/admin/media/:id", (_req, res) => {
  res.json({ success: true });
});

router.get("/admin/devotions", (_req, res) => {
  res.json({ devotions: [], total: 0 });
});

router.post("/admin/devotions", (_req, res) => {
  res.status(201).json({ devotion: stubDevotion() });
});

router.get("/admin/devotions/:id", (req, res) => {
  res.status(404).json({ error: "Devotion not found", id: req.params.id });
});

router.patch("/admin/devotions/:id", (_req, res) => {
  res.json({ devotion: stubDevotion() });
});

router.delete("/admin/devotions/:id", (_req, res) => {
  res.json({ success: true });
});

router.get("/admin/news", (_req, res) => {
  res.json({ news: [], total: 0 });
});

router.post("/admin/news", (_req, res) => {
  res.status(201).json({ article: stubArticle() });
});

router.get("/admin/news/:slug", (req, res) => {
  res.status(404).json({ error: "Article not found", slug: req.params.slug });
});

router.patch("/admin/news/:slug", (_req, res) => {
  res.json({ article: stubArticle() });
});

router.delete("/admin/news/:slug", (_req, res) => {
  res.json({ success: true });
});

export default router;
