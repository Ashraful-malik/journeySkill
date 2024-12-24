"use client";

import React from "react";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
function Navbar() {
  const { userId } = useAuth();
  return (
    <nav className="bg-dark-800 p-2 ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">JourneySkill</div>
        {!userId ? (
          <div className="flex space-x-4">
            <Link href="/sign-in">Sign-In</Link>
            <Link href="/sign-up">Sign-Up</Link>
          </div>
        ) : (
          <UserButton showName />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
