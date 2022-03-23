import { Router } from "express";
import { createUser, signIn } from "../controllers/userController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import loginSchema from "../schemas/loginSchema.js";
import userSchema from "../schemas/userSchema.js";

const userRouter = Router();

userRouter.post('/users', validateSchemaMiddleware(userSchema), createUser);
userRouter.post('/login', validateSchemaMiddleware(loginSchema), signIn)

export default userRouter;