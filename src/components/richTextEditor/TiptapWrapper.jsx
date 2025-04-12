"use client";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import { Suspense } from "react";

const Tiptap = dynamic(() => import("./Tiptap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[200px]">
      <Loader className="animate-spin h-8 w-8" />
    </div>
  ),
});

export default function TiptapWrapper(props) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[200px]">
          <Loader className="animate-spin h-8 w-8" />
        </div>
      }
    >
      <Tiptap {...props} />
    </Suspense>
  );
}
