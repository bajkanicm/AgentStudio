import * as React from "react";

/**
 * Minimal markdown renderer for chat messages: code fences, inline code,
 * bold, italics, links (plain), ordered/unordered lists, paragraphs.
 * Deliberately tiny — no external deps, no raw HTML pass-through.
 */
export function ChatMarkdown({ text }: { text: string }) {
  const blocks = splitCodeFences(text);
  return (
    <div className="space-y-2 leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "code" ? (
          <pre
            key={i}
            className="overflow-x-auto rounded-lg border border-border bg-black/40 p-3 font-mono text-xs"
          >
            <code>{block.content}</code>
          </pre>
        ) : (
          <TextBlock key={i} text={block.content} />
        )
      )}
    </div>
  );
}

function splitCodeFences(text: string) {
  const parts: { type: "text" | "code"; content: string }[] = [];
  const regex = /```[a-zA-Z]*\n?([\s\S]*?)(```|$)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last)
      parts.push({ type: "text", content: text.slice(last, match.index) });
    parts.push({ type: "code", content: match[1].replace(/\n$/, "") });
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts;
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    const items = list.items.map((item, i) => (
      <li key={i}>
        <Inline text={item} />
      </li>
    ));
    out.push(
      list.ordered ? (
        <ol key={out.length} className="ml-4 list-decimal space-y-1">
          {items}
        </ol>
      ) : (
        <ul key={out.length} className="ml-4 list-disc space-y-1">
          {items}
        </ul>
      )
    );
    list = null;
  };

  for (const line of lines) {
    const ol = line.match(/^\s*\d+[.)]\s+(.*)/);
    const ul = line.match(/^\s*[-*•]\s+(.*)/);
    if (ol) {
      if (!list || !list.ordered) {
        flush();
        list = { ordered: true, items: [] };
      }
      list.items.push(ol[1]);
    } else if (ul) {
      if (!list || list.ordered) {
        flush();
        list = { ordered: false, items: [] };
      }
      list.items.push(ul[1]);
    } else {
      flush();
      if (line.trim())
        out.push(
          <p key={out.length}>
            <Inline text={line} />
          </p>
        );
    }
  }
  flush();
  return <>{out}</>;
}

function Inline({ text }: { text: string }) {
  // Tokenize **bold**, `code`, _italic_
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|_[^_]+_)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**"))
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("`"))
      nodes.push(
        <code
          key={key++}
          className="rounded bg-black/40 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>
      );
    else nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
