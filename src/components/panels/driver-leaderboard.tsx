"use client";

import { useDriverPerformanceStore } from "@/store/driverPerformanceStore";
import { Trophy, Star, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function DriverLeaderboard() {
  const performances = useDriverPerformanceStore((s) => s.performances);

  // Sort by score descending
  const sorted = [...performances].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-full rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-yellow-500 to-orange-500">
            <Trophy className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">Driver Leaderboard</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-thin">
        {sorted.map((p, index) => (
          <div
            key={p.driverId}
            className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            {/* Rank */}
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0",
              index === 0 ? "bg-yellow-500/20 text-yellow-400" :
              index === 1 ? "bg-zinc-400/20 text-zinc-300" :
              index === 2 ? "bg-amber-700/20 text-amber-500" : "bg-white/[0.04] text-zinc-500"
            )}>
              {index + 1}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">{p.driverName}</p>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 text-yellow-500" />
                  {p.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5 text-blue-400" />
                  {p.onTimePercent.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-end shrink-0">
              <span className="text-sm font-bold text-zinc-200">{p.score.toFixed(0)}</span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Score</span>
            </div>
            
            {/* Trend */}
            <div className="shrink-0 w-4">
              {p.score > 90 ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> : <TrendingDown className="h-3.5 w-3.5 text-red-400 opacity-50" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
