import { Router } from "express";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { getTags } from "../controllers/hashtagController.js"

const tagRouter = Router();

tagRouter.get("/hashtags", getTags);

export default tagRouter;