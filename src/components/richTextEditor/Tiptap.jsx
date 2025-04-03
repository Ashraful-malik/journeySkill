"use client";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import OrderedList from "@tiptap/extension-ordered-list";
import { BubbleMenu, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading as HeadingIcon,
  Text,
  Loader,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function Tiptap({ content = "", onChange, disabled }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Heading.configure({
        levels: [1],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-5",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-5",
        },
      }),
    ],
    content: content,
    editable: !disabled, // This controls editability

    onUpdate: ({ editor }) => {
      if (!disabled) {
        const html = editor.getHTML();
        onChange(html);
      }
      // Trigger form validation after update
      if (typeof document !== "undefined") {
        const event = new Event("input", { bubbles: true });
        document.querySelector(".ProseMirror")?.dispatchEvent(event);
      }
    },
    onCreate: () => {
      setIsLoading(false); // Editor is ready
    },
  });

  // Update editor's editable state when disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div className="tiptap-editor-loading min-h-[200px] flex items-center justify-center">
        <Loader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  // Prevent event bubbling for toolbar buttons
  const handleToolbarClick = (e, command) => {
    e.preventDefault();
    e.stopPropagation();
    command();
  };

  return (
    <div className="tiptap-editor" data-disabled={disabled}>
      {/* Main Toolbar */}
      {!isMobile && (
        <div className="toolbar flex flex-wrap gap-2 p-2 border-b">
          {/* paragraph */}
          <button
            onClick={(e) =>
              handleToolbarClick(e, () =>
                editor.chain().focus().setParagraph().run()
              )
            }
            className={editor.isActive("paragraph") ? "is-active" : ""}
            title="Normal text"
          >
            <Text className="w-5 h-5" />
          </button>
          {/* Heading 1 button */}
          <button
            onClick={(e) =>
              handleToolbarClick(e, () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              )
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
            title="Heading"
          >
            <HeadingIcon className="w-5 h-5" />{" "}
          </button>

          {/* bold */}
          <button
            onClick={(e) =>
              handleToolbarClick(e, () =>
                editor.chain().focus().toggleBold().run()
              )
            }
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Bold className="w-5 h-5" />
          </button>

          {/* italic */}
          <button
            onClick={(e) =>
              handleToolbarClick(e, () =>
                editor.chain().focus().toggleItalic().run()
              )
            }
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <Italic className="w-5 h-5" />
          </button>

          {/* Bullet List button */}
          <button
            onClick={(e) =>
              handleToolbarClick(e, () =>
                editor.chain().focus().toggleBulletList().run()
              )
            }
            className={editor.isActive("bulletList") ? "is-active" : ""}
            title="Bullet List"
          >
            <List className="w-5 h-5" />
          </button>

          {/* Ordered List button */}
          <button
            onClick={(e) =>
              handleToolbarClick(e, () =>
                editor.chain().focus().toggleOrderedList().run()
              )
            }
            className={editor.isActive("orderedList") ? "is-active" : ""}
            title="Numbered List"
          >
            <ListOrdered className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Bubble Menu  for mobile*/}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu flex gap-1 bg-white p-1 shadow-lg rounded">
            {/* paragraph */}
            <button
              onClick={(e) =>
                handleToolbarClick(e, () =>
                  editor.chain().focus().setParagraph().run()
                )
              }
              className={editor.isActive("paragraph") ? "is-active" : ""}
              title="Normal text"
            >
              <Text className="w-4 h-4" />
            </button>

            {/* Heading 1 button */}
            <button
              onClick={(e) =>
                handleToolbarClick(e, () =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                )
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }
              title="Heading"
            >
              <HeadingIcon className="w-4 h-4" />{" "}
            </button>

            {/* bold */}
            <button
              onClick={(e) =>
                handleToolbarClick(e, () =>
                  editor.chain().focus().toggleBold().run()
                )
              }
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={(e) =>
                handleToolbarClick(e, () =>
                  editor.chain().focus().toggleItalic().run()
                )
              }
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              <Italic className="w-4 h-4" />
            </button>

            {/* Bullet List  */}
            <button
              onClick={(e) =>
                handleToolbarClick(e, () =>
                  editor.chain().focus().toggleBulletList().run()
                )
              }
              className={editor.isActive("bulletList") ? "is-active" : ""}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Ordered List  */}
            <button
              onClick={(e) =>
                handleToolbarClick(e, () =>
                  editor.chain().focus().toggleOrderedList().run()
                )
              }
              className={editor.isActive("orderedList") ? "is-active" : ""}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>
        </BubbleMenu>
      )}
      {/* Editor Content */}
      <div
        className="prose max-w-none p-4  overflow-auto h-[calc(100vh-500px)] md:h-[calc(100vh-400px)]"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default Tiptap;
