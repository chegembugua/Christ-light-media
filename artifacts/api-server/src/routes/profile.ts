import { Router } from "express";

const router = Router();

router.get("/profile", (_req, res) => {
  res.status(401).json({ error: "Not authenticated" });
});

router.patch("/profile", (_req, res) => {
  res.status(401).json({ error: "Not authenticated" });
});

router.post("/profile/avatar", (_req, res) => {
  res.status(401).json({ error: "Not authenticated" });
});

router.delete("/profile/avatar", (_req, res) => {
  res.status(401).json({ error: "Not authenticated" });
});

router.get("/users/profile", (_req, res) => {
  res.status(401).json({ error: "Not authenticated" });
});

router.get("/auth/profile", (_req, res) => {
  res.status(401).json({ error: "Not authenticated" });
});

router.post("/auth/create-profile", (_req, res) => {
  res.status(401).json({ error: "Not authenticated" });
});

export default router;
