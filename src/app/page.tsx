"use client";

import { useState } from "react";
import { useSimulation } from "@/hooks/useSimulation";
import { TopNav } from "@/components/panels/top-nav";
import { KPIStrip } from "@/components/panels/kpi-strip";
import { FleetMapWrapper } from "@/components/panels/fleet-map-wrapper";
import { AlertCenter } from "@/components/panels/alert-center";
import { OrdersPanel } from "@/components/panels/orders-panel";
import { CopilotPanel } from "@/components/panels/copilot-panel";
import { ActivityTimeline } from "@/components/panels/activity-timeline";
import { DisruptionSimulator } from "@/components/panels/disruption-simulator";
import { AgentCollaborationView } from "@/components/panels/agent-collaboration-view";
import { DecisionFeed } from "@/components/panels/decision-feed";

type View = "dispatcher" | "analytics";

export default function Dashboard() {
  const [disruptionPanelOpen, setDisruptionPanelOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>("dispatcher");

  useSimulation();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNav
        onToggleDisruptions={() => setDisruptionPanelOpen(!disruptionPanelOpen)}
        disruptionPanelOpen={disruptionPanelOpen}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Disruption Simulator Dropdown */}
      <DisruptionSimulator
        open={disruptionPanelOpen}
        onClose={() => setDisruptionPanelOpen(false)}
      />

      {/* KPI Strip */}
      <KPIStrip />

      {/* ─── DISPATCHER VIEW ─── */}
      {currentView === "dispatcher" && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Main 3-column grid */}
          <div className="flex-1 grid grid-cols-12 gap-2.5 px-3 pt-2.5 min-h-0 overflow-hidden">

            {/* Col 1-5: Map (top) + Orders (bottom) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-2.5 min-h-0 overflow-hidden">
              {/* Fleet Map — takes majority of height */}
              <div className="flex-1 min-h-[250px]">
                <FleetMapWrapper />
              </div>
              {/* Orders Panel */}
              <div className="h-[220px] shrink-0">
                <OrdersPanel />
              </div>
            </div>

            {/* Col 6-9: Alert Center (top) + Copilot (bottom) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-2.5 min-h-0 overflow-hidden">
              {/* Alert Center */}
              <div className="flex-1 min-h-[180px]">
                <AlertCenter />
              </div>
              {/* Copilot */}
              <div className="h-[220px] shrink-0">
                <CopilotPanel />
              </div>
            </div>

            {/* Col 10-12: Agent Network (top) + Decision Feed (bottom) */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-2.5 min-h-0 overflow-hidden">
              {/* Agent Collaboration View */}
              <div className="flex-1 min-h-[200px]">
                <AgentCollaborationView />
              </div>
              {/* Decision Feed */}
              <div className="h-[220px] shrink-0">
                <DecisionFeed />
              </div>
            </div>

          </div>

          {/* Activity Timeline — bottom bar */}
          <div className="h-[150px] shrink-0 px-3 pb-2.5 pt-2">
            <ActivityTimeline />
          </div>
        </div>
      )}

      {/* ─── ANALYTICS VIEW ─── */}
      {currentView === "analytics" && (
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Placeholder — Phase 4 */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-lg font-semibold text-zinc-200 mb-2">
                Executive Analytics
              </h2>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                The Executive Analytics layer is coming in Phase 4. It will show
                revenue metrics, SLA compliance trends, fleet utilization heatmaps,
                and Operations Agent insights.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {["Revenue / Delivery", "SLA Compliance", "Fleet Utilization"].map((label) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="h-16 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded animate-pulse mb-2" />
                    <p className="text-xs text-zinc-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Decisions in Analytics view */}
            <div className="grid grid-cols-2 gap-4">
              <AgentCollaborationView />
              <DecisionFeed />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
