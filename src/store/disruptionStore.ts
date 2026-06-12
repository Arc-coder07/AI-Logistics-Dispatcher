// ============================================================
// Disruption Store — Simulation Controls
// ============================================================

import { create } from "zustand";
import { DisruptionType } from "@/store/types";

interface Disruption {
  type: DisruptionType;
  active: boolean;
  label: string;
  icon: string;
  description: string;
}

interface DisruptionStore {
  disruptions: Disruption[];
  toggleDisruption: (type: DisruptionType) => void;
  getActiveDisruptions: () => Disruption[];
  isActive: (type: DisruptionType) => boolean;
}

export const useDisruptionStore = create<DisruptionStore>((set, get) => ({
  disruptions: [
    {
      type: DisruptionType.TRAFFIC_JAM,
      active: false,
      label: "Traffic Jam",
      icon: "🚧",
      description: "Simulates heavy traffic congestion in downtown area",
    },
    {
      type: DisruptionType.HEAVY_RAIN,
      active: false,
      label: "Heavy Rain",
      icon: "🌧",
      description: "Simulates severe weather affecting all deliveries",
    },
    {
      type: DisruptionType.VEHICLE_BREAKDOWN,
      active: false,
      label: "Vehicle Breakdown",
      icon: "🚚",
      description: "Simulates a random vehicle mechanical failure",
    },
    {
      type: DisruptionType.DEMAND_SPIKE,
      active: false,
      label: "Demand Spike",
      icon: "📈",
      description: "Simulates sudden increase in delivery requests",
    },
    {
      type: DisruptionType.ROAD_CLOSURE,
      active: false,
      label: "Road Closure",
      icon: "⛔",
      description: "Simulates a major road closure requiring reroutes",
    },
  ],

  toggleDisruption: (type) => {
    set((state) => ({
      disruptions: state.disruptions.map((d) =>
        d.type === type ? { ...d, active: !d.active } : d
      ),
    }));
  },

  getActiveDisruptions: () => {
    return get().disruptions.filter((d) => d.active);
  },

  isActive: (type) => {
    return get().disruptions.find((d) => d.type === type)?.active || false;
  },
}));
