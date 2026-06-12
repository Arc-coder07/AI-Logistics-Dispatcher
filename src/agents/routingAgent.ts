// ============================================================
// Routing Agent — Route Optimization
// ============================================================

import { TimelineEventType } from "@/store/types";
import { useTimelineStore } from "@/store/timelineStore";
import { eventBus } from "@/agents/eventBus";

export class RoutingAgent {
  optimizeRoute(driverId: string, reason: string): void {
    const timelineStore = useTimelineStore.getState();

    timelineStore.addEvent({
      type: TimelineEventType.ROUTE_UPDATED,
      title: "Route Optimized",
      description: `Route updated for driver ${driverId} — ${reason}`,
    });

    eventBus.emit("ROUTE_UPDATED", { driverId, reason });
  }

  suggestReroute(driverIds: string[], reason: string): void {
    const timelineStore = useTimelineStore.getState();

    timelineStore.addEvent({
      type: TimelineEventType.AI_RECOMMENDATION,
      title: "Reroute Suggested",
      description: `AI suggests rerouting ${driverIds.length} drivers — ${reason}`,
    });
  }
}

export const routingAgent = new RoutingAgent();
