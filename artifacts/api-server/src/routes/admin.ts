import { Router, Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../lib/db";
import { media, devotions, newsArticles, users, prayerRequests, chatMessages } from "@workspace/db/schema";
import { eq, desc, count, ilike, or } from "drizzle-orm";
import { requireAdmin, AuthUser } from "../middlewares/requireAuth";

const router = Router();
type AuthReq = Request & { user: AuthUser };

// ─── File upload setup ────────────────────────────────────────────────────────
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

// All admin routes require admin role
router.use("/admin", requireAdmin);

// ─── Dashboard stats ──────────────────────────────────────────────────────────

router.get("/admin/stats", async (_req, res) => {
  try {
    const [[{ userCount }], [{ mediaCount }], [{ devotionCount }], [{ prayerCount }], [{ messageCount }]] =
      await Promise.all([
        db.select({ userCount: count() }).from(users),
        db.select({ mediaCount: count() }).from(media),
        db.select({ devotionCount: count() }).from(devotions),
        db.select({ prayerCount: count() }).from(prayerRequests),
        db.select({ messageCount: count() }).from(chatMessages),
      ]);
    return res.json({ userCount, mediaCount, devotionCount, prayerCount, messageCount });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// ─── Media management ─────────────────────────────────────────────────────────

router.get("/admin/media", async (req, res) => {
  const q = (req.query.q as string) ?? "";
  const limit = Math.min(Number(req.query.limit ?? 50), 100);
  const offset = Number(req.query.offset ?? 0);
  try {
    const rows = await db
      .select()
      .from(media)
      .where(q ? or(ilike(media.title, `%${q}%`), ilike(media.category, `%${q}%`)) : undefined)
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset);
    const [{ total }] = await db.select({ total: count() }).from(media);
    return res.json({ media: rows, total });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post(
  "/admin/media",
  upload.fields([{ name: "file", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  async (req, res) => {
    const body = req.body as Record<string, string>;
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;

    // Derive public URLs for uploaded files (served at /uploads/<filename>)
    // Serve uploads under /api/uploads — path must match artifact routing prefix
    const host = `${req.protocol}://${req.get("host")}`;
    const audioFile = files?.["file"]?.[0];
    const imageFile = files?.["image"]?.[0];
    const audioUrl = audioFile ? `${host}/api/uploads/${audioFile.filename}` : (body.audioUrl ?? "");
    const coverImage = imageFile ? `${host}/api/uploads/${imageFile.filename}` : (body.coverImage ?? "");

    try {
      const [created] = await db.insert(media).values({
        title: body.title ?? "Untitled",
        description: body.description,
        speaker: body.speaker ?? "",
        coverImage,
        audioUrl,
        videoUrl: body.videoUrl ?? null,
        type: (body.type as typeof media.$inferInsert["type"]) ?? "SERMON",
        category: body.category ?? "",
        duration: body.duration ?? null,
        isPublished: body.isPublished === "true",
        publishedAt: body.isPublished === "true" ? new Date() : undefined,
        podcastShowId: body.podcastShowId ?? null,
      }).returning();
      return res.status(201).json({ media: created });
    } catch (err) {
      return res.status(500).json({ error: String(err) });
    }
  }
);

router.get("/admin/media/:id", async (req, res) => {
  try {
    const row = await db.query.media.findFirst({ where: eq(media.id, req.params.id) });
    if (!row) return res.status(404).json({ error: "Media not found" });
    return res.json({ media: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.patch("/admin/media/:id", async (req, res) => {
  const body = req.body as Partial<typeof media.$inferInsert>;
  try {
    const [updated] = await db
      .update(media)
      .set({ ...body, updatedAt: new Date(), publishedAt: body.isPublished ? new Date() : undefined })
      .where(eq(media.id, req.params.id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Media not found" });
    return res.json({ media: updated });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.delete("/admin/media/:id", async (req, res) => {
  try {
    await db.delete(media).where(eq(media.id, req.params.id));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// ─── Devotions management ─────────────────────────────────────────────────────

router.get("/admin/devotions", async (_req, res) => {
  try {
    const rows = await db.select().from(devotions).orderBy(desc(devotions.date));
    return res.json({ devotions: rows, total: rows.length });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/admin/devotions", async (req, res) => {
  const body = req.body as Partial<typeof devotions.$inferInsert>;
  try {
    const [created] = await db.insert(devotions).values({
      title: body.title ?? "Untitled",
      verse: body.verse ?? "",
      verseText: body.verseText,
      reflection: body.reflection ?? "",
      date: body.date ? new Date(body.date as unknown as string) : new Date(),
      imageUrl: body.imageUrl,
      isPublished: body.isPublished ?? false,
      publishedAt: body.isPublished ? new Date() : undefined,
    }).returning();
    return res.status(201).json({ devotion: created });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/admin/devotions/:id", async (req, res) => {
  try {
    const row = await db.query.devotions.findFirst({ where: eq(devotions.id, req.params.id) });
    if (!row) return res.status(404).json({ error: "Devotion not found" });
    return res.json({ devotion: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.patch("/admin/devotions/:id", async (req, res) => {
  const body = req.body as Partial<typeof devotions.$inferInsert>;
  try {
    const [updated] = await db
      .update(devotions)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(devotions.id, req.params.id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Devotion not found" });
    return res.json({ devotion: updated });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.delete("/admin/devotions/:id", async (req, res) => {
  try {
    await db.delete(devotions).where(eq(devotions.id, req.params.id));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// ─── News management ──────────────────────────────────────────────────────────

router.get("/admin/news", async (_req, res) => {
  try {
    const rows = await db.select().from(newsArticles).orderBy(desc(newsArticles.createdAt));
    return res.json({ news: rows, total: rows.length });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/admin/news", async (req, res) => {
  const body = req.body as Partial<typeof newsArticles.$inferInsert> & { featuredImage?: string };
  const slug = body.slug ?? (body.title ?? "untitled").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  // Accept either coverImage (schema name) or featuredImage (form field name)
  const coverImage = body.coverImage ?? body.featuredImage ?? "";
  try {
    const [created] = await db.insert(newsArticles).values({
      title: body.title ?? "Untitled",
      slug,
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      coverImage,
      category: body.category ?? "General",
      author: body.author,
      isPublished: body.isPublished ?? false,
      isFeature: body.isFeature ?? false,
      publishedAt: body.isPublished ? new Date() : undefined,
    }).returning();
    return res.status(201).json({ article: created });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/admin/news/:slug", async (req, res) => {
  try {
    const row = await db.query.newsArticles.findFirst({ where: eq(newsArticles.slug, req.params.slug) });
    if (!row) return res.status(404).json({ error: "Article not found" });
    return res.json({ article: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.patch("/admin/news/:slug", async (req, res) => {
  const body = req.body as Partial<typeof newsArticles.$inferInsert> & { featuredImage?: string };
  // Normalize featuredImage → coverImage
  const { featuredImage, ...rest } = body;
  const patch = featuredImage !== undefined ? { ...rest, coverImage: featuredImage } : rest;
  try {
    const [updated] = await db
      .update(newsArticles)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(newsArticles.slug, req.params.slug))
      .returning();
    if (!updated) return res.status(404).json({ error: "Article not found" });
    return res.json({ article: updated });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.delete("/admin/news/:slug", async (req, res) => {
  try {
    await db.delete(newsArticles).where(eq(newsArticles.slug, req.params.slug));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// ─── Users listing ────────────────────────────────────────────────────────────

router.get("/admin/users", async (_req, res) => {
  try {
    const rows = await db.select().from(users).orderBy(desc(users.createdAt));
    return res.json({ users: rows, total: rows.length });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
