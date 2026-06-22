// ============================================================
// Delay Agent — ETA-Based Delay Risk Prediction
// ============================================================

import { AgentName, TimelineEventType, OrderStatus, AlertType, AlertSeverity } from "@/store/types";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useAlertStore } from "@/store/alertStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { useAgentStore } from "@/store/agentStore";
import { eventBus } from "@/agents/eventBus";
import { haversineDistance } from "@/lib/utils";

const DELAY_RISK_THRESHOLD = 60; // alert when risk > 60%
const CRITICAL_RISK_THRESHOLD = 80;

export class DelayAgent {
  analyze(): void {
    const agentStore = useAgentStore.getState();
    agentStore.setAgentStatus(AgentName.DELAY, "thinking", "Scanning delivery ETAs...");

    const orders = useOrderStore.getState().orders;
    const drivers = useDriverStore.getState().drivers;
    const disruptions = useDisruptionStore.getState().getActiveDisruptions();
    const alertStore = useAlertStore.getState();
    const timelineStore = useTimelineStore.getState();

    const activeOrders = orders.filter(
      (o) =>
        o.status === OrderStatus.ASSIGNED ||
        o.status === OrderStatus.PICKED_UP ||
        o.status === OrderStatus.DELIVERING
    );

    if (activeOrders.length === 0) {
      agentStore.setAgentStatus(AgentName.DELAY, "idle", "No active deliveries to analyze");
      return;
    }

    for (const order of activeOrders) {
      const driver = drivers.find((d) => d.id === order.assignedDriverId);
      if (!driver) continue;

      // Compute delay risk score based on multiple factors
      let riskScore = 0;

      // Factor 1: Remaining distance to destination (0-40 points)
      const distanceToDestination = haversineDistance(
        driver.location.lat,
        driver.location.lng,
        order.destination.location.lat,
        order.destination.location.lng
      );
      const distanceRisk = Math.min(40, (distanceToDestination / 5) * 40);
      riskScore += distanceRisk;

      // Factor 2: Time since assignment vs ETA (0-30 points)
      if (order.assignedAt) {
        const elapsedMinutes = (Date.now() - new Date(order.assignedAt).getTime()) / 60000;
        const originalETA = order.eta;
        if (elapsedMinutes > originalETA * 0.8) {
          riskScore += 30;
        } else if (elapsedMinutes > originalETA * 0.6) {
          riskScore += 15;
        }
      }

      // Factor 3: Active disruptions (0-30 points)
      const disruptionRisk = Math.min(30, disruptions.length * 15);
      riskScore += disruptionRisk;

      // Clamp to 0-100
      riskScore = Math.min(100, Math.max(0, riskScore));

      // Update order's delay risk
      useOrderStore.getState().updateOrderDelayRisk(order.id, riskScore);

      // Trigger alert if above threshold
      if (riskScore >= DELAY_RISK_THRESHOLD) {
        const severity =
          riskScore >= CRITICAL_RISK_THRESHOLD || order.priority === "critical"
            ? AlertSeverity.CRITICAL
            : AlertSeverity.HIGH;

        const predictedExtraMinutes = Math.round((riskScore / 100) * 20);
        const recommendation = `${driver.name} is ${distanceToDestination.toFixed(1)}km from destination. ${
          disruptions.length > 0
            ? `Consider rerouting around active disruptions.`
            : `Monitor progress — no alternative route needed yet.`
        }`;

        alertStore.addAlert({
          type: AlertType.DELAY,
          severity,
          title: `Delay Risk: ${order.id}`,
          description: `${order.packageType} to ${order.destination.address} — ${Math.round(riskScore)}% delay probability detected`,
          affectedDeliveries: 1,
          predictedDelay: predictedExtraMinutes,
          recommendation,
          confidence: Math.round(75 + riskScore * 0.2),
          impact: `Potential ${predictedExtraMinutes} minute delay for ${order.customerName}`,
          agentSource: AgentName.DELAY,
        });

        const decision = agentStore.addDecision({
          agentName: AgentName.DELAY,
          action: `Delay risk detected for ${order.id}`,
          reasoning: `Distance: ${distanceToDestination.toFixed(1)}km remaining. Time pressure: ${order.assignedAt ? Math.round((Date.now() - new Date(order.assignedAt).getTime()) / 60000) : 0}min elapsed. Active disruptions: ${disruptions.length}. Computed risk: ${Math.round(riskScore)}%`,
          confidence: Math.round(75 + riskScore * 0.2),
          impact: `${Math.round(riskScore)}% probability of delay for order ${order.id}`,
          relatedEntities: [order.id, driver.id],
          status: "complete",
        });

        timelineStore.addEvent({
          type: TimelineEventType.DELAY_DETECTED,
          title: "Delay Risk Detected",
          description: `Order ${order.id} — ${Math.round(riskScore)}% delay probability`,
          agentSource: AgentName.DELAY,
        });

        // Emit for Route Agent to pick up
        eventBus.emit("DELAY_RISK_DETECTED", {
          orderId: order.id,
          driverId: driver.id,
          riskScore,
          decision,
          chainId: undefined,
        });
      }
    }

    agentStore.setAgentStatus(
      AgentName.DELAY,
      "idle",
      `Analyzed ${activeOrders.length} active deliveries`
    );
  }
}

export const delayAgent = new DelayAgent();
