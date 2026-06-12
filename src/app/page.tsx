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

export default function Dashboard() {
  const [disruptionPanelOpen, setDisruptionPanelOpen] = useState(false);

  // Initialize all simulation loops
  useSimulation();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNav
        onToggleDisruptions={() => setDisruptionPanelOpen(!disruptionPanelOpen)}
        disruptionPanelOpen={disruptionPanelOpen}
      />

      {/* Disruption Simulator Dropdown */}
      <DisruptionSimulator
        open={disruptionPanelOpen}
        onClose={() => setDisruptionPanelOpen(false)}
      />

      {/* KPI Strip */}
      <KPIStrip />

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-3 px-4 pb-3 overflow-hidden min-h-0">
        {/* Left Column — Map + Orders */}
        <div className="lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Fleet Map */}
          <div className="flex-1 min-h-[280px]">
            <FleetMapWrapper />
          </div>

          {/* Orders Panel */}
          <div className="h-[280px] lg:h-[260px] shrink-0">
            <OrdersPanel />
          </div>
        </div>

        {/* Right Column — Alerts + Copilot + Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* AI Alert Center */}
          <div className="flex-1 min-h-[200px]">
            <AlertCenter />
          </div>

          {/* AI Copilot */}
          <div className="h-[280px] lg:h-[260px] shrink-0">
            <CopilotPanel />
          </div>
        </div>
      </div>

      {/* Activity Timeline (Bottom) */}
      <div className="h-[180px] shrink-0 px-4 pb-3">
        <ActivityTimeline />
      </div>
    </div>
  );
}
