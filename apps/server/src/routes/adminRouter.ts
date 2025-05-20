import { Router } from "express";
import adminController from "../controllers/adminController";
import authMiddleware from "../middlewares/authMiddleware";

const adminRouter: Router = Router();

// MAKE SURE TO ADD AUTH MIDDLEWARE
adminRouter.get("/generate-presigned-url", adminController.getPreSignedUrl);

export default adminRouter;
