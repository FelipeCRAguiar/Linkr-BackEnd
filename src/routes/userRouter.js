import { Router } from "express";
import { createUser } from "../controllers/userController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import userSchema from "../schemas/userSchema.js";

const userRouter = Router();

userRouter.post('/users', validateSchemaMiddleware(userSchema), createUser);
userRouter.post

export default userRouter;