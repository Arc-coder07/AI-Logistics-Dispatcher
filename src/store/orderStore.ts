// ============================================================
// Order Store — Order Lifecycle Management
// ============================================================

import { create } from "zustand";
import { Order, OrderPriority, OrderStatus } from "@/store/types";
import {
  DELIVERY_POINTS,
  WAREHOUSE,
  CUSTOMER_NAMES,
  PACKAGE_TYPES,
} from "@/lib/simulation/locations";
import { generateId, pickRandom } from "@/lib/utils";

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  generateOrder: () => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDriver: (orderId: string, driverId: string, driverName: string, reasoning: string) => void;
  updateOrderDelayRisk: (orderId: string, riskScore: number) => void;
  getActiveOrders: () => Order[];
  getDelayedOrders: () => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrdersByPriority: (priority: OrderPriority) => Order[];
  removeOldDelivered: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  addOrder: (order) => {
    set((state) => ({ orders: [order, ...state.orders] }));
  },

  generateOrder: () => {
    const pickup = pickRandom([WAREHOUSE, ...DELIVERY_POINTS.slice(0, 5)]);
    let destination = pickRandom(DELIVERY_POINTS);
    while (
      destination.location.lat === pickup.location.lat &&
      destination.location.lng === pickup.location.lng
    ) {
      destination = pickRandom(DELIVERY_POINTS);
    }

    const priorityRoll = Math.random();
    let priority: OrderPriority;
    if (priorityRoll < 0.1) priority = OrderPriority.CRITICAL;
    else if (priorityRoll < 0.35) priority = OrderPriority.HIGH;
    else priority = OrderPriority.NORMAL;

    const order: Order = {
      id: generateId("ORD"),
      pickup: {
        location: pickup.location,
        address: pickup.address || pickup.name,
      },
      destination: {
        location: destination.location,
        address: destination.address,
      },
      priority,
      status: OrderStatus.CREATED,
      assignedDriverId: null,
      assignedDriverName: null,
      eta: Math.floor(Math.random() * 30) + 10,
      createdAt: new Date(),
      assignedAt: null,
      aiReasoning: null,
      customerName: pickRandom(CUSTOMER_NAMES),
      packageType: pickRandom(PACKAGE_TYPES),
      delayRisk: 0,
    };

    return order;
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    }));
  },

  assignDriver: (orderId, driverId, driverName, reasoning) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: OrderStatus.ASSIGNED,
              assignedDriverId: driverId,
              assignedDriverName: driverName,
              aiReasoning: reasoning,
              assignedAt: new Date(),
            }
          : o
      ),
    }));
  },

  updateOrderDelayRisk: (orderId, riskScore) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, delayRisk: riskScore } : o
      ),
    }));
  },

  getActiveOrders: () => {
    return get().orders.filter(
      (o) =>
        o.status !== OrderStatus.DELIVERED
    );
  },

  getDelayedOrders: () => {
    return get().orders.filter((o) => o.status === OrderStatus.DELAYED);
  },

  getOrdersByStatus: (status) => {
    return get().orders.filter((o) => o.status === status);
  },

  getOrdersByPriority: (priority) => {
    return get().orders.filter((o) => o.priority === priority);
  },

  removeOldDelivered: () => {
    set((state) => ({
      orders: state.orders
        .filter((o) => {
          if (o.status === OrderStatus.DELIVERED) {
            const age = Date.now() - o.createdAt.getTime();
            return age < 5 * 60 * 1000;
          }
          return true;
        })
        .slice(0, 50),
    }));
  },
}));
