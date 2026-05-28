import { Router, Request } from "express";
import { db } from "../lib/db";
import { prayerRequests, prayerVotes, chatRooms, chatMessages, users } from "@workspace/db/schema";
import { eq, desc, asc, and, or, ilike, count } from "drizzle-orm";
import { requireAuth, getRequestUser, AuthUser } from "../middlewares/requireAuth";

const router = Router();
type AuthReq = Request & { user: AuthUser };

// ─── Prayer Requests ──────────────────────────────────────────────────────────

router.get("/community/prayers", async (req, res) => {
  const {
    category,
    status,
    sort = "recent",
    search,
    limit: lim,
    offset: off,
  } = req.query as Record<string, string>;

  const limit = Math.min(Number(lim ?? 20), 100);
  const offset = Number(off ?? 0);
  const searchTerm = (search ?? "").trim();

  try {
    const conditions = [eq(prayerRequests.isPublished, true)];

    // `category=all` means no filter
    if (category && category !== "all") {
      conditions.push(eq(prayerRequests.category, category));
    }
    // `status=answered` | `status=active` | `status=all`
    if (status && status !== "all") {
      conditions.push(eq(prayerRequests.isAnswered, status === "answered"));
    }
    if (searchTerm) {
      conditions.push(
        or(
          ilike(prayerRequests.title, `%${searchTerm}%`),
          ilike(prayerRequests.content, `%${searchTerm}%`)
        )!
      );
    }

    const where = and(...conditions);

    const orderBy =
      sort === "most-prayed"
        ? [desc(prayerRequests.prayerCount)]
        : sort === "oldest"
        ? [asc(prayerRequests.createdAt)]
        : [desc(prayerRequests.createdAt)];

    const rows = await db.query.prayerRequests.findMany({
      where,
      orderBy,
      limit,
      offset,
      with: { user: { columns: { id: true, fullName: true, avatarUrl: true } } },
    });
    const [{ total }] = await db
      .select({ total: count() })
      .from(prayerRequests)
      .where(where);

    return res.json({ prayers: rows, total });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/community/prayers", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const { title, content, category, isAnonymous, duration } = req.body as Record<
    string,
    string | boolean
  >;
  try {
    const [created] = await db
      .insert(prayerRequests)
      .values({
        title: title as string,
        content: content as string,
        category: category as string | undefined,
        userId,
        isAnonymous: Boolean(isAnonymous),
        duration: duration as string | undefined,
      })
      .returning();
    return res.status(201).json({ prayer: created });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * GET /api/community/prayers/:id
 * Returns full prayer detail including prayerCount.
 */
router.get("/community/prayers/:id", async (req, res) => {
  try {
    const row = await db.query.prayerRequests.findFirst({
      where: eq(prayerRequests.id, req.params.id as string),
      with: { user: { columns: { id: true, fullName: true, avatarUrl: true } } },
    });
    if (!row) return res.status(404).json({ error: "Prayer request not found" });
    return res.json({ prayer: row });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * POST /api/community/prayers/:id/pray — record a prayer vote
 * DELETE /api/community/prayers/:id/pray — remove a prayer vote
 * Both return { voted: boolean, totalVotes: number } as the frontend expects.
 */
router.post("/community/prayers/:id/pray", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const prayerRequestId = req.params.id as string;
  try {
    const existing = await db.query.prayerVotes.findFirst({
      where: and(
        eq(prayerVotes.userId, userId),
        eq(prayerVotes.prayerRequestId, prayerRequestId)
      ),
    });
    if (existing) {
      // Already voted — return current state without error
      const prayer = await db.query.prayerRequests.findFirst({
        where: eq(prayerRequests.id, prayerRequestId),
      });
      return res.json({ ok: true, voted: true, totalVotes: prayer?.prayerCount ?? 0 });
    }
    await db.insert(prayerVotes).values({ userId, prayerRequestId });
    const prayer = await db.query.prayerRequests.findFirst({
      where: eq(prayerRequests.id, prayerRequestId),
    });
    const newCount = (prayer?.prayerCount ?? 0) + 1;
    await db
      .update(prayerRequests)
      .set({ prayerCount: newCount })
      .where(eq(prayerRequests.id, prayerRequestId));
    return res.json({ ok: true, voted: true, totalVotes: newCount });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.delete("/community/prayers/:id/pray", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const prayerRequestId = req.params.id as string;
  try {
    const existing = await db.query.prayerVotes.findFirst({
      where: and(
        eq(prayerVotes.userId, userId),
        eq(prayerVotes.prayerRequestId, prayerRequestId)
      ),
    });
    if (!existing) {
      const prayer = await db.query.prayerRequests.findFirst({
        where: eq(prayerRequests.id, prayerRequestId),
      });
      return res.json({ ok: true, voted: false, totalVotes: prayer?.prayerCount ?? 0 });
    }
    await db
      .delete(prayerVotes)
      .where(
        and(
          eq(prayerVotes.userId, userId),
          eq(prayerVotes.prayerRequestId, prayerRequestId)
        )
      );
    const prayer = await db.query.prayerRequests.findFirst({
      where: eq(prayerRequests.id, prayerRequestId),
    });
    const newCount = Math.max((prayer?.prayerCount ?? 1) - 1, 0);
    await db
      .update(prayerRequests)
      .set({ prayerCount: newCount })
      .where(eq(prayerRequests.id, prayerRequestId));
    return res.json({ ok: true, voted: false, totalVotes: newCount });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// ─── Chat Rooms ───────────────────────────────────────────────────────────────

router.get("/community/chat/rooms", async (_req, res) => {
  try {
    const rooms = await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.isActive, true))
      .orderBy(chatRooms.name);
    return res.json({ rooms });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/community/chat/:roomId/messages", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 50), 200);
  const offset = Number(req.query.offset ?? 0);
  try {
    const where = and(
      eq(chatMessages.roomId, req.params.roomId as string),
      eq(chatMessages.isDeleted, false)
    );
    const [rows, [{ total }]] = await Promise.all([
      db.query.chatMessages.findMany({
        where,
        orderBy: [desc(chatMessages.createdAt)],
        limit,
        offset,
        with: { user: { columns: { id: true, fullName: true, avatarUrl: true } } },
      }),
      db.select({ total: count() }).from(chatMessages).where(where),
    ]);
    return res.json({ messages: rows.reverse(), total });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/community/chat/:roomId/messages", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const { content } = req.body as { content: string };
  const { roomId } = req.params as { roomId: string };
  try {
    const [created] = await db
      .insert(chatMessages)
      .values({ content, userId, roomId })
      .returning();
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, fullName: true, avatarUrl: true },
    });
    return res.status(201).json({ message: { ...created, user } });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.delete(
  "/community/chat/:roomId/messages/:messageId",
  requireAuth,
  async (req, res) => {
    const { id: userId } = (req as AuthReq).user;
    const { messageId } = req.params as { messageId: string };
    try {
      const msg = await db.query.chatMessages.findFirst({
        where: eq(chatMessages.id, messageId),
      });
      if (!msg) return res.status(404).json({ error: "Message not found" });
      const user = await getRequestUser(req);
      if (msg.userId !== userId && user?.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
      await db
        .update(chatMessages)
        .set({ isDeleted: true })
        .where(eq(chatMessages.id, messageId));
      return res.json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: String(err) });
    }
  }
);

export default router;
