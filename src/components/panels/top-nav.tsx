"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Zap, Activity, BarChart3, Brain } from "lucide-react";
import { useAlertStore } from "@/store/alertStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { useAgentStore } from "@/store/agentStore";
import { cn } from "@/lib/utils";

type View = "dispatcher" | "analytics";

interface TopNavProps {
  onToggleDisruptions: () => void;
  disruptionPanelOpen: boolean;
  currentView: View;
  onViewChange: (view: View) => void;
}

export function TopNav({
  onToggleDisruptions,
  disruptionPanelOpen,
  currentView,
  onViewChange,
}: TopNavProps) {
  const [time, setTime] = useState("");
  const pendingAlerts = useAlertStore((s) => s.getPendingAlerts());
  const activeDisruptions = useDisruptionStore((s) => s.getActiveDisruptions());
  const agents = useAgentStore((s) => s.agents);

  // Compute system status
  const activeAgents = Object.values(agents).filter(
    (a) => a.status === "thinking" || a.status === "acting"
  ).length;

  const systemStatus =
    activeDisruptions.length > 0
      ? { label: "Disruption Active", color: "text-amber-400", dot: "bg-amber-400" }
      : pendingAlerts.length > 5
      ? { label: "High Alert Volume", color: "text-orange-400", dot: "bg-orange-400" }
      : { label: "All Systems Nominal", color: "text-emerald-400", dot: "bg-emerald-400" };

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-4 py-2.5 backdrop-blur-xl shrink-0">
      {/* Left — Logo + Branding */}
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <h1 className="text-[13px] font-bold text-zinc-100 leading-tight tracking-tight">
            AI Logistics Dispatcher
          </h1>
          <p className="text-[10px] text-zinc-600 leading-tight">
            Autonomous Simulation Control Tower
          </p>
        </div>
      </div>

      {/* Center — View Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
        <button
          onClick={() => onViewChange("dispatcher")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
            currentView === "dispatcher"
              ? "bg-blue-500/20 border border-blue-500/30 text-blue-300"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
          )}
        >
          <Activity className="h-3 w-3" />
          Dispatcher
        </button>
        <button
          onClick={() => onViewChange("analytics")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
            currentView === "analytics"
              ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
          )}
        >
          <BarChart3 className="h-3 w-3" />
          Analytics
        </button>
      </div>

      {/* Right — System info + Controls */}
      <div className="flex items-center gap-3">
        {/* Active agents indicator */}
        {activeAgents > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1"
          >
            <Brain className="h-3 w-3 text-blue-400" />
            <span className="text-[10px] text-blue-400 font-medium">
              {activeAgents} agent{activeAgents !== 1 ? "s" : ""} thinking
            </span>
          </motion.div>
        )}

        {/* System status */}
        <div className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", systemStatus.dot)} />
          <span className={cn("text-[11px] font-medium", systemStatus.color)}>
            {systemStatus.label}
          </span>
        </div>

        {/* Pending alerts badge */}
        {pendingAlerts.length > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5">
            <span className="text-[10px] font-bold text-red-400">{pendingAlerts.length}</span>
            <span className="text-[10px] text-red-400/70">alerts</span>
          </div>
        )}

        {/* Live clock */}
        <span className="hidden lg:block font-mono text-[11px] text-zinc-600 tabular-nums">
          {time}
        </span>

        {/* Disruption toggle */}
        <button
          id="disruption-toggle-btn"
          onClick={onToggleDisruptions}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
            disruptionPanelOpen || activeDisruptions.length > 0
              ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
              : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/[0.1] hover:text-zinc-200"
          )}
        >
          <Zap className="h-3 w-3" />
          <span>Scenarios</span>
          {activeDisruptions.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black">
              {activeDisruptions.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
