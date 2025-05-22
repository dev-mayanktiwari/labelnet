import { Router } from "express";
import adminController from "../controllers/adminController";
import authMiddleware from "../middlewares/authMiddleware";

const adminRouter: Router = Router();

// MAKE SURE TO ADD AUTH MIDDLEWARE
adminRouter.get(
  "/generate-presigned-url",
  authMiddleware,
  adminController.getPreSignedUrl
);
adminRouter.post(
  "/create-task/:hash",
  authMiddleware,
  adminController.createTask
);
adminRouter.get("/get-all-tasks", authMiddleware, adminController.getAllTasks);
adminRouter.post(
  "/pause-task/:taskId",
  authMiddleware,
  adminController.pauseTask
);

export default adminRouter;
