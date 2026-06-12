// ============================================================
// Central Event Bus — Inter-Agent Communication
// ============================================================

import { BusEvent, EventType } from "@/store/types";

type EventHandler = (event: BusEvent) => void;

class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private allHandlers: Set<EventHandler> = new Set();

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

  clear(): void {
    this.handlers.clear();
    this.allHandlers.clear();
  }
}

export const eventBus = new EventBus();
