import { create } from "zustand";

interface PredictionCard {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  confidence: number;
}

interface AnalyticsStore {
  predictions: PredictionCard[];
  updatePredictions: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  predictions: [
    { id: "p-orders", label: "Predicted Orders (Next Hr)", value: "42", trend: "up", confidence: 88 },
    { id: "p-drivers", label: "Driver Demand", value: "High", trend: "up", confidence: 92 },
    { id: "p-delay", label: "Global Delay Risk", value: "14%", trend: "stable", confidence: 76 },
    { id: "p-congestion", label: "Congestion Forecast", value: "Moderate", trend: "stable", confidence: 81 },
  ],

  updatePredictions: () => {
    set((state) => ({
      predictions: state.predictions.map((p) => {
        // Just add some random variance for the simulation
        if (p.id === "p-orders") {
          const val = parseInt(p.value) + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5);
          return { ...p, value: Math.max(10, val).toString(), trend: val > parseInt(p.value) ? "up" : "down" };
        }
        if (p.id === "p-delay") {
          const val = parseInt(p.value) + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
          return { ...p, value: `${Math.max(5, val)}%`, trend: val > parseInt(p.value) ? "up" : "down" };
        }
        return p;
      }),
    }));
  },
}));
