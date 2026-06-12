"use client";

import { useTimelineStore } from "@/store/timelineStore";
import { TimelineItem } from "@/components/ui/timeline-item";
import { AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";

export function ActivityTimeline() {
  const events = useTimelineStore((s) => s.events);
  const recentEvents = events.slice(0, 25);

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.01]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-zinc-200">Activity Timeline</h2>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
          </span>
        </div>
        <span className="text-[10px] text-zinc-600">
          {events.length} events
        </span>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <AnimatePresence>
          {recentEvents.map((event, i) => (
            <TimelineItem
              key={event.id}
              event={event}
              index={i}
              isLast={i === recentEvents.length - 1}
            />
          ))}
        </AnimatePresence>

        {recentEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Radio className="h-6 w-6 text-zinc-700 mb-2" />
            <p className="text-sm text-zinc-500">Waiting for events...</p>
            <p className="text-[11px] text-zinc-600 mt-1">
              Activity will appear here in real time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
