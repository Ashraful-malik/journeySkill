import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

function HomeNavbar({ onHamburgerClick }) {
  return (
    <div className="p-4 flex justify-between">
      <Button variant="ghost" size="icon" onClick={onHamburgerClick}>
        <Menu />
      </Button>
      <p className="text-xl font-bold">JourneySkill</p>
    </div>
  );
}

export default HomeNavbar;
