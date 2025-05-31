"use client";

import type React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectWalletButton } from "./connect-wallet-button";
import { authService } from "../lib/apiClient";
import { SignMessage } from "./sign-message";

interface AuthCheckProps {
  children: React.ReactNode;
  requiredUserType?: "admin" | "user";
  redirectTo?: string;
}

export function AuthCheck({
  children,
  requiredUserType = "user",
  redirectTo = "/dashboard",
}: AuthCheckProps) {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true, // Start with loading to prevent flicker
    isChecked: false,
  });

  // console.log("Auth state:", authState);

  useEffect(() => {
    // Reset auth state when wallet disconnects
    if (!connected || !publicKey) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        isChecked: true,
      });
      return;
    }

    // Check if user is authenticated via cookie
    const checkAuth = async () => {
      try {
        const response = await authService.authCheck();
        // @ts-ignore
        if (response.statusCode === 200) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            isChecked: true,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            isChecked: true,
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          isChecked: true,
        });
      }
    };

    checkAuth();
  }, [connected, publicKey]);

  useEffect(() => {
    // Only redirect if auth check is complete
    if (!authState.isChecked || authState.isLoading) {
      return;
    }

    // If not authenticated and not connected, redirect to home
    if (!authState.isAuthenticated && (!connected || !publicKey)) {
      if (redirectTo === "/") {
        router.push("/");
      }
      return;
    }

    // If authenticated and we're in a protected route, stay on current page
    // No automatic redirect to dashboard - let the user stay where they are
  }, [
    authState.isAuthenticated,
    authState.isChecked,
    authState.isLoading,
    connected,
    publicKey,
    router,
    redirectTo,
  ]);

  if (authState.isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold">Loading...</h1>
          <p className="text-muted-foreground">
            Checking authentication status...
          </p>
        </div>
      </div>
    );
  }

  if (!connected || !publicKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Please connect your Solana wallet to access tasks and earn rewards.
          </p>
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated && authState.isChecked) {
    return (
      <SignMessage
        userType={requiredUserType}
        onSuccess={() =>
          setAuthState((prev) => ({ ...prev, isAuthenticated: true }))
        }
      />
    );
  }

  return <>{children}</>;
}
