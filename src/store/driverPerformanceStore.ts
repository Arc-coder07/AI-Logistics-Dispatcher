// ============================================================
// Driver Performance Store
// ============================================================

import { create } from "zustand";
import { DriverPerformance } from "@/store/types";
import { DRIVER_PROFILES } from "@/lib/simulation/locations";

interface DriverPerformanceStore {
  performances: DriverPerformance[];
  initializePerformances: () => void;
  updatePerformance: (driverId: string, updates: Partial<DriverPerformance>) => void;
}

export const useDriverPerformanceStore = create<DriverPerformanceStore>((set) => ({
  performances: [],

  initializePerformances: () => {
    const performances: DriverPerformance[] = DRIVER_PROFILES.map((profile) => {
      const baseRating = 4.0 + Math.random() * 0.9;
      const baseOnTime = 80 + Math.random() * 18;
      const baseFuelEfficiency = 85 + Math.random() * 12;
      const baseScore = (baseRating / 5) * 40 + (baseOnTime / 100) * 40 + (baseFuelEfficiency / 100) * 20;

      return {
        driverId: profile.id,
        driverName: profile.name,
        onTimePercent: baseOnTime,
        avgETAAccuracy: 2 + Math.random() * 5, // minutes variance
        rating: baseRating,
        fuelEfficiency: baseFuelEfficiency,
        score: baseScore,
      };
    });

    set({ performances });
  },

  updatePerformance: (driverId, updates) => {
    set((state) => ({
      performances: state.performances.map((p) => {
        if (p.driverId !== driverId) return p;
        const updated = { ...p, ...updates };
        updated.score = (updated.rating / 5) * 40 + (updated.onTimePercent / 100) * 40 + (updated.fuelEfficiency / 100) * 20;
        return updated;
      }),
    }));
  },
}));
