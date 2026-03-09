"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const ADMIN_ONLY_ROUTES = ["/dashboard", "/add-tyre", "/add-customer", "/customers"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("tms_auth") === "true";
    const role = localStorage.getItem("tms_role") || "user";

    if (!isAuth && pathname !== "/login") {
      router.replace("/login");
    } else if (isAuth && pathname === "/login") {
      router.replace(role === "super_admin" ? "/dashboard" : "/stock");
    } else if (
      isAuth &&
      role === "user" &&
      ADMIN_ONLY_ROUTES.some((r) => pathname.startsWith(r))
    ) {
      router.replace("/stock");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) return null;

  return <>{children}</>;
}
