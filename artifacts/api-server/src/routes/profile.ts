import { Router } from "express";

const router = Router();

/**
 * GET /api/profile — returns { user: ... } matching the Next.js original contract.
 * Without Supabase configured the session is always absent; return null gracefully.
 */
router.get("/profile", (_req, res) => {
  res.json({ user: null });
});

/**
 * PATCH /api/profile — returns { user: ... }
 */
router.patch("/profile", (_req, res) => {
  res.status(401).json({ error: "Unauthorized" });
});

router.post("/profile/avatar", (_req, res) => {
  res.status(401).json({ error: "Unauthorized" });
});

router.delete("/profile/avatar", (_req, res) => {
  res.status(401).json({ error: "Unauthorized" });
});

/**
 * GET /api/users/profile — same shape as /api/profile
 */
router.get("/users/profile", (_req, res) => {
  res.json({ user: null });
});

/**
 * GET /api/auth/profile?id= — returns the profile object directly (not wrapped).
 * Frontend casts the full response as UserProfile.
 * Return 404 when no DB is configured.
 */
router.get("/auth/profile", (_req, res) => {
  res.status(404).json({ error: "User not found" });
});

/**
 * POST /api/auth/create-profile — returns { success: true } on success.
 */
router.post("/auth/create-profile", (_req, res) => {
  res.status(401).json({ error: "Authentication required" });
});

export default router;
