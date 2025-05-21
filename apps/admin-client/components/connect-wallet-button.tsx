"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function ConnectWalletButton() {
  // Removed all authentication logic from this component
  return (
    <div className="wallet-adapter-button-wrapper">
      <WalletMultiButton className="wallet-adapter-button" />
      <style jsx global>{`
        .wallet-adapter-button-wrapper {
          display: inline-block;
        }
        .wallet-adapter-button {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          height: 40px;
          line-height: 1;
          padding: 0 24px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .wallet-adapter-button:hover {
          background-color: hsl(var(--primary) / 0.9);
        }
        .wallet-adapter-button:not([disabled]):hover {
          background-color: hsl(var(--primary) / 0.9);
        }
        .wallet-adapter-modal-wrapper {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
        }
        .wallet-adapter-modal-button-close {
          background-color: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
        }
        .wallet-adapter-modal-title {
          color: hsl(var(--foreground));
        }
        .wallet-adapter-modal-content {
          color: hsl(var(--muted-foreground));
        }
        .wallet-adapter-modal-list {
          margin: 0;
        }
        .wallet-adapter-modal-list .wallet-adapter-button {
          font-weight: normal;
          border-radius: 6px;
          font-family: inherit;
          background-color: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
        }
      `}</style>
    </div>
  );
}
