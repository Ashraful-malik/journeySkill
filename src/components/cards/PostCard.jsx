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
import { Bookmark, Eye, Heart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import CustomDropdownMenu from "../CustomDropdownMenu";

function PostCard({ content, image, link, className }) {
  const handleLike = () => {
    console.log("liked");
  };
  const handleComment = () => {
    console.log("commented");
  };
  return (
    <Card className={`border border-b-0 rounded-none ${className}`}>
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {/* profile details */}
          <div className="flex items-center space-x-2">
            <Avatar aria-label="User Avatar: Ashraful Malik">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Ashraful Malik's avatar"
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            {/* user username and name */}
            <div>
              <Link href="/profile/1215">
                <p id="author-name " className="hover:underline">
                  Ashraful Malik
                </p>
              </Link>
              <p className="text-sm text-muted-foreground" id="author-username">
                @ashraful
              </p>
            </div>
          </div>
          {/* dropdown menu */}
          <div>
            <CustomDropdownMenu />
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
            <button
              onClick={handleLike}
              className="flex items-center gap-2 cursor-pointer "
              aria-label="Like this post"
            >
              <Heart size={20} className="hover:text-red-500" />
              <span className="text-sm" aria-hidden="true">
                100
              </span>
            </button>
            <Link href="/comment/456?type=post">
              <button
                onClick={handleComment}
                className="flex items-center gap-2 cursor-pointer"
                aria-label="Comment on this post"
              >
                <MessageCircle size={20} className="hover:text-primary" />
                <span className="text-sm" aria-hidden="true">
                  200
                </span>
              </button>
            </Link>
          </div>

          {/* Right side Action */}
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
