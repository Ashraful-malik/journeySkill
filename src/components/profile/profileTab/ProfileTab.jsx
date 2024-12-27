import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

function ProfileTab() {
  return (
    <Tabs defaultValue="posts">
      <TabsList className="w-full rounded-none h-12 bg-background border-b">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
        <TabsTrigger value="Saved">Saved</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">we have all the posts</TabsContent>
      <TabsContent value="challenges">Change your password here.</TabsContent>
    </Tabs>
  );
}

export default ProfileTab;
