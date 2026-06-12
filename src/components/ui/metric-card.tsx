"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./animated-counter";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: LucideIcon;
  accentColor?: "blue" | "green" | "amber" | "red" | "violet";
  suffix?: string;
  delay?: number;
}

const ACCENT_STYLES = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    border: "hover:border-blue-500/30",
    glow: "group-hover:shadow-blue-500/5",
    trendUp: "text-blue-400",
  },
  green: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    border: "hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/5",
    trendUp: "text-emerald-400",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    border: "hover:border-amber-500/30",
    glow: "group-hover:shadow-amber-500/5",
    trendUp: "text-amber-400",
  },
  red: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    border: "hover:border-red-500/30",
    glow: "group-hover:shadow-red-500/5",
    trendUp: "text-red-400",
  },
  violet: {
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    border: "hover:border-violet-500/30",
    glow: "group-hover:shadow-violet-500/5",
    trendUp: "text-violet-400",
  },
};

export function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  accentColor = "blue",
  suffix = "",
  delay = 0,
}: MetricCardProps) {
  const styles = ACCENT_STYLES[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm transition-all duration-300",
        styles.border,
        "hover:bg-white/[0.04] hover:shadow-lg",
        styles.glow
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <AnimatedCounter
              value={value}
              className="text-2xl font-semibold tracking-tight text-zinc-100"
            />
            {suffix && (
              <span className="text-sm text-zinc-500">{suffix}</span>
            )}
          </div>
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-[11px] font-medium",
                trend >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              <span>{trend >= 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(trend)}%</span>
              <span className="text-zinc-600">vs last hour</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "rounded-lg p-2 transition-colors duration-300",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-4 w-4", styles.iconColor)} />
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute bottom-2 right-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      </div>
    </motion.div>
  );
}
