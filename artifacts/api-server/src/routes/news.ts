import { Router } from "express";
import { db } from "../lib/db";
import { newsArticles } from "@workspace/db/schema";
import { eq, ilike, or, and, desc, count } from "drizzle-orm";

const router = Router();

router.get("/news", async (req, res) => {
  const { category, q, limit: lim, offset: off } = req.query as Record<string, string>;
  const limit = Math.min(Number(lim ?? 20), 100);
  const offset = Number(off ?? 0);
  try {
    const conditions = [
      eq(newsArticles.isPublished, true),
      ...(category ? [eq(newsArticles.category, category)] : []),
      ...(q ? [or(ilike(newsArticles.title, `%${q}%`), ilike(newsArticles.excerpt, `%${q}%`))] : []),
    ];
    const where = and(...conditions);
    const [rows, [{ total }], categories] = await Promise.all([
      db.select().from(newsArticles).where(where).orderBy(desc(newsArticles.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(newsArticles).where(where),
      db.selectDistinct({ category: newsArticles.category }).from(newsArticles).where(eq(newsArticles.isPublished, true)),
    ]);
    return res.json({ news: rows, total, categories: categories.map((c) => c.category) });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/news/featured", async (_req, res) => {
  try {
    const rows = await db.select().from(newsArticles)
      .where(and(eq(newsArticles.isPublished, true), eq(newsArticles.isFeature, true)))
      .orderBy(desc(newsArticles.createdAt)).limit(3);
    return res.json({ news: rows });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/news/:slug", async (req, res) => {
  try {
    const row = await db.query.newsArticles.findFirst({ where: eq(newsArticles.slug, req.params.slug) });
    if (!row || !row.isPublished) return res.status(404).json({ error: "Article not found" });
    // Increment view count
    await db.update(newsArticles).set({ viewCount: row.viewCount + 1 }).where(eq(newsArticles.slug, req.params.slug));
    return res.json({ article: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
