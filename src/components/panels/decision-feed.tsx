"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore, AGENT_META } from "@/store/agentStore";
import { AgentDecision, AgentName } from "@/store/types";
import { formatTime, cn } from "@/lib/utils";

const CONFIDENCE_COLOR = (c: number) => {
  if (c >= 85) return "text-emerald-400";
  if (c >= 70) return "text-amber-400";
  return "text-red-400";
};

const CONFIDENCE_BAR_COLOR = (c: number) => {
  if (c >= 85) return "bg-emerald-500";
  if (c >= 70) return "bg-amber-500";
  return "bg-red-500";
};

function DecisionCard({ decision }: { decision: AgentDecision }) {
  const meta = AGENT_META[decision.agentName];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-200"
    >
      {/* Color accent left border */}
      <div
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />

      <div className="pl-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm shrink-0">{meta.icon}</span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-zinc-200 leading-tight truncate">
                {decision.action}
              </p>
              <p
                className="text-[9px] font-medium"
                style={{ color: meta.color }}
              >
                {decision.agentName}
              </p>
            </div>
          </div>
          <span className="text-[9px] text-zinc-600 shrink-0">
            {formatTime(decision.timestamp)}
          </span>
        </div>

        {/* Reasoning */}
        <p className="text-[10px] text-zinc-500 leading-relaxed mb-2 line-clamp-2">
          {decision.reasoning}
        </p>

        {/* Metrics row */}
        <div className="flex items-center gap-3">
          {/* Confidence bar */}
          <div className="flex items-center gap-1.5 flex-1">
            <span className="text-[9px] text-zinc-600 shrink-0">Conf.</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${decision.confidence}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn("h-full rounded-full", CONFIDENCE_BAR_COLOR(decision.confidence))}
              />
            </div>
            <span className={cn("text-[9px] font-medium shrink-0", CONFIDENCE_COLOR(decision.confidence))}>
              {decision.confidence}%
            </span>
          </div>

          {/* Status badge */}
          <span
            className={cn(
              "text-[9px] px-1.5 py-0.5 rounded-full border shrink-0",
              decision.status === "complete"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : decision.status === "acting"
                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            )}
          >
            {decision.status}
          </span>
        </div>

        {/* Impact */}
        {decision.impact && (
          <p className="mt-1.5 text-[9px] text-zinc-600 border-t border-white/[0.04] pt-1.5">
            Impact: <span className="text-zinc-500">{decision.impact}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function DecisionFeed() {
  const { decisions } = useAgentStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayDecisions = decisions.slice(0, 30);

  // Auto-scroll on new decisions
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [decisions.length]);

  // Filter state (can be expanded with tabs later)
  const agentCounts = Object.values(AgentName).reduce(
    (acc, name) => {
      acc[name] = decisions.filter((d) => d.agentName === name).length;
      return acc;
    },
    {} as Record<AgentName, number>
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-orange-500">
            <span className="text-[10px]">⚡</span>
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">AI Decision Feed</h2>
        </div>
        <div className="flex items-center gap-2">
          {decisions.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          )}
          <span className="text-[10px] text-zinc-600">{decisions.length} total</span>
        </div>
      </div>

      {/* Agent color legend */}
      <div className="flex gap-2 overflow-x-auto px-3 py-2 border-b border-white/[0.04] scrollbar-thin shrink-0">
        {Object.values(AgentName).map((name) => {
          const meta = AGENT_META[name];
          return (
            <div key={name} className="flex items-center gap-1 shrink-0">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              <span className="text-[9px] text-zinc-600">
                {name.replace(" Agent", "")} ({agentCounts[name] ?? 0})
              </span>
            </div>
          );
        })}
      </div>

      {/* Decision List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {displayDecisions.length > 0 ? (
            displayDecisions.map((decision) => (
              <DecisionCard key={decision.id} decision={decision} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <span className="text-3xl mb-3">⚡</span>
              <p className="text-xs text-zinc-500 font-medium">Waiting for agent activity</p>
              <p className="text-[10px] text-zinc-700 mt-1">
                Decisions appear here in real-time
                <br />
                as agents analyze and act
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
