"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks, Wallet, Settings, LogOut, Tag, Award } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { disconnect } = useWallet();
  const router = useRouter();

  const handleLogout = async () => {
    await disconnect();
    router.push("/");
  };

  const routes = [
    {
      label: "Available Tasks",
      icon: ListChecks,
      href: "/tasks",
      active: pathname === "/tasks",
    },
    {
      label: "My Earnings",
      icon: Award,
      href: "/tasks/earnings",
      active: pathname === "/tasks/earnings",
    },
    {
      label: "Wallet",
      icon: Wallet,
      href: "/tasks/wallet",
      active: pathname === "/tasks/wallet",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/tasks/settings",
      active: pathname === "/tasks/settings",
    },
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/tasks" className="flex items-center gap-2 font-semibold">
            <Tag className="h-6 w-6 text-primary" />
            <span>LabelChain</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  route.active
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
