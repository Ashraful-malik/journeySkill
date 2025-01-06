import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/cards/PostCard";
import ChallengeCard from "@/components/cards/ChallengeCard";

function ProfileTab() {
  return (
    <Tabs defaultValue="posts">
      <TabsList className="w-full rounded-none h-12 bg-background border-b">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 ">
          {/* all posts of user */}
          <PostCard
            content="hello world this is content of post more content here i am typing this is me and i am playing with it"
            image="https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww"
            link="https://google.com"
            className="border"
          />
          <PostCard
            content="hello world this is content of post more content here i am typing this is me and i am playing with it"
            image="https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww"
            link="https://google.com"
            className="border"
          />
          <PostCard
            content="hello world this is content of post more content here i am typing this is me and i am playing with it"
            image="https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww"
            link="https://google.com"
            className="border"
          />
          <PostCard
            content="hello world this is content of post more content here i am typing this is me and i am playing with it"
            image="https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww"
            link="https://google.com"
            className="border"
          />
          <PostCard
            content="hello world this is content of post more content here i am typing this is me and i am playing with it"
            image="https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww"
            link="https://google.com"
            className="border"
          />
        </div>
      </TabsContent>
      <TabsContent value="challenges">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <ChallengeCard
            challengeName="30 days coding challenge"
            description="I am taking the challenge to build a full-stack SaaS application using React in just 30 days. I will be posting my progress, experiences and lessons learned here."
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default ProfileTab;
