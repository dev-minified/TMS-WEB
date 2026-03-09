"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("tms_role") || "user";
    router.replace(role === "super_admin" ? "/dashboard" : "/stock");
  }, [router]);

  return null;
}
