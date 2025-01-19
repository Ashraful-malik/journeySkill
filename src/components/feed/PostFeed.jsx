import { useUserQuery } from "@/hooks/queries/useUserQuery";
import PostCard from "../cards/PostCard";
const PostFeed = ({ posts }) => {
  return (
    <div className="flex-1 max-w-2xl mx-auto ">
      {posts?.posts?.map((post) => (
        <PostCard
          key={post._id}
          linkUrl={post?.link}
          content={post?.text}
          createdAt={post?.createdAt}
          image={post?.image}
          owner={post?.owner}
          challenge={post?.challengeId}
        />
      ))}
    </div>
  );
};

export default PostFeed;
