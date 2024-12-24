"use client";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = ["/", "/login", "/signup"].includes(pathname);

  return showNavbar ? <Navbar /> : null;
}
