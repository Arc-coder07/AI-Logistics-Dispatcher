// ============================================================
// Communication Agent — Copilot Response Generator
// ============================================================

import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useAlertStore } from "@/store/alertStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { DriverStatus, OrderStatus, OrderPriority } from "@/store/types";

export class CommunicationAgent {
  generateResponse(query: string): string {
    const q = query.toLowerCase();

    const drivers = useDriverStore.getState().drivers;
    const orders = useOrderStore.getState().orders;
    const alerts = useAlertStore.getState().alerts;
    const disruptions = useDisruptionStore.getState().disruptions;

    const activeOrders = orders.filter((o) => o.status !== OrderStatus.DELIVERED);
    const delayedOrders = orders.filter((o) => o.status === OrderStatus.DELAYED);
    const onlineDrivers = drivers.filter((d) => d.status !== DriverStatus.OFFLINE);
    const idleDrivers = drivers.filter((d) => d.status === DriverStatus.IDLE);
    const pendingAlerts = alerts.filter((a) => a.actionStatus === "pending");
    const activeDisruptions = disruptions.filter((d) => d.active);
    const criticalOrders = orders.filter((o) => o.priority === OrderPriority.CRITICAL && o.status !== OrderStatus.DELIVERED);
    const completedToday = drivers.reduce((sum, d) => sum + d.completedDeliveries, 0);

    // Pattern matching for common queries
    if (q.includes("delay") || q.includes("late")) {
      if (delayedOrders.length === 0) {
        return `✅ **No delayed deliveries detected.** All ${activeOrders.length} active orders are progressing on schedule. The fleet is performing within SLA targets.`;
      }
      const details = delayedOrders
        .slice(0, 3)
        .map((o) => `• **${o.id}** → ${o.destination.address} (${o.assignedDriverName || "Unassigned"})`)
        .join("\n");
      return `⚠️ **${delayedOrders.length} deliveries are currently delayed:**\n\n${details}\n\n**Root Cause Analysis:**\n${activeDisruptions.length > 0 ? `Active disruptions (${activeDisruptions.map((d) => d.label).join(", ")}) are contributing to delays.` : "No major disruptions detected — delays may be due to route complexity or traffic."}\n\n**Recommendation:** ${pendingAlerts.length > 0 ? `Review ${pendingAlerts.length} pending AI recommendations for mitigation strategies.` : "Consider enabling the disruption simulator to test response protocols."}`;
    }

    if (q.includes("overload") || q.includes("workload") || q.includes("busy")) {
      const workloads = drivers
        .filter((d) => d.status !== DriverStatus.OFFLINE)
        .map((d) => `• **${d.name}**: ${d.workload}/${d.maxWorkload} deliveries (${d.status})`)
        .join("\n");
      const avgWorkload = onlineDrivers.reduce((s, d) => s + d.workload, 0) / (onlineDrivers.length || 1);
      return `📊 **Fleet Workload Analysis:**\n\n${workloads}\n\n**Average workload:** ${avgWorkload.toFixed(1)} deliveries per driver\n**Idle drivers:** ${idleDrivers.length}\n**Online drivers:** ${onlineDrivers.length}\n\n${avgWorkload > 3 ? "⚠️ Workload is above optimal levels. Consider bringing additional drivers online." : "✅ Workload distribution is within healthy parameters."}`;
    }

    if (q.includes("critical") || q.includes("urgent") || q.includes("priority")) {
      if (criticalOrders.length === 0) {
        return `✅ **No critical deliveries in queue.** All high-priority orders have been fulfilled or are progressing normally.`;
      }
      const details = criticalOrders
        .map((o) => `• **${o.id}** — ${o.packageType} → ${o.destination.address} (Status: ${o.status})`)
        .join("\n");
      return `🔴 **${criticalOrders.length} Critical Deliveries Active:**\n\n${details}\n\nThese orders are being given priority routing and the fastest available drivers.`;
    }

    if (q.includes("bottleneck") || q.includes("problem") || q.includes("issue")) {
      const issues: string[] = [];
      if (delayedOrders.length > 0) issues.push(`${delayedOrders.length} delayed deliveries`);
      if (activeDisruptions.length > 0) issues.push(`${activeDisruptions.length} active disruptions (${activeDisruptions.map((d) => d.label).join(", ")})`);
      if (pendingAlerts.length > 0) issues.push(`${pendingAlerts.length} unresolved AI alerts`);
      const overloaded = drivers.filter((d) => d.workload >= d.maxWorkload - 1);
      if (overloaded.length > 0) issues.push(`${overloaded.length} drivers near capacity`);

      if (issues.length === 0) {
        return `✅ **No significant bottlenecks detected.** Operations are running smoothly with ${activeOrders.length} active orders and ${onlineDrivers.length} drivers online.`;
      }
      return `🔍 **Current Bottleneck Analysis:**\n\n${issues.map((i) => `• ${i}`).join("\n")}\n\n**Recommended Actions:**\n• Review pending alerts in the Alert Center\n• Consider adjusting dispatch priorities\n• ${idleDrivers.length > 0 ? `${idleDrivers.length} idle drivers available for rebalancing` : "All drivers are currently engaged — consider bringing offline drivers online"}`;
    }

    if (q.includes("status") || q.includes("overview") || q.includes("summary") || q.includes("how")) {
      return `📋 **Operations Overview:**\n\n• **Active Orders:** ${activeOrders.length}\n• **Drivers Online:** ${onlineDrivers.length}/${drivers.length}\n• **Deliveries Completed:** ${completedToday}\n• **Delayed:** ${delayedOrders.length}\n• **Pending Alerts:** ${pendingAlerts.length}\n• **Active Disruptions:** ${activeDisruptions.length}\n\n${delayedOrders.length > 0 ? "⚠️ Some deliveries are experiencing delays." : "✅ All systems operating normally."} ${pendingAlerts.length > 0 ? `\n\n📬 You have ${pendingAlerts.length} AI recommendations awaiting review.` : ""}`;
    }

    if (q.includes("driver") && (q.includes("where") || q.includes("location") || q.includes("find"))) {
      const driverList = onlineDrivers
        .map((d) => `• **${d.name}** — ${d.status} at (${d.location.lat.toFixed(4)}, ${d.location.lng.toFixed(4)})`)
        .join("\n");
      return `📍 **Driver Locations:**\n\n${driverList}`;
    }

    if (q.includes("help") || q.includes("what can")) {
      return `🤖 **I can help you with:**\n\n• "Why are deliveries delayed?" — Delay analysis\n• "Which drivers are overloaded?" — Workload report\n• "Show critical deliveries" — Priority orders\n• "What are today's bottlenecks?" — Issue diagnosis\n• "Give me a status overview" — Full operations summary\n• "Where are the drivers?" — Fleet positioning\n\nI continuously monitor all operations and will proactively alert you to issues.`;
    }

    // Default intelligent response
    return `📊 **Quick Status:** ${activeOrders.length} active orders, ${onlineDrivers.length} drivers online, ${delayedOrders.length} delays, ${pendingAlerts.length} pending alerts.\n\nI can provide detailed analysis on delays, workload distribution, critical deliveries, or operational bottlenecks. What would you like to explore?`;
  }
}

export const communicationAgent = new CommunicationAgent();
