"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useAlertStore } from "@/store/alertStore";
import { OrderStatus, DriverStatus } from "@/store/types";
import {
  Package,
  Users,
  CheckCircle2,
  AlertTriangle,
  Brain,
} from "lucide-react";

export function KPIStrip() {
  const drivers = useDriverStore((s) => s.drivers);
  const orders = useOrderStore((s) => s.orders);
  const alerts = useAlertStore((s) => s.alerts);

  const activeOrders = orders.filter(
    (o) => o.status !== OrderStatus.DELIVERED
  ).length;
  const driversOnline = drivers.filter(
    (d) => d.status !== DriverStatus.OFFLINE
  ).length;
  const completed = drivers.reduce((sum, d) => sum + d.completedDeliveries, 0);
  const delayed = orders.filter((o) => o.status === OrderStatus.DELAYED).length;
  const pendingAlerts = alerts.filter(
    (a) => a.actionStatus === "pending"
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-5">
      <MetricCard
        title="Active Orders"
        value={activeOrders}
        trend={12}
        icon={Package}
        accentColor="blue"
        delay={0}
      />
      <MetricCard
        title="Drivers Online"
        value={driversOnline}
        icon={Users}
        accentColor="green"
        suffix={`/ ${drivers.length}`}
        delay={1}
      />
      <MetricCard
        title="Completed"
        value={completed}
        trend={8}
        icon={CheckCircle2}
        accentColor="violet"
        delay={2}
      />
      <MetricCard
        title="Delayed"
        value={delayed}
        icon={AlertTriangle}
        accentColor={delayed > 0 ? "red" : "green"}
        delay={3}
      />
      <MetricCard
        title="AI Pending"
        value={pendingAlerts}
        icon={Brain}
        accentColor={pendingAlerts > 0 ? "amber" : "blue"}
        delay={4}
      />
    </div>
  );
}
