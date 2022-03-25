import { Router } from "express";
import userRouter from "./userRouter.js";
import getPostsRouter from "./getPostsRouter.js";

const router = Router();

router.use(userRouter);
router.use(getPostsRouter);

export default router;