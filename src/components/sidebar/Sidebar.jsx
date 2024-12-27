"use client";

import {
  Home,
  Bell,
  User,
  Swords,
  SquarePlus,
  SlidersHorizontal,
  Settings,
  LogOut,
  Bug,
  SunMoon,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import the hook for current pathname
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu"; // Import ShadCN dropdown menu components

const Sidebar = () => {
  const pathname = usePathname(); // Get the current route

  const navItems = [
    { name: "Home", icon: Home, link: "/home" },
    { name: "Challenges", icon: Swords, link: "/challenges" },
    { name: "Notifications", icon: Bell, link: "#notifications" },
    { name: "Profile", icon: User, link: "/profile" },
    { name: "Create", icon: SquarePlus, link: "/create" },
    {
      name: "More",
      icon: SlidersHorizontal,
      link: "#more",
      subItems: [
        { name: "Settings", link: "#settings", icon: Settings },
        { name: "Save", link: "#save", icon: Bookmark },
        { name: "Theme", link: "#theme", icon: SunMoon },
        { name: "Report Issue", link: "#report", icon: Bug },
        { name: "Logout", link: "#logout", icon: LogOut },
      ],
    },
  ];

  return (
    <aside
      className="fixed h-full w-64 lg:flex flex-col bg-background p-4"
      aria-label="Sidebar"
    >
      {/* Sidebar title */}
      <div className="text-2xl font-bold mb-4" tabIndex={0}>
        JourneySkill
      </div>

      {/* User avatar */}
      <Avatar
        className="w-12 h-12 cursor-pointer border-2"
        aria-label="User avatar"
      >
        <AvatarImage
          src="https://avatars.githubusercontent.com/u/43632556?v=4"
          alt="@shadcn"
        />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>

      {/* Navigation */}
      <nav className="space-y-4 py-4" aria-label="Main Navigation">
        {navItems.map((item, idx) =>
          item.subItems ? (
            <DropdownMenu key={idx}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-3 p-2 rounded-lg w-full ${
                    pathname === item.link
                      ? "bg-accent text-white"
                      : "hover:bg-accent focus:bg-accent"
                  }`}
                  aria-label={item.name}
                >
                  <item.icon size={24} aria-hidden="true" />
                  <span className="text-lg">{item.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="dark:text-neutral-300">
                {item.subItems.map((subItem, subIdx) => (
                  <DropdownMenuItem key={subIdx}>
                    <Link
                      href={subItem.link}
                      className="flex items-center gap-3 rounded-lg hover:bg-accent focus:bg-accent"
                      aria-label={subItem.name}
                    >
                      <subItem.icon size={24} aria-hidden="true" />
                      <span className="text-lg">{subItem.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href={item.link}
              key={idx}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                pathname === item.link
                  ? "bg-accent text-white"
                  : "hover:bg-accent focus:bg-accent"
              }`}
              aria-label={item.name}
            >
              <item.icon size={24} aria-hidden="true" />
              <span className="text-lg">{item.name}</span>
            </Link>
          )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
