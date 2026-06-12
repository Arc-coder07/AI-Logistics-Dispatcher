"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { Order } from "@/store/types";
import { MapPin, ArrowRight, Clock, User, Package } from "lucide-react";

interface OrderCardProps {
  order: Order;
  index?: number;
}

const PRIORITY_BORDER: Record<string, string> = {
  critical: "border-l-red-500",
  high: "border-l-amber-500",
  normal: "border-l-blue-500",
};

export function OrderCard({ order, index = 0 }: OrderCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-200 hover:bg-white/[0.04] border-l-2",
        PRIORITY_BORDER[order.priority]
      )}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">{order.id.substring(0, 12)}</span>
            <StatusBadge status={order.priority} />
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[100px]">{order.pickup.address.split(",")[0]}</span>
          <ArrowRight className="h-3 w-3 text-zinc-600 shrink-0" />
          <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
          <span className="truncate max-w-[100px]">{order.destination.address.split(",")[0]}</span>
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            <span>{order.packageType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{order.eta}m</span>
          </div>
          {order.assignedDriverName && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{order.assignedDriverName}</span>
            </div>
          )}
        </div>

        {/* AI Reasoning */}
        {order.aiReasoning && (
          <div className="mt-1 rounded-md bg-blue-500/[0.06] border border-blue-500/10 p-2">
            <p className="text-[10px] font-medium text-blue-400 mb-1">🤖 AI Assignment</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed whitespace-pre-line">
              {order.aiReasoning}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
