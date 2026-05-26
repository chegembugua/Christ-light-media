import { Router } from "express";
import { db } from "../lib/db";
import { media, podcastShows } from "@workspace/db/schema";
import { eq, ilike, or, and, desc, count } from "drizzle-orm";

const router = Router();

router.get("/media", async (req, res) => {
  const { type, category, q, limit: lim, offset: off } = req.query as Record<string, string>;
  const limit = Math.min(Number(lim ?? 20), 100);
  const offset = Number(off ?? 0);
  try {
    const conditions = [
      eq(media.isPublished, true),
      ...(type ? [eq(media.type, type)] : []),
      ...(category ? [ilike(media.category, `%${category}%`)] : []),
      ...(q ? [or(ilike(media.title, `%${q}%`), ilike(media.speaker, `%${q}%`))] : []),
    ];
    const where = and(...conditions);
    const [rows, [{ total }]] = await Promise.all([
      db.select().from(media).where(where).orderBy(desc(media.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(media).where(where),
    ]);
    return res.json({ media: rows, total });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * GET /api/media/speakers?type= — distinct speakers for a media type
 * GET /api/media/artists?type= — alias for speakers (music)
 * GET /api/media/leaders?type= — alias for speakers (worship)
 */
router.get("/media/speakers", async (req, res) => {
  const { type } = req.query as Record<string, string>;
  try {
    const rows = await db.selectDistinct({ speaker: media.speaker }).from(media)
      .where(and(eq(media.isPublished, true), ...(type ? [eq(media.type, type)] : [])))
      .orderBy(media.speaker);
    const speakers = rows.map((r) => r.speaker).filter(Boolean) as string[];
    return res.json({ speakers });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/media/artists", async (req, res) => {
  const { type } = req.query as Record<string, string>;
  try {
    const rows = await db.selectDistinct({ speaker: media.speaker }).from(media)
      .where(and(eq(media.isPublished, true), ...(type ? [eq(media.type, type)] : [])))
      .orderBy(media.speaker);
    const artists = rows.map((r) => r.speaker).filter(Boolean) as string[];
    return res.json({ artists });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/media/leaders", async (req, res) => {
  const { type } = req.query as Record<string, string>;
  try {
    const rows = await db.selectDistinct({ speaker: media.speaker }).from(media)
      .where(and(eq(media.isPublished, true), ...(type ? [eq(media.type, type)] : [])))
      .orderBy(media.speaker);
    const leaders = rows.map((r) => r.speaker).filter(Boolean) as string[];
    return res.json({ leaders });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * POST /api/media/favorites — add a media item to user favorites (stored in user preferences)
 * DELETE /api/media/favorites — remove a media item from user favorites
 * These store favorites client-side via localStorage; server acknowledges only.
 */
router.post("/media/favorites", async (_req, res) => {
  return res.json({ ok: true });
});

router.delete("/media/favorites", async (_req, res) => {
  return res.json({ ok: true });
});

router.get("/media/featured", async (_req, res) => {
  try {
    const rows = await db.select().from(media).where(eq(media.isPublished, true)).orderBy(desc(media.playCount)).limit(6);
    return res.json({ media: rows });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/media/:id", async (req, res) => {
  try {
    const row = await db.query.media.findFirst({ where: eq(media.id, req.params.id) });
    if (!row || !row.isPublished) return res.status(404).json({ error: "Media not found" });
    return res.json({ media: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/media/:id/play", async (req, res) => {
  try {
    const row = await db.query.media.findFirst({ where: eq(media.id, req.params.id) });
    if (!row) return res.status(404).json({ error: "Media not found" });
    await db.update(media).set({ playCount: row.playCount + 1 }).where(eq(media.id, req.params.id));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/sermons", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  const offset = Number(req.query.offset ?? 0);
  try {
    const [rows, [{ total }]] = await Promise.all([
      db.select().from(media).where(and(eq(media.isPublished, true), eq(media.type, "SERMON"))).orderBy(desc(media.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(media).where(and(eq(media.isPublished, true), eq(media.type, "SERMON"))),
    ]);
    return res.json({ media: rows, total });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/music", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  const offset = Number(req.query.offset ?? 0);
  try {
    const [rows, [{ total }]] = await Promise.all([
      db.select().from(media).where(and(eq(media.isPublished, true), eq(media.type, "MUSIC"))).orderBy(desc(media.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(media).where(and(eq(media.isPublished, true), eq(media.type, "MUSIC"))),
    ]);
    return res.json({ media: rows, total });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/podcasts", async (_req, res) => {
  try {
    const shows = await db.select().from(podcastShows).limit(20);
    return res.json({ shows, total: shows.length });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/worship", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  try {
    const rows = await db.select().from(media).where(and(eq(media.isPublished, true), eq(media.type, "WORSHIP"))).orderBy(desc(media.createdAt)).limit(limit);
    return res.json({ media: rows, total: rows.length });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
