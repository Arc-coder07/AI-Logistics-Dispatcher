"use client";

import { useVehicleStore } from "@/store/vehicleStore";
import { Truck, Battery, AlertTriangle, PenToolIcon as Tool } from "lucide-react";
import { cn } from "@/lib/utils";

export function FleetHealthPanel() {
  const vehicles = useVehicleStore((s) => s.vehicles);

  return (
    <div className="flex flex-col h-full rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500">
            <Tool className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">Fleet Health</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600">{vehicles.length} vehicles active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 grid gap-3 scrollbar-thin">
        {vehicles.map((v) => {
          const isHighRisk = v.riskScore > 75;
          const isMediumRisk = v.riskScore > 40;

          return (
            <div
              key={v.id}
              className={cn(
                "rounded-lg border p-3 flex flex-col gap-3",
                isHighRisk
                  ? "border-red-500/30 bg-red-500/5"
                  : isMediumRisk
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-white/[0.04] bg-white/[0.02]"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className={cn("h-4 w-4", isHighRisk ? "text-red-400" : isMediumRisk ? "text-amber-400" : "text-emerald-400")} />
                  <span className="text-xs font-semibold text-zinc-200">
                    {v.id} ({v.type})
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "text-lg font-bold leading-none",
                    isHighRisk ? "text-red-400" : isMediumRisk ? "text-amber-400" : "text-emerald-400"
                  )}>
                    {v.riskScore.toFixed(0)}
                  </span>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Risk</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-zinc-500">
                    <span>Fuel</span>
                    <span className={v.fuelLevel < 30 ? "text-red-400" : "text-zinc-300"}>
                      {v.fuelLevel.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full">
                    <div
                      className={cn("h-full rounded-full", v.fuelLevel < 30 ? "bg-red-500" : "bg-emerald-500")}
                      style={{ width: `${v.fuelLevel}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-zinc-500">
                    <span>Engine</span>
                    <span className={v.engineHealth < 50 ? "text-red-400" : "text-zinc-300"}>
                      {v.engineHealth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full">
                    <div
                      className={cn("h-full rounded-full", v.engineHealth < 50 ? "bg-red-500" : "bg-blue-500")}
                      style={{ width: `${v.engineHealth}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Maint: {v.lastMaintenance.toFixed(0)}km ago
                </span>
                <span>Total: {(v.mileage / 1000).toFixed(1)}k km</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
