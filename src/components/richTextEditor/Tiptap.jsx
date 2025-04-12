"use client";

import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import OrderedList from "@tiptap/extension-ordered-list";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Code from "@tiptap/extension-code";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading as HeadingIcon,
  Text,
  Loader,
  Code as CodeIcon,
} from "lucide-react";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function Tiptap({ content = "", onChange, disabled }) {
  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const [error, setError] = useState(null);
  const isFirstUpdate = useRef(true);
  const timeoutRef = useRef(null);

  // Ensure editor is only mounted on client
  useLayoutEffect(() => {
    setIsEditorMounted(true);
    isFirstUpdate.current = false;
    return () => setIsEditorMounted(false);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        code: false,
      }),
      Code.configure({
        HTMLAttributes: {
          class: "my-code-block",
        },
      }),
      Heading.configure({ levels: [1] }),
      BulletList.configure({
        HTMLAttributes: { class: "list-disc pl-5" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "list-decimal pl-5" },
      }),
    ],
    content,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    }, 
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (!disabled) {
        const html = editor.getHTML();
        if (!isFirstUpdate.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            onChange(html);
          }, 200);
        }
      }
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded">
        Editor error: {error.message}
      </div>
    );
  }

  if (!isEditorMounted || !editor) {
    return (
      <div className="tiptap-editor-loading min-h-[200px] flex items-center justify-center">
        <Loader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  const canRenderBubbleMenu =
    isEditorMounted &&
    editor &&
    editor.isEditable &&
    editor.view?.dom?.isConnected;

  return (
    <div className="tiptap-editor" data-disabled={disabled}>
      {/* Use CSS-based responsiveness, not conditional rendering */}
      <div className="toolbar hidden md:flex flex-wrap gap-2 p-2 border-b">
        <ToolbarButton editor={editor} command="setParagraph" icon={<Text />} />
        <ToolbarButton
          editor={editor}
          command="toggleHeading"
          options={{ level: 1 }}
          icon={<HeadingIcon />}
        />
        <ToolbarButton editor={editor} command="toggleBold" icon={<Bold />} />
        <ToolbarButton
          editor={editor}
          command="toggleItalic"
          icon={<Italic />}
        />
        <ToolbarButton
          editor={editor}
          command="toggleBulletList"
          icon={<List />}
        />
        <ToolbarButton
          editor={editor}
          command="toggleOrderedList"
          icon={<ListOrdered />}
        />
        <ToolbarButton
          editor={editor}
          command="toggleCode"
          icon={<CodeIcon />}
        />
      </div>

      {canRenderBubbleMenu && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu flex gap-1 bg-white p-1 shadow-lg rounded">
            <ToolbarButton
              editor={editor}
              command="setParagraph"
              icon={<Text />}
              small
            />
            <ToolbarButton
              editor={editor}
              command="toggleHeading"
              options={{ level: 1 }}
              icon={<HeadingIcon />}
              small
            />
            <ToolbarButton
              editor={editor}
              command="toggleBold"
              icon={<Bold />}
              small
            />
            <ToolbarButton
              editor={editor}
              command="toggleItalic"
              icon={<Italic />}
              small
            />
            <ToolbarButton
              editor={editor}
              command="toggleBulletList"
              icon={<List />}
              small
            />
            <ToolbarButton
              editor={editor}
              command="toggleOrderedList"
              icon={<ListOrdered />}
              small
            />
          </div>
        </BubbleMenu>
      )}

      <div
        className="prose max-w-none p-4 overflow-auto h-[calc(100vh-500px)] md:h-[calc(100vh-400px)]"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

const ToolbarButton = ({
  editor,
  command,
  options = {},
  icon,
  small = false,
}) => {
  const isActive = editor.isActive(
    command.replace(/^toggle/, "").toLowerCase(),
    options
  );
  const runCommand = () => editor.chain().focus()[command](options).run();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        runCommand();
      }}
      className={isActive ? "is-active" : ""}
      title={command}
    >
      {React.cloneElement(icon, { className: small ? "w-4 h-4" : "w-5 h-5" })}
    </button>
  );
};

export default Tiptap;
