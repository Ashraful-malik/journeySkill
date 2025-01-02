"use client";
import { Ellipsis, EllipsisVertical, Trash } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
const CustomDropdownMenu = () => {
  const dropDownItems = [{ label: "Delete", icon: Trash }];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          {dropDownItems.map((item, idx) => (
            <DropdownMenuItem key={idx}>
              {item.label}
              <DropdownMenuShortcut>
                <item.icon size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default CustomDropdownMenu;
