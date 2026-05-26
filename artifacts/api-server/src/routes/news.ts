import { Router } from "express";

const router = Router();

router.get("/news", (_req, res) => {
  res.json({ news: [], total: 0, featured: null, categories: [] });
});

router.get("/news/archive", (_req, res) => {
  res.json({ news: [], total: 0 });
});

router.get("/news/:slug/related", (_req, res) => {
  res.json({ articles: [] });
});

router.get("/news/:slug", (req, res) => {
  res.status(404).json({ error: "Article not found", slug: req.params.slug });
});

export default router;
