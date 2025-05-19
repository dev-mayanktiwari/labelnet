import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  publicKey: string;
  id: string;
  type: "user" | "admin";
}
