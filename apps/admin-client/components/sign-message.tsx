"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import bs58 from "bs58";
import { authService } from "../lib/apiClient";

interface SignMessageProps {
  userType: "admin" | "user";
  onSuccess: () => void;
}

export function SignMessage({ userType, onSuccess }: SignMessageProps) {
  const { publicKey, signMessage } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignMessage = useCallback(async () => {
    if (!publicKey || !signMessage) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to continue.",
      });
      return;
    }

    try {
      setIsLoading(true);

      // 1. Request a nonce from the server
      const nonceResponse = await authService.getNonce();

      // @ts-ignore
      const nonce = nonceResponse.data.nonce;

      // 2. Create the message to sign
      const message = `Sign this message to authenticate with LabelChain as ${userType}.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      // 3. Sign the message
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      // 4. Send the signature to the server for verification

      const verifyResponse = await authService.signup({
        publicKey: publicKey.toString(),
        message,
        signature: signatureBase58,
        userType,
      });
      //   const verifyResponse = await fetch("/api/auth/verify", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     credentials: "include", // Important for cookies
      //     body: JSON.stringify({
      //       publicKey: publicKey.toString(),
      //       message,
      //       signature: bs58.encode(signature),
      //       userType,
      //     }),

      //   if (!verifyResponse.ok) {
      //     const errorData = await verifyResponse.json();
      //     throw new Error(errorData.message || "Verification failed");
      //   }

      // console.log(verifyResponse);

      toast.success("Authentication successful", {
        description: "You have successfully authenticated with your wallet.",
      });

      // 5. Call the onSuccess callback
      onSuccess();
    } catch (error) {
      console.error("Signing error:", error);
      toast.error("Authentication failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to authenticate with wallet",
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signMessage, userType, onSuccess]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Wallet Authentication Required</CardTitle>
          <CardDescription>
            Please sign a message with your wallet to verify ownership and
            access the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                You'll be asked to sign a message containing a unique nonce.
                This is a security measure to verify that you own this wallet.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xs font-medium">
                  {publicKey?.toString().substring(0, 2)}
                </span>
              </div>
              <div className="text-sm font-medium">
                {publicKey?.toString().substring(0, 6)}...
                {publicKey
                  ?.toString()
                  .substring(publicKey.toString().length - 4)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSignMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing...
              </>
            ) : (
              "Sign Message"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
