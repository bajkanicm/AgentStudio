"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "@/components/chat/markdown";
import { ArrowUp, RotateCcw, Sparkles } from "lucide-react";

export interface ChatAgentConfig {
  templateSlug: string;
  agentId?: string;
  name?: string;
  systemPrompt?: string;
  tone?: string;
  temperature?: number;
  knowledgeBase?: string;
  model?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AgentChatProps {
  endpoint: string; // /api/demo-chat (public) or /api/chat (auth'd)
  config: ChatAgentConfig;
  greeting?: string;
  suggestions?: string[];
  className?: string;
  /** Compact paddings for embedding in the landing page. */
  compact?: boolean;
  emptyHint?: string;
  onAssistantDone?: () => void;
}

export function AgentChat({
  endpoint,
  config,
  greeting,
  suggestions = [],
  className,
  compact,
  onAssistantDone,
}: AgentChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const conversationIdRef = React.useRef<string | null>(null);
  const configRef = React.useRef(config);
  configRef.current = config;

  const scrollToBottom = React.useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, streaming, scrollToBottom]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  const send = React.useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || streaming) return;
      setError(null);
      setInput("");
      const history: ChatMessage[] = [...messages, { role: "user", content }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            config: configRef.current,
            conversationId: conversationIdRef.current,
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? `Request failed (${res.status})`);
        }
        const cid = res.headers.get("X-Conversation-Id");
        if (cid) conversationIdRef.current = cid;
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const current = acc;
          setMessages([...history, { role: "assistant", content: current }]);
        }
        onAssistantDone?.();
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
          setMessages(history);
        }
      } finally {
        setStreaming(false);
      }
    },
    [endpoint, messages, streaming, onAssistantDone]
  );

  const reset = () => {
    abortRef.current?.abort();
    conversationIdRef.current = null;
    setMessages([]);
    setError(null);
    setStreaming(false);
  };

  const showGreeting = greeting && messages.length === 0;
  const lastAssistant = messages[messages.length - 1];
  const waitingFirstChunk =
    streaming && lastAssistant?.role === "assistant" && lastAssistant.content === "";

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* Messages */}
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 space-y-4 overflow-y-auto scroll-smooth",
          compact ? "p-4" : "p-4 sm:p-6"
        )}
      >
        {showGreeting && (
          <Bubble role="assistant" compact={compact}>
            <ChatMarkdown text={greeting} />
          </Bubble>
        )}
        {messages.map((m, i) =>
          m.role === "assistant" && m.content === "" ? null : (
            <Bubble key={i} role={m.role} compact={compact}>
              {m.role === "assistant" ? (
                <>
                  <ChatMarkdown text={m.content} />
                  {streaming && i === messages.length - 1 && (
                    <span className="animate-blink ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-primary" />
                  )}
                </>
              ) : (
                <span className="whitespace-pre-wrap">{m.content}</span>
              )}
            </Bubble>
          )
        )}
        {waitingFirstChunk && (
          <Bubble role="assistant" compact={compact}>
            <span className="flex items-center gap-1 py-1">
              <span className="typing-dot size-1.5 rounded-full bg-muted-foreground" />
              <span className="typing-dot size-1.5 rounded-full bg-muted-foreground" />
              <span className="typing-dot size-1.5 rounded-full bg-muted-foreground" />
            </span>
          </Bubble>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length === 0 && (
        <div className={cn("flex flex-wrap gap-2", compact ? "px-4 pb-3" : "px-4 pb-3 sm:px-6")}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Sparkles className="size-3 text-primary/70 transition-transform group-hover:scale-110" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className={cn("border-t border-border", compact ? "p-3" : "p-3 sm:p-4")}
      >
        <div className="flex items-end gap-2 rounded-xl border border-input bg-secondary/40 p-2 transition-colors focus-within:border-primary/60">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Type a message…"
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          {messages.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 text-muted-foreground"
              onClick={reset}
              title="Reset conversation"
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            className="size-9 shrink-0"
            disabled={!input.trim() || streaming}
            title="Send"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

function Bubble({
  role,
  compact,
  children,
}: {
  role: "user" | "assistant";
  compact?: boolean;
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl text-sm",
          compact ? "px-3.5 py-2.5" : "px-4 py-3",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-secondary/60 text-foreground"
        )}
      >
        {children}
      </div>
    </div>
  );
}
