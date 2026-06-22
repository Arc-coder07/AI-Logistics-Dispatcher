import { useDisruptionStore } from "@/store/disruptionStore";
import { DisruptionType } from "@/store/types";

// The traffic engine handles modifying global or regional traffic conditions
// based on disruptions and time of day.
export const trafficEngine = {
  tick: () => {
    // In a full implementation, this would adjust zone-based speeds
    // For now, we mainly check for disruptions that affect the global traffic modifier.
    // The driver store can read this state to determine movement speed.
    
    // We could store traffic state in a new trafficStore or just apply penalties 
    // dynamically when moving drivers in the driverEngine.
    // For now, this is a placeholder for the periodic evaluation of traffic.
    const disruptionStore = useDisruptionStore.getState();
    const trafficJamActive = disruptionStore.isActive(DisruptionType.TRAFFIC_JAM);
    const heavyRainActive = disruptionStore.isActive(DisruptionType.HEAVY_RAIN);
    
    // We can emit events or update a global traffic state
    // Let's assume DriverEngine will check disruptions directly for now
    // But this engine ensures periodic updates to any traffic-specific store if we add one.
  }
};
