"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Minus,
} from "lucide-react";

type Props = {
  /** Tiptap JSON document */
  value: unknown;
  /** Called with updated Tiptap JSON */
  onChange: (json: unknown) => void;
  placeholder?: string;
  minHeight?: string;
};

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

function isSafeHref(href: string): boolean {
  return /^(https?:|mailto:|tel:|\/|#)/.test(href);
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = "240px",
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          class:
            "text-[var(--accent)] underline underline-offset-2 hover:opacity-80",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: (value as object) ?? EMPTY_DOC,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-neutral dark:prose-invert max-w-none focus:outline-none px-4 py-3",
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Sync external value changes (e.g. when switching between records)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(value ?? EMPTY_DOC)) {
      editor.commands.setContent((value as object) ?? EMPTY_DOC, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) {
    return (
      <div
        className="rounded-lg border border-[var(--border)] bg-[var(--background)]"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] focus-within:border-[var(--ring)] focus-within:ring-1 focus-within:ring-[var(--ring)]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] disabled:opacity-40 disabled:hover:bg-transparent";
  const active = "bg-[var(--border)] text-[var(--foreground)]";

  function addLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    if (!isSafeHref(url)) {
      window.alert("Only http(s), mailto, tel, relative, or hash URLs are allowed.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--border)] bg-[var(--card)] px-2 py-1.5">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${btn} ${editor.isActive("heading", { level: 1 }) ? active : ""}`}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-px bg-[var(--border)]" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btn} ${editor.isActive("bold") ? active : ""}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btn} ${editor.isActive("italic") ? active : ""}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`${btn} ${editor.isActive("code") ? active : ""}`}
        title="Inline code"
      >
        <Code className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={addLink}
        className={`${btn} ${editor.isActive("link") ? active : ""}`}
        title="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-px bg-[var(--border)]" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}
        title="Bullet list"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${btn} ${editor.isActive("orderedList") ? active : ""}`}
        title="Numbered list"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${btn} ${editor.isActive("blockquote") ? active : ""}`}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btn}
        title="Divider"
      >
        <Minus className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-px bg-[var(--border)]" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={btn}
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={btn}
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
}
