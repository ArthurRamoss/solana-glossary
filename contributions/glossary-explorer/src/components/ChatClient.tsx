"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: input.trim(),
      };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Missing OPENAI_API_KEY. Set it in your environment variables."
              : `Error ${res.status}: ${res.statusText}`
          );
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        const assistantId = crypto.randomUUID();
        let fullText = "";

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: fullText } : m
              )
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-3xl flex-col px-4">
      {/* Header */}
      <div className="border-b border-border py-4">
        <h1 className="font-mono text-lg font-bold">
          <span className="gradient-text">Ask Solana</span>
        </h1>
        <p className="text-xs text-muted mt-1">
          AI-powered chat with access to 1001 glossary terms via tool calling
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-muted text-sm mb-4">
                Ask me anything about Solana
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "What is a PDA?",
                  "Explain Proof of History",
                  "How do AMMs work?",
                  "What is Tower BFT?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted hover:text-foreground hover:bg-card-hover transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-solana-purple/20 text-foreground"
                  : "gradient-border bg-card text-foreground/90"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-card px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-solana-purple animate-pulse" />
                <div className="h-1.5 w-1.5 rounded-full bg-solana-purple animate-pulse [animation-delay:150ms]" />
                <div className="h-1.5 w-1.5 rounded-full bg-solana-green animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border py-4">
        <div className="gradient-border flex items-center rounded-xl bg-card px-4 py-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any Solana concept..."
            className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-2 rounded-lg bg-solana-purple px-3 py-1.5 text-xs font-medium text-white disabled:opacity-30 hover:bg-solana-purple/80 transition-colors"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted/50">
          Powered by Vercel AI SDK + OpenAI — requires OPENAI_API_KEY
        </p>
      </form>
    </div>
  );
}
