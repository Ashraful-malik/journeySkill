"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import CommentTypeSelector from "@/components/CommentTypeSelector";
import { Suspense } from "react";

function CommentWrapper() {
  return (
    <WrapperLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <CommentTypeSelector />
      </Suspense>
    </WrapperLayout>
  );
}

export default CommentWrapper;
