// ============================================================
// useSimulation — Master Simulation Loop
// ============================================================

"use client";

import { useEffect, useRef } from "react";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { dispatchAgent } from "@/agents/dispatchAgent";
import { monitoringAgent } from "@/agents/monitoringAgent";
import {
  DriverStatus,
  OrderStatus,
  TimelineEventType,
} from "@/store/types";

export function useSimulation() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize drivers
    useDriverStore.getState().initializeDrivers();

    // Add system start event
    useTimelineStore.getState().addEvent({
      type: TimelineEventType.SYSTEM_EVENT,
      title: "System Online",
      description: "AI Logistics Dispatcher initialized — all agents active",
    });

    // Generate a few initial orders
    const orderStore = useOrderStore.getState();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const order = orderStore.generateOrder();
        useOrderStore.getState().addOrder(order);
        useTimelineStore.getState().addEvent({
          type: TimelineEventType.ORDER_CREATED,
          title: "Order Created",
          description: `${order.id} — ${order.packageType} (${order.priority})`,
        });
        // Dispatch after short delay
        setTimeout(() => {
          dispatchAgent.dispatch(order);
        }, 800);
      }, (i + 1) * 2000);
    }

    // --- Driver Movement Loop (every 2.5s) ---
    const movementInterval = setInterval(() => {
      useDriverStore.getState().moveDriversTowardDestinations();

      // Check if any delivering drivers should complete
      const drivers = useDriverStore.getState().drivers;
      drivers.forEach((driver) => {
        if (driver.status === DriverStatus.DELIVERING && Math.random() < 0.3) {
          useDriverStore.getState().completeDelivery(driver.id);

          if (driver.currentOrderId) {
            useOrderStore
              .getState()
              .updateOrderStatus(driver.currentOrderId, OrderStatus.DELIVERED);
          }

          useTimelineStore.getState().addEvent({
            type: TimelineEventType.DELIVERY_COMPLETED,
            title: "Delivery Completed",
            description: `${driver.name} completed delivery ${driver.currentOrderId || ""}`,
          });
        }
      });
    }, 2500);

    // --- Order Generation Loop (every 10-18s) ---
    let orderTimeout: NodeJS.Timeout;
    const scheduleNextOrder = () => {
      const delay = Math.random() * 8000 + 10000;
      const disruptionStore = useDisruptionStore.getState();
      const demandSpikeActive = disruptionStore.isActive("demand-spike" as never);

      orderTimeout = setTimeout(() => {
        const oStore = useOrderStore.getState();
        const order = oStore.generateOrder();
        oStore.addOrder(order);

        useTimelineStore.getState().addEvent({
          type: TimelineEventType.ORDER_CREATED,
          title: "Order Created",
          description: `${order.id} — ${order.packageType} (${order.priority})`,
        });

        // AI dispatch after brief delay
        setTimeout(() => {
          dispatchAgent.dispatch(order);
        }, 1500);

        // If demand spike, generate extra orders faster
        if (demandSpikeActive) {
          setTimeout(() => {
            const extraOrder = useOrderStore.getState().generateOrder();
            useOrderStore.getState().addOrder(extraOrder);
            useTimelineStore.getState().addEvent({
              type: TimelineEventType.ORDER_CREATED,
              title: "Order Created (Surge)",
              description: `${extraOrder.id} — ${extraOrder.packageType} (${extraOrder.priority})`,
            });
            setTimeout(() => dispatchAgent.dispatch(extraOrder), 800);
          }, 3000);
        }

        scheduleNextOrder();
      }, demandSpikeActive ? delay * 0.4 : delay);
    };
    scheduleNextOrder();

    // --- Monitoring Agent Loop (every 20s) ---
    const monitorInterval = setInterval(() => {
      monitoringAgent.checkForIssues();
    }, 20000);

    // --- Cleanup old data (every 60s) ---
    const cleanupInterval = setInterval(() => {
      useOrderStore.getState().removeOldDelivered();
      useAlertStore.getState().clearOldAlerts();
      useTimelineStore.getState().clearOldEvents();
    }, 60000);

    // First monitoring check after 15s
    setTimeout(() => {
      monitoringAgent.checkForIssues();
    }, 15000);

    return () => {
      clearInterval(movementInterval);
      clearInterval(monitorInterval);
      clearInterval(cleanupInterval);
      clearTimeout(orderTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// Need to import this lazily
import { useAlertStore } from "@/store/alertStore";
