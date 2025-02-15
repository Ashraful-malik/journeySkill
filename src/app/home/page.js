"use client";
// export default Page;
import PostFeed from "@/components/feed/PostFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import PostCardSkeleton from "@/components/skeleton/card/PostCardSkeleton";
import { usePostQuery } from "@/hooks/queries/usePostQuery";
import { useEffect, useRef } from "react";

const Page = () => {
  const {
    data: posts,
    isLoading: feedLoading,
    error: feedError,
    fetchNextPage,
    hasNextPage,
  } = usePostQuery();
  console.log("post form hoem ---->", posts);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage || feedLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, feedLoading, fetchNextPage]);
  return (
    <WrapperLayout>
      {feedLoading ? (
        Array.from({ length: 4 }).map((_, idx) => (
          <div className="my-4" key={idx}>
            <PostCardSkeleton />
          </div>
        ))
      ) : (
        <PostFeed posts={posts} ref={loadMoreRef} hasNextPage={hasNextPage} />
      )}
    </WrapperLayout>
  );
};

export default Page;
