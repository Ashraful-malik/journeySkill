"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";

function Navbar() {
  const { userId } = useAuth();
  const { setTheme } = useTheme();
  return (
    <nav
      className="p-2 md:h-14 fixed top-0 left-0 right-0 z-10 bg-indigo-500/20 backdrop-blur-md
     flex items-center justify-between "
    >
      <div
        className="container mx-auto flex justify-center md:justify-between items-center flex-wrap p-2 md:p-0
      "
      >
        <Link
          href="/"
          className="text-white text-2xl font-bold flex items-start gap-2 pb-2 md:pb-0 "
        >
          <Image src="/logo.png" alt="logo" width={18} height={18} />
          <p>JourneySkill</p>
        </Link>
        {userId ? (
          <Link
            href="/home"
            className="px-5 py-2 rounded-md  text-white hover:bg-indigo-500 font-medium"
          >
            Home
          </Link>
        ) : (
          <div className="flex space-x-4 items-center">
            <Link
              href="/sign-in"
              className="px-5 py-2 rounded-md  text-white hover:bg-indigo-500 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className=" px-5 py-2 rounded-md bg-indigo-400 text-white hover:bg-indigo-500 font-medium"
            >
              Sign Up
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
