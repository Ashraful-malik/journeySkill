import { useUserQuery } from "@/hooks/queries/useUserQuery";
import {
  Home,
  User,
  Swords,
  SquarePlus,
  MessageSquareText,
} from "lucide-react";
import Link from "next/link";

const BottomNav = () => {
  const { data: userData, isLoading: userLoading } = useUserQuery();
  const username = userData?.username;
  const navItems = [
    { icon: Home, link: "/home" },
    { icon: Swords, link: "/challenges" },
    { icon: SquarePlus, link: "/create" },
    {
      icon: MessageSquareText,
      link: "https://forms.gle/SXqpyrsJNbg8Nqiu7",
      target: "_blank",
    },
    { icon: User, link: `/profile/${username}` },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full lg:hidden bg-background border-t flex justify-around py-2">
      {navItems.map((item, idx) => (
        <Link
          href={item.link}
          key={idx}
          className="flex flex-col items-center text-sm"
          disabled={userLoading}
          {...(item.target && { target: item.target })}
        >
          <item.icon className="w-6 h-6" />
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
