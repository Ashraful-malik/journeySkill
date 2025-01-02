"use client";
import React from "react";
import PostCard from "../cards/PostCard";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Comment from "./view/Comment";

function PostComment() {
  return (
    <div className="w-full border-r border-l mt-2">
      <PostCard
        className="border-r-0 border-l-0"
        content={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
        image="https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww"
        link="https://journeyskill.verce.app"
      />
      {/* comment section */}
      <section className="flex flex-col gap-2 ">
        {/* comment input */}
        <div className="flex items-center ">
          <Input
            placeholder="Add a comment"
            className=" rounded-none h-12 border-r-0"
          />
          <Button size="lg" variant="outline" className="h-12 rounded-none">
            Comment
          </Button>
        </div>
        {/* comments */}
        <div className="ml-2">
          <Comment
            profileImage="https://avatars.githubusercontent.com/u/43632556?v=4"
            name="Steve"
            comment="first comment"
          />
          <Comment
            profileImage="https://avatars.githubusercontent.com/u/43632556?v=4"
            name="Steve"
            comment="Nice picture where did you click this from "
          />
        </div>
      </section>
    </div>
  );
}

export default PostComment;
