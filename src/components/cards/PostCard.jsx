"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { Bookmark, Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

const actionButtons = [
  { name: "Like", icon: Heart, label: "Like this post" },
  { name: "Comment", icon: MessageCircle, label: "Comment on this post" },
  { name: "View", icon: Eye, label: "View post statistics", noPointer: true },
];

function PostCard({ content, image, link }) {
  return (
    <Card className="border border-b-0 rounded-none">
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Avatar aria-label="User Avatar: Ashraful Malik">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Ashraful Malik's avatar"
            />
            <AvatarFallback>AM</AvatarFallback>
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
        <Image
          src={`${image}`}
          className="w-full h-auto object-cover rounded-md"
          height={500}
          width={500}
          loading="lazy"
          alt="Painting of a majestic castle"
        />
        <div className="content">
          <p className="leading-7 mt-4 text-base">{content}</p>
          <Link
            href={link}
            target="_blank"
            className="text-sm hover:underline text-blue-500 visited:text-purple-600"
          >
            {link}
          </Link>
        </div>
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
                  item.noPointer ? "" : "cursor-pointer"
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

export default PostCard;
