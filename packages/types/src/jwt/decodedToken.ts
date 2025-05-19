export interface DecodedToken {
  publicKey: string;
  id: string;
  type: "user" | "admin";
}
