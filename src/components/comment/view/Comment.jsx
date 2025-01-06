"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import React, { useState } from "react";

function Comment({ profileImage, name, comment }) {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="flex items-start gap-3 mb-4 ">
      <Avatar
        className="w-10 h-10 cursor-pointer border-2"
        aria-label="User avatar"
      >
        <AvatarImage src={profileImage} alt={name} />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{name}</h3>
        <p
          className={`text-muted-foreground max-w-[65ch] ${
            showMore ? "line-clamp-none" : "line-clamp-2"
          }`}
        >
          {comment}
        </p>
        {comment.length > 100 && (
          <button
            className="text-sm font-bold cursor-pointer"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Comment;
