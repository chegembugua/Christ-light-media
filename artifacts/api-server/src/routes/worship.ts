import { Router } from "express";
import { db } from "../lib/db";
import { media, radioSchedules } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

/**
 * GET /api/worship/upcoming
 * Returns { event } — the single most-recently published worship session.
 * Frontend destructures result.event directly.
 */
router.get("/worship/upcoming", async (_req, res) => {
  try {
    const rows = await db.select().from(media)
      .where(and(eq(media.isPublished, true), eq(media.type, "WORSHIP")))
      .orderBy(desc(media.createdAt)).limit(1);
    const raw = rows[0] ?? null;
    const event = raw
      ? {
          ...raw,
          scheduledAt: raw.publishedAt ?? raw.createdAt,
          isLive: false,
          leaders: raw.speaker ? [raw.speaker] : [],
          durationMinutes: raw.duration ? parseInt(raw.duration) : null,
        }
      : null;
    return res.json({ event });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/worship/radio-schedule", async (_req, res) => {
  try {
    const rows = await db.select().from(radioSchedules).where(eq(radioSchedules.isActive, true)).orderBy(radioSchedules.dayOfWeek, radioSchedules.startTime);
    return res.json({ schedule: rows });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
