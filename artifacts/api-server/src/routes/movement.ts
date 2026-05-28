import { Router, Request } from "express";
import { db } from "../lib/db";
import { movementMembers, challenges, challengeEnrollments, testimonies } from "@workspace/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth, AuthUser } from "../middlewares/requireAuth";

const router = Router();
type AuthReq = Request & { user: AuthUser };

router.get("/movement/membership", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  try {
    const membership = await db.query.movementMembers.findFirst({ where: eq(movementMembers.userId, userId) });
    return res.json({ membership: membership ?? null, isMember: !!membership });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/movement/join", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  try {
    const existing = await db.query.movementMembers.findFirst({ where: eq(movementMembers.userId, userId) });
    if (existing) return res.json({ ok: true, membership: existing });
    const [membership] = await db.insert(movementMembers).values({ userId }).returning();
    return res.status(201).json({ ok: true, membership });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/movement/challenges", async (_req, res) => {
  try {
    const rows = await db.select().from(challenges).where(eq(challenges.isActive, true)).orderBy(challenges.title);
    return res.json({ challenges: rows });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * Generate template daily prompts based on challenge category + duration.
 * These serve as placeholder content when no DB prompts table exists.
 */
function generateDailyPrompts(challenge: { duration: number; category: string | null; title: string }) {
  const themesByCategory: Record<string, string[]> = {
    Prayer: ["Adoration", "Confession", "Thanksgiving", "Supplication", "Listening", "Intercession"],
    Fasting: ["Preparation", "Surrender", "Discipline", "Renewal", "Breakthrough", "Perseverance"],
    Worship: ["Praise", "Gratitude", "Awe", "Surrender", "Joy", "Rest"],
    Scripture: ["Meditation", "Application", "Memorization", "Study", "Reflection", "Declaration"],
  };
  const themes = themesByCategory[challenge.category ?? ""] ?? ["Focus", "Reflection", "Growth", "Prayer", "Action", "Rest"];
  return Array.from({ length: challenge.duration }, (_, i) => {
    const theme = themes[i % themes.length];
    return {
      id: String(i + 1),
      day: i + 1,
      title: `Day ${i + 1}: ${theme}`,
      scripture: `Psalm ${(i % 150) + 1}:${(i % 20) + 1}`,
      prompt: `On day ${i + 1} of the ${challenge.title}, focus on ${theme.toLowerCase()} in your prayer time. Ask God to reveal His purpose for this day.`,
      completed: false,
    };
  });
}

router.get("/movement/challenges/:slug", async (req, res) => {
  try {
    const row = await db.query.challenges.findFirst({ where: eq(challenges.slug, req.params.slug as string) });
    if (!row) return res.status(404).json({ error: "Challenge not found" });
    const dailyPrompts = generateDailyPrompts(row);
    return res.json({ challenge: row, dailyPrompts });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/movement/challenges/:slug/progress", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  try {
    const challenge = await db.query.challenges.findFirst({ where: eq(challenges.slug, req.params.slug as string) });
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    const enrollment = await db.query.challengeEnrollments.findFirst({
      where: and(eq(challengeEnrollments.userId, userId), eq(challengeEnrollments.challengeId, challenge.id)),
    });
    // Return as `enrollment` — matching frontend expectation (setEnrollment(data.enrollment))
    return res.json({ enrollment: enrollment ?? null });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/movement/challenges/:slug/enroll", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  try {
    const challenge = await db.query.challenges.findFirst({ where: eq(challenges.slug, req.params.slug as string) });
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    const existing = await db.query.challengeEnrollments.findFirst({
      where: and(eq(challengeEnrollments.userId, userId), eq(challengeEnrollments.challengeId, challenge.id)),
    });
    if (existing) return res.json({ ok: true, enrollment: existing });
    const [enrollment] = await db.insert(challengeEnrollments).values({ userId, challengeId: challenge.id }).returning();
    return res.status(201).json({ ok: true, enrollment });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/movement/challenges/:slug/progress", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const { day } = req.body as { day: number };
  try {
    const challenge = await db.query.challenges.findFirst({ where: eq(challenges.slug, req.params.slug as string) });
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    const enrollment = await db.query.challengeEnrollments.findFirst({
      where: and(eq(challengeEnrollments.userId, userId), eq(challengeEnrollments.challengeId, challenge.id)),
    });
    if (!enrollment) return res.status(404).json({ error: "Not enrolled" });
    const daysCompleted = Array.from(new Set([...(enrollment.daysCompleted as number[]), day]));
    const isCompleted = daysCompleted.length >= challenge.duration;
    const [updated] = await db.update(challengeEnrollments)
      .set({ daysCompleted, isCompleted, completedAt: isCompleted ? new Date() : null })
      .where(eq(challengeEnrollments.id, enrollment.id))
      .returning();
    // Return as `enrollment` — matching frontend expectation (setEnrollment(data.enrollment))
    return res.json({ ok: true, enrollment: updated ?? { ...enrollment, daysCompleted, isCompleted } });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/movement/testimonies", async (req, res) => {
  const { category, limit: lim } = req.query as Record<string, string>;
  const limit = Math.min(Number(lim ?? 20), 100);
  try {
    const rows = await db.query.testimonies.findMany({
      where: and(
        eq(testimonies.isPublished, true),
        ...(category ? [eq(testimonies.category, category)] : [])
      ),
      orderBy: [desc(testimonies.createdAt)],
      limit,
      with: { user: { columns: { id: true, fullName: true, avatarUrl: true } } },
    });
    const featured = rows.find((t) => t.isFeatured) ?? rows[0] ?? null;
    return res.json({ testimonies: rows, featured, total: rows.length });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// Testimony detail — GET /movement/testimonies/:id
router.get("/movement/testimonies/:id", async (req, res) => {
  try {
    const row = await db.query.testimonies.findFirst({
      where: and(eq(testimonies.id, req.params.id as string), eq(testimonies.isPublished, true)),
      with: { user: { columns: { id: true, fullName: true, avatarUrl: true } } },
    });
    if (!row) return res.status(404).json({ error: "Testimony not found" });
    // Increment view count
    await db.update(testimonies).set({ viewCount: row.viewCount + 1 }).where(eq(testimonies.id, row.id));
    return res.json({ testimony: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// React to a testimony — POST /movement/testimonies/:id/react
router.post("/movement/testimonies/:id/react", requireAuth, async (req, res) => {
  try {
    const row = await db.query.testimonies.findFirst({
      where: and(eq(testimonies.id, req.params.id as string), eq(testimonies.isPublished, true)),
    });
    if (!row) return res.status(404).json({ error: "Testimony not found" });
    const [updated] = await db
      .update(testimonies)
      .set({ reactionCount: sql`${testimonies.reactionCount} + 1` })
      .where(eq(testimonies.id, row.id))
      .returning({ reactionCount: testimonies.reactionCount });
    return res.json({ ok: true, reactionCount: updated?.reactionCount ?? row.reactionCount + 1 });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/movement/testimonies", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const { title, content, category, isAnonymous } = req.body as Record<string, string | boolean>;
  try {
    await db.insert(testimonies).values({
      title: title as string,
      content: content as string,
      category: (category as string) ?? "General",
      userId,
      isAnonymous: Boolean(isAnonymous),
    });
    return res.status(201).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
