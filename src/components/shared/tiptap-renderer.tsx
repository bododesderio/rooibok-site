import { Fragment, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Tiptap JSON types                                                  */
/* ------------------------------------------------------------------ */

type Mark = {
  type: "bold" | "italic" | "code" | "link";
  attrs?: Record<string, unknown>;
};

type ContentNode = {
  type: string;
  content?: ContentNode[];
  text?: string;
  marks?: Mark[];
  attrs?: Record<string, unknown>;
};

type TiptapDoc = {
  type: "doc";
  content?: ContentNode[];
};

/* ------------------------------------------------------------------ */
/*  Mark wrapper                                                       */
/* ------------------------------------------------------------------ */

function applyMarks(text: string, marks?: Mark[]): ReactNode {
  if (!marks || marks.length === 0) return text;

  let node: ReactNode = text;

  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        node = <strong className="font-semibold">{node}</strong>;
        break;
      case "italic":
        node = <em>{node}</em>;
        break;
      case "code":
        node = (
          <code className="rounded bg-[var(--border)] px-1.5 py-0.5 text-sm font-mono">
            {node}
          </code>
        );
        break;
      case "link": {
        const href = (mark.attrs?.href as string) ?? "#";
        // Sanitize: only allow http, https, mailto, and tel protocols
        const isSafe = /^(https?:|mailto:|tel:|\/|#)/.test(href);
        node = (
          <a
            href={isSafe ? href : "#"}
            target={(mark.attrs?.target as string) ?? undefined}
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
          >
            {node}
          </a>
        );
        break;
      }
    }
  }

  return node;
}

/* ------------------------------------------------------------------ */
/*  Inline content renderer                                            */
/* ------------------------------------------------------------------ */

function renderInline(nodes?: ContentNode[]): ReactNode {
  if (!nodes) return null;

  return nodes.map((node, i) => {
    if (node.type === "text") {
      return <Fragment key={i}>{applyMarks(node.text ?? "", node.marks)}</Fragment>;
    }
    if (node.type === "hardBreak") {
      return <br key={i} />;
    }
    return null;
  });
}

/* ------------------------------------------------------------------ */
/*  Block-level renderer                                               */
/* ------------------------------------------------------------------ */

function renderNode(node: ContentNode, index: number): ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={index} className="mb-4 leading-7 text-[var(--foreground-muted)]">
          {renderInline(node.content)}
        </p>
      );

    case "heading": {
      const level = (node.attrs?.level as number) ?? 2;
      const Tag = `h${Math.min(Math.max(level, 1), 6)}` as
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";
      const sizes: Record<string, string> = {
        h1: "text-3xl font-bold mt-10 mb-4",
        h2: "text-2xl font-bold mt-8 mb-3",
        h3: "text-xl font-semibold mt-6 mb-2",
        h4: "text-lg font-semibold mt-5 mb-2",
        h5: "text-base font-semibold mt-4 mb-1",
        h6: "text-sm font-semibold mt-4 mb-1",
      };
      return (
        <Tag key={index} className={`${sizes[Tag]} text-[var(--foreground)]`}>
          {renderInline(node.content)}
        </Tag>
      );
    }

    case "bulletList":
      return (
        <ul key={index} className="mb-4 ml-6 list-disc space-y-1 text-[var(--foreground-muted)]">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={index} className="mb-4 ml-6 list-decimal space-y-1 text-[var(--foreground-muted)]">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      );

    case "listItem":
      return (
        <li key={index} className="leading-7">
          {node.content?.map((child, i) => {
            // Avoid wrapping single-paragraph list items in extra <p>
            if (child.type === "paragraph") {
              return <Fragment key={i}>{renderInline(child.content)}</Fragment>;
            }
            return renderNode(child, i);
          })}
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={index}
          className="mb-4 border-l-4 border-[var(--accent)] pl-4 italic text-[var(--foreground-muted)]"
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre
          key={index}
          className="mb-4 overflow-x-auto rounded-lg bg-[var(--border)] p-4 text-sm font-mono text-[var(--foreground)]"
        >
          <code>{renderInline(node.content)}</code>
        </pre>
      );

    case "horizontalRule":
      return <hr key={index} className="my-8 border-[var(--border)]" />;

    default:
      // Fall through for unknown node types — render children if any
      if (node.content) {
        return (
          <div key={index}>
            {node.content.map((child, i) => renderNode(child, i))}
          </div>
        );
      }
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

type TiptapRendererProps = {
  content: TiptapDoc | null | undefined;
};

export function TiptapRenderer({ content }: TiptapRendererProps) {
  if (!content || !content.content) {
    return null;
  }

  return <>{content.content.map((node, i) => renderNode(node, i))}</>;
}
