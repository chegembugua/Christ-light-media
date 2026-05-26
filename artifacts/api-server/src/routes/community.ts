import { Router, Request } from "express";
import { db } from "../lib/db";
import { prayerRequests, prayerVotes, chatRooms, chatMessages, users } from "@workspace/db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { requireAuth, getRequestUser, AuthUser } from "../middlewares/requireAuth";

const router = Router();
type AuthReq = Request & { user: AuthUser };

// ─── Prayer Requests ──────────────────────────────────────────────────────────

router.get("/community/prayers", async (req, res) => {
  const { category, limit: lim, offset: off } = req.query as Record<string, string>;
  const limit = Math.min(Number(lim ?? 20), 100);
  const offset = Number(off ?? 0);
  try {
    const conditions = [
      eq(prayerRequests.isPublished, true),
      ...(category ? [eq(prayerRequests.category, category)] : []),
    ];
    const rows = await db.query.prayerRequests.findMany({
      where: and(...conditions),
      orderBy: [desc(prayerRequests.createdAt)],
      limit,
      offset,
      with: { user: { columns: { id: true, fullName: true, avatarUrl: true } } },
    });
    const [{ total }] = await db.select({ total: count() }).from(prayerRequests).where(and(...conditions));
    return res.json({ prayers: rows, total });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/community/prayers", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const { title, content, category, isAnonymous, duration } = req.body as Record<string, string | boolean>;
  try {
    const [created] = await db.insert(prayerRequests).values({
      title: title as string,
      content: content as string,
      category: category as string | undefined,
      userId,
      isAnonymous: Boolean(isAnonymous),
      duration: duration as string | undefined,
    }).returning();
    return res.status(201).json({ prayer: created });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/community/prayers/:id/pray", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const prayerRequestId = req.params.id;
  try {
    const existing = await db.query.prayerVotes.findFirst({
      where: and(eq(prayerVotes.userId, userId), eq(prayerVotes.prayerRequestId, prayerRequestId)),
    });
    if (existing) return res.json({ ok: true, alreadyPrayed: true });
    await db.insert(prayerVotes).values({ userId, prayerRequestId });
    const prayer = await db.query.prayerRequests.findFirst({ where: eq(prayerRequests.id, prayerRequestId) });
    if (prayer) {
      await db.update(prayerRequests).set({ prayerCount: prayer.prayerCount + 1 }).where(eq(prayerRequests.id, prayerRequestId));
    }
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// ─── Chat Rooms ───────────────────────────────────────────────────────────────

router.get("/community/chat/rooms", async (_req, res) => {
  try {
    const rooms = await db.select().from(chatRooms).where(eq(chatRooms.isActive, true)).orderBy(chatRooms.name);
    return res.json({ rooms });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/community/chat/:roomId/messages", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 50), 200);
  try {
    const rows = await db.query.chatMessages.findMany({
      where: and(eq(chatMessages.roomId, req.params.roomId), eq(chatMessages.isDeleted, false)),
      orderBy: [desc(chatMessages.createdAt)],
      limit,
      with: { user: { columns: { id: true, fullName: true, avatarUrl: true } } },
    });
    return res.json({ messages: rows.reverse(), total: rows.length });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/community/chat/:roomId/messages", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const { content } = req.body as { content: string };
  const { roomId } = req.params;
  try {
    const [created] = await db.insert(chatMessages).values({ content, userId, roomId }).returning();
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, fullName: true, avatarUrl: true },
    });
    return res.status(201).json({ message: { ...created, user } });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.delete("/community/chat/:roomId/messages/:messageId", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const { messageId } = req.params;
  try {
    const msg = await db.query.chatMessages.findFirst({ where: eq(chatMessages.id, messageId) });
    if (!msg) return res.status(404).json({ error: "Message not found" });
    // Only allow deleting own messages (admin can delete any)
    const user = await getRequestUser(req);
    if (msg.userId !== userId && user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    await db.update(chatMessages).set({ isDeleted: true }).where(eq(chatMessages.id, messageId));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
