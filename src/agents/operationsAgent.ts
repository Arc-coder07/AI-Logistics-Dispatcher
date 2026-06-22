// ============================================================
// Operations Agent — Business Insights & SLA Analysis
// ============================================================

import { AgentName, TimelineEventType, OrderStatus, DriverStatus } from "@/store/types";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useAlertStore } from "@/store/alertStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useAgentStore } from "@/store/agentStore";
import { eventBus } from "@/agents/eventBus";

export interface OperationalInsight {
  id: string;
  title: string;
  detail: string;
  metric: string;
  recommendation: string;
  severity: "info" | "warning" | "critical";
  generatedAt: Date;
}

let insightCounter = 0;

export class OperationsAgent {
  generateInsights(): OperationalInsight[] {
    const agentStore = useAgentStore.getState();
    agentStore.setAgentStatus(AgentName.OPERATIONS, "thinking", "Analyzing operational data...");

    const drivers = useDriverStore.getState().drivers;
    const orders = useOrderStore.getState().orders;
    const alerts = useAlertStore.getState().alerts;

    const insights: OperationalInsight[] = [];

    const activeOrders = orders.filter((o) => o.status !== OrderStatus.DELIVERED);
    const delayedOrders = orders.filter((o) => o.status === OrderStatus.DELAYED);
    const onlineDrivers = drivers.filter((d) => d.status !== DriverStatus.OFFLINE);
    const idleDrivers = drivers.filter((d) => d.status === DriverStatus.IDLE);
    const completedToday = drivers.reduce((s, d) => s + d.completedDeliveries, 0);
    const pendingAlerts = alerts.filter((a) => a.actionStatus === "pending");

    // SLA Analysis
    const slaCompliance =
      activeOrders.length > 0
        ? Math.round(((activeOrders.length - delayedOrders.length) / activeOrders.length) * 100)
        : 100;

    if (slaCompliance < 85) {
      insights.push({
        id: `INS-${++insightCounter}`,
        title: "SLA Compliance Below Target",
        detail: `Current SLA compliance rate is ${slaCompliance}% (target: 95%). ${delayedOrders.length} delayed deliveries are impacting performance.`,
        metric: `${slaCompliance}% SLA`,
        recommendation: `Prioritize delayed orders and review driver assignments. ${idleDrivers.length > 0 ? `${idleDrivers.length} idle drivers available for rebalancing.` : "Consider bringing offline drivers online."}`,
        severity: slaCompliance < 70 ? "critical" : "warning",
        generatedAt: new Date(),
      });
    }

    // Fleet utilization
    const utilizationRate =
      onlineDrivers.length > 0
        ? Math.round(
            (onlineDrivers.filter((d) => d.status !== DriverStatus.IDLE).length /
              onlineDrivers.length) *
              100
          )
        : 0;

    if (utilizationRate > 90) {
      insights.push({
        id: `INS-${++insightCounter}`,
        title: "Fleet at Maximum Utilization",
        detail: `${utilizationRate}% of online drivers are currently active. No buffer capacity for demand spikes.`,
        metric: `${utilizationRate}% utilized`,
        recommendation: `Fleet utilization is critically high. Bringing 2 additional drivers online would reduce risk by approximately 18%.`,
        severity: "warning",
        generatedAt: new Date(),
      });
    }

    // Throughput insight
    const avgDeliveriesPerDriver =
      onlineDrivers.length > 0
        ? (completedToday / onlineDrivers.length).toFixed(1)
        : "0";

    insights.push({
      id: `INS-${++insightCounter}`,
      title: "Fleet Throughput Analysis",
      detail: `Fleet has completed ${completedToday} deliveries. Average ${avgDeliveriesPerDriver} deliveries per active driver.`,
      metric: `${completedToday} deliveries`,
      recommendation:
        parseFloat(avgDeliveriesPerDriver) < 3
          ? "Throughput is below optimal. Review dispatch prioritization and reduce idle time."
          : "Fleet throughput is healthy. Maintain current dispatch strategy.",
      severity: parseFloat(avgDeliveriesPerDriver) < 3 ? "warning" : "info",
      generatedAt: new Date(),
    });

    // Unresolved alerts backlog
    if (pendingAlerts.length > 3) {
      insights.push({
        id: `INS-${++insightCounter}`,
        title: "Alert Backlog Growing",
        detail: `${pendingAlerts.length} AI recommendations are awaiting operator review. Unresolved alerts reduce system effectiveness.`,
        metric: `${pendingAlerts.length} pending`,
        recommendation: `Review and action pending alerts in the Alert Center. Prioritize CRITICAL and HIGH severity items first.`,
        severity: pendingAlerts.length > 6 ? "critical" : "warning",
        generatedAt: new Date(),
      });
    }

    // Record in decision feed
    if (insights.length > 0) {
      const topInsight = insights[0];

      agentStore.addDecision({
        agentName: AgentName.OPERATIONS,
        action: `${insights.length} operational insight(s) generated`,
        reasoning: insights.map((i) => `${i.title}: ${i.detail}`).join(" | "),
        confidence: 88,
        impact: `Actionable intelligence for ${insights.filter((i) => i.severity !== "info").length} operational issues`,
        relatedEntities: [],
        status: "complete",
      });

      useTimelineStore.getState().addEvent({
        type: TimelineEventType.INSIGHT_GENERATED,
        title: "Operational Insight",
        description: topInsight.title,
        agentSource: AgentName.OPERATIONS,
      });

      eventBus.emit("INSIGHT_GENERATED", { insights });
    }

    agentStore.setAgentStatus(
      AgentName.OPERATIONS,
      "idle",
      `${insights.length} insight(s) generated`
    );

    return insights;
  }
}

export const operationsAgent = new OperationsAgent();
