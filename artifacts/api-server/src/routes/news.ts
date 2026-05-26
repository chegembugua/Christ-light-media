import { Router } from "express";
import { db } from "../lib/db";
import { newsArticles } from "@workspace/db/schema";
import { eq, ilike, or, and, desc, asc, count, ne, sql } from "drizzle-orm";

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

// News archive — same logic as /news but also supports `year` filter
// Must be registered BEFORE /news/:slug to avoid slug capturing "archive"
router.get("/news/archive", async (req, res) => {
  const {
    category,
    q,
    search,
    sort = "newest",
    year,
    limit: lim,
    offset: off,
  } = req.query as Record<string, string>;

  const limit = Math.min(Number(lim ?? 20), 100);
  const offset = Number(off ?? 0);
  const searchTerm = (search ?? q ?? "").trim();

  try {
    const conditions = [eq(newsArticles.isPublished, true)];

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
    if (year) {
      conditions.push(sql`EXTRACT(YEAR FROM ${newsArticles.createdAt}) = ${Number(year)}`);
    }

    const where = and(...conditions);
    const orderBy =
      sort === "oldest"
        ? [asc(newsArticles.createdAt)]
        : sort === "most-viewed"
        ? [desc(newsArticles.viewCount)]
        : [desc(newsArticles.createdAt)];

    const baseWhere = eq(newsArticles.isPublished, true);
    const [rows, [{ total }], catRows, yearRows] = await Promise.all([
      db.select().from(newsArticles).where(where).orderBy(...orderBy).limit(limit).offset(offset),
      db.select({ total: count() }).from(newsArticles).where(where),
      db.select({ category: newsArticles.category }).from(newsArticles).where(baseWhere),
      db.select({ year: sql<number>`EXTRACT(YEAR FROM ${newsArticles.createdAt})::int` })
        .from(newsArticles)
        .where(baseWhere)
        .groupBy(sql`EXTRACT(YEAR FROM ${newsArticles.createdAt})`)
        .orderBy(desc(sql`EXTRACT(YEAR FROM ${newsArticles.createdAt})`)),
    ]);

    const catCountMap: Record<string, number> = {};
    for (const r of catRows) {
      if (r.category) catCountMap[r.category] = (catCountMap[r.category] ?? 0) + 1;
    }
    const categories = Object.entries(catCountMap).map(([name, c]) => ({ name, count: c }));
    const years = yearRows.map((r) => r.year).filter(Boolean);

    return res.json({ news: rows, total, categories, years });
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

// Related articles — same category, excluding the current article
router.get("/news/:slug/related", async (req, res) => {
  const limit = Math.min(Number((req.query.limit as string) ?? 3), 10);
  try {
    const article = await db.query.newsArticles.findFirst({
      where: and(eq(newsArticles.slug, req.params.slug), eq(newsArticles.isPublished, true)),
    });
    if (!article) return res.status(404).json({ error: "Article not found" });

    const rows = await db
      .select()
      .from(newsArticles)
      .where(
        and(
          eq(newsArticles.isPublished, true),
          eq(newsArticles.category, article.category),
          ne(newsArticles.slug, article.slug)
        )
      )
      .orderBy(desc(newsArticles.createdAt))
      .limit(limit);

    return res.json({ articles: rows });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
