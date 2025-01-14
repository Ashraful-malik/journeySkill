"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { User } from "lucide-react";

// Profile Header
const ProfileHeader = ({ username, fullName, profileImage }) => (
  <div className="profile-image -mt-10 flex items-baseline justify-between">
    <div>
      <Avatar className="w-20 h-20 ">
        <AvatarImage
          src={profileImage?.clerkImage || profileImage?.imageUrl}
          alt="@shadcn"
        />
        <AvatarFallback aria-label="User's initials">
          <User />
        </AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold mt-2">{fullName}</h1>
      <p className="text-base text-muted-foreground font-bold">@{username}</p>
    </div>
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary">
        <Link href={`/profile/edit/${username}`}>Edit Profile</Link>
      </Button>
      <Button size="sm">Follow</Button>
    </div>
  </div>
);

export default ProfileHeader;
