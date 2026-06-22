// ============================================================
// useSimulation — Master Simulation Loop (v2)
// ============================================================

"use client";

import { useEffect, useRef } from "react";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { useAlertStore } from "@/store/alertStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { useAgentStore } from "@/store/agentStore";
import { dispatchAgent } from "@/agents/dispatchAgent";
import { monitoringAgent } from "@/agents/monitoringAgent";
import { delayAgent } from "@/agents/delayAgent";
import { fleetAgent } from "@/agents/fleetAgent";
import { operationsAgent } from "@/agents/operationsAgent";
import { agentOrchestrator } from "@/agents/agentOrchestrator";
import { DriverStatus, OrderStatus, TimelineEventType, AgentName } from "@/store/types";

export function useSimulation() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // --- Initialize all stores ---
    useDriverStore.getState().initializeDrivers();
    useVehicleStore.getState().initializeVehicles();

    // --- Mark all agents as idle on boot ---
    const agentStore = useAgentStore.getState();
    agentStore.setAgentStatus(AgentName.DISPATCH, "idle", "System initializing...");
    agentStore.setAgentStatus(AgentName.MONITORING, "idle", "System initializing...");
    agentStore.setAgentStatus(AgentName.ROUTE, "idle", "System initializing...");
    agentStore.setAgentStatus(AgentName.DELAY, "idle", "System initializing...");
    agentStore.setAgentStatus(AgentName.FLEET, "idle", "System initializing...");
    agentStore.setAgentStatus(AgentName.OPERATIONS, "idle", "System initializing...");
    agentStore.setAgentStatus(AgentName.COMMUNICATION, "idle", "System initializing...");

    // --- Wire up agent orchestrator (inter-agent event subscriptions) ---
    const cleanupOrchestrator = agentOrchestrator.initialize();

    useTimelineStore.getState().addEvent({
      type: TimelineEventType.SYSTEM_EVENT,
      title: "System Online",
      description: "All 7 AI agents initialized — Autonomous Logistics Simulation Platform active",
    });

    // --- Generate initial orders ---
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
        setTimeout(() => {
          dispatchAgent.dispatch(order);
        }, 800);
      }, (i + 1) * 2000);
    }

    // --- Driver Movement Loop (every 2.5s) ---
    const movementInterval = setInterval(() => {
      useDriverStore.getState().moveDriversTowardDestinations();

      // Distance-based delivery completion: when driver reaches destination
      const drivers = useDriverStore.getState().drivers;
      drivers.forEach((driver) => {
        if (
          driver.status === DriverStatus.DELIVERING &&
          driver.destination &&
          Math.random() < 0.25 // slight randomness to stagger completions
        ) {
          useDriverStore.getState().completeDelivery(driver.id);

          if (driver.currentOrderId) {
            useOrderStore
              .getState()
              .updateOrderStatus(driver.currentOrderId, OrderStatus.DELIVERED);
          }

          useTimelineStore.getState().addEvent({
            type: TimelineEventType.DELIVERY_COMPLETED,
            title: "Delivery Completed",
            description: `${driver.name} completed delivery ${driver.currentOrderId ?? ""}`,
            agentSource: AgentName.DISPATCH,
          });
        }
      });
    }, 2500);

    // --- Order Generation Loop (every 10-18s) ---
    let orderTimeout: ReturnType<typeof setTimeout>;
    const scheduleNextOrder = () => {
      const baseDelay = Math.random() * 8000 + 10000;
      const disruptionStore = useDisruptionStore.getState();
      const demandSpikeActive = disruptionStore.isActive("demand-spike" as Parameters<typeof disruptionStore.isActive>[0]);

      orderTimeout = setTimeout(() => {
        const oStore = useOrderStore.getState();
        const order = oStore.generateOrder();
        oStore.addOrder(order);

        useTimelineStore.getState().addEvent({
          type: TimelineEventType.ORDER_CREATED,
          title: "Order Created",
          description: `${order.id} — ${order.packageType} (${order.priority})`,
        });

        setTimeout(() => {
          dispatchAgent.dispatch(order);
        }, 1500);

        // Demand spike: generate extra orders faster
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
      }, demandSpikeActive ? baseDelay * 0.4 : baseDelay);
    };
    scheduleNextOrder();

    // --- Monitoring Agent Loop (every 20s) ---
    const monitorInterval = setInterval(() => {
      monitoringAgent.checkForIssues();
    }, 20000);

    // --- Delay Agent Loop (every 15s) ---
    const delayInterval = setInterval(() => {
      delayAgent.analyze();
    }, 15000);

    // --- Fleet Agent Loop (every 30s) ---
    const fleetInterval = setInterval(() => {
      fleetAgent.monitor();
    }, 30000);

    // --- Operations Agent Loop (every 45s) ---
    const opsInterval = setInterval(() => {
      operationsAgent.generateInsights();
    }, 45000);

    // --- Cleanup Loop (every 60s) ---
    const cleanupInterval = setInterval(() => {
      useOrderStore.getState().removeOldDelivered();
      useAlertStore.getState().clearOldAlerts();
      useTimelineStore.getState().clearOldEvents();
    }, 60000);

    // First agent checks after startup
    setTimeout(() => monitoringAgent.checkForIssues(), 15000);
    setTimeout(() => delayAgent.analyze(), 18000);
    setTimeout(() => fleetAgent.monitor(), 25000);
    setTimeout(() => operationsAgent.generateInsights(), 35000);

    return () => {
      clearInterval(movementInterval);
      clearInterval(monitorInterval);
      clearInterval(delayInterval);
      clearInterval(fleetInterval);
      clearInterval(opsInterval);
      clearInterval(cleanupInterval);
      clearTimeout(orderTimeout);
      cleanupOrchestrator();
      initialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
