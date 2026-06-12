// ============================================================
// Dispatch Agent — AI Driver Assignment
// ============================================================

import { Order, OrderPriority, TimelineEventType } from "@/store/types";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useTimelineStore } from "@/store/timelineStore";
import { eventBus } from "@/agents/eventBus";
import { haversineDistance } from "@/lib/utils";

export class DispatchAgent {
  dispatch(order: Order): void {
    const driverStore = useDriverStore.getState();
    const orderStore = useOrderStore.getState();
    const timelineStore = useTimelineStore.getState();

    // Find best driver using multi-factor scoring
    const availableDrivers = driverStore.getAvailableDrivers().filter(
      (d) => d.status === "idle" || d.status === "returning"
    );

    if (availableDrivers.length === 0) {
      timelineStore.addEvent({
        type: TimelineEventType.SYSTEM_EVENT,
        title: "No Drivers Available",
        description: `Order ${order.id} queued — all drivers are currently busy`,
      });
      return;
    }

    // Score each driver
    const scored = availableDrivers.map((driver) => {
      const distance = haversineDistance(
        driver.location.lat,
        driver.location.lng,
        order.pickup.location.lat,
        order.pickup.location.lng
      );
      const workloadScore = (driver.maxWorkload - driver.workload) / driver.maxWorkload;
      const distanceScore = 1 / (1 + distance);
      const ratingScore = driver.rating / 5;

      // Priority weighting
      let priorityMultiplier = 1;
      if (order.priority === OrderPriority.CRITICAL) priorityMultiplier = 1.5;
      else if (order.priority === OrderPriority.HIGH) priorityMultiplier = 1.2;

      const totalScore =
        (distanceScore * 0.4 + workloadScore * 0.35 + ratingScore * 0.25) *
        priorityMultiplier;

      return { driver, distance, totalScore, workloadScore, distanceScore };
    });

    scored.sort((a, b) => b.totalScore - a.totalScore);
    const best = scored[0];

    // Generate reasoning
    const reasons: string[] = [];
    if (scored.length > 1 && best.distanceScore >= scored[1].distanceScore) {
      reasons.push(`Closest available driver (${best.distance.toFixed(1)}km away)`);
    } else {
      reasons.push(`${best.distance.toFixed(1)}km from pickup`);
    }
    if (best.driver.workload === 0) {
      reasons.push("Currently idle with no active deliveries");
    } else {
      reasons.push(`Low workload (${best.driver.workload}/${best.driver.maxWorkload} capacity)`);
    }
    reasons.push(`High reliability rating (${best.driver.rating}★)`);

    const eta = Math.round(best.distance * 8 + Math.random() * 5 + 5);
    reasons.push(`Estimated arrival in ${eta} minutes`);

    const reasoning = `Assigned ${best.driver.name}\n\nReasoning:\n• ${reasons.join("\n• ")}`;

    // Execute assignment
    orderStore.assignDriver(order.id, best.driver.id, best.driver.name, reasoning);
    driverStore.assignOrder(
      best.driver.id,
      order.id,
      order.destination.location
    );

    // Timeline event
    timelineStore.addEvent({
      type: TimelineEventType.DRIVER_ASSIGNED,
      title: "Driver Assigned by AI",
      description: `${best.driver.name} assigned to ${order.id} (${order.priority} priority) — ${reasons[0]}`,
    });

    // Emit event
    eventBus.emit("DRIVER_ASSIGNED", {
      orderId: order.id,
      driverId: best.driver.id,
      reasoning,
    });
  }
}

export const dispatchAgent = new DispatchAgent();
