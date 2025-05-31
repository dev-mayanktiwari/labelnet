"use client";

import type React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ConnectWalletButton } from "./connect-wallet-button";
import { authService } from "../lib/apiClient";
import { SignMessage } from "./sign-message";

interface AuthCheckProps {
  children: React.ReactNode;
  requiredUserType?: "admin" | "user";
  redirectTo?: string;
}

type AuthStatus =
  | "initializing"
  | "loading"
  | "unauthenticated"
  | "need-signature"
  | "authenticated";

// TODO THIS CODES NEEDS TO BE FIXED AND OPTIMIZED
export function AuthCheck({
  children,
  requiredUserType = "user",
  redirectTo = "/",
}: AuthCheckProps) {
  const { connected, publicKey, connecting } = useWallet();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>("initializing");

  const checkAuthentication = useCallback(async () => {
    // console.log(
    //   "Checking auth - connected:",
    //   connected,
    //   "publicKey:",
    //   !!publicKey,
    //   "connecting:",
    //   connecting
    // );

    // If wallet is still connecting, wait
    if (connecting) {
      setAuthStatus("initializing");
      return;
    }

    // If wallet not connected, user is unauthenticated
    if (!connected || !publicKey) {
      // console.log("Setting status to unauthenticated - wallet not connected");
      setAuthStatus("unauthenticated");
      return;
    }

    setAuthStatus("loading");

    try {
      // Check if user is already authenticated
      const response = await authService.authCheck();
      // console.log("Auth check response:", response);
      // @ts-ignore
      if (response.statusCode === 200) {
        // console.log("Setting status to authenticated");
        setAuthStatus("authenticated");
      } else {
        // console.log("Setting status to need-signature");
        setAuthStatus("need-signature");
      }
    } catch (error) {
      // console.error("Auth check error:", error);
      // console.log("Setting status to need-signature due to error");
      setAuthStatus("need-signature");
    }
  }, [connected, publicKey, connecting]);

  // Wait a bit for wallet to initialize, then check auth
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthentication();
    }, 100); // Small delay to let wallet initialize

    return () => clearTimeout(timer);
  }, [checkAuthentication]);

  // Also check immediately when connection state changes
  useEffect(() => {
    if (!connecting) {
      checkAuthentication();
    }
  }, [connected, publicKey, connecting, checkAuthentication]);

  // Handle redirects only when necessary
  useEffect(() => {
    if (authStatus === "unauthenticated" && !connected && !connecting) {
      // Only redirect if we're supposed to redirect unauthenticated users
      // and we're not already on the redirect path
      if (redirectTo !== window.location.pathname) {
        router.push(redirectTo);
      }
    }
  }, [authStatus, connected, connecting, redirectTo, router]);

  const handleSignSuccess = useCallback(() => {
    setAuthStatus("authenticated");
  }, []);

  // Render based on auth status
  switch (authStatus) {
    case "initializing":
    case "loading":
      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold">Loading...</h1>
            <p className="text-muted-foreground">
              {authStatus === "initializing"
                ? "Initializing wallet connection..."
                : "Checking authentication status..."}
            </p>
          </div>
        </div>
      );

    case "unauthenticated":
      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              Please connect your Solana wallet to access tasks and earn
              rewards.
            </p>
            <ConnectWalletButton />
          </div>
        </div>
      );

    case "need-signature":
      return (
        <SignMessage
          userType={requiredUserType}
          onSuccess={handleSignSuccess}
        />
      );

    case "authenticated":
      return <>{children}</>;

    default:
      return null;
  }
}
