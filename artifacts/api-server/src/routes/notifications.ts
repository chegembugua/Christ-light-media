import { Router, Request } from "express";
import { db } from "../lib/db";
import { notifications } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, AuthUser } from "../middlewares/requireAuth";

const router = Router();
type AuthReq = Request & { user: AuthUser };

router.get("/notifications", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  try {
    const rows = await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
    const unreadCount = rows.filter((n) => !n.isRead).length;
    return res.json({ notifications: rows, unreadCount });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.patch("/notifications/:id/read", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  try {
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, req.params.id as string), eq(notifications.userId, userId)));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.patch("/notifications", requireAuth, async (req, res) => {
  const { id: userId } = (req as AuthReq).user;
  try {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
