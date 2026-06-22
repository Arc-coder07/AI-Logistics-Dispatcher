"use client";

import { useSimulationStore } from "@/store/simulationStore";
import { Play, Pause, FastForward, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SimulationControls() {
  const { speed, isPaused, tick, elapsedTime, setSpeed, pause, resume, reset } = useSimulationStore();

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 shrink-0">
      {/* Clock / Tick info */}
      <div className="flex flex-col min-w-[80px]">
        <span className="font-mono text-xs font-medium text-zinc-200 tabular-nums">
          {formatTime(elapsedTime)}
        </span>
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
          Tick {tick}
        </span>
      </div>

      <div className="h-6 w-px bg-white/[0.06]" />

      {/* Playback Controls */}
      <div className="flex items-center gap-1.5 bg-white/[0.02] p-1 rounded-md border border-white/[0.04]">
        <button
          onClick={isPaused ? resume : pause}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-sm transition-colors",
            isPaused ? "text-amber-400 hover:bg-amber-500/20" : "text-emerald-400 hover:bg-emerald-500/20"
          )}
        >
          {isPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
        </button>

        <div className="h-4 w-px bg-white/[0.06] mx-1" />

        {[1, 2, 5, 10].map((s) => (
          <button
            key={s}
            onClick={() => {
              setSpeed(s);
              if (isPaused) resume();
            }}
            className={cn(
              "flex h-7 px-2 items-center justify-center rounded-sm text-[10px] font-bold transition-all",
              speed === s && !isPaused
                ? "bg-blue-500/20 text-blue-400"
                : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300"
            )}
          >
            {s}x
          </button>
        ))}

        <div className="h-4 w-px bg-white/[0.06] mx-1" />

        <button
          onClick={reset}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          title="Reset Simulation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
