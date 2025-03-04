"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserPosts from "./TabSection/UserPosts";
import UserChallenges from "./TabSection/UserChallenges";

function ProfileTab({ userData }) {
  return (
    <Tabs defaultValue="posts">
      <TabsList className="w-full rounded-none h-12 bg-background border-b">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        {/* all user posts */}
        <UserPosts userData={userData} />
      </TabsContent>
      <TabsContent value="challenges">
        {/* all user challenges */}
        <UserChallenges userData={userData} />
      </TabsContent>
    </Tabs>
  );
}

export default ProfileTab;
