"use client";

import { useAnalyticsStore } from "@/store/analyticsStore";
import { BrainCircuit, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PredictiveCards() {
  const predictions = useAnalyticsStore((s) => s.predictions);

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {predictions.map((p) => (
        <div key={p.id} className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{p.label}</span>
            <div className="flex items-center gap-1">
              <BrainCircuit className="h-3 w-3 text-purple-400" />
              <span className="text-[9px] text-zinc-600">{p.confidence}% conf</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-zinc-200">{p.value}</span>
            <div className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full",
              p.trend === "up" ? "bg-emerald-500/10 text-emerald-400" :
              p.trend === "down" ? "bg-red-500/10 text-red-400" : "bg-zinc-500/10 text-zinc-400"
            )}>
              {p.trend === "up" ? <TrendingUp className="h-3 w-3" /> :
               p.trend === "down" ? <TrendingDown className="h-3 w-3" /> :
               <Minus className="h-3 w-3" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
