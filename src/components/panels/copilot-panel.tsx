"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCopilotStore } from "@/store/copilotStore";
import { communicationAgent } from "@/agents/communicationAgent";
import { Bot, Send, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_QUERIES = [
  "Why are deliveries delayed?",
  "Which drivers are overloaded?",
  "Show critical deliveries",
  "What are today's bottlenecks?",
  "Give me a status overview",
];

export function CopilotPanel() {
  const { messages, isTyping, addUserMessage, addAssistantMessage, setTyping, clearMessages } =
    useCopilotStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (query?: string) => {
    const text = query || input.trim();
    if (!text) return;

    addUserMessage(text);
    setInput("");
    setTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = communicationAgent.generateResponse(text);
      addAssistantMessage(response);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.01]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">AI Copilot</h2>
        </div>
        <button
          onClick={clearMessages}
          className="rounded-md p-1 text-zinc-600 transition-colors hover:bg-white/[0.05] hover:text-zinc-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20">
                  <Bot className="h-3 w-3 text-blue-400" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-blue-500/15 border border-blue-500/20 text-zinc-200"
                    : "bg-white/[0.03] border border-white/[0.06] text-zinc-300"
                )}
              >
                <div className="whitespace-pre-wrap prose-sm">
                  {msg.content.split("\n").map((line, i) => {
                    // Simple markdown-like rendering
                    const boldLine = line.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-zinc-200 font-semibold">$1</strong>'
                    );
                    return (
                      <p
                        key={i}
                        className={cn(line === "" ? "h-2" : "")}
                        dangerouslySetInnerHTML={{ __html: boldLine }}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20">
              <Bot className="h-3 w-3 text-blue-400" />
            </div>
            <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}

        {/* Suggested queries — show when few messages */}
        {messages.length <= 2 && (
          <div className="space-y-1.5 pt-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
              Suggested
            </p>
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="block w-full text-left rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-[11px] text-zinc-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-zinc-300 hover:border-white/[0.08]"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about operations..."
            className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-600 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className={cn(
              "rounded-md p-1 transition-all duration-200",
              input.trim()
                ? "text-blue-400 hover:bg-blue-500/10"
                : "text-zinc-700"
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
