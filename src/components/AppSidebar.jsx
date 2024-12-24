"use client";
import {
  Bookmark,
  Bug,
  Calendar,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  SunMoon,
  User,
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
import { User2, ChevronUp } from "lucide-react";

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
    icon: Inbox,
  },
  {
    title: "Create",
    url: "#",
    icon: Calendar,
  },

  {
    title: "Profile",
    url: "#",
    icon: Settings,
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
    <Sidebar collapsible="icon" className="text-neutral-300">
      <SidebarContent>
        <SidebarHeader className="flex-row items-center border-b">
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="pb-4 ">
                  <SidebarMenuButton asChild size="base">
                    <a href={item.url} className="flex items-center ">
                      <item.icon style={{ width: "24px", height: "24px" }} />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
