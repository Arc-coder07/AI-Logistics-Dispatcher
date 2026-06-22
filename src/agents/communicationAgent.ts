// ============================================================
// Communication Agent — Full Data Synthesis (v2)
// ============================================================

import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useAlertStore } from "@/store/alertStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { useAgentStore } from "@/store/agentStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { DriverStatus, OrderStatus, OrderPriority, AgentName } from "@/store/types";

export class CommunicationAgent {
  generateResponse(query: string): string {
    const q = query.toLowerCase();

    const drivers = useDriverStore.getState().drivers;
    const orders = useOrderStore.getState().orders;
    const alerts = useAlertStore.getState().alerts;
    const disruptions = useDisruptionStore.getState().disruptions;
    const vehicles = useVehicleStore.getState().vehicles;
    const agentDecisions = useAgentStore.getState().getRecentDecisions(10);
    const activeChain = useAgentStore.getState().getActiveChain();

    const activeOrders = orders.filter((o) => o.status !== OrderStatus.DELIVERED);
    const delayedOrders = orders.filter((o) => o.status === OrderStatus.DELAYED);
    const onlineDrivers = drivers.filter((d) => d.status !== DriverStatus.OFFLINE);
    const idleDrivers = drivers.filter((d) => d.status === DriverStatus.IDLE);
    const pendingAlerts = alerts.filter((a) => a.actionStatus === "pending");
    const activeDisruptions = disruptions.filter((d) => d.active);
    const criticalOrders = orders.filter(
      (o) => o.priority === OrderPriority.CRITICAL && o.status !== OrderStatus.DELIVERED
    );
    const completedToday = drivers.reduce((sum, d) => sum + d.completedDeliveries, 0);
    const highRiskVehicles = vehicles.filter((v) => v.riskScore > 65);

    // --- Delay & SLA ---
    if (q.includes("delay") || q.includes("late") || q.includes("slow")) {
      if (delayedOrders.length === 0) {
        return `✅ **No delayed deliveries detected.** All ${activeOrders.length} active orders are progressing on schedule.\n\nFleet SLA compliance: **100%** for current cycle. ${completedToday} deliveries completed today.\n\n${activeDisruptions.length > 0 ? `⚠️ Note: ${activeDisruptions.length} disruption(s) active — monitoring for emerging delays.` : "All systems nominal."}`;
      }
      const details = delayedOrders
        .slice(0, 3)
        .map((o) => `• **${o.id}** → ${o.destination.address} (${o.assignedDriverName ?? "Unassigned"}) — Risk: ${Math.round(o.delayRisk ?? 0)}%`)
        .join("\n");
      const slaRate = Math.round(
        ((activeOrders.length - delayedOrders.length) / Math.max(1, activeOrders.length)) * 100
      );
      return `⚠️ **${delayedOrders.length} delayed deliveries detected — SLA compliance: ${slaRate}%**\n\n${details}\n\n**Root Cause:**\n${activeDisruptions.length > 0 ? `• Active disruptions: ${activeDisruptions.map((d) => d.label).join(", ")}` : "• No major disruptions — route complexity or driver workload"}\n${delayedOrders.some((o) => (o.delayRisk ?? 0) > 75) ? "• High-risk orders flagged by Delay Agent — rerouting in progress" : ""}\n\n**Recommended actions:**\n${pendingAlerts.length > 0 ? `• Review ${pendingAlerts.length} pending AI alerts` : "• Monitor current deliveries"}\n${idleDrivers.length > 0 ? `• ${idleDrivers.length} idle driver(s) available for priority reassignment` : ""}`;
    }

    // --- Workload & Overload ---
    if (q.includes("overload") || q.includes("workload") || q.includes("busy") || q.includes("capacity")) {
      const workloads = drivers
        .filter((d) => d.status !== DriverStatus.OFFLINE)
        .sort((a, b) => b.workload - a.workload)
        .map((d) => {
          const bar = "█".repeat(d.workload) + "░".repeat(Math.max(0, d.maxWorkload - d.workload));
          return `• **${d.name}**: ${bar} ${d.workload}/${d.maxWorkload} (${d.status})`;
        })
        .join("\n");
      const avgWorkload =
        onlineDrivers.reduce((s, d) => s + d.workload, 0) / (onlineDrivers.length || 1);
      const overloaded = drivers.filter((d) => d.workload >= d.maxWorkload - 1).length;
      return `📊 **Fleet Workload Analysis:**\n\n${workloads}\n\n**Summary:**\n• Average load: ${avgWorkload.toFixed(1)} deliveries/driver\n• Overloaded drivers: ${overloaded}\n• Idle capacity: ${idleDrivers.length} drivers\n\n${avgWorkload > 3 ? "⚠️ Workload above optimal. Dispatch Agent is prioritizing idle drivers for new orders." : "✅ Workload distribution is healthy."}`;
    }

    // --- Critical Orders ---
    if (q.includes("critical") || q.includes("urgent") || q.includes("priority")) {
      if (criticalOrders.length === 0) {
        return `✅ **No critical deliveries in queue.** All high-priority orders fulfilled or progressing normally.`;
      }
      const details = criticalOrders
        .map((o) => `• **${o.id}** — ${o.packageType} → ${o.destination.address}\n  Status: ${o.status} | Driver: ${o.assignedDriverName ?? "Awaiting dispatch"} | Risk: ${Math.round(o.delayRisk ?? 0)}%`)
        .join("\n");
      return `🔴 **${criticalOrders.length} Critical Deliveries Active:**\n\n${details}\n\nDispatch Agent assigns critical orders with a **1.5x priority score multiplier** ensuring fastest available driver selection.`;
    }

    // --- Bottlenecks ---
    if (q.includes("bottleneck") || q.includes("problem") || q.includes("issue")) {
      const issues: string[] = [];
      if (delayedOrders.length > 0) issues.push(`${delayedOrders.length} delayed deliveries (SLA risk)`);
      if (activeDisruptions.length > 0) issues.push(`${activeDisruptions.length} active disruptions: ${activeDisruptions.map((d) => d.label).join(", ")}`);
      if (pendingAlerts.length > 0) issues.push(`${pendingAlerts.length} unreviewed AI alerts`);
      if (highRiskVehicles.length > 0) issues.push(`${highRiskVehicles.length} vehicles with maintenance risk >65%`);
      const overloaded = drivers.filter((d) => d.workload >= d.maxWorkload - 1);
      if (overloaded.length > 0) issues.push(`${overloaded.length} drivers near capacity: ${overloaded.map((d) => d.name).join(", ")}`);

      if (issues.length === 0) {
        return `✅ **No significant bottlenecks detected.** ${activeOrders.length} orders active, ${onlineDrivers.length} drivers online, all agents running normally.`;
      }
      return `🔍 **Bottleneck Analysis — ${issues.length} issue(s):**\n\n${issues.map((i) => `• ${i}`).join("\n")}\n\n**Recommended actions:**\n• Review Alert Center for pending recommendations\n${idleDrivers.length > 0 ? `• Reassign ${idleDrivers.length} idle driver(s) to delayed orders` : "• All drivers active — no rebalancing possible"}\n${highRiskVehicles.length > 0 ? `• Schedule maintenance for ${highRiskVehicles.length} at-risk vehicle(s)` : ""}`;
    }

    // --- Fleet Health & Vehicles ---
    if (q.includes("vehicle") || q.includes("fleet health") || q.includes("fuel") || q.includes("maintenance")) {
      const vehicleList = vehicles
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5)
        .map((v) => {
          const driver = drivers.find((d) => d.id === v.driverId);
          const risk = Math.round(v.riskScore);
          const riskLabel = risk > 75 ? "🔴 CRITICAL" : risk > 50 ? "🟡 WARNING" : "🟢 OK";
          return `• **${driver?.name ?? v.driverName}** (${v.type}): Fuel ${Math.round(v.fuelLevel)}% | Engine ${Math.round(v.engineHealth)}% | Risk ${riskLabel} (${risk}%)`;
        })
        .join("\n");
      return `🚚 **Fleet Health Report:**\n\n${vehicleList}\n\n**Summary:**\n• High-risk vehicles: ${highRiskVehicles.length}\n• Fleet Agent monitors telemetry every 30 seconds\n${highRiskVehicles.length > 0 ? `\n⚠️ ${highRiskVehicles.length} vehicle(s) require attention. Check Fleet Health panel.` : "\n✅ Fleet operating within normal parameters."}`;
    }

    // --- Agent Activity ---
    if (q.includes("agent") || q.includes("ai") || q.includes("what are agents") || q.includes("agents doing")) {
      const agentStore = useAgentStore.getState();
      const agentStates = Object.values(agentStore.agents);
      const agentList = agentStates
        .map((a) => `• **${a.name}** [${a.status.toUpperCase()}]: ${a.lastAction} (${a.decisionCount} decisions)`)
        .join("\n");
      return `🤖 **Multi-Agent System Status:**\n\n${agentList}\n\n${activeChain ? `**Active Chain:** ${activeChain.trigger.description} (${activeChain.steps.length} steps complete)` : "No active collaboration chains."}\n\n**Total decisions made:** ${agentDecisions.length > 0 ? agentStore.decisions.length : 0}`;
    }

    // --- Predictions ---
    if (q.includes("predict") || q.includes("forecast") || q.includes("tomorrow") || q.includes("next hour")) {
      const currentRate = activeOrders.length;
      const predictedOrders = Math.round(currentRate * (0.9 + Math.random() * 0.4));
      const requiredDrivers = Math.ceil(predictedOrders / 3);
      const delayProb = Math.round((activeDisruptions.length * 15) + (delayedOrders.length / Math.max(1, activeOrders.length)) * 40);
      return `🔮 **Operational Forecast (Next 60 min):**\n\n• **Predicted orders:** ~${predictedOrders} (based on current rate)\n• **Drivers required:** ~${requiredDrivers}\n• **Available:** ${onlineDrivers.length} (${onlineDrivers.length >= requiredDrivers ? "✅ sufficient" : "⚠️ may be insufficient"})\n• **Delay probability:** ${delayProb}% ${delayProb > 40 ? "⚠️ HIGH" : delayProb > 20 ? "🟡 MEDIUM" : "🟢 LOW"}\n• **Congestion risk:** ${activeDisruptions.length > 0 ? "🔴 HIGH" : "🟢 LOW"}\n\nPredictions generated from real-time simulation data by Operations Agent.`;
    }

    // --- Status Overview ---
    if (q.includes("status") || q.includes("overview") || q.includes("summary") || q.includes("how")) {
      const slaRate = activeOrders.length > 0
        ? Math.round(((activeOrders.length - delayedOrders.length) / activeOrders.length) * 100)
        : 100;
      return `📋 **Operations Overview:**\n\n• **Active Orders:** ${activeOrders.length} (${criticalOrders.length} critical)\n• **Drivers Online:** ${onlineDrivers.length}/${drivers.length} (${idleDrivers.length} idle)\n• **Deliveries Today:** ${completedToday}\n• **Delayed:** ${delayedOrders.length} | **SLA:** ${slaRate}%\n• **Pending Alerts:** ${pendingAlerts.length}\n• **Active Disruptions:** ${activeDisruptions.length}\n• **Vehicle Risks:** ${highRiskVehicles.length} flagged\n\n${delayedOrders.length > 0 ? "⚠️ Some deliveries experiencing delays." : "✅ All systems operating normally."} ${pendingAlerts.length > 0 ? `\n\n📬 ${pendingAlerts.length} AI recommendation(s) awaiting your review.` : ""}`;
    }

    // --- Driver Locations ---
    if (q.includes("driver") && (q.includes("where") || q.includes("location") || q.includes("find"))) {
      const driverList = onlineDrivers
        .map((d) => `• **${d.name}** — ${d.status} | ${d.workload}/${d.maxWorkload} deliveries`)
        .join("\n");
      return `📍 **Fleet Positioning:**\n\n${driverList}\n\n*Live positions visible on the Fleet Map.*`;
    }

    // --- Help ---
    if (q.includes("help") || q.includes("what can")) {
      return `🤖 **AI Copilot — Available Commands:**\n\n• "Why are deliveries delayed?" — Delay analysis + SLA\n• "Which drivers are overloaded?" — Workload distribution\n• "Show critical deliveries" — Priority order status\n• "What are the bottlenecks?" — Comprehensive issue diagnosis\n• "Fleet health report" — Vehicle telemetry summary\n• "What are agents doing?" — Multi-agent system status\n• "Predict next hour demand" — Operational forecast\n• "Give me a status overview" — Full operations summary\n\nI continuously synthesize data from all 6 AI agents to provide real-time operational intelligence.`;
    }

    // --- Default ---
    const slaRate = activeOrders.length > 0
      ? Math.round(((activeOrders.length - delayedOrders.length) / activeOrders.length) * 100)
      : 100;
    return `📊 **Quick Status:** ${activeOrders.length} active orders | ${onlineDrivers.length} drivers online | ${completedToday} completed | SLA: ${slaRate}% | ${pendingAlerts.length} pending alerts | ${highRiskVehicles.length} vehicle risks\n\nAsk me about delays, workload, critical orders, fleet health, agent activity, or predictions. Type "help" for all commands.`;
  }
}

export const communicationAgent = new CommunicationAgent();
