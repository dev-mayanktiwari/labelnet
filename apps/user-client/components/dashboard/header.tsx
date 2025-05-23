"use client";

import { Menu } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useWallet } from "@solana/wallet-adapter-react";
import { truncateAddress } from "@workspace/ui/lib/utils";

export function Header() {
  const { publicKey } = useWallet();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="flex-1" />
      {publicKey && (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-medium">
              {publicKey.toString().substring(0, 2)}
            </span>
          </div>
          <span className="hidden text-sm md:inline-block">
            {truncateAddress(publicKey.toString())}
          </span>
        </div>
      )}
    </header>
  );
}
