// ============================================================
// Copilot Store — AI Chat Panel State
// ============================================================

import { create } from "zustand";
import { CopilotMessage } from "@/store/types";
import { generateId } from "@/lib/utils";

interface CopilotStore {
  messages: CopilotMessage[];
  isTyping: boolean;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useCopilotStore = create<CopilotStore>((set) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Welcome to AI Logistics Copilot. I'm monitoring all operations in real-time. Ask me anything about fleet status, deliveries, or disruptions.",
      timestamp: new Date(),
    },
  ],
  isTyping: false,

  addUserMessage: (content) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: generateId("MSG"),
          role: "user",
          content,
          timestamp: new Date(),
        },
      ],
    }));
  },

  addAssistantMessage: (content) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: generateId("MSG"),
          role: "assistant",
          content,
          timestamp: new Date(),
        },
      ],
      isTyping: false,
    }));
  },

  setTyping: (typing) => {
    set({ isTyping: typing });
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "👋 Chat cleared. I'm still monitoring all operations. How can I help?",
          timestamp: new Date(),
        },
      ],
    });
  },
}));
