"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { User } from "lucide-react";
import { useGlobalUser } from "@/context/userContent";

// Profile Header
function ProfileHeader({ userData }) {
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;

  return (
    <div className="profile-image -mt-10 flex items-baseline justify-between">
      <div>
        <Avatar className="w-24 h-24 ">
          <AvatarImage
            src={
              userData?.tempProfileImage
                ? userData?.tempProfileImage
                : userData?.profileImage?.imageUrl
            }
            alt={userData?.username}
          />
          <AvatarFallback aria-label="User's initials">
            <User />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold mt-2">{userData?.fullName}</h1>
        <p className="text-base text-muted-foreground font-bold">
          @{userData?.username}
        </p>
      </div>
      {userData?._id === userId && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary">
            <Link href={`/profile/edit/${userData?.username}`}>
              Edit Profile
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProfileHeader;
