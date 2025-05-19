"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  ListChecks,
  Wallet,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
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
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Create Task",
      icon: Plus,
      href: "/dashboard/create-task",
      active: pathname === "/dashboard/create-task",
    },
    {
      label: "My Tasks",
      icon: ListChecks,
      href: "/dashboard/tasks",
      active: pathname === "/dashboard/tasks",
    },
    {
      label: "Wallet",
      icon: Wallet,
      href: "/dashboard/wallet",
      active: pathname === "/dashboard/wallet",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Shield className="h-6 w-6 text-primary" />
            <span>LabelChain Admin</span>
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
