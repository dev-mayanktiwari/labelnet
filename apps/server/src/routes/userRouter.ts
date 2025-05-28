import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";

const userRouter: Router = Router();

// MAKE SURE TO ADD AUTH MIDDLEWARE
userRouter.get("/get-next-task", authMiddleware, userController.getNextTask);
userRouter.get("/get-all-tasks", authMiddleware, userController.getAllTasks);
userRouter.post(
  "/submit-response",
  authMiddleware,
  userController.submitResponse
);
userRouter.post("/payout", authMiddleware, userController.payout);
userRouter.get("/get-task/:taskId", authMiddleware, userController.getTaskById);
userRouter.get(
  "/get-payout-amount",
  authMiddleware,
  userController.getPayoutAmoutn
);

export default userRouter;
