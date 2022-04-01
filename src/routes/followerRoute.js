import { Router } from "express";
import { follow, getFollow, unfollow } from "../controllers/followerController.js";
import { validateToken } from "../middlewares/validateUserToken.js";

const followerRouter = Router();

followerRouter.post("/follow", validateToken, follow);
followerRouter.delete("/unfollow", validateToken, unfollow);
followerRouter.get("/isfollowing", validateToken, getFollow)

export default followerRouter