import React from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";

function HomeNavbar({ onHamburgerClick }) {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo.png" : "/logo-dark.png";
  return (
    <div className="p-4 flex justify-between">
      <Button variant="ghost" size="icon" onClick={onHamburgerClick}>
        <Menu />
      </Button>
      <div className="flex items-center justify-center text-center gap-2">
        <Image
          src={logoSrc}
          alt="logo"
          width={8}
          height={8}
          style={{ width: "auto", height: "auto" }}
        />
        <p className="text-xl font-bold">JourneySkill</p>
      </div>
    </div>
  );
}

export default HomeNavbar;
