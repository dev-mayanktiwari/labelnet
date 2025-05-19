export interface TokenPayload {
  publicKey: string;
  id: string;
  type: "user" | "admin";
}
