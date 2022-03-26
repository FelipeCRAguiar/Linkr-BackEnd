import { getPosts, createPost } from "../controllers/postController.js";
import { Router } from "express";
import { validateToken } from "../middlewares/validateUserToken.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import postSchema from "../schemas/postSchema.js";

const postRouter = Router();

postRouter.get("/posts", getPosts);
postRouter.post(
  "/post",
  validateToken,
  validateSchemaMiddleware(postSchema),
  createPost
);

export default postRouter;
