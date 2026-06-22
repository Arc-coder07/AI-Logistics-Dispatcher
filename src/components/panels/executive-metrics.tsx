"use client";

import { useOrderStore } from "@/store/orderStore";
import { useDriverStore } from "@/store/driverStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { DollarSign, Percent, TrendingUp, TrendingDown, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExecutiveMetrics() {
  const orders = useOrderStore((s) => s.orders);
  const drivers = useDriverStore((s) => s.drivers);
  const vehicles = useVehicleStore((s) => s.vehicles);

  const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;
  // A simplistic revenue calculation: $45 per delivery, minus $12 driver cost, minus $5 fuel
  const revenue = completedOrders * 45;
  const cost = completedOrders * 17;
  const margin = revenue - cost;

  const slaCompliance =
    orders.length > 0
      ? Math.round(((orders.length - orders.filter((o) => o.status === "DELAYED").length) / orders.length) * 100)
      : 100;

  const fleetUtilization = Math.round(
    (drivers.filter((d) => d.status === "BUSY").length / Math.max(1, drivers.length)) * 100
  );

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {/* Revenue Card */}
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-emerald-500/[0.05] p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Net Margin</p>
            <h3 className="text-3xl font-bold text-zinc-100 mt-2">${margin.toLocaleString()}</h3>
          </div>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          <span>+12.5% vs yesterday</span>
        </div>
      </div>

      {/* SLA Card */}
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-blue-500/[0.05] p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">SLA Compliance</p>
            <h3 className="text-3xl font-bold text-zinc-100 mt-2">{slaCompliance}%</h3>
          </div>
          <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Percent className="h-4 w-4 text-blue-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-blue-400">
          <TrendingUp className="h-3 w-3" />
          <span>+2.1% SLA delta</span>
        </div>
      </div>

      {/* Utilization Card */}
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-orange-500/[0.05] p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Fleet Utilization</p>
            <h3 className="text-3xl font-bold text-zinc-100 mt-2">{fleetUtilization}%</h3>
          </div>
          <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-orange-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-orange-400">
          <TrendingUp className="h-3 w-3" />
          <span>Optimal load balance</span>
        </div>
      </div>

      {/* Throughput Card */}
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-purple-500/[0.05] p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Delivered</p>
            <h3 className="text-3xl font-bold text-zinc-100 mt-2">{completedOrders}</h3>
          </div>
          <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Package className="h-4 w-4 text-purple-400" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-purple-400">
          <TrendingUp className="h-3 w-3" />
          <span>Peak volume expected</span>
        </div>
      </div>
    </div>
  );
}
