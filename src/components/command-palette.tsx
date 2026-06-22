"use client";
/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from "react";
import { Search, Command, Play, Pause, Zap, AlertTriangle, Truck } from "lucide-react";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useSimulationStore } from "@/store/simulationStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { DisruptionType } from "@/store/types";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const simulationStore = useSimulationStore();
  const disruptionStore = useDisruptionStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    {
      id: "sim-pause",
      label: simulationStore.isPaused ? "Resume Simulation" : "Pause Simulation",
      icon: simulationStore.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />,
      action: () => simulationStore.isPaused ? simulationStore.resume() : simulationStore.pause(),
    },
    {
      id: "sim-speed-5x",
      label: "Set Simulation Speed to 5x",
      icon: <Zap className="h-4 w-4 text-yellow-400" />,
      action: () => simulationStore.setSpeed(5),
    },
    {
      id: "sim-speed-10x",
      label: "Set Simulation Speed to 10x",
      icon: <Zap className="h-4 w-4 text-orange-500" />,
      action: () => simulationStore.setSpeed(10),
    },
    {
      id: "trigger-traffic",
      label: "Trigger Global Traffic Jam",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      action: () => disruptionStore.triggerDisruption({
        id: `jam-${Date.now()}`,
        type: DisruptionType.TRAFFIC_JAM,
        affectedZones: ["SF_DOWNTOWN"],
        severity: "critical",
        startTime: Date.now(),
        description: "Command Palette triggered traffic jam",
        active: true,
      }),
    },
    {
      id: "trigger-warehouse",
      label: "Simulate Warehouse Failure",
      icon: <Truck className="h-4 w-4 text-red-500" />,
      action: () => disruptionStore.triggerDisruption({
        id: `fail-${Date.now()}`,
        type: DisruptionType.WAREHOUSE_FAILURE,
        affectedZones: ["SF_SOUTH"],
        severity: "critical",
        startTime: Date.now(),
        description: "Warehouse systems offline",
        active: true,
      }),
    }
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (action: () => void) => {
    action();
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={close}
      />
      
      <div className="relative w-full max-w-lg rounded-xl border border-white/[0.1] bg-[#111] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.1]">
          <Search className="h-5 w-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredCommands.length > 0) {
                executeCommand(filteredCommands[0].action);
              }
            }}
          />
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 border border-white/[0.1] rounded px-1.5 py-0.5">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500">
              No commands found.
            </div>
          ) : (
            filteredCommands.map((c, i) => (
              <div
                key={c.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-zinc-300 transition-colors",
                  i === 0 ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                )}
                onClick={() => executeCommand(c.action)}
              >
                {c.icon}
                <span>{c.label}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
