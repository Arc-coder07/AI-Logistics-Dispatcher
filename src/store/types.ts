// ============================================================
// AI Logistics Dispatcher — Core Type Definitions
// ============================================================

// --- Enums ---

export enum DriverStatus {
  IDLE = "idle",
  EN_ROUTE = "en-route",
  DELIVERING = "delivering",
  RETURNING = "returning",
  OFFLINE = "offline",
}

export enum OrderPriority {
  CRITICAL = "critical",
  HIGH = "high",
  NORMAL = "normal",
}

export enum OrderStatus {
  CREATED = "created",
  ASSIGNED = "assigned",
  PICKED_UP = "picked-up",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  DELAYED = "delayed",
}

export enum AlertType {
  TRAFFIC = "traffic",
  WEATHER = "weather",
  VEHICLE = "vehicle",
  DEMAND = "demand",
  ROAD_CLOSURE = "road-closure",
  DELAY = "delay",
  OVERLOAD = "overload",
}

export enum AlertSeverity {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum AlertActionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum DisruptionType {
  TRAFFIC_JAM = "traffic-jam",
  HEAVY_RAIN = "heavy-rain",
  VEHICLE_BREAKDOWN = "vehicle-breakdown",
  DEMAND_SPIKE = "demand-spike",
  ROAD_CLOSURE = "road-closure",
}

export enum TimelineEventType {
  ORDER_CREATED = "order-created",
  DRIVER_ASSIGNED = "driver-assigned",
  DELIVERY_COMPLETED = "delivery-completed",
  ALERT_TRIGGERED = "alert-triggered",
  AI_RECOMMENDATION = "ai-recommendation",
  APPROVAL_ACTION = "approval-action",
  DISRUPTION_STARTED = "disruption-started",
  DISRUPTION_ENDED = "disruption-ended",
  ROUTE_UPDATED = "route-updated",
  SYSTEM_EVENT = "system-event",
}

// --- Data Types ---

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  status: DriverStatus;
  workload: number;
  maxWorkload: number;
  location: Coordinates;
  destination: Coordinates | null;
  currentOrderId: string | null;
  completedDeliveries: number;
  rating: number;
  vehicleType: string;
}

export interface Order {
  id: string;
  pickup: {
    location: Coordinates;
    address: string;
  };
  destination: {
    location: Coordinates;
    address: string;
  };
  priority: OrderPriority;
  status: OrderStatus;
  assignedDriverId: string | null;
  assignedDriverName: string | null;
  eta: number; // minutes
  createdAt: Date;
  aiReasoning: string | null;
  customerName: string;
  packageType: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedDeliveries: number;
  predictedDelay: number; // minutes
  recommendation: string;
  confidence: number; // 0-100
  impact: string;
  actionStatus: AlertActionStatus;
  createdAt: Date;
  resolvedAt: Date | null;
  resolvedBy: string | null;
}

export interface AIRecommendation {
  id: string;
  type: "dispatch" | "reroute" | "delay" | "prioritize";
  title: string;
  description: string;
  reasoning: string[];
  confidence: number;
  predictedImpact: string;
  affectedEntities: string[];
  actionStatus: AlertActionStatus;
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
  metadata?: Record<string, string | number>;
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface DisruptionEvent {
  id: string;
  type: DisruptionType;
  active: boolean;
  severity: AlertSeverity;
  affectedArea: Coordinates;
  radius: number; // km
  startedAt: Date;
  endedAt: Date | null;
}

// --- Store Types ---

export interface KPIData {
  activeOrders: number;
  driversOnline: number;
  deliveriesCompleted: number;
  delayedDeliveries: number;
  pendingRecommendations: number;
  activeOrdersTrend: number;
  deliveriesTrend: number;
  delayedTrend: number;
}

// --- Event Bus Types ---

export type EventType =
  | "ORDER_CREATED"
  | "DRIVER_ASSIGNED"
  | "DELIVERY_COMPLETED"
  | "ALERT_TRIGGERED"
  | "DISRUPTION_DETECTED"
  | "DISRUPTION_ENDED"
  | "ROUTE_UPDATED"
  | "APPROVAL_ACTION"
  | "KPI_UPDATE"
  | "DRIVER_MOVED"
  | "ORDER_STATUS_CHANGED";

export interface BusEvent {
  type: EventType;
  payload: unknown;
  timestamp: Date;
}
