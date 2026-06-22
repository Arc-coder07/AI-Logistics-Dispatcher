import { useWarehouseStore } from "@/store/warehouseStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { DisruptionType } from "@/store/types";

export const warehouseEngine = {
  tick: () => {
    const warehouseStore = useWarehouseStore.getState();
    const disruptionStore = useDisruptionStore.getState();

    // If warehouse failed, do not process anything
    if (disruptionStore.isActive(DisruptionType.WAREHOUSE_FAILURE)) {
      return;
    }

    // Process up to capacity per tick (or 1 item per tick for realism)
    const queue = warehouseStore.warehouse.loadingQueue;
    if (queue.length > 0) {
      // Simulate loading 1 order per tick
      const orderIdToLoad = queue[0];
      warehouseStore.dequeuePickup(orderIdToLoad);
      
      // Update order status if it was in CREATED state?
      // Actually, dispatch handles assigning. Warehouse queue might just be a metric for now.
    }
  }
};
