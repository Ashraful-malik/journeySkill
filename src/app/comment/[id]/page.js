"use client";
import WrapperLayout from "@/components/layouts/WrapperLayout";
import CommentTypeSelector from "@/components/CommentTypeSelector";
import { Suspense } from "react";

function Page() {
  return (
    <WrapperLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <CommentTypeSelector />
      </Suspense>
    </WrapperLayout>
  );
}

export default Page;
