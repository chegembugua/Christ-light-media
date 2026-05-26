import { Router } from "express";

const router = Router();

router.get("/profile", (_req, res) => {
  res.json({ profile: null });
});

router.patch("/profile", (_req, res) => {
  res.json({ profile: null, error: "Authentication required" });
});

router.post("/profile/avatar", (_req, res) => {
  res.json({ ok: false, error: "Authentication required" });
});

router.delete("/profile/avatar", (_req, res) => {
  res.json({ ok: false, error: "Authentication required" });
});

router.get("/users/profile", (_req, res) => {
  res.json({ profile: null });
});

router.get("/auth/profile", (_req, res) => {
  res.json({ profile: null });
});

router.post("/auth/create-profile", (_req, res) => {
  res.json({ profile: null, error: "Authentication required" });
});

export default router;
