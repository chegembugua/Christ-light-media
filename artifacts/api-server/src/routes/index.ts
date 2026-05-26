import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mediaRouter from "./media";
import devotionsRouter from "./devotions";
import newsRouter from "./news";
import communityRouter from "./community";
import notificationsRouter from "./notifications";
import profileRouter from "./profile";
import movementRouter from "./movement";
import worshipRouter from "./worship";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(mediaRouter);
router.use(devotionsRouter);
router.use(newsRouter);
router.use(communityRouter);
router.use(notificationsRouter);
router.use(profileRouter);
router.use(movementRouter);
router.use(worshipRouter);
router.use(adminRouter);

export default router;
