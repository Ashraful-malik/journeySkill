import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";

function HomeNavbar({ onHamburgerClick }) {
  const { theme, systemTheme } = useTheme();

  return (
    <div className="p-4 flex justify-between">
      <Button variant="ghost" size="icon" onClick={onHamburgerClick}>
        <Menu />
      </Button>
      <div className="flex items-center justify-center text-center gap-2">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <p className="text-xl font-bold">JourneySkill</p>
      </div>
    </div>
  );
}

export default HomeNavbar;
