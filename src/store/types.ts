// ============================================================
// AI Logistics Dispatcher — Core Type Definitions (v2)
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
  MAINTENANCE = "maintenance",
  WAREHOUSE = "warehouse",
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
  WAREHOUSE_FAILURE = "warehouse-failure",
  DRIVER_STRIKE = "driver-strike",
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
  AGENT_DECISION = "agent-decision",
  DELAY_DETECTED = "delay-detected",
  VEHICLE_ALERT = "vehicle-alert",
  INSIGHT_GENERATED = "insight-generated",
}

export enum AgentName {
  DISPATCH = "Dispatch Agent",
  ROUTE = "Route Agent",
  DELAY = "Delay Agent",
  FLEET = "Fleet Agent",
  OPERATIONS = "Operations Agent",
  COMMUNICATION = "Communication Agent",
  MONITORING = "Monitoring Agent",
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
  assignedAt?: Date | null; // when current delivery was assigned
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
  assignedAt: Date | null;
  aiReasoning: string | null;
  customerName: string;
  packageType: string;
  delayRisk?: number; // 0-100 percentage from DelayAgent
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
  agentSource?: AgentName;
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
  metadata?: Record<string, string | number>;
  agentSource?: AgentName;
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentsSources?: AgentName[];
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

// --- Agent Decision Types ---

export interface AgentDecision {
  id: string;
  agentName: AgentName;
  action: string;
  reasoning: string;
  confidence: number; // 0-100
  impact: string;
  timestamp: Date;
  relatedEntities: string[]; // order IDs, driver IDs, etc.
  triggeredBy?: string; // ID of decision that triggered this one
  chainId?: string; // ID of collaboration chain this belongs to
  status: "thinking" | "acting" | "complete" | "failed";
}

export interface CollaborationChain {
  id: string;
  trigger: {
    agentName: AgentName;
    event: string;
    description: string;
  };
  steps: AgentDecision[];
  startedAt: Date;
  completedAt: Date | null;
  status: "active" | "complete" | "failed";
}

// --- Vehicle Types ---

export interface Vehicle {
  id: string; // matches driver id
  driverId: string;
  driverName: string;
  type: string; // Van, Truck, Sedan
  fuelLevel: number; // 0-100%
  mileage: number; // km driven total
  batteryLevel: number; // 0-100% (for electric metrics)
  engineHealth: number; // 0-100%
  riskScore: number; // 0-100% (computed from above)
  lastMaintenance: number; // km ago
  distanceSinceRefuel: number; // km since last refuel
}

// --- KPI & Analytics ---

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

export interface DriverPerformance {
  driverId: string;
  driverName: string;
  onTimePercent: number; // 0-100
  avgETAAccuracy: number; // minutes variance
  rating: number; // 1-5
  fuelEfficiency: number; // 0-100 score
  score: number; // 0-100 overall computed score
}

// --- Simulation & Digital Twin Types ---

export interface SimulationState {
  speed: number;
  isPaused: boolean;
  tick: number;
  elapsedTime: number; // in seconds of simulation time
}

export interface Warehouse {
  id: string;
  name: string;
  location: Coordinates;
  loadingQueue: string[]; // Order IDs waiting for pickup
  pendingPickups: number;
  utilization: number; // 0-100 percentage
  capacity: number; // max concurrent loadings
  status: "nominal" | "bottleneck" | "failure";
}

export interface DeliveryRecord {
  id: string; // the order ID
  order: Order;
  driverId: string;
  driverName: string;
  events: TimelineEvent[];
  startedAt: Date;
  completedAt: Date;
  totalTime: number; // minutes
  delayDuration: number; // minutes
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
  | "ORDER_STATUS_CHANGED"
  | "DELAY_RISK_DETECTED"
  | "VEHICLE_RISK_DETECTED"
  | "MAINTENANCE_RECOMMENDED"
  | "INSIGHT_GENERATED"
  | "REROUTE_CALCULATED"
  | "AGENT_DECISION_MADE"
  | "COLLABORATION_CHAIN_STARTED"
  | "COLLABORATION_CHAIN_COMPLETED"
  | "SIMULATION_PAUSED"
  | "SIMULATION_RESUMED"
  | "SIMULATION_SPEED_CHANGED"
  | "WAREHOUSE_BOTTLENECK"
  | "DELIVERY_RECORD_SAVED";

export interface BusEvent {
  type: EventType;
  payload: unknown;
  timestamp: Date;
}
