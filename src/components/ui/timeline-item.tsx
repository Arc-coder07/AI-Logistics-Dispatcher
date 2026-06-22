"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimelineEvent, TimelineEventType } from "@/store/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Brain,
  ThumbsUp,
  Navigation,
  Zap,
  Radio,
  GitBranch,
  Clock,
  Wrench,
  TrendingUp,
} from "lucide-react";

const EVENT_CONFIG: Record<
  TimelineEventType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  [TimelineEventType.ORDER_CREATED]: {
    icon: Package,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  [TimelineEventType.DRIVER_ASSIGNED]: {
    icon: Truck,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  [TimelineEventType.DELIVERY_COMPLETED]: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  [TimelineEventType.ALERT_TRIGGERED]: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  [TimelineEventType.AI_RECOMMENDATION]: {
    icon: Brain,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  [TimelineEventType.APPROVAL_ACTION]: {
    icon: ThumbsUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  [TimelineEventType.DISRUPTION_STARTED]: {
    icon: Zap,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  [TimelineEventType.DISRUPTION_ENDED]: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  [TimelineEventType.ROUTE_UPDATED]: {
    icon: Navigation,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  [TimelineEventType.SYSTEM_EVENT]: {
    icon: Radio,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
  },
  [TimelineEventType.AGENT_DECISION]: {
    icon: GitBranch,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  [TimelineEventType.DELAY_DETECTED]: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  [TimelineEventType.VEHICLE_ALERT]: {
    icon: Wrench,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  [TimelineEventType.INSIGHT_GENERATED]: {
    icon: TrendingUp,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
};

interface TimelineItemProps {
  event: TimelineEvent;
  index?: number;
  isLast?: boolean;
}

export function TimelineItem({ event, index = 0, isLast = false }: TimelineItemProps) {
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG[TimelineEventType.SYSTEM_EVENT];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="relative flex gap-3 pb-3"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[13px] top-7 h-[calc(100%-12px)] w-px bg-white/[0.06]" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full",
          config.bg
        )}
      >
        <Icon className={cn("h-3 w-3", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-medium text-zinc-300 truncate">
            {event.title}
          </h4>
          <span className="text-[10px] text-zinc-600 shrink-0">
            {formatRelativeTime(event.timestamp)}
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
          {event.description}
        </p>
      </div>
    </motion.div>
  );
}
