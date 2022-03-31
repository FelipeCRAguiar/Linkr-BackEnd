import {
  getPosts,
  createPost,
  deletePost,
  editPost,
  likePost,
  unlikePost,
  getPostByUser,
  commentPost
} from "../controllers/postController.js";
import { Router } from "express";
import { validateToken } from "../middlewares/validateUserToken.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import postSchema from "../schemas/postSchema.js";
import editPostSchema from "../schemas/editPostSchema.js";

const postRouter = Router();

postRouter.get("/posts", getPosts);
postRouter.post(
  "/posts",
  validateToken,
  validateSchemaMiddleware(postSchema),
  createPost
);
postRouter.delete("/posts/:postId", validateToken, deletePost);

postRouter.post("/like/:postId/:userId", likePost);
postRouter.patch(
  "/posts/:postId",
  validateToken,
  validateSchemaMiddleware(editPostSchema),
  editPost
);
postRouter.delete("/unlike/:postId/:userId", unlikePost);
postRouter.get("/user/:id", validateToken, getPostByUser);
postRouter.post("/comment/:postId/:userId", commentPost);

export default postRouter;
