"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  // Driver statuses
  idle: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "en-route": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delivering: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  returning: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  offline: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",

  // Order statuses
  created: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  assigned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "picked-up": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  delayed: "bg-red-500/20 text-red-400 border-red-500/30",

  // Priorities
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",

  // Alert action statuses
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const PULSE_STATUSES = new Set(["en-route", "delivering", "delayed", "critical", "pending"]);

export function StatusBadge({ status, pulse, size = "sm", className }: StatusBadgeProps) {
  const showPulse = pulse ?? PULSE_STATUSES.has(status);
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS["normal"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium capitalize",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        colorClass,
        className
      )}
    >
      {showPulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              status === "critical" || status === "delayed"
                ? "bg-red-400"
                : status === "pending"
                ? "bg-amber-400"
                : "bg-blue-400"
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              status === "critical" || status === "delayed"
                ? "bg-red-400"
                : status === "pending"
                ? "bg-amber-400"
                : "bg-blue-400"
            )}
          />
        </span>
      )}
      {status.replace("-", " ")}
    </span>
  );
}
