import type React from "react";
import { AuthCheck } from "@/components/auth-check";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCheck>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AuthCheck>
  );
}
