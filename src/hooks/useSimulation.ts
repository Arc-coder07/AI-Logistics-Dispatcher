// ============================================================
// useSimulation — Master Simulation Loop (v3 - Engine Based)
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
import { useSimulationStore } from "@/store/simulationStore";
import { dispatchAgent } from "@/agents/dispatchAgent";
import { monitoringAgent } from "@/agents/monitoringAgent";
import { delayAgent } from "@/agents/delayAgent";
import { fleetAgent } from "@/agents/fleetAgent";
import { operationsAgent } from "@/agents/operationsAgent";
import { agentOrchestrator } from "@/agents/agentOrchestrator";
import { TimelineEventType, AgentName } from "@/store/types";

// Engines
import { driverEngine } from "@/engines/driverEngine";
import { orderEngine } from "@/engines/orderEngine";
import { vehicleEngine } from "@/engines/vehicleEngine";
import { warehouseEngine } from "@/engines/warehouseEngine";
import { trafficEngine } from "@/engines/trafficEngine";

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

    // --- Wire up agent orchestrator ---
    const cleanupOrchestrator = agentOrchestrator.initialize();

    useTimelineStore.getState().addEvent({
      type: TimelineEventType.SYSTEM_EVENT,
      title: "System Online",
      description: "All 7 AI agents initialized — Digital Twin Simulation active",
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

    // --- Master Simulation Loop ---
    let animationFrameId: number;
    let lastTickTime = performance.now();
    const BASE_TICK_RATE_MS = 1000; // 1 real second = 1 base tick

    let ticksSinceMonitoring = 0;
    let ticksSinceDelay = 0;
    let ticksSinceFleet = 0;
    let ticksSinceOps = 0;
    let ticksSinceCleanup = 0;

    const tickLoop = (time: number) => {
      const state = useSimulationStore.getState();
      
      if (state.isPaused) {
        lastTickTime = time;
        animationFrameId = requestAnimationFrame(tickLoop);
        return;
      }
      
      const delta = time - lastTickTime;
      const currentTickRate = BASE_TICK_RATE_MS / state.speed;

      if (delta >= currentTickRate) {
        lastTickTime = time - (delta % currentTickRate);

        // 1. Run Engines
        // In the previous version, driver movement was every 2.5s.
        // We can run driver engine every tick, or throttle it slightly.
        // Let's just run them every tick.
        driverEngine.tick();
        orderEngine.tick();
        vehicleEngine.tick();
        warehouseEngine.tick();
        trafficEngine.tick();

        // 2. Run Agents based on tick counters
        ticksSinceMonitoring++;
        if (ticksSinceMonitoring >= 20) {
          monitoringAgent.checkForIssues();
          ticksSinceMonitoring = 0;
        }

        ticksSinceDelay++;
        if (ticksSinceDelay >= 15) {
          delayAgent.analyze();
          ticksSinceDelay = 0;
        }

        ticksSinceFleet++;
        if (ticksSinceFleet >= 30) {
          fleetAgent.monitor();
          ticksSinceFleet = 0;
        }

        ticksSinceOps++;
        if (ticksSinceOps >= 45) {
          operationsAgent.generateInsights();
          ticksSinceOps = 0;
        }

        ticksSinceCleanup++;
        if (ticksSinceCleanup >= 60) {
          useOrderStore.getState().removeOldDelivered();
          useAlertStore.getState().clearOldAlerts();
          useTimelineStore.getState().clearOldEvents();
          ticksSinceCleanup = 0;
        }

        // 3. Advance simulation clock (1 tick = 10 simulated seconds)
        useSimulationStore.getState().tickForward(10);
      }

      animationFrameId = requestAnimationFrame(tickLoop);
    };

    animationFrameId = requestAnimationFrame(tickLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      cleanupOrchestrator();
      initialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
