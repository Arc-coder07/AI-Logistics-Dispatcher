import { create } from "zustand";
import { SimulationState } from "./types";
import { eventBus } from "@/agents/eventBus";

interface SimulationStore extends SimulationState {
  setSpeed: (speed: number) => void;
  pause: () => void;
  resume: () => void;
  tickForward: (deltaSeconds: number) => void;
  reset: () => void;
}

const initialState: SimulationState = {
  speed: 1, // 1x, 2x, 5x, 10x
  isPaused: false,
  tick: 0,
  elapsedTime: 0, // seconds
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  ...initialState,

  setSpeed: (speed) => {
    set({ speed });
    eventBus.emit("SIMULATION_SPEED_CHANGED", { speed });
  },

  pause: () => {
    set({ isPaused: true });
    eventBus.emit("SIMULATION_PAUSED", null);
  },

  resume: () => {
    set({ isPaused: false });
    eventBus.emit("SIMULATION_RESUMED", null);
  },

  tickForward: (deltaSeconds) => {
    set((state) => ({
      tick: state.tick + 1,
      elapsedTime: state.elapsedTime + deltaSeconds,
    }));
  },

  reset: () => {
    set(initialState);
  },
}));
