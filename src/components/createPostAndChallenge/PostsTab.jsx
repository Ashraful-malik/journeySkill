"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePost from "./Form/CreatePost";
import CreateChallenge from "./Form/CreateChallenge";
import { StickyNote, Swords } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
function PostsTab({ userChallenges }) {
  // fetch use challenges
  const router = useRouter();
  const searchParams = useSearchParams();
  const getActiveTabFromQuery = () => {
    const tab = searchParams.get("tab");
    return tab === "create-challenge" ? "create-challenge" : "create-post";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromQuery());

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab !== activeTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", activeTab);
      router.replace(`?${params.toString()}`); // Update the query params without refreshing
    }
  }, [activeTab, searchParams, router]);
  return (
    <Tabs
      defaultValue="create-post"
      className="px-2 lg:px-0"
      value={activeTab}
      onValueChange={setActiveTab}
    >
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
        <CreatePost userChallenges={userChallenges} />
      </TabsContent>
      <TabsContent value="create-challenge">
        {/* CreateChallenge form */}
        <CreateChallenge />
      </TabsContent>
    </Tabs>
  );
}

export default PostsTab;
