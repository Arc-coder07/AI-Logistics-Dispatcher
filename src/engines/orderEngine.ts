import { useOrderStore } from "@/store/orderStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useDisruptionStore } from "@/store/disruptionStore";
import { useWarehouseStore } from "@/store/warehouseStore";
import { TimelineEventType, DisruptionType } from "@/store/types";
import { dispatchAgent } from "@/agents/dispatchAgent";

let ticksSinceLastOrder = 0;

export const orderEngine = {
  tick: () => {
    const disruptionStore = useDisruptionStore.getState();
    const demandSpikeActive = disruptionStore.isActive(DisruptionType.DEMAND_SPIKE);
    const warehouseFailureActive = disruptionStore.isActive(DisruptionType.WAREHOUSE_FAILURE);
    
    // If warehouse failed, no orders can be processed
    if (warehouseFailureActive) {
      return;
    }

    // Default tick rate for order generation. Say 1 order every 10-15 ticks.
    // Ticks run ~1 per second. So an order every 12 seconds in real time (at 1x speed).
    const targetTicks = demandSpikeActive ? 5 : 12;
    ticksSinceLastOrder++;

    if (ticksSinceLastOrder >= targetTicks) {
      ticksSinceLastOrder = 0;
      
      const oStore = useOrderStore.getState();
      const order = oStore.generateOrder();
      oStore.addOrder(order);

      // Add to warehouse loading queue
      useWarehouseStore.getState().enqueuePickup(order.id);

      useTimelineStore.getState().addEvent({
        type: TimelineEventType.ORDER_CREATED,
        title: "Order Created",
        description: `${order.id} — ${order.packageType} (${order.priority})`,
      });

      // Dispatch after a simulated delay (1-2 ticks)
      setTimeout(() => {
        dispatchAgent.dispatch(order);
        useWarehouseStore.getState().dequeuePickup(order.id);
      }, 1500); // We'll keep the timeout, or we could handle it via tick counters
    }
  }
};
