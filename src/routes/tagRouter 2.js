import { Router } from "express";
import { createUser, signIn } from "../controllers/userController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import loginSchema from "../schemas/loginSchema.js";
import userSchema from "../schemas/userSchema.js";
import { getTags } from "../controllers/hashtagController.js"

const tagRouter = Router();

tagRouter.get("/hashtags", getTags);

export default tagRouter;