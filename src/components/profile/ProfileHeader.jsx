import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

// Profile Header
const ProfileHeader = () => (
  <div className="profile-image -mt-12 flex items-baseline justify-between">
    <div>
      <Avatar className="w-20 h-20 ">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback aria-label="User's initials">SM</AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold mt-2">Ashraufl Malik</h1>
      <p className="text-base text-muted-foreground font-bold">@ashraful</p>
    </div>
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary">
        Edit Profile
      </Button>
      <Button size="sm">Follow</Button>
    </div>
  </div>
);

export default ProfileHeader;
