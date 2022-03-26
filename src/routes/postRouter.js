import { getPosts } from "../controllers/postController.js";
import { Router } from "express";

const getPostsRouter = Router();

getPostsRouter.get("/posts", getPosts);

export default getPostsRouter;
