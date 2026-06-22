"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
import { WarehousePanel } from "@/components/panels/warehouse-panel";
import { DeliveryReplay } from "@/components/panels/delivery-replay";
import { FleetHealthPanel } from "@/components/panels/fleet-health-panel";
import { DriverLeaderboard } from "@/components/panels/driver-leaderboard";
import { PredictiveCards } from "@/components/panels/predictive-cards";
import { ExecutiveMetrics } from "@/components/panels/executive-metrics";
import { CommandPalette } from "@/components/command-palette";

type View = "dispatcher" | "analytics";

export default function Dashboard() {
  const [disruptionPanelOpen, setDisruptionPanelOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>("dispatcher");
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);

  // Close panel on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedPanel(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useSimulation();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <CommandPalette />

      {/* Expanded Modal Overlay */}
      {expandedPanel && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 lg:p-12">
          <div className="relative w-full h-full max-w-[1400px] flex flex-col bg-[#09090b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setExpandedPanel(null)}
              className="absolute top-4 right-4 z-[10000] p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex-1 overflow-hidden">
              {expandedPanel === "timeline" && <ActivityTimeline isExpanded />}
              {expandedPanel === "replay" && <DeliveryReplay isExpanded />}
              {expandedPanel === "collab" && <AgentCollaborationView isExpanded />}
              {expandedPanel === "feed" && <DecisionFeed isExpanded />}
            </div>
          </div>
        </div>
      )}
      
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

            {/* Col 1-5: Map (top) + Orders/Warehouse (bottom) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-2.5 min-h-0 overflow-hidden">
              {/* Fleet Map — takes majority of height */}
              <div className="flex-1 min-h-[250px]">
                <FleetMapWrapper />
              </div>
              {/* Bottom row of left column */}
              <div className="flex gap-2.5 h-[220px] shrink-0">
                <div className="w-[40%] shrink-0">
                  <WarehousePanel />
                </div>
                <div className="w-[60%] shrink-0">
                  <OrdersPanel />
                </div>
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
                <AgentCollaborationView onExpand={() => setExpandedPanel("collab")} />
              </div>
              {/* Decision Feed */}
              <div className="h-[220px] shrink-0">
                <DecisionFeed onExpand={() => setExpandedPanel("feed")} />
              </div>
            </div>

          </div>

          {/* Activity Timeline & Replay — bottom bar */}
          <div className="h-[160px] shrink-0 px-3 pb-2.5 pt-2 flex gap-2.5">
            <div className="flex-1 min-w-0">
              <ActivityTimeline onExpand={() => setExpandedPanel("timeline")} />
            </div>
            <div className="w-[350px] shrink-0">
              <DeliveryReplay onExpand={() => setExpandedPanel("replay")} />
            </div>
          </div>
        </div>
      )}

      {/* ─── ANALYTICS VIEW ─── */}
      {currentView === "analytics" && (
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Executive KPIs */}
            <div className="min-h-[140px]">
              <ExecutiveMetrics />
            </div>

            {/* Predictive Analytics */}
            <div className="min-h-[120px]">
              <PredictiveCards />
            </div>

            {/* Fleet Health & Driver Performance */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="col-span-1 lg:col-span-8 min-h-[400px]">
                <FleetHealthPanel />
              </div>
              <div className="col-span-1 lg:col-span-4 min-h-[400px]">
                <DriverLeaderboard />
              </div>
            </div>

            {/* Agent Decisions in Analytics view */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="min-h-[400px]">
                <AgentCollaborationView onExpand={() => setExpandedPanel("collab")} />
              </div>
              <div className="min-h-[400px]">
                <DecisionFeed onExpand={() => setExpandedPanel("feed")} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
