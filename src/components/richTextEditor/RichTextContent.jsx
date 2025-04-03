// components/RichTextContent.jsx
"use client";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

function RichTextContent({ html }) {
  const [sanitized, setSanitized] = useState("");

  useEffect(() => {
    setSanitized(DOMPurify.sanitize(html));
  }, [html]);

  return (
    <div
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
export default RichTextContent;
