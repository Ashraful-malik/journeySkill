import { Home, Bell, Search, User } from "lucide-react";
import Link from "next/link";

const BottomNav = () => {
  const navItems = [
    { name: "Home", icon: Home, link: "/" },
    { name: "Explore", icon: Search, link: "/explore" },
    { name: "Notifications", icon: Bell, link: "/notifications" },
    { name: "Profile", icon: User, link: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full lg:hidden bg-background border-t flex justify-around py-2">
      {navItems.map((item, idx) => (
        <Link
          href={item.link}
          key={idx}
          className="flex flex-col items-center text-sm"
        >
          <item.icon className="w-6 h-6" />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
