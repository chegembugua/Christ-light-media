import { Router, Request } from "express";
import { db } from "../lib/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, getRequestUser, AuthUser } from "../middlewares/requireAuth";

const router = Router();

type AuthReq = Request & { user: AuthUser };

/** GET /api/profile — current user profile */
router.get("/profile", requireAuth, async (req, res) => {
  const { id } = (req as AuthReq).user;
  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    if (!user) return res.json({ user: null });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/** PATCH /api/profile — update current user profile */
router.patch("/profile", requireAuth, async (req, res) => {
  const { id } = (req as AuthReq).user;
  const { fullName, bio, location, preferences } = req.body as Record<string, unknown>;
  try {
    const [updated] = await db
      .update(users)
      .set({
        ...(fullName !== undefined ? { fullName: fullName as string } : {}),
        ...(bio !== undefined ? { bio: bio as string, isBioComplete: (bio as string).trim().length > 0 } : {}),
        ...(location !== undefined ? { location: location as string } : {}),
        ...(preferences !== undefined ? { preferences } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return res.json({ user: updated ?? null });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/** GET /api/users/profile — alias */
router.get("/users/profile", requireAuth, async (req, res) => {
  const { id } = (req as AuthReq).user;
  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    return res.json({ user: user ?? null });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * POST /api/profile/avatar — store avatar URL in user record
 * The frontend reads the file as a data URL and sends it; we store it as avatarUrl.
 */
router.post("/profile/avatar", requireAuth, async (req, res) => {
  const { id } = (req as AuthReq).user;
  // Accept either base64 data URL or a URL string in body
  const avatarUrl: string | undefined =
    (req.body as Record<string, unknown>)?.avatarUrl as string | undefined;
  // FormData (multipart) sends `avatar` file — for MVP, store placeholder
  const url = avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(id)}&background=random`;
  try {
    const [updated] = await db.update(users).set({ avatarUrl: url, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return res.json({ user: updated ?? null });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/**
 * DELETE /api/profile/avatar — remove avatar (set to null)
 */
router.delete("/profile/avatar", requireAuth, async (req, res) => {
  const { id } = (req as AuthReq).user;
  try {
    const [updated] = await db.update(users).set({ avatarUrl: null, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return res.json({ user: updated ?? null });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/** GET /api/auth/profile?id= — fetch by Supabase user id (must match caller) */
router.get("/auth/profile", async (req, res) => {
  const requestedId = req.query.id as string | undefined;
  if (!requestedId) return res.status(400).json({ error: "User ID required" });

  const caller = await getRequestUser(req);
  if (!caller || caller.id !== requestedId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, requestedId) });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

/** POST /api/auth/create-profile — upsert platform profile after Supabase signup */
router.post("/auth/create-profile", async (req, res) => {
  // Identity MUST come from the verified JWT — never trust client-supplied id or email.
  const caller = await getRequestUser(req);
  if (!caller) return res.status(401).json({ error: "Unauthorized" });

  // Accept supplemental fields from body; ignore any email/id in body (use JWT).
  const { fullName } = req.body as { fullName?: string };

  try {
    const existing = await db.query.users.findFirst({ where: eq(users.id, caller.id) });
    if (existing) return res.json({ success: true });

    // Determine role exclusively from the JWT-verified email.
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const role = adminEmails.includes(caller.email.toLowerCase()) ? "ADMIN" : "USER";

    await db.insert(users).values({
      id: caller.id,
      email: caller.email,
      fullName: fullName ?? null,
      role,
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
