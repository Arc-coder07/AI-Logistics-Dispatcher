import { create } from "zustand";
import { Warehouse, Coordinates } from "./types";
import { eventBus } from "@/agents/eventBus";

interface WarehouseStore {
  warehouse: Warehouse;
  updateWarehouse: (updates: Partial<Warehouse>) => void;
  enqueuePickup: (orderId: string) => void;
  dequeuePickup: (orderId: string) => void;
}

const DEFAULT_WAREHOUSE_LOC: Coordinates = {
  lat: 37.7749, // Center of SF
  lng: -122.4194,
};

export const useWarehouseStore = create<WarehouseStore>((set, get) => ({
  warehouse: {
    id: "wh-1",
    name: "Central Logistics Hub",
    location: DEFAULT_WAREHOUSE_LOC,
    loadingQueue: [],
    pendingPickups: 0,
    utilization: 0,
    capacity: 10,
    status: "nominal",
  },

  updateWarehouse: (updates) => {
    set((state) => {
      const newWarehouse = { ...state.warehouse, ...updates };
      
      // Calculate new status based on utilization
      if (newWarehouse.utilization >= 90 && state.warehouse.status !== "bottleneck") {
        newWarehouse.status = "bottleneck";
        eventBus.emit("WAREHOUSE_BOTTLENECK", { utilization: newWarehouse.utilization });
      } else if (newWarehouse.utilization < 80 && state.warehouse.status === "bottleneck") {
        newWarehouse.status = "nominal";
      }

      return { warehouse: newWarehouse };
    });
  },

  enqueuePickup: (orderId) => {
    const state = get();
    const newQueue = [...state.warehouse.loadingQueue, orderId];
    const utilization = Math.min(100, Math.round((newQueue.length / state.warehouse.capacity) * 100));
    
    get().updateWarehouse({
      loadingQueue: newQueue,
      pendingPickups: newQueue.length,
      utilization,
    });
  },

  dequeuePickup: (orderId) => {
    const state = get();
    const newQueue = state.warehouse.loadingQueue.filter((id) => id !== orderId);
    const utilization = Math.min(100, Math.round((newQueue.length / state.warehouse.capacity) * 100));
    
    get().updateWarehouse({
      loadingQueue: newQueue,
      pendingPickups: newQueue.length,
      utilization,
    });
  },
}));
