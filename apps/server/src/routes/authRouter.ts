import { Router } from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const authRouter: Router = Router();

authRouter.get("/get-nonce", authController.getNonce);
authRouter.get("/auth-check", authMiddleware, authController.authCheck);
authRouter.post("/register", authController.register);
authRouter.post("/logout", authController.logOut);

export default authRouter;
