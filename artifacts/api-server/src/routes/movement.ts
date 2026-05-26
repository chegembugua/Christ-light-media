import { Router, Request } from "express";
import { db } from "../lib/db";
import { movementMembers, challenges, challengeEnrollments, testimonies } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
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

router.get("/movement/challenges/:slug", async (req, res) => {
  try {
    const row = await db.query.challenges.findFirst({ where: eq(challenges.slug, req.params.slug) });
    if (!row) return res.status(404).json({ error: "Challenge not found" });
    return res.json({ challenge: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/movement/challenges/:slug/progress", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  try {
    const challenge = await db.query.challenges.findFirst({ where: eq(challenges.slug, req.params.slug) });
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    const enrollment = await db.query.challengeEnrollments.findFirst({
      where: and(eq(challengeEnrollments.userId, userId), eq(challengeEnrollments.challengeId, challenge.id)),
    });
    return res.json({ progress: enrollment ?? null });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/movement/challenges/:slug/enroll", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  try {
    const challenge = await db.query.challenges.findFirst({ where: eq(challenges.slug, req.params.slug) });
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
    const challenge = await db.query.challenges.findFirst({ where: eq(challenges.slug, req.params.slug) });
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    const enrollment = await db.query.challengeEnrollments.findFirst({
      where: and(eq(challengeEnrollments.userId, userId), eq(challengeEnrollments.challengeId, challenge.id)),
    });
    if (!enrollment) return res.status(404).json({ error: "Not enrolled" });
    const daysCompleted = Array.from(new Set([...(enrollment.daysCompleted as number[]), day]));
    const isCompleted = daysCompleted.length >= challenge.duration;
    await db.update(challengeEnrollments)
      .set({ daysCompleted, isCompleted, completedAt: isCompleted ? new Date() : null })
      .where(eq(challengeEnrollments.id, enrollment.id));
    return res.json({ ok: true, daysCompleted, isCompleted });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/movement/testimonies", async (_req, res) => {
  try {
    const rows = await db.query.testimonies.findMany({
      where: eq(testimonies.isPublished, true),
      orderBy: [desc(testimonies.createdAt)],
      limit: 20,
      with: { user: { columns: { id: true, fullName: true, avatarUrl: true } } },
    });
    const featured = rows.find((t) => t.isFeatured) ?? null;
    return res.json({ testimonies: rows, featured, total: rows.length });
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
