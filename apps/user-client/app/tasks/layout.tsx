import type React from "react";
import { AuthCheck } from "@/components/auth-check";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthCheck requiredUserType="user">
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar className="hidden md:block md:w-64" />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AuthCheck>
  );
}
