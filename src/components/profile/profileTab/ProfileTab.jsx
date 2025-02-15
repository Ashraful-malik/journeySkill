import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/cards/PostCard";
import ChallengeCard from "@/components/cards/ChallengeCard";
import { useUserChallengesQuery } from "@/hooks/queries/useChallengeQuery";
import { useFetchUserPostsQuery } from "@/hooks/queries/usePostQuery";

function ProfileTab({ userData }) {
  const { data: userChallenges, isLoading } = useUserChallengesQuery(
    userData?._id
  );
  const { data: userPosts, isLoading: postLoading } = useFetchUserPostsQuery(
    userData?._id
  );
  return (
    <Tabs defaultValue="posts">
      <TabsList className="w-full rounded-none h-12 bg-background border-b">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 place-items-center">
          {postLoading && <div>Loading...</div>}
          {/* all posts of user */}
          {userPosts?.posts.map((post) => (
            <PostCard
              key={post._id}
              content={post?.text}
              image={post?.image}
              linkUrl={post?.link}
              owner={post?.owner}
              createdAt={post?.createdAt}
              challenge={post?.challengeId}
              className="max-w-sm w-full self-start"
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="challenges">
        {isLoading && <div>Loading...</div>}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 ">
          {userChallenges?.challenges.map((challenge) => (
            <ChallengeCard
              key={challenge?._id}
              title={challenge?.challengeName}
              description={challenge?.description}
              id={challenge?._id}
              createdAt={challenge?.createdAt}
              challengeOwner={userData}
              className="max-w-sm w-full "
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default ProfileTab;
