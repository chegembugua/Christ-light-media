import { Router } from "express";

const router = Router();

router.get("/worship/upcoming", (_req, res) => {
  res.json({ event: null });
});

export default router;
