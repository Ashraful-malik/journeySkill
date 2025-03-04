"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export default function HotjarTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.hj === "function") {
      window.hj("stateChange", pathname); // Tell Hotjar when route changes
    }
  }, [pathname]);

  return null;
}
