import { z } from "zod";

export const UserRegisterInput = z.object({
  publicKey: z.string().min(1, "Public key is required"),
  signature: z.string().min(1, "Signature is required"),
  userType: z.enum(["user", "admin"]),
  message: z.string().min(1, "Message is required"),
});

export type TUserRegistrationInput = z.infer<typeof UserRegisterInput>;
