import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { useTimelineStore } from "@/store/timelineStore";
import { useDeliveryHistoryStore } from "@/store/deliveryHistoryStore";
import { DriverStatus, OrderStatus, TimelineEventType, AgentName } from "@/store/types";
import { dispatchAgent } from "@/agents/dispatchAgent";

export const driverEngine = {
  tick: () => {
    // Move drivers towards their destinations
    useDriverStore.getState().moveDriversTowardDestinations();

    // Distance-based delivery completion check
    const drivers = useDriverStore.getState().drivers;
    drivers.forEach((driver) => {
      if (
        driver.status === DriverStatus.DELIVERING &&
        driver.destination &&
        Math.random() < 0.25 // slight randomness to stagger completions in the same tick
      ) {
        // Complete delivery in driver store
        useDriverStore.getState().completeDelivery(driver.id);

        if (driver.currentOrderId) {
          const orderStore = useOrderStore.getState();
          orderStore.updateOrderStatus(driver.currentOrderId, OrderStatus.DELIVERED);

          // Get the completed order for history
          const order = orderStore.orders.find((o) => o.id === driver.currentOrderId);
          
          if (order) {
            const timelineStore = useTimelineStore.getState();
            const events = timelineStore.events.filter(
              (e) => e.title.includes(order.id) || e.description.includes(order.id)
            );
            
            const now = new Date();
            const totalTime = (now.getTime() - order.createdAt.getTime()) / 60000;
            
            useDeliveryHistoryStore.getState().addRecord({
              id: order.id,
              order,
              driverId: driver.id,
              driverName: driver.name,
              events,
              startedAt: order.createdAt,
              completedAt: now,
              totalTime,
              delayDuration: 0, // Placeholder, can be calculated based on ETA vs actual
            });

            timelineStore.addEvent({
              type: TimelineEventType.DELIVERY_COMPLETED,
              title: "Delivery Completed",
              description: `${driver.name} completed delivery ${order.id}`,
              agentSource: AgentName.DISPATCH,
            });
          }
        }
      }
    });
  },
};
