"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore, AGENT_META } from "@/store/agentStore";
import { AgentName } from "@/store/types";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENT_ORDER: AgentName[] = [
  AgentName.DELAY,
  AgentName.ROUTE,
  AgentName.DISPATCH,
  AgentName.COMMUNICATION,
  AgentName.FLEET,
  AgentName.OPERATIONS,
  AgentName.MONITORING,
];

const STATUS_STYLES = {
  idle: "bg-zinc-800 border-zinc-700 text-zinc-500",
  thinking: "bg-amber-500/10 border-amber-500/40 text-amber-400",
  acting: "bg-blue-500/10 border-blue-500/40 text-blue-400",
  complete: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
};

const STATUS_DOT = {
  idle: "bg-zinc-600",
  thinking: "bg-amber-400 animate-pulse",
  acting: "bg-blue-400 animate-bounce",
  complete: "bg-emerald-400",
};

interface AgentCollaborationViewProps {
  isExpanded?: boolean;
  onExpand?: () => void;
}

export function AgentCollaborationView({ isExpanded, onExpand }: AgentCollaborationViewProps = {}) {
  const { agents, chains, activeChainId } = useAgentStore();
  const activeChain = chains.find((c) => c.id === activeChainId);
  const recentChains = chains.filter((c) => c.status === "complete").slice(0, 3);

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-500">
            <span className="text-[10px]">🕸️</span>
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">Agent Network</h2>
        </div>
        <div className="flex items-center gap-2">
          {activeChain && (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Chain active
            </span>
          )}
          <span className="text-[10px] text-zinc-600">7 agents</span>
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1 hover:bg-white/[0.1] rounded text-zinc-500 hover:text-zinc-300 transition ml-1"
              title="Expand Network"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
        {/* Agent Grid */}
        <div className="grid grid-cols-2 gap-2">
          {AGENT_ORDER.map((agentName) => {
            const agent = agents[agentName];
            const meta = AGENT_META[agentName];
            if (!agent) return null;

            const isInActiveChain =
              activeChain?.steps.some((s) => s.agentName === agentName) ?? false;

            return (
              <motion.div
                key={agentName}
                animate={
                  agent.status === "acting"
                    ? { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 1.2 } }
                    : { scale: 1 }
                }
                className={cn(
                  "relative rounded-lg border p-2.5 transition-all duration-300",
                  STATUS_STYLES[agent.status],
                  isInActiveChain && agent.status === "idle"
                    ? "border-violet-500/30 bg-violet-500/5"
                    : ""
                )}
              >
                {/* Agent icon + name */}
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{meta.icon}</span>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-200 leading-tight">
                        {agentName.replace(" Agent", "")}
                      </p>
                      <p className="text-[9px] text-zinc-600">Agent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[agent.status])}
                    />
                  </div>
                </div>

                {/* Status & last action */}
                <p className="text-[9px] text-zinc-500 truncate leading-snug">
                  {agent.lastAction}
                </p>

                {/* Decision count */}
                <div className="mt-1.5 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[9px] font-medium capitalize px-1.5 py-0.5 rounded-full border",
                      STATUS_STYLES[agent.status]
                    )}
                  >
                    {agent.status}
                  </span>
                  <span className="text-[9px] text-zinc-600">{agent.decisionCount} decisions</span>
                </div>

                {/* Color accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-lg opacity-60"
                  style={{ backgroundColor: meta.color }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Active Chain Visualization */}
        <AnimatePresence>
          {activeChain && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-[10px] font-semibold text-amber-400">Active Collaboration Chain</p>
              </div>
              <p className="text-[10px] text-zinc-400 mb-2 leading-snug">
                {activeChain.trigger.description}
              </p>

              {/* Chain steps */}
              <div className="space-y-1.5">
                {activeChain.steps.map((step, i) => {
                  const meta = AGENT_META[step.agentName];
                  return (
                    <div key={step.id} className="flex items-start gap-2">
                      <div className="flex flex-col items-center">
                        <div
                          className="h-4 w-4 flex items-center justify-center rounded-full text-[8px]"
                          style={{ backgroundColor: `${meta.color}20`, border: `1px solid ${meta.color}50` }}
                        >
                          {meta.icon}
                        </div>
                        {i < activeChain.steps.length - 1 && (
                          <div className="w-px h-3 bg-zinc-700 mt-0.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-zinc-300 leading-tight">{step.action}</p>
                        <p className="text-[9px] text-zinc-600 truncate">{step.agentName}</p>
                      </div>
                      <span className="text-[9px] text-emerald-500">✓</span>
                    </div>
                  );
                })}

                {/* Pending step indicator */}
                <div className="flex items-center gap-2 opacity-50">
                  <div className="h-4 w-4 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
                    <span className="text-[8px]">⏳</span>
                  </div>
                  <p className="text-[9px] text-zinc-600">Processing...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent completed chains */}
        {recentChains.length > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600 mb-2">
              Recent Chains
            </p>
            <div className="space-y-1.5">
              {recentChains.map((chain) => (
                <div
                  key={chain.id}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.01] px-2.5 py-2"
                >
                  <span className="text-[9px] text-emerald-500">✓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-zinc-400 truncate">
                      {chain.trigger.description}
                    </p>
                    <p className="text-[9px] text-zinc-600">
                      {chain.steps.length} agents · {chain.steps.map((s) => AGENT_META[s.agentName].icon).join(" → ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!activeChain && recentChains.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="text-2xl mb-2">🕸️</span>
            <p className="text-xs text-zinc-600">
              Agents monitoring operations.
              <br />
              Collaboration chains appear when
              <br />
              anomalies trigger cascades.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
