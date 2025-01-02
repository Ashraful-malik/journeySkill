import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import React from "react";

function Comment({ profileImage, name, comment }) {
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
        <p className=" text-muted-foreground">{comment}</p>
      </div>
    </div>
  );
}

export default Comment;
