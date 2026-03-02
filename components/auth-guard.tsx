"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("tms_auth") === "true";
    if (!isAuth && pathname !== "/login") {
      router.replace("/login");
    } else if (isAuth && pathname === "/login") {
      router.replace("/dashboard");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) return null;

  return <>{children}</>;
}
