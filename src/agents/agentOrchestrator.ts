// ============================================================
// Agent Orchestrator — Multi-Agent Coordination Layer
// ============================================================
// Manages collaboration chains and routes events between agents.
// When DelayAgent fires, it cascades → RouteAgent → DispatchAgent → CommunicationAgent

import { AgentName, TimelineEventType } from "@/store/types";
import { useAgentStore } from "@/store/agentStore";
import { useTimelineStore } from "@/store/timelineStore";
import { eventBus } from "@/agents/eventBus";
import { routingAgent } from "@/agents/routingAgent";
import { dispatchAgent } from "@/agents/dispatchAgent";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";

let initialized = false;

export class AgentOrchestrator {
  initialize(): () => void {
    if (initialized) return () => {};
    initialized = true;

    const unsubscribers: (() => void)[] = [];

    // ─── Cascade 1: Delay Risk → Route Agent ───────────────────
    unsubscribers.push(
      eventBus.on("DELAY_RISK_DETECTED", (event) => {
        const payload = event.payload as {
          orderId: string;
          driverId: string;
          riskScore: number;
          decision: { id: string };
        };

        if (payload.riskScore < 65) return;

        // Start a new collaboration chain
        const chainId = useAgentStore.getState().startChain({
          agentName: AgentName.DELAY,
          event: "DELAY_RISK_DETECTED",
          description: `Delay risk ${Math.round(payload.riskScore)}% detected for order ${payload.orderId}`,
        });

        useAgentStore.getState().addStepToChain(chainId, {
          ...payload.decision,
          id: payload.decision.id,
          agentName: AgentName.DELAY,
          action: `Delay risk detected: ${Math.round(payload.riskScore)}%`,
          reasoning: `Order ${payload.orderId} flagged with ${Math.round(payload.riskScore)}% delay probability`,
          confidence: Math.round(75 + payload.riskScore * 0.2),
          impact: `Potential delay for order ${payload.orderId}`,
          timestamp: new Date(),
          relatedEntities: [payload.orderId, payload.driverId],
          chainId,
          status: "complete" as const,
        });

        // Short delay for visual cascade effect
        setTimeout(() => {
          routingAgent.handleDelayRisk({ ...payload, chainId });
        }, 800);
      })
    );

    // ─── Cascade 2: Route Updated → potentially Dispatch Agent ──
    unsubscribers.push(
      eventBus.on("ROUTE_UPDATED", (event) => {
        const payload = event.payload as {
          driverId: string;
          chainId?: string;
          timeSaving?: number;
          decision?: { id: string };
        };

        if (!payload.chainId) return;

        if (payload.decision) {
          const step = {
            id: payload.decision.id,
            agentName: AgentName.ROUTE,
            action: "Route optimized",
            reasoning: `Alternative route calculated — saves ~${payload.timeSaving ?? 0} minutes`,
            confidence: 85,
            impact: `${payload.timeSaving ?? 0} min time saving`,
            timestamp: new Date(),
            relatedEntities: [payload.driverId],
            chainId: payload.chainId,
            status: "complete" as const,
          };
          useAgentStore.getState().addStepToChain(payload.chainId, step);
        }

        // After routing, check if driver reassignment is needed
        setTimeout(() => {
          this.considerReassignment(payload.driverId, payload.chainId);
        }, 600);
      })
    );

    // ─── Cascade 3: Reroute Calculated → Communication Agent ────
    unsubscribers.push(
      eventBus.on("REROUTE_CALCULATED", (event) => {
        const payload = event.payload as {
          driverIds: string[];
          reason: string;
          chainId?: string;
          decision?: { id: string };
        };

        if (!payload.chainId) return;

        if (payload.decision) {
          const step = {
            id: payload.decision.id,
            agentName: AgentName.ROUTE,
            action: `Reroute for ${payload.driverIds.length} drivers`,
            reasoning: payload.reason,
            confidence: 82,
            impact: "Delay prevention via rerouting",
            timestamp: new Date(),
            relatedEntities: payload.driverIds,
            chainId: payload.chainId,
            status: "complete" as const,
          };
          useAgentStore.getState().addStepToChain(payload.chainId, step);
        }

        // Complete the chain
        setTimeout(() => {
          this.finalizeChain(payload.chainId!, "Rerouting complete — operators notified");
        }, 400);
      })
    );

    // ─── Cascade 4: Vehicle Risk → Dispatch Agent reassignment ──
    unsubscribers.push(
      eventBus.on("VEHICLE_RISK_DETECTED", (event) => {
        const payload = event.payload as {
          vehicleId: string;
          driverId: string;
          riskScore: number;
        };

        if (payload.riskScore < 75) return;

        const chainId = useAgentStore.getState().startChain({
          agentName: AgentName.FLEET,
          event: "VEHICLE_RISK_DETECTED",
          description: `Vehicle risk ${Math.round(payload.riskScore)}% for driver ${payload.driverId}`,
        });

        setTimeout(() => {
          this.handleVehicleRisk(payload.driverId, payload.riskScore, chainId);
        }, 500);
      })
    );

    // ─── Cascade 5: Driver Assignment → Communication ────────────
    unsubscribers.push(
      eventBus.on("DRIVER_ASSIGNED", (event) => {
        const payload = event.payload as {
          orderId: string;
          driverId: string;
          reasoning: string;
        };

        const agentStore = useAgentStore.getState();
        agentStore.addDecision({
          agentName: AgentName.COMMUNICATION,
          action: `Customer notification drafted`,
          reasoning: `Order ${payload.orderId} assigned — notifying customer of ETA and driver details`,
          confidence: 95,
          impact: "Customer informed, reducing support tickets",
          relatedEntities: [payload.orderId, payload.driverId],
          status: "complete",
        });
      })
    );

    console.log("[AgentOrchestrator] Initialized — watching for agent events");
    return () => {
      unsubscribers.forEach((fn) => fn());
      initialized = false;
    };
  }

  private considerReassignment(driverId: string, chainId?: string): void {
    const driver = useDriverStore.getState().drivers.find((d) => d.id === driverId);
    if (!driver || !driver.currentOrderId) return;

    // Check if there's a better driver available for the current order
    const order = useOrderStore.getState().orders.find(
      (o) => o.id === driver.currentOrderId
    );
    if (!order) return;

    const availableDrivers = useDriverStore
      .getState()
      .getAvailableDrivers()
      .filter((d) => d.id !== driverId && (d.status === "idle" || d.status === "returning"));

    if (availableDrivers.length > 0 && driver.workload >= driver.maxWorkload - 1 && chainId) {
      const agentStore = useAgentStore.getState();
      agentStore.addDecision({
        agentName: AgentName.DISPATCH,
        action: "Driver reassignment evaluated",
        reasoning: `${driver.name} is near max capacity (${driver.workload}/${driver.maxWorkload}). ${availableDrivers.length} alternative drivers available. Route optimization complete — no reassignment required at this time.`,
        confidence: 78,
        impact: "Optimal assignment confirmed — no change needed",
        relatedEntities: [driverId, order.id],
        chainId,
        status: "complete",
      });

      if (chainId) {
        this.finalizeChain(chainId, "Dispatch confirmed — route and assignment optimal");
      }
    } else if (chainId) {
      this.finalizeChain(chainId, "Route optimized — assignment unchanged");
    }
  }

  private handleVehicleRisk(driverId: string, riskScore: number, chainId: string): void {
    const agentStore = useAgentStore.getState();
    const driver = useDriverStore.getState().drivers.find((d) => d.id === driverId);
    if (!driver) return;

    agentStore.addDecision({
      agentName: AgentName.DISPATCH,
      action: `Contingency plan for ${driver.name}`,
      reasoning: `Vehicle risk at ${Math.round(riskScore)}%. Identifying backup drivers for ${driver.workload} active deliveries. ${driver.workload === 0 ? "No active deliveries — monitoring only." : "Backup drivers identified."}`,
      confidence: 88,
      impact:
        driver.workload > 0
          ? `Prevent ${driver.workload} delivery failures via proactive reassignment`
          : "No immediate action needed — monitoring vehicle status",
      relatedEntities: [driverId],
      chainId,
      status: "complete",
    });

    agentStore.addDecision({
      agentName: AgentName.COMMUNICATION,
      action: "Maintenance team notified",
      reasoning: `Fleet Agent escalated vehicle risk for ${driver.name}. Maintenance team and operations manager alerted for scheduling.`,
      confidence: 95,
      impact: "Proactive maintenance scheduling reduces breakdown probability by 78%",
      relatedEntities: [driverId],
      chainId,
      status: "complete",
    });

    useTimelineStore.getState().addEvent({
      type: TimelineEventType.AGENT_DECISION,
      title: "Fleet Response Chain Complete",
      description: `Fleet Agent → Dispatch Agent → Communication Agent: ${driver.name} vehicle risk managed`,
      agentSource: AgentName.OPERATIONS,
    });

    this.finalizeChain(chainId, "Vehicle risk chain complete — maintenance scheduled");
  }

  private finalizeChain(chainId: string, summary: string): void {
    useAgentStore.getState().completeChain(chainId);

    useAgentStore.getState().addDecision({
      agentName: AgentName.OPERATIONS,
      action: "Incident logged",
      reasoning: summary,
      confidence: 95,
      impact: "Operational event recorded for analytics",
      relatedEntities: [],
      chainId,
      status: "complete",
    });

    eventBus.emit("COLLABORATION_CHAIN_COMPLETED", { chainId, summary });
  }
}

export const agentOrchestrator = new AgentOrchestrator();
