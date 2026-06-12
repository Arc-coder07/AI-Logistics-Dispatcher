"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlertStore } from "@/store/alertStore";
import { AlertCard } from "@/components/ui/alert-card";
import { AlertActionStatus } from "@/store/types";
import { Shield, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "pending" | "approved" | "rejected";

export function AlertCenter() {
  const alerts = useAlertStore((s) => s.alerts);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return true;
    return alert.actionStatus === activeTab;
  });

  const pendingCount = alerts.filter(
    (a) => a.actionStatus === AlertActionStatus.PENDING
  ).length;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.01]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-zinc-200">AI Alert Center</h2>
          {pendingCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
              <Bell className="h-2.5 w-2.5" />
              {pendingCount}
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-white/[0.04] px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-200",
              activeTab === tab.key
                ? "bg-white/[0.08] text-zinc-200"
                : "text-zinc-500 hover:text-zinc-400 hover:bg-white/[0.04]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, i) => (
              <AlertCard key={alert.id} alert={alert} index={i} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="mb-3 rounded-full bg-white/[0.03] p-4">
                <Shield className="h-6 w-6 text-zinc-700" />
              </div>
              <p className="text-sm text-zinc-500">No alerts to show</p>
              <p className="text-[11px] text-zinc-600 mt-1">
                AI agents are monitoring operations
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
