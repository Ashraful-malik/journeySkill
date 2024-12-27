import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bookmark, Eye, Heart, MessageCircle, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
const actionButtons = [
  { name: "Like", icon: Heart, label: "Like this post" },
  { name: "Comment", icon: MessageCircle, label: "Comment on this post" },
  { name: "View", icon: Eye, label: "View post statistics", noPointer: true },
];

function ChallengeCard({ id, description, title }) {
  return (
    <Card className=" rounded-sm">
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Avatar aria-label="User Avatar: Ashraful Malik">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Ashraful Malik's avatar"
            />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div>
            <p id="author-name">Ashraful Malik</p>
            <p className="text-sm text-muted-foreground" id="author-username">
              @ashraful
            </p>
          </div>
        </CardTitle>
        <CardDescription aria-labelledby="author-name">
          2 days ago
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <Link href={`/challenges/${id}`}>
          <div className="content">
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="leading-7 [&:not(:first-child)]:mt-4 text-base">
              {description}
            </p>
          </div>
        </Link>
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          {/* Left Actions */}
          <div className="flex items-center space-x-4 text-muted-foreground">
            {actionButtons.map((item, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-2 ${
                  item.noPointer ? "cursor-default" : "cursor-pointer"
                }`}
                aria-label={item.label} // Accessible label for the action
              >
                <item.icon size={20} />
                <span className="text-sm" aria-hidden="true">
                  100
                </span>
              </button>
            ))}
          </div>

          {/* Right Action */}
          <button
            className="flex items-center gap-2 cursor-pointer text-muted-foreground"
            aria-label="Save this post"
          >
            <Bookmark size={20} />
            <span className="text-sm " aria-hidden="true">
              Save
            </span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ChallengeCard;
