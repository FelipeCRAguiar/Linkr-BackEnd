import {
  getPosts,
  createPost,
  deletePost,
} from "../controllers/postController.js";
import { Router } from "express";
import { validateToken } from "../middlewares/validateUserToken.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import postSchema from "../schemas/postSchema.js";

const postRouter = Router();

postRouter.get("/posts", getPosts);
postRouter.post(
  "/posts",
  validateToken,
  validateSchemaMiddleware(postSchema),
  createPost
);
postRouter.delete("/posts/:postId", validateToken, deletePost);

export default postRouter;
