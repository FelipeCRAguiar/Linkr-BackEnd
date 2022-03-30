import { Router } from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRouter.js";
import tagRouter from "./tagRouter.js";
import followerRouter from "./followerRoute.js";

const router = Router();

router.use(userRouter);
router.use(postRouter);
router.use(tagRouter);
router.use(followerRouter);

export default router;
