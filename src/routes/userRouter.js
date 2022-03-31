import { Router } from "express";
import { createUser, getUser, searchUsers, signIn } from "../controllers/userController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateToken } from "../middlewares/validateUserToken.js";
import loginSchema from "../schemas/loginSchema.js";
import userSchema from "../schemas/userSchema.js";

const userRouter = Router();

userRouter.post('/sign-up', validateSchemaMiddleware(userSchema), createUser);
userRouter.post('/login', validateSchemaMiddleware(loginSchema), signIn);
userRouter.get('/users/:id', validateToken, getUser);
userRouter.get('/username', validateToken, searchUsers);

export default userRouter;