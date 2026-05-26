import { Router } from "express";

const router = Router();

router.get("/devotions", (_req, res) => {
  res.json({ devotions: [], total: 0 });
});

router.get("/devotions/:id", (req, res) => {
  res.status(404).json({ error: "Devotion not found", id: req.params.id });
});

export default router;
