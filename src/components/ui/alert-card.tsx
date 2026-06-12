"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Alert, AlertActionStatus, AlertSeverity } from "@/store/types";
import { useAlertStore } from "@/store/alertStore";
import { useTimelineStore } from "@/store/timelineStore";
import { TimelineEventType } from "@/store/types";
import {
  Shield,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
} from "lucide-react";

interface AlertCardProps {
  alert: Alert;
  index?: number;
}

const SEVERITY_STYLES: Record<string, { border: string; bg: string; icon: string }> = {
  critical: {
    border: "border-red-500/30",
    bg: "bg-red-500/[0.04]",
    icon: "text-red-400",
  },
  high: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/[0.04]",
    icon: "text-amber-400",
  },
  medium: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/[0.04]",
    icon: "text-blue-400",
  },
  low: {
    border: "border-zinc-500/30",
    bg: "bg-zinc-500/[0.04]",
    icon: "text-zinc-400",
  },
};

export function AlertCard({ alert, index = 0 }: AlertCardProps) {
  const { approveAlert, rejectAlert } = useAlertStore();
  const { addEvent } = useTimelineStore();

  const severity = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.medium;
  const isPending = alert.actionStatus === AlertActionStatus.PENDING;

  const handleApprove = () => {
    approveAlert(alert.id);
    addEvent({
      type: TimelineEventType.APPROVAL_ACTION,
      title: "Recommendation Approved",
      description: `Operator approved: ${alert.title}`,
    });
  };

  const handleReject = () => {
    rejectAlert(alert.id);
    addEvent({
      type: TimelineEventType.APPROVAL_ACTION,
      title: "Recommendation Rejected",
      description: `Operator rejected: ${alert.title}`,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
        severity.border,
        severity.bg,
        isPending ? "hover:border-white/20" : "opacity-75"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className={cn("h-4 w-4 mt-0.5 shrink-0", severity.icon)} />
          <div>
            <h4 className="text-sm font-medium text-zinc-200">{alert.title}</h4>
            <p className="text-xs text-zinc-500 mt-0.5">{alert.description}</p>
          </div>
        </div>
        {!isPending && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
              alert.actionStatus === AlertActionStatus.APPROVED
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {alert.actionStatus}
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg bg-white/[0.03] p-2">
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 mb-0.5">
            <Target className="h-3 w-3" />
            Affected Deliveries
          </div>
          <p className="text-sm font-semibold text-zinc-200">
            {alert.affectedDeliveries}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-2">
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 mb-0.5">
            <Clock className="h-3 w-3" />
            Predicted Delay
          </div>
          <p className="text-sm font-semibold text-zinc-200">
            {alert.predictedDelay}min
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-2.5 mb-3">
        <p className="text-[10px] font-medium text-blue-400 mb-1 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          AI Recommendation
        </p>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {alert.recommendation}
        </p>
      </div>

      {/* Confidence & Impact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="text-[11px] text-zinc-400">
              Confidence: <span className="text-emerald-400 font-medium">{alert.confidence}%</span>
            </span>
          </div>
        </div>
        <span className="text-[11px] text-zinc-500">{alert.impact}</span>
      </div>

      {/* Action Buttons */}
      {isPending && (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-400 transition-all duration-200 hover:bg-emerald-500/20 hover:border-emerald-500/40"
          >
            <Check className="h-3.5 w-3.5" />
            Approve
          </button>
          <button
            onClick={handleReject}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/40"
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      )}
    </motion.div>
  );
}
