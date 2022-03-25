import { getPosts } from "../controllers/getPostsContorller.js";
import { Router } from "express";

const getPostsRouter = Router();

getPostsRouter.get('/posts', getPosts);


export default getPostsRouter;