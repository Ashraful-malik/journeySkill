import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

const Tiptap = dynamic(() => import("./Tiptap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[200px]">
      <Loader className="animate-spin h-8 w-8" />
    </div>
  ),
});
function TiptapWrapper(props) {
  return <Tiptap {...props} />;
}

export default TiptapWrapper;
