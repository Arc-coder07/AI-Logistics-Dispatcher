// ============================================================
// Driver Store — Fleet State Management
// ============================================================

import { create } from "zustand";
import {
  Driver,
  DriverStatus,
  Coordinates,
} from "@/store/types";
import {
  DRIVER_PROFILES,
  INITIAL_DRIVER_POSITIONS,
  WAREHOUSE,
} from "@/lib/simulation/locations";
import { interpolatePosition, randomBetween } from "@/lib/utils";

interface DriverStore {
  drivers: Driver[];
  initializeDrivers: () => void;
  updateDriverLocation: (driverId: string, location: Coordinates) => void;
  setDriverStatus: (driverId: string, status: DriverStatus) => void;
  assignOrder: (driverId: string, orderId: string, destination: Coordinates) => void;
  completeDelivery: (driverId: string) => void;
  incrementWorkload: (driverId: string) => void;
  decrementWorkload: (driverId: string) => void;
  getIdleDrivers: () => Driver[];
  getAvailableDrivers: () => Driver[];
  getNearestDriver: (location: Coordinates) => Driver | null;
  getLeastLoadedDriver: () => Driver | null;
  moveDriversTowardDestinations: () => void;
  setDriverOffline: (driverId: string) => void;
  setDriverOnline: (driverId: string) => void;
}

export const useDriverStore = create<DriverStore>((set, get) => ({
  drivers: [],

  initializeDrivers: () => {
    const drivers: Driver[] = DRIVER_PROFILES.map((profile, i) => ({
      ...profile,
      status: DriverStatus.IDLE,
      workload: 0,
      maxWorkload: 5,
      location: INITIAL_DRIVER_POSITIONS[i],
      destination: null,
      currentOrderId: null,
      completedDeliveries: Math.floor(Math.random() * 20) + 5,
    }));
    set({ drivers });
  },

  updateDriverLocation: (driverId, location) => {
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, location } : d
      ),
    }));
  },

  setDriverStatus: (driverId, status) => {
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, status } : d
      ),
    }));
  },

  assignOrder: (driverId, orderId, destination) => {
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId
          ? {
              ...d,
              status: DriverStatus.EN_ROUTE,
              currentOrderId: orderId,
              destination,
              workload: d.workload + 1,
            }
          : d
      ),
    }));
  },

  completeDelivery: (driverId) => {
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId
          ? {
              ...d,
              status: DriverStatus.RETURNING,
              currentOrderId: null,
              destination: WAREHOUSE.location,
              workload: Math.max(0, d.workload - 1),
              completedDeliveries: d.completedDeliveries + 1,
            }
          : d
      ),
    }));
  },

  incrementWorkload: (driverId) => {
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, workload: d.workload + 1 } : d
      ),
    }));
  },

  decrementWorkload: (driverId) => {
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId
          ? { ...d, workload: Math.max(0, d.workload - 1) }
          : d
      ),
    }));
  },

  getIdleDrivers: () => {
    return get().drivers.filter((d) => d.status === DriverStatus.IDLE);
  },

  getAvailableDrivers: () => {
    return get().drivers.filter(
      (d) =>
        d.status !== DriverStatus.OFFLINE &&
        d.workload < d.maxWorkload
    );
  },

  getNearestDriver: (location) => {
    const available = get().getAvailableDrivers().filter(
      (d) => d.status === DriverStatus.IDLE || d.status === DriverStatus.RETURNING
    );
    if (available.length === 0) return null;

    let nearest = available[0];
    let minDist = Infinity;

    for (const driver of available) {
      const dist = Math.sqrt(
        Math.pow(driver.location.lat - location.lat, 2) +
          Math.pow(driver.location.lng - location.lng, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = driver;
      }
    }
    return nearest;
  },

  getLeastLoadedDriver: () => {
    const available = get().getAvailableDrivers();
    if (available.length === 0) return null;
    return available.reduce((prev, curr) =>
      curr.workload < prev.workload ? curr : prev
    );
  },

  moveDriversTowardDestinations: () => {
    set((state) => ({
      drivers: state.drivers.map((driver) => {
        if (!driver.destination || driver.status === DriverStatus.IDLE || driver.status === DriverStatus.OFFLINE) {
          return driver;
        }

        const speed = randomBetween(0.08, 0.15);
        const newLocation = interpolatePosition(
          driver.location,
          driver.destination,
          speed
        );

        const dist = Math.sqrt(
          Math.pow(newLocation.lat - driver.destination.lat, 2) +
            Math.pow(newLocation.lng - driver.destination.lng, 2)
        );

        if (dist < 0.001) {
          if (driver.status === DriverStatus.RETURNING) {
            return {
              ...driver,
              location: driver.destination,
              destination: null,
              status: DriverStatus.IDLE,
            };
          }
          if (driver.status === DriverStatus.EN_ROUTE) {
            return {
              ...driver,
              location: driver.destination,
              status: DriverStatus.DELIVERING,
            };
          }
        }

        return { ...driver, location: newLocation };
      }),
    }));
  },

  setDriverOffline: (driverId) => {
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId
          ? { ...d, status: DriverStatus.OFFLINE, destination: null }
          : d
      ),
    }));
  },

  setDriverOnline: (driverId) => {
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.id === driverId ? { ...d, status: DriverStatus.IDLE } : d
      ),
    }));
  },
}));
