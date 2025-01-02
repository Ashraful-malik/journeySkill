import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePost from "./Form/CreatePost";
import CreateChallenge from "./Form/CreateChallenge";
import { StickyNote, Swords } from "lucide-react";
function PostsTab() {
  return (
    <Tabs defaultValue="create-post" className="px-2 lg:px-0">
      <TabsList className="w-full h-12 border-b justify-start my-8 ">
        <TabsTrigger value="create-post" className="py-2">
          <StickyNote size={20} className="mr-2" />
          Create Post
        </TabsTrigger>
        <TabsTrigger value="create-challenge" className="py-2">
          <Swords size={20} className="mr-2" />
          Create Challenge
        </TabsTrigger>
      </TabsList>
      <TabsContent value="create-post">
        {/* CreatePost form */}
        <CreatePost />
      </TabsContent>
      <TabsContent value="create-challenge">
        {/* CreateChallenge form */}
        <CreateChallenge />
      </TabsContent>
    </Tabs>
  );
}

export default PostsTab;
