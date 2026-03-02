"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import AuthGuard from "@/components/auth-guard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <AuthGuard>
      {isLogin ? (
        children
      ) : (
        <>
          <Sidebar />
          <main className="min-h-screen bg-zinc-50 md:ml-60 dark:bg-zinc-950">
            {children}
          </main>
        </>
      )}
    </AuthGuard>
  );
}
