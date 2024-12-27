"use client";
import {
  Bookmark,
  Bug,
  Calendar,
  Home,
  Inbox,
  LogOut,
  Settings,
  SunMoon,
  User2,
  ChevronUp,
  Swords,
  SquarePlus,
  ChevronRight,
  FileText,
  Flag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Challenges",
    url: "#",
    icon: Swords,
  },
  {
    title: "Create",
    submenu: [
      { title: "Create Post", url: "#create-post", icon: FileText },
      { title: "Create Challenge", url: "#create-challenge", icon: Flag },
    ],
    icon: SquarePlus,
  },
  {
    title: "Profile",
    url: "#",
    icon: User2,
  },
];

const footerMenuItems = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Theme",
    url: "#",
    icon: SunMoon,
  },
  {
    title: "Save",
    url: "#",
    icon: Bookmark,
  },
  {
    title: "Report Bug",
    url: "#",
    icon: Bug,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-none">
      <SidebarHeader>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.submenu ? (
                  // Dropdown menu for items with submenu
                  <SidebarMenuItem key={item.title} className="pb-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          className="flex items-center justify-between w-full"
                          size="base"
                          isActive="true"
                        >
                          <div className="flex items-center">
                            <item.icon
                              style={{ width: "20px", height: "20px" }}
                            />
                            <span className="text-base ml-2">{item.title}</span>
                          </div>
                          <ChevronRight className="ml-auto" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="bottom"
                        className="w-[--radix-popper-anchor-width]"
                      >
                        {item.submenu.map((subItem) => (
                          <DropdownMenuItem key={subItem.title}>
                            <a href={subItem.url} className="flex items">
                              <subItem.icon
                                style={{ width: "20px", height: "20px" }}
                              />
                              <span className="ml-2">{subItem.title}</span>
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ) : (
                  // Normal menu item
                  <SidebarMenuItem key={item.title} className="pb-4">
                    <SidebarMenuButton asChild size="base">
                      <a href={item.url} className="flex items-center ">
                        <item.icon style={{ width: "20px", height: "20px" }} />
                        <span className="text-base ml-2">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full min-w-12">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>
                      <User2 />
                    </AvatarFallback>
                  </Avatar>
                  Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {footerMenuItems.map((item) => (
                  <DropdownMenuItem key={item.title}>
                    <a href={item.url} className="flex items-center">
                      <item.icon />
                      <span className="ml-2">{item.title}</span>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
