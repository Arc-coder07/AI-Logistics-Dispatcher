"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Zap,
  Command,
} from "lucide-react";
import { Logo } from "@/components/Logo";

interface TopNavProps {
  onToggleDisruptions: () => void;
  disruptionPanelOpen: boolean;
}

export function TopNav({ onToggleDisruptions, disruptionPanelOpen }: TopNavProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center justify-between border-b border-white/[0.06] bg-white/[0.01] px-5 py-3 backdrop-blur-sm"
    >
      {/* Left — Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
          <Logo className="h-5 w-5 text-zinc-100" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
            AI Logistics Dispatcher
          </h1>
          <p className="text-[10px] text-zinc-500">
            Autonomous Operations Control Tower
          </p>
        </div>
      </div>

      {/* Center — System Status */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium text-emerald-400">
            All Systems Operational
          </span>
        </div>
        <div className="text-xs font-mono text-zinc-500 tabular-nums">
          {time.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDisruptions}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
            disruptionPanelOpen
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-300"
          )}
        >
          <Zap className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Disruptions</span>
        </button>
        <div className="hidden sm:flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[11px] text-zinc-500">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </div>
    </motion.header>
  );
}
