import { Router } from "express";
import { db } from "../lib/db";
import { media, radioSchedules } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

router.get("/worship/upcoming", async (_req, res) => {
  try {
    const rows = await db.select().from(media)
      .where(and(eq(media.isPublished, true), eq(media.type, "WORSHIP")))
      .orderBy(desc(media.createdAt)).limit(5);
    return res.json({ events: rows.map((r) => ({ ...r, scheduledAt: r.publishedAt ?? r.createdAt, isLive: false })) });
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
