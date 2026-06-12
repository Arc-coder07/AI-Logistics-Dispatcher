"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "@/store/orderStore";
import { OrderCard } from "@/components/ui/order-card";
import { OrderStatus } from "@/store/types";
import { Package, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterOption = "active" | "all" | "critical" | "delayed";

export function OrdersPanel() {
  const orders = useOrderStore((s) => s.orders);
  const [filter, setFilter] = useState<FilterOption>("active");

  const filteredOrders = orders.filter((order) => {
    switch (filter) {
      case "active":
        return order.status !== OrderStatus.DELIVERED;
      case "critical":
        return order.priority === "critical" && order.status !== OrderStatus.DELIVERED;
      case "delayed":
        return order.status === OrderStatus.DELAYED;
      default:
        return true;
    }
  });

  const filters: { key: FilterOption; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "all", label: "All" },
    { key: "critical", label: "Critical" },
    { key: "delayed", label: "Delayed" },
  ];

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.01]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-zinc-200">Orders</h2>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
            {filteredOrders.length}
          </span>
        </div>
        <Filter className="h-3.5 w-3.5 text-zinc-600" />
      </div>

      {/* Filter */}
      <div className="flex gap-1 border-b border-white/[0.04] px-4 py-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-200",
              filter === f.key
                ? "bg-white/[0.08] text-zinc-200"
                : "text-zinc-500 hover:text-zinc-400 hover:bg-white/[0.04]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            filteredOrders.slice(0, 20).map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="mb-3 rounded-full bg-white/[0.03] p-4">
                <Package className="h-6 w-6 text-zinc-700" />
              </div>
              <p className="text-sm text-zinc-500">No orders to show</p>
              <p className="text-[11px] text-zinc-600 mt-1">
                Orders will appear here in real time
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
