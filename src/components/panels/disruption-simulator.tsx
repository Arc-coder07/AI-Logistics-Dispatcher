"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDisruptionStore } from "@/store/disruptionStore";
import { useTimelineStore } from "@/store/timelineStore";
import { DisruptionType, TimelineEventType } from "@/store/types";
import { cn } from "@/lib/utils";
import { Zap, X } from "lucide-react";

interface DisruptionSimulatorProps {
  open: boolean;
  onClose: () => void;
}

export function DisruptionSimulator({ open, onClose }: DisruptionSimulatorProps) {
  const { disruptions, toggleDisruption } = useDisruptionStore();
  const { addEvent } = useTimelineStore();

  const handleToggle = (type: DisruptionType, label: string, active: boolean) => {
    toggleDisruption(type);
    addEvent({
      type: active
        ? TimelineEventType.DISRUPTION_ENDED
        : TimelineEventType.DISRUPTION_STARTED,
      title: active ? `${label} Ended` : `${label} Activated`,
      description: active
        ? `${label} simulation deactivated by operator`
        : `${label} simulation activated — AI agents responding`,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-4 top-14 z-50 w-80 rounded-xl border border-white/[0.08] bg-[#111118]/95 backdrop-blur-xl shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-zinc-200">
                Disruption Simulator
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-zinc-600 transition-colors hover:bg-white/[0.05] hover:text-zinc-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="px-4 py-2 text-[11px] text-zinc-500">
            Activate disruptions to test AI agent responses and operational resilience.
          </p>

          {/* Disruption Controls */}
          <div className="px-3 pb-3 space-y-1.5">
            {disruptions.map((disruption) => (
              <button
                key={disruption.type}
                onClick={() =>
                  handleToggle(disruption.type, disruption.label, disruption.active)
                }
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-200 text-left",
                  disruption.active
                    ? "border-amber-500/30 bg-amber-500/[0.08]"
                    : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08]"
                )}
              >
                <span className="text-lg">{disruption.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      disruption.active ? "text-amber-300" : "text-zinc-300"
                    )}
                  >
                    {disruption.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate">
                    {disruption.description}
                  </p>
                </div>
                <div
                  className={cn(
                    "h-5 w-9 rounded-full transition-all duration-300 relative",
                    disruption.active ? "bg-amber-500" : "bg-zinc-700"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300",
                      disruption.active ? "left-[18px]" : "left-0.5"
                    )}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Active count */}
          {disruptions.some((d) => d.active) && (
            <div className="border-t border-white/[0.06] px-4 py-2">
              <p className="text-[10px] text-amber-400/80">
                ⚡ {disruptions.filter((d) => d.active).length} disruption(s) active
                — AI agents are responding
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
