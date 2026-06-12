// ============================================================
// Timeline Store — Live Activity Feed
// ============================================================

import { create } from "zustand";
import { TimelineEvent, TimelineEventType } from "@/store/types";
import { generateId } from "@/lib/utils";

interface TimelineStore {
  events: TimelineEvent[];
  addEvent: (event: Omit<TimelineEvent, "id" | "timestamp">) => void;
  getRecentEvents: (count: number) => TimelineEvent[];
  clearOldEvents: () => void;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  events: [],

  addEvent: (eventData) => {
    const event: TimelineEvent = {
      ...eventData,
      id: generateId("TL"),
      timestamp: new Date(),
    };
    set((state) => ({
      events: [event, ...state.events].slice(0, 100),
    }));
  },

  getRecentEvents: (count) => {
    return get().events.slice(0, count);
  },

  clearOldEvents: () => {
    set((state) => ({
      events: state.events.slice(0, 100),
    }));
  },
}));

// Helper to create timeline events
export function createTimelineEvent(
  type: TimelineEventType,
  title: string,
  description: string,
  metadata?: Record<string, string | number>
): Omit<TimelineEvent, "id" | "timestamp"> {
  return { type, title, description, metadata };
}
