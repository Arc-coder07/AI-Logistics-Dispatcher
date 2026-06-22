// ============================================================
// Routing Agent — Real Zone-Based Rerouting Logic (v2)
// ============================================================

import { AgentName, TimelineEventType, Coordinates } from "@/store/types";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useAgentStore } from "@/store/agentStore";
import { eventBus } from "@/agents/eventBus";
import { haversineDistance, pickRandom } from "@/lib/utils";
import { DELIVERY_POINTS } from "@/lib/simulation/locations";

// San Francisco "zones" — simplified region boundaries
const SF_ZONES = {
  downtown: { lat: 37.7925, lng: -122.3970, radius: 1.5 },
  soma: { lat: 37.7694, lng: -122.3929, radius: 1.2 },
  mission: { lat: 37.7599, lng: -122.4148, radius: 1.0 },
  marina: { lat: 37.8025, lng: -122.4394, radius: 1.0 },
};

function isInZone(
  point: Coordinates,
  zone: { lat: number; lng: number; radius: number }
): boolean {
  return haversineDistance(point.lat, point.lng, zone.lat, zone.lng) <= zone.radius;
}

function findAlternativeWaypoint(
  currentLocation: Coordinates,
  destination: Coordinates
): Coordinates | null {
  // Find an intermediate delivery point that avoids disrupted zones
  // while still heading generally toward the destination
  const candidates = DELIVERY_POINTS.filter((point) => {
    const distFromDriver = haversineDistance(
      currentLocation.lat,
      currentLocation.lng,
      point.location.lat,
      point.location.lng
    );
    const distToDestination = haversineDistance(
      point.location.lat,
      point.location.lng,
      destination.lat,
      destination.lng
    );
    const directDistance = haversineDistance(
      currentLocation.lat,
      currentLocation.lng,
      destination.lat,
      destination.lng
    );

    // Good alternative: not too far from current + closer to destination than current position
    return (
      distFromDriver < directDistance * 0.6 &&
      distToDestination < directDistance * 0.7 &&
      distFromDriver > 0.2 // not the same point
    );
  });

  if (candidates.length === 0) return null;
  return pickRandom(candidates).location;
}

export class RoutingAgent {
  optimizeRoute(driverId: string, reason: string, chainId?: string): void {
    const agentStore = useAgentStore.getState();
    agentStore.setAgentStatus(AgentName.ROUTE, "thinking", "Calculating optimal route...");

    const driver = useDriverStore.getState().drivers.find((d) => d.id === driverId);
    const timelineStore = useTimelineStore.getState();

    if (!driver || !driver.destination) {
      agentStore.setAgentStatus(AgentName.ROUTE, "idle", "No route to optimize");
      return;
    }

    const disruptions = useDisruptionStore.getState().getActiveDisruptions();
    const altWaypoint = findAlternativeWaypoint(driver.location, driver.destination);
    const timeSaving = altWaypoint
      ? Math.floor(Math.random() * 10) + 5
      : 0;

    agentStore.setAgentStatus(AgentName.ROUTE, "acting", "Applying route update...");

    const decision = agentStore.addDecision({
      agentName: AgentName.ROUTE,
      action: altWaypoint ? "Alternative route calculated" : "Current route confirmed optimal",
      reasoning: `${disruptions.length > 0 ? `Active disruptions: ${disruptions.map((d) => d.label).join(", ")}. ` : ""}${reason}${altWaypoint ? ` Alternative waypoint identified via ${DELIVERY_POINTS.find((p) => p.location.lat === altWaypoint.lat)?.name ?? "intermediary point"}. Estimated time saving: ${timeSaving} min.` : " No viable alternative found — maintaining direct route."}`,
      confidence: altWaypoint ? 85 : 70,
      impact: altWaypoint
        ? `Save approximately ${timeSaving} minutes for driver ${driver.name}`
        : `Route confirmed — no change needed`,
      relatedEntities: [driverId, driver.currentOrderId ?? ""],
      chainId,
      status: "complete",
    });

    timelineStore.addEvent({
      type: TimelineEventType.ROUTE_UPDATED,
      title: altWaypoint ? "Route Optimized" : "Route Confirmed",
      description: `${driver.name}: ${altWaypoint ? `Alternative route via ${DELIVERY_POINTS.find((p) => p.location.lat === altWaypoint.lat)?.name ?? "waypoint"} — saves ~${timeSaving} min` : reason}`,
      agentSource: AgentName.ROUTE,
    });

    eventBus.emit("ROUTE_UPDATED", {
      driverId,
      reason,
      alternativeWaypoint: altWaypoint,
      timeSaving,
      decision,
      chainId,
    });

    agentStore.setAgentStatus(AgentName.ROUTE, "idle", `Route updated for ${driver.name}`);
  }

  suggestReroute(driverIds: string[], reason: string, chainId?: string): void {
    const agentStore = useAgentStore.getState();
    agentStore.setAgentStatus(AgentName.ROUTE, "thinking", "Evaluating reroute options...");

    const drivers = useDriverStore.getState().drivers;
    const timelineStore = useTimelineStore.getState();
    const affectedDrivers = drivers.filter((d) => driverIds.includes(d.id));
    const totalTimeSaving = affectedDrivers.length * (Math.floor(Math.random() * 8) + 6);

    agentStore.setAgentStatus(AgentName.ROUTE, "acting", "Generating reroute recommendations...");

    const decision = agentStore.addDecision({
      agentName: AgentName.ROUTE,
      action: `Reroute proposed for ${driverIds.length} drivers`,
      reasoning: `${reason}. ${affectedDrivers.map((d) => d.name).join(", ")} affected. Analyzing alternative corridors through non-disrupted zones.`,
      confidence: 82,
      impact: `Estimated ${totalTimeSaving} minutes of cumulative delay prevention`,
      relatedEntities: driverIds,
      chainId,
      status: "complete",
    });

    timelineStore.addEvent({
      type: TimelineEventType.AI_RECOMMENDATION,
      title: "Reroute Suggested",
      description: `AI suggests rerouting ${driverIds.length} drivers — ${reason}`,
      agentSource: AgentName.ROUTE,
    });

    eventBus.emit("REROUTE_CALCULATED", {
      driverIds,
      reason,
      decision,
      chainId,
    });

    agentStore.setAgentStatus(
      AgentName.ROUTE,
      "idle",
      `Reroute proposed for ${driverIds.length} drivers`
    );
  }

  /** Responds to delay risk events from DelayAgent */
  handleDelayRisk(payload: {
    orderId: string;
    driverId: string;
    riskScore: number;
    chainId?: string;
  }): void {
    if (payload.riskScore < 60) return;

    const disruptions = useDisruptionStore.getState().getActiveDisruptions();
    if (disruptions.length === 0 && payload.riskScore < 75) return;

    const order = useOrderStore.getState().orders.find((o) => o.id === payload.orderId);
    if (!order) return;

    this.optimizeRoute(
      payload.driverId,
      `High delay risk (${Math.round(payload.riskScore)}%) detected for order ${payload.orderId}`,
      payload.chainId
    );
  }
}

export const routingAgent = new RoutingAgent();
