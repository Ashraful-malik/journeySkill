"use client";
import PostFeed from "@/components/feed/PostFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import PostCardSkeleton from "@/components/skeleton/card/PostCardSkeleton";
import { usePostQuery } from "@/hooks/queries/usePostQuery";

const Page = () => {
  const {
    data: posts,
    isLoading: feedLoading,
    error: feedError,
    fetchNextPage,
    isFetchingNextPage,
  } = usePostQuery();

  return (
    <WrapperLayout>
      {feedLoading ? (
        Array.from({ length: 4 }).map((_, idx) => (
          <div className="my-4" key={idx}>
            <PostCardSkeleton />
          </div>
        ))
      ) : (
        <PostFeed
          posts={posts}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </WrapperLayout>
  );
};

export default Page;
