// ============================================================
// Central Event Bus — Inter-Agent Communication (v2)
// History buffer + typed subscribers
// ============================================================

import { BusEvent, EventType } from "@/store/types";

type EventHandler = (event: BusEvent) => void;

const HISTORY_LIMIT = 500;

class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private allHandlers: Set<EventHandler> = new Set();
  private history: BusEvent[] = [];

  on(type: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  onAll(handler: EventHandler): () => void {
    this.allHandlers.add(handler);
    return () => this.allHandlers.delete(handler);
  }

  emit(type: EventType, payload: unknown): void {
    const event: BusEvent = { type, payload, timestamp: new Date() };

    // Store in history buffer
    this.history.unshift(event);
    if (this.history.length > HISTORY_LIMIT) {
      this.history = this.history.slice(0, HISTORY_LIMIT);
    }

    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (e) {
          console.error(`[EventBus] Error in handler for ${type}:`, e);
        }
      });
    }

    this.allHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (e) {
        console.error(`[EventBus] Error in global handler:`, e);
      }
    });
  }

  /** Returns all events in history, newest first */
  getHistory(): BusEvent[] {
    return [...this.history];
  }

  /** Returns events of a specific type, newest first */
  getEventsByType(type: EventType): BusEvent[] {
    return this.history.filter((e) => e.type === type);
  }

  /** Returns the most recent N events */
  getRecentEvents(count: number): BusEvent[] {
    return this.history.slice(0, count);
  }

  clear(): void {
    this.handlers.clear();
    this.allHandlers.clear();
    this.history = [];
  }
}

export const eventBus = new EventBus();
