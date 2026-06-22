import { useDriverStore } from "@/store/driverStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { DriverStatus } from "@/store/types";

export const vehicleEngine = {
  tick: () => {
    const drivers = useDriverStore.getState().drivers;
    const vehicleStore = useVehicleStore.getState();

    // Degrade all vehicles a tiny bit globally if needed, 
    // but we can just use the store's degradeAll() function
    // For realism, let's only degrade moving vehicles
    drivers.forEach((driver) => {
      if (
        driver.status === DriverStatus.EN_ROUTE ||
        driver.status === DriverStatus.DELIVERING ||
        driver.status === DriverStatus.RETURNING
      ) {
        // Assume 0.2km driven per tick
        vehicleStore.updateMileage(driver.id, 0.2);

        // Occasional random extra degradation
        if (Math.random() < 0.05) {
          // Degrading all actually degrades everyone slightly, let's just trigger it globally sometimes
          // Or we can just let the global degrade happen
        }
      }
    });

    // We can call the global degrade function on a slower tick
    if (Math.random() < 0.1) {
      vehicleStore.degradeAll();
    }
  },
};
