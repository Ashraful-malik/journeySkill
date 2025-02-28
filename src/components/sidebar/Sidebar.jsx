"use client";

import {
  Home,
  User,
  Swords,
  SquarePlus,
  SlidersHorizontal,
  Bug,
  MessageCircleMore,
  LogOut,
  MessageSquareText,
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
import ThemeSwitcher from "../ThemeSwitcher";
import { useUserQuery } from "@/hooks/queries/useUserQuery";
import { useClerk } from "@clerk/nextjs";
import { Badge } from "../ui/badge";

const Sidebar = () => {
  const { data: userData } = useUserQuery();
  const username = userData?.username;
  const pathname = usePathname(); // Get the current route
  const { signOut } = useClerk();

  const navItems = [
    { name: "Home", icon: Home, link: "/home" },
    { name: "Challenges", icon: Swords, link: "/challenges" },
    { name: "Profile", icon: User, link: `/profile/${username}` },
    { name: "Create", icon: SquarePlus, link: "/create" },
    {
      name: "✨Give Feedback",
      icon: MessageSquareText,
      link: "https://forms.gle/SXqpyrsJNbg8Nqiu7",
      target: "_blank",
    },
    {
      name: "More",
      icon: SlidersHorizontal,
      link: "#more",
      subItems: [
        {
          name: "Report Issue",
          link: "https://forms.gle/HZh448qtMXSMmFsx9",
          icon: Bug,
          target: "_blank",
        },

        {
          name: "Logout",
          link: "#logout",
          icon: LogOut,
          className: "text-red-500",
          onClick: () => {
            signOut({ redirectUrl: "/" });
          },
        },
      ],
    },
  ];

  return (
    <aside
      className="fixed h-full w-64 lg:flex flex-col bg-background p-4"
      aria-label="Sidebar"
    >
      {/* Sidebar title */}
      <div
        className="text-2xl font-bold mb-4 flex item-center  h-auto text-center gap-2"
        tabIndex={0}
      >
        <p> JourneySkill</p>
        <Badge variant="secondary" className="max-h-min">
          Beta
        </Badge>
      </div>

      {/* User avatar */}
      <Avatar className="w-14 h-14  border-2" aria-label="User avatar">
        <AvatarImage
          src={userData?.profileImage?.imageUrl}
          alt={userData?.username}
        />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>

      {/* Navigation */}
      <nav className="space-y-4 py-4 " aria-label="Main Navigation">
        {navItems.map((item, idx) =>
          item.subItems ? (
            <DropdownMenu key={idx}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-3 p-2 rounded-lg w-full ${
                    pathname === item.link
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent focus:bg-sidebar-accent"
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
                      {...(subItem.target && { target: subItem.target })}
                    >
                      <subItem.icon size={24} aria-hidden="true" />
                      <span
                        className={`text-lg ${subItem.className}`}
                        onClick={subItem.onClick}
                      >
                        {subItem.name}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                {/* Add ThemeSwitcher */}
                <DropdownMenuItem>
                  <ThemeSwitcher />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href={item.link}
              key={idx}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                pathname === item.link
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent focus:bg-sidebar-accent"
              }`}
              aria-label={item.name}
              {...(item.target && { target: item.target })}
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
