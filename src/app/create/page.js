import WrapperLayout from "@/components/layouts/WrapperLayout";
import React from "react";
import CreatePost from "@/components/createPostAndChallenge/Form/CreatePost";
import PostsTab from "@/components/createPostAndChallenge/PostsTab";
function page() {
  return (
    <WrapperLayout>
      <PostsTab />
    </WrapperLayout>
  );
}

export default page;
