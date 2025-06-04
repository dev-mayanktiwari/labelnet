import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { ResponseMessage } from "@workspace/constants";
import { httpError, logger } from "@workspace/utils";
import cookieParser from "cookie-parser";
import { AppConfig } from "./config";
import healthRouter from "./routes/healthRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import authRouter from "./routes/authRouter";
import adminRouter from "./routes/adminRouter";
import { transactionWorker } from "./services/transactionWorker";
import userRouter from "./routes/userRouter";

const app: Application = express();
const PORT = AppConfig.get("PORT");

// Middlewares
app.use(
  cors({
    origin: [
      "https://labelnet-admin-client.vercel.app",
      "https://labelnet-user-client.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

//404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    throw new Error(ResponseMessage.NOT_FOUND);
  } catch (error) {
    httpError(next, error, req, 404);
  }
});

// Global Error Handler
app.use(globalErrorHandler);

transactionWorker.start();

process.on("SIGTERM", () => {
  // console.log("Shutting down gracefully...");
  transactionWorker.stop();
  process.exit(0);
});

process.on("SIGINT", () => {
  // console.log("Shutting down gracefully...");
  transactionWorker.stop();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info("The server started successfully.", {
    meta: {
      PORT: PORT,
      SERVER_URL: `http://localhost:${PORT}`,
    },
  });
});
