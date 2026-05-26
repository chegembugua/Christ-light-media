import { Router } from "express";
import { db } from "../lib/db";
import { devotions } from "@workspace/db/schema";
import { eq, desc, and, lte, sql } from "drizzle-orm";

const router = Router();

router.get("/devotions", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  const offset = Number(req.query.offset ?? 0);
  try {
    const rows = await db.select().from(devotions)
      .where(and(eq(devotions.isPublished, true), lte(devotions.date, new Date())))
      .orderBy(desc(devotions.date)).limit(limit).offset(offset);
    return res.json({ devotions: rows, total: rows.length });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/devotions/today", async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const row = await db.query.devotions.findFirst({
      where: and(eq(devotions.isPublished, true), lte(devotions.date, today)),
      orderBy: [desc(devotions.date)],
    });
    return res.json({ devotion: row ?? null });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * GET /devotions/:idOrDate
 * Accepts either a UUID (e.g. "123e4567-e89b-...") or a date string (e.g. "2024-01-15").
 */
router.get("/devotions/:idOrDate", async (req, res) => {
  const { idOrDate } = req.params;
  const isDate = /^\d{4}-\d{2}-\d{2}$/.test(idOrDate);
  try {
    let row;
    if (isDate) {
      // Lookup by date column (cast to date for comparison)
      row = await db.query.devotions.findFirst({
        where: and(
          eq(devotions.isPublished, true),
          sql`DATE(${devotions.date}) = ${idOrDate}::date`
        ),
      });
    } else {
      row = await db.query.devotions.findFirst({ where: eq(devotions.id, idOrDate) });
    }
    if (!row || !row.isPublished) return res.status(404).json({ error: "Devotion not found" });
    return res.json({ devotion: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
