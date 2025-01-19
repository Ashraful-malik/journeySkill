"use client";
// export default Page;
import PostFeed from "@/components/feed/PostFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import { usePostQuery } from "@/hooks/queries/usePostQuery";

const Page = () => {
  const {
    data: posts,
    isLoading: feedLoading,
    error: feedError,
  } = usePostQuery();

  return (
    <WrapperLayout>
      {feedLoading && <div>Loading...</div>}
      <PostFeed posts={posts} />
    </WrapperLayout>
  );
};

export default Page;
