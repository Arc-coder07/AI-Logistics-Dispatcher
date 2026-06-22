// ============================================================
// Fleet Agent — Vehicle Health Monitoring & Risk Prediction
// ============================================================

import { AgentName, TimelineEventType, AlertType, AlertSeverity } from "@/store/types";
import { useDriverStore } from "@/store/driverStore";
import { useAlertStore } from "@/store/alertStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useAgentStore } from "@/store/agentStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { eventBus } from "@/agents/eventBus";

const MAINTENANCE_RISK_THRESHOLD = 65;
const CRITICAL_FUEL_LEVEL = 20;
const CRITICAL_ENGINE_HEALTH = 30;

export class FleetAgent {
  monitor(): void {
    const agentStore = useAgentStore.getState();
    agentStore.setAgentStatus(AgentName.FLEET, "thinking", "Scanning vehicle telemetry...");

    const vehicles = useVehicleStore.getState().vehicles;
    const drivers = useDriverStore.getState().drivers;
    const alertStore = useAlertStore.getState();
    const timelineStore = useTimelineStore.getState();

    let issuesFound = 0;

    for (const vehicle of vehicles) {
      const driver = drivers.find((d) => d.id === vehicle.driverId);
      if (!driver || driver.status === "offline") continue;

      // Critical fuel check
      if (vehicle.fuelLevel <= CRITICAL_FUEL_LEVEL) {
        alertStore.addAlert({
          type: AlertType.MAINTENANCE,
          severity: AlertSeverity.HIGH,
          title: `⛽ Low Fuel: ${driver.name}`,
          description: `Vehicle operated by ${driver.name} is at ${Math.round(vehicle.fuelLevel)}% fuel — refueling required soon.`,
          affectedDeliveries: driver.workload,
          predictedDelay: 15,
          recommendation: `Route ${driver.name} to nearest fuel station after current delivery. Consider reassigning pending orders.`,
          confidence: 98,
          impact: `${driver.workload} deliveries at risk if vehicle runs out of fuel`,
          agentSource: AgentName.FLEET,
        });
        issuesFound++;
      }

      // Critical engine health
      if (vehicle.engineHealth <= CRITICAL_ENGINE_HEALTH) {
        alertStore.addAlert({
          type: AlertType.VEHICLE,
          severity: AlertSeverity.CRITICAL,
          title: `🔧 Engine Warning: ${driver.name}`,
          description: `${driver.name}'s vehicle engine health is critically low (${Math.round(vehicle.engineHealth)}%). Risk of breakdown is high.`,
          affectedDeliveries: driver.workload,
          predictedDelay: 30,
          recommendation: `Take ${driver.name} offline immediately. Reassign ${driver.workload} deliveries to nearest available drivers.`,
          confidence: 94,
          impact: `Prevent critical breakdown — ${driver.workload} deliveries and driver safety at risk`,
          agentSource: AgentName.FLEET,
        });
        issuesFound++;
      }

      // High maintenance risk
      if (vehicle.riskScore >= MAINTENANCE_RISK_THRESHOLD && Math.random() < 0.4) {
        const decision = agentStore.addDecision({
          agentName: AgentName.FLEET,
          action: `Maintenance risk flagged for ${driver.name}`,
          reasoning: `Vehicle analysis: Fuel ${Math.round(vehicle.fuelLevel)}%, Engine health ${Math.round(vehicle.engineHealth)}%, Mileage since last maintenance ${Math.round(vehicle.lastMaintenance)}km. Computed risk score: ${Math.round(vehicle.riskScore)}%`,
          confidence: Math.round(80 + vehicle.riskScore * 0.15),
          impact: `${Math.round(vehicle.riskScore)}% maintenance risk — schedule service within ${Math.round((100 - vehicle.riskScore) * 0.5)} hours`,
          relatedEntities: [vehicle.id, driver.id],
          status: "complete",
        });

        timelineStore.addEvent({
          type: TimelineEventType.VEHICLE_ALERT,
          title: "Vehicle Risk Detected",
          description: `${driver.name} — Maintenance risk: ${Math.round(vehicle.riskScore)}%`,
          agentSource: AgentName.FLEET,
        });

        eventBus.emit("VEHICLE_RISK_DETECTED", {
          vehicleId: vehicle.id,
          driverId: vehicle.driverId,
          riskScore: vehicle.riskScore,
          decision,
        });
      }
    }

    // Degrade vehicles over time
    useVehicleStore.getState().degradeAll();

    const statusMsg =
      issuesFound > 0
        ? `${issuesFound} vehicle issue(s) detected`
        : "All vehicles within normal parameters";

    agentStore.setAgentStatus(AgentName.FLEET, "idle", statusMsg);
  }
}

export const fleetAgent = new FleetAgent();
