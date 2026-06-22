// ============================================================
// Vehicle Store — Fleet Health State Management
// ============================================================

import { create } from "zustand";
import { Vehicle } from "@/store/types";
import { DRIVER_PROFILES } from "@/lib/simulation/locations";

interface VehicleStore {
  vehicles: Vehicle[];
  initializeVehicles: () => void;
  degradeAll: () => void;
  refuelVehicle: (vehicleId: string) => void;
  getVehicleByDriver: (driverId: string) => Vehicle | undefined;
  updateMileage: (driverId: string, distanceKm: number) => void;
}

function computeRiskScore(vehicle: Vehicle): number {
  const fuelRisk = Math.max(0, (30 - vehicle.fuelLevel) * 1.5); // 0-45 when fuel < 30%
  const engineRisk = Math.max(0, (50 - vehicle.engineHealth) * 0.8); // 0-40 when engine < 50
  const mileageRisk = Math.min(15, vehicle.lastMaintenance / 200); // 0-15 based on km since maintenance
  return Math.min(100, fuelRisk + engineRisk + mileageRisk);
}

const DEGRADATION_RATES: Record<string, { fuel: number; engine: number }> = {
  Van: { fuel: 0.12, engine: 0.04 },
  Truck: { fuel: 0.18, engine: 0.06 },
  Sedan: { fuel: 0.08, engine: 0.03 },
};

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],

  initializeVehicles: () => {
    const vehicles: Vehicle[] = DRIVER_PROFILES.map((profile) => ({
      id: `VEH-${profile.id}`,
      driverId: profile.id,
      driverName: profile.name,
      type: profile.vehicleType,
      fuelLevel: 70 + Math.random() * 30, // 70-100%
      mileage: Math.floor(Math.random() * 80000) + 20000,
      batteryLevel: 60 + Math.random() * 40, // 60-100%
      engineHealth: 65 + Math.random() * 35, // 65-100%
      riskScore: 0,
      lastMaintenance: Math.floor(Math.random() * 2000),
      distanceSinceRefuel: Math.floor(Math.random() * 200),
    }));

    // Compute initial risk scores
    const vehiclesWithRisk = vehicles.map((v) => ({
      ...v,
      riskScore: computeRiskScore(v),
    }));

    set({ vehicles: vehiclesWithRisk });
  },

  degradeAll: () => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => {
        const rate = DEGRADATION_RATES[v.type] ?? DEGRADATION_RATES.Van;
        const newFuel = Math.max(0, v.fuelLevel - rate.fuel * (0.8 + Math.random() * 0.4));
        const newEngine = Math.max(0, v.engineHealth - rate.engine * (0.8 + Math.random() * 0.4));
        const newMileage = v.mileage + Math.random() * 2;
        const newLastMaintenance = v.lastMaintenance + Math.random() * 2;

        const updated: Vehicle = {
          ...v,
          fuelLevel: newFuel,
          engineHealth: newEngine,
          mileage: newMileage,
          lastMaintenance: newLastMaintenance,
          distanceSinceRefuel: v.distanceSinceRefuel + Math.random() * 2,
        };

        return { ...updated, riskScore: computeRiskScore(updated) };
      }),
    }));
  },

  refuelVehicle: (vehicleId) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => {
        if (v.id !== vehicleId) return v;
        const updated = { ...v, fuelLevel: 100, distanceSinceRefuel: 0 };
        return { ...updated, riskScore: computeRiskScore(updated) };
      }),
    }));
  },

  getVehicleByDriver: (driverId) => {
    return get().vehicles.find((v) => v.driverId === driverId);
  },

  updateMileage: (driverId, distanceKm) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => {
        if (v.driverId !== driverId) return v;
        const updated = {
          ...v,
          mileage: v.mileage + distanceKm,
          lastMaintenance: v.lastMaintenance + distanceKm,
          distanceSinceRefuel: v.distanceSinceRefuel + distanceKm,
        };
        return { ...updated, riskScore: computeRiskScore(updated) };
      }),
    }));
  },
}));
