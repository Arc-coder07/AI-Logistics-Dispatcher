// ============================================================
// Monitoring Agent — Continuous Operations Monitoring
// ============================================================

import {
  AlertType,
  AlertSeverity,
  DisruptionType,
  TimelineEventType,
} from "@/store/types";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useAlertStore } from "@/store/alertStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { eventBus } from "@/agents/eventBus";
import { pickRandom } from "@/lib/utils";

export class MonitoringAgent {
  checkForIssues(): void {
    this.checkDelayedDeliveries();
    this.checkOverloadedDrivers();
    this.checkDisruptions();
  }

  private checkDelayedDeliveries(): void {
    const orders = useOrderStore.getState().orders;
    const alertStore = useAlertStore.getState();
    const timelineStore = useTimelineStore.getState();

    const activeOrders = orders.filter(
      (o) => o.status !== "delivered" && o.status !== "created"
    );

    // Randomly flag some orders as delayed for simulation
    const delayCandidate = activeOrders.find(
      (o) =>
        o.status === "delivering" &&
        Math.random() < 0.15
    );

    if (delayCandidate) {
      useOrderStore.getState().updateOrderStatus(delayCandidate.id, "delayed" as never);

      const alert = alertStore.addAlert({
        type: AlertType.DELAY,
        severity: AlertSeverity.MEDIUM,
        title: "Delivery Delay Detected",
        description: `Order ${delayCandidate.id} to ${delayCandidate.destination.address} is experiencing delays`,
        affectedDeliveries: 1,
        predictedDelay: Math.floor(Math.random() * 15) + 5,
        recommendation: `Notify customer and consider reassignment to a closer driver`,
        confidence: Math.floor(Math.random() * 15) + 80,
        impact: `${Math.floor(Math.random() * 10) + 3} minute delay reduction possible`,
      });

      timelineStore.addEvent({
        type: TimelineEventType.ALERT_TRIGGERED,
        title: "Delay Alert",
        description: `AI detected potential delay for ${delayCandidate.id}`,
      });

      eventBus.emit("ALERT_TRIGGERED", { alert });
    }
  }

  private checkOverloadedDrivers(): void {
    const drivers = useDriverStore.getState().drivers;
    const alertStore = useAlertStore.getState();
    const timelineStore = useTimelineStore.getState();

    const overloaded = drivers.filter(
      (d) => d.workload >= d.maxWorkload - 1 && d.status !== "offline"
    );

    if (overloaded.length > 0 && Math.random() < 0.2) {
      const driver = pickRandom(overloaded);
      alertStore.addAlert({
        type: AlertType.OVERLOAD,
        severity: AlertSeverity.HIGH,
        title: "Driver Overload Warning",
        description: `${driver.name} is at ${driver.workload}/${driver.maxWorkload} capacity`,
        affectedDeliveries: driver.workload,
        predictedDelay: Math.floor(Math.random() * 20) + 10,
        recommendation: `Redistribute ${Math.ceil(driver.workload / 2)} deliveries to nearby available drivers`,
        confidence: Math.floor(Math.random() * 10) + 85,
        impact: `Reduce average delivery time by ${Math.floor(Math.random() * 12) + 5} minutes`,
      });

      timelineStore.addEvent({
        type: TimelineEventType.ALERT_TRIGGERED,
        title: "Overload Warning",
        description: `${driver.name} is approaching maximum workload capacity`,
      });
    }
  }

  private checkDisruptions(): void {
    const disruptionStore = useDisruptionStore.getState();
    const alertStore = useAlertStore.getState();
    const timelineStore = useTimelineStore.getState();
    const drivers = useDriverStore.getState().drivers;
    const activeDrivers = drivers.filter((d) => d.status !== "offline");

    const activeDisruptions = disruptionStore.getActiveDisruptions();

    for (const disruption of activeDisruptions) {
      // Rate-limit: only generate alerts occasionally
      if (Math.random() > 0.3) continue;

      switch (disruption.type) {
        case DisruptionType.TRAFFIC_JAM: {
          const affected = Math.floor(Math.random() * 8) + 3;
          alertStore.addAlert({
            type: AlertType.TRAFFIC,
            severity: AlertSeverity.HIGH,
            title: "⚠ Traffic Congestion Detected",
            description:
              "Heavy traffic reported on I-80 and downtown corridors. Multiple delivery routes affected.",
            affectedDeliveries: affected,
            predictedDelay: Math.floor(Math.random() * 20) + 10,
            recommendation: `Reroute ${Math.min(affected, activeDrivers.length)} drivers via alternative routes. Prioritize critical deliveries.`,
            confidence: Math.floor(Math.random() * 8) + 88,
            impact: `Save approximately ${Math.floor(Math.random() * 25) + 15} minutes across affected deliveries`,
          });
          timelineStore.addEvent({
            type: TimelineEventType.DISRUPTION_STARTED,
            title: "Traffic Alert",
            description: "Heavy traffic congestion detected — AI analyzing impact",
          });
          break;
        }

        case DisruptionType.HEAVY_RAIN: {
          alertStore.addAlert({
            type: AlertType.WEATHER,
            severity: AlertSeverity.HIGH,
            title: "🌧 Heavy Rain Advisory",
            description:
              "Severe weather conditions detected. Visibility reduced, roads may be slippery.",
            affectedDeliveries: Math.floor(Math.random() * 12) + 5,
            predictedDelay: Math.floor(Math.random() * 25) + 15,
            recommendation:
              "Delay low-priority deliveries by 30 minutes. Reduce speed limits for active drivers.",
            confidence: Math.floor(Math.random() * 7) + 83,
            impact: "Reduce accident risk by 67% and protect driver safety",
          });
          timelineStore.addEvent({
            type: TimelineEventType.DISRUPTION_STARTED,
            title: "Weather Alert",
            description: "Heavy rain detected — AI recommending delivery adjustments",
          });
          break;
        }

        case DisruptionType.VEHICLE_BREAKDOWN: {
          if (activeDrivers.length > 0) {
            const affectedDriver = pickRandom(activeDrivers);
            alertStore.addAlert({
              type: AlertType.VEHICLE,
              severity: AlertSeverity.CRITICAL,
              title: "🚚 Vehicle Breakdown Reported",
              description: `${affectedDriver.name}'s vehicle has reported a mechanical issue near current location.`,
              affectedDeliveries: affectedDriver.workload,
              predictedDelay: Math.floor(Math.random() * 30) + 20,
              recommendation: `Take ${affectedDriver.name} offline. Reassign ${affectedDriver.workload} deliveries to nearby drivers.`,
              confidence: 95,
              impact: `Prevent ${affectedDriver.workload} delivery failures`,
            });
            timelineStore.addEvent({
              type: TimelineEventType.DISRUPTION_STARTED,
              title: "Vehicle Issue",
              description: `${affectedDriver.name} reported vehicle breakdown`,
            });
          }
          break;
        }

        case DisruptionType.DEMAND_SPIKE: {
          alertStore.addAlert({
            type: AlertType.DEMAND,
            severity: AlertSeverity.MEDIUM,
            title: "📈 Demand Spike Detected",
            description:
              "Order volume has increased 3x above normal levels in the past 10 minutes.",
            affectedDeliveries: Math.floor(Math.random() * 15) + 10,
            predictedDelay: Math.floor(Math.random() * 15) + 8,
            recommendation:
              "Activate surge protocols. Consider bringing 2 offline drivers online.",
            confidence: Math.floor(Math.random() * 5) + 90,
            impact: "Maintain average delivery time within SLA targets",
          });
          timelineStore.addEvent({
            type: TimelineEventType.DISRUPTION_STARTED,
            title: "Demand Spike",
            description: "Unusual surge in delivery requests detected",
          });
          break;
        }

        case DisruptionType.ROAD_CLOSURE: {
          alertStore.addAlert({
            type: AlertType.ROAD_CLOSURE,
            severity: AlertSeverity.HIGH,
            title: "⛔ Road Closure Alert",
            description:
              "Market Street between 3rd and 7th closed due to emergency construction.",
            affectedDeliveries: Math.floor(Math.random() * 6) + 3,
            predictedDelay: Math.floor(Math.random() * 20) + 12,
            recommendation:
              "Reroute all affected drivers via Mission Street. Update ETAs for impacted deliveries.",
            confidence: 97,
            impact: `Avoid ${Math.floor(Math.random() * 30) + 15} minutes of cumulative delays`,
          });
          timelineStore.addEvent({
            type: TimelineEventType.DISRUPTION_STARTED,
            title: "Road Closure",
            description: "Road closure detected — AI calculating alternative routes",
          });
          break;
        }
      }
    }
  }
}

export const monitoringAgent = new MonitoringAgent();
