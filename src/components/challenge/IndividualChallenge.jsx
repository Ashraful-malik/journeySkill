import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import PostCard from "../cards/PostCard";

function IndividualChallenge() {
  const posts = [
    {
      content:
        "I am doing a 30 days challenge to improve my coding skills. Each day, I am dedicating time to learn new concepts and apply them in small projects. It's been a rewarding experience so far and I'm excited to see my progress by the end of the challenge.",
      image:
        "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww",
      link: "https://journeyskill.verce.app",
    },
    {
      content:
        "I am doing a 30 days challenge to improve my coding skills. Each day, I am dedicating time to learn new concepts and apply them in small projects. It's been a rewarding experience so far and I'm excited to see my progress by the end of the challenge.",
      image:
        "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww",
      link: "https://journeyskill.verce.app",
    },
  ];
  return (
    <div className="mt-5">
      {/* header */}
      <header className="flex items-center  justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-12 h-12 ">
            <AvatarImage src="https://github.com/shadcn.png" alt="@maria" />
            <AvatarFallback aria-label="User's initials">
              <User />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-base font-semibold">Ashraful Malik</h1>
            <p className="text-sm text-muted-foreground">@ashraful00</p>
          </div>
        </div>
        {/* follow button */}
        <div>
          <Button size="sm">Follow</Button>
        </div>
      </header>

      {/* body */}
      <div className="my-8">
        <div className="content">
          <p className="text-sm text-muted-foreground">
            Challenge started: 01/01/2023
          </p>
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            30 Days Coding Challenge
          </h1>
          <p className="text-base leading-7 [&:not(:first-child)]:mt-2 max-w-[70ch]">
            I am doing 30 days coding challenge to learn basic of react this is
            my new year resolution challenge I am doing 30 days coding challenge
            to learn basic of react this is my new year resolution challenge I
            am doing 30 days coding challenge to learn basic of react this is my
            new year resolution challenge
          </p>
        </div>
      </div>
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            content={post.content}
            image={post.image}
            link={post.link}
          />
        ))}
      </div>
    </div>
  );
}

export default IndividualChallenge;
