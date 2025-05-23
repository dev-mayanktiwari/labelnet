"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";
import { truncateAddress } from "@workspace/ui/lib/utils";

export default function WalletPage() {
  const { publicKey } = useWallet();

  // Mock data for transactions
  const transactions = [
    {
      id: "tx1",
      type: "incoming",
      amount: 0.5,
      description: "Task: Image Classification",
      date: "2025-05-05",
      status: "confirmed",
    },
    {
      id: "tx2",
      type: "incoming",
      amount: 0.8,
      description: "Task: Object Detection",
      date: "2025-05-04",
      status: "confirmed",
    },
    {
      id: "tx3",
      type: "incoming",
      amount: 0.6,
      description: "Task: Facial Recognition",
      date: "2025-05-03",
      status: "confirmed",
    },
    {
      id: "tx4",
      type: "outgoing",
      amount: 1.5,
      description: "Withdrawal to external wallet",
      date: "2025-05-02",
      status: "confirmed",
    },
    {
      id: "tx5",
      type: "incoming",
      amount: 0.7,
      description: "Task: Landscape Classification",
      date: "2025-05-01",
      status: "confirmed",
    },
  ];

  // Calculate balance
  const balance = transactions.reduce((sum, tx) => {
    if (tx.type === "incoming") {
      return sum + tx.amount;
    } else {
      return sum - tx.amount;
    }
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your SOL wallet and view transaction history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription>
            Your current SOL balance and wallet address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <span className="text-4xl font-bold">{balance.toFixed(1)} SOL</span>
            <span className="text-sm text-muted-foreground">
              ≈ ${(balance * 100).toFixed(2)} USD
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm text-muted-foreground">Wallet Address</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {publicKey
                  ? truncateAddress(publicKey.toString(), 8)
                  : "Not connected"}
              </span>
              {publicKey && (
                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                  <a
                    href={`https://explorer.solana.com/address/${publicKey.toString()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View on Solana Explorer</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="pt-4">
            <Button className="w-full">Withdraw to External Wallet</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Recent transactions from your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tx.type === "incoming"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {tx.type === "incoming" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${tx.type === "incoming" ? "text-green-500" : "text-red-500"}`}
                  >
                    {tx.type === "incoming" ? "+" : "-"}
                    {tx.amount} SOL
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
