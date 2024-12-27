"use client";
// export default Page;
import PostFeed from "@/components/feed/PostFeed";
import WrapperLayout from "@/components/layouts/WrapperLayout";

const Page = () => {
  return (
    <WrapperLayout>
      <PostFeed />
    </WrapperLayout>
  );
};

export default Page;
