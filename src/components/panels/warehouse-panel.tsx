"use client";

import { useWarehouseStore } from "@/store/warehouseStore";
import { Package, Box, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WarehousePanel() {
  const { warehouse } = useWarehouseStore();
  const isFailure = warehouse.status === "failure";
  const isBottleneck = warehouse.status === "bottleneck";

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-500">
            <Box className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">{warehouse.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border",
              isFailure
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : isBottleneck
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            )}
          >
            {isFailure ? <AlertTriangle className="h-2.5 w-2.5" /> : <CheckCircle2 className="h-2.5 w-2.5" />}
            {warehouse.status}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-5">
        {/* Utilization Gauge */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
              Loading Bay Utilization
            </span>
            <span className={cn(
              "text-xs font-bold",
              warehouse.utilization >= 90 ? "text-red-400" :
              warehouse.utilization >= 75 ? "text-amber-400" : "text-emerald-400"
            )}>
              {warehouse.utilization}%
            </span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                warehouse.utilization >= 90 ? "bg-red-500" :
                warehouse.utilization >= 75 ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${warehouse.utilization}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
            <span>Idle</span>
            <span>At Capacity</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Package className="h-4 w-4" />
              <span className="text-xs">Queue</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-zinc-100 leading-none">
                {warehouse.pendingPickups}
              </span>
              <span className="text-[10px] text-zinc-500 mb-1">orders</span>
            </div>
          </div>
          
          <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Box className="h-4 w-4" />
              <span className="text-xs">Capacity</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-zinc-100 leading-none">
                {warehouse.capacity}
              </span>
              <span className="text-[10px] text-zinc-500 mb-1">max</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
