import { Router } from "express";
import { db } from "../lib/db";
import { newsArticles } from "@workspace/db/schema";
import { eq, ilike, or, and, desc, asc, count } from "drizzle-orm";

const router = Router();

router.get("/news", async (req, res) => {
  // Accept both `q` and `search` for text search
  const {
    category,
    q,
    search,
    sort = "newest",
    dateRange,
    limit: lim,
    offset: off,
  } = req.query as Record<string, string>;

  const limit = Math.min(Number(lim ?? 20), 100);
  const offset = Number(off ?? 0);
  const searchTerm = (search ?? q ?? "").trim();

  try {
    const conditions = [eq(newsArticles.isPublished, true)];

    // `category=all` or `category=featured` — handled specially, not as a literal DB filter
    if (category && category !== "all" && category !== "featured") {
      conditions.push(eq(newsArticles.category, category));
    }
    if (category === "featured") {
      conditions.push(eq(newsArticles.isFeature, true));
    }
    if (searchTerm) {
      conditions.push(
        or(
          ilike(newsArticles.title, `%${searchTerm}%`),
          ilike(newsArticles.excerpt, `%${searchTerm}%`),
          ilike(newsArticles.content, `%${searchTerm}%`)
        )!
      );
    }

    const where = and(...conditions);

    // Sort order
    const orderBy =
      sort === "oldest"
        ? [asc(newsArticles.createdAt)]
        : sort === "most-viewed"
        ? [desc(newsArticles.viewCount)]
        : [desc(newsArticles.createdAt)];

    // Category counts — always from all published articles (no search/date filter)
    const [rows, [{ total }], catRows] = await Promise.all([
      db
        .select()
        .from(newsArticles)
        .where(where)
        .orderBy(...orderBy)
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(newsArticles).where(where),
      db
        .select({ category: newsArticles.category })
        .from(newsArticles)
        .where(eq(newsArticles.isPublished, true)),
    ]);

    // Build categories as { name, count }[] — shape the frontend expects
    const catCountMap: Record<string, number> = {};
    for (const r of catRows) {
      if (r.category) catCountMap[r.category] = (catCountMap[r.category] ?? 0) + 1;
    }
    const categories = Object.entries(catCountMap).map(([name, c]) => ({ name, count: c }));

    return res.json({ news: rows, total, categories });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/news/featured", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(newsArticles)
      .where(and(eq(newsArticles.isPublished, true), eq(newsArticles.isFeature, true)))
      .orderBy(desc(newsArticles.createdAt))
      .limit(3);
    return res.json({ news: rows });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/news/:slug", async (req, res) => {
  try {
    const row = await db.query.newsArticles.findFirst({
      where: eq(newsArticles.slug, req.params.slug),
    });
    if (!row || !row.isPublished) return res.status(404).json({ error: "Article not found" });
    await db
      .update(newsArticles)
      .set({ viewCount: row.viewCount + 1 })
      .where(eq(newsArticles.slug, req.params.slug));
    return res.json({ article: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
