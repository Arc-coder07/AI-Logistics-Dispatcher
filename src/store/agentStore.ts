// ============================================================
// Agent Store — Agent States, Decision Feed & Collaboration Chains
// ============================================================

import { create } from "zustand";
import { AgentDecision, AgentName, CollaborationChain } from "@/store/types";
import { generateId } from "@/lib/utils";

export type AgentStatus = "idle" | "thinking" | "acting" | "complete";

export interface AgentState {
  name: AgentName;
  status: AgentStatus;
  lastAction: string;
  lastActionAt: Date | null;
  decisionCount: number;
  color: string;
  icon: string;
  description: string;
}

interface AgentStore {
  agents: Record<AgentName, AgentState>;
  decisions: AgentDecision[];
  chains: CollaborationChain[];
  activeChainId: string | null;

  // Agent state management
  setAgentStatus: (name: AgentName, status: AgentStatus, lastAction?: string) => void;

  // Decision recording
  addDecision: (decision: Omit<AgentDecision, "id" | "timestamp" | "status"> & { status?: AgentDecision["status"] }) => AgentDecision;
  updateDecisionStatus: (decisionId: string, status: AgentDecision["status"]) => void;

  // Collaboration chains
  startChain: (trigger: CollaborationChain["trigger"]) => string; // returns chainId
  addStepToChain: (chainId: string, decision: AgentDecision) => void;
  completeChain: (chainId: string) => void;
  failChain: (chainId: string) => void;
  getActiveChain: () => CollaborationChain | null;

  // Queries
  getRecentDecisions: (count: number) => AgentDecision[];
  getDecisionsByAgent: (agentName: AgentName) => AgentDecision[];
}

const AGENT_META: Record<AgentName, { color: string; icon: string; description: string }> = {
  [AgentName.DISPATCH]: {
    color: "#10b981",
    icon: "🚀",
    description: "Assigns drivers to orders using multi-factor scoring",
  },
  [AgentName.ROUTE]: {
    color: "#3b82f6",
    icon: "🗺️",
    description: "Optimizes routes and calculates rerouting alternatives",
  },
  [AgentName.DELAY]: {
    color: "#f59e0b",
    icon: "⏱️",
    description: "Predicts delivery delay risks and escalates to route agent",
  },
  [AgentName.FLEET]: {
    color: "#8b5cf6",
    icon: "🚚",
    description: "Monitors vehicle health and predicts maintenance needs",
  },
  [AgentName.OPERATIONS]: {
    color: "#06b6d4",
    icon: "📊",
    description: "Generates business insights and SLA performance analysis",
  },
  [AgentName.COMMUNICATION]: {
    color: "#ec4899",
    icon: "💬",
    description: "Synthesizes all agent data for operator and customer updates",
  },
  [AgentName.MONITORING]: {
    color: "#f97316",
    icon: "👁️",
    description: "Continuously scans for anomalies and operational issues",
  },
};

const buildInitialAgents = (): Record<AgentName, AgentState> => {
  const agents = {} as Record<AgentName, AgentState>;
  for (const name of Object.values(AgentName)) {
    agents[name] = {
      name,
      status: "idle",
      lastAction: "Waiting for events",
      lastActionAt: null,
      decisionCount: 0,
      ...AGENT_META[name],
    };
  }
  return agents;
};

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: buildInitialAgents(),
  decisions: [],
  chains: [],
  activeChainId: null,

  setAgentStatus: (name, status, lastAction) => {
    set((state) => ({
      agents: {
        ...state.agents,
        [name]: {
          ...state.agents[name],
          status,
          lastAction: lastAction ?? state.agents[name].lastAction,
          lastActionAt: status !== "idle" ? new Date() : state.agents[name].lastActionAt,
        },
      },
    }));
  },

  addDecision: (decisionData) => {
    const decision: AgentDecision = {
      ...decisionData,
      id: generateId("DEC"),
      timestamp: new Date(),
      status: decisionData.status ?? "complete",
    };

    set((state) => ({
      decisions: [decision, ...state.decisions].slice(0, 200),
      agents: {
        ...state.agents,
        [decision.agentName]: {
          ...state.agents[decision.agentName],
          decisionCount: state.agents[decision.agentName].decisionCount + 1,
          lastAction: decision.action,
          lastActionAt: new Date(),
          status: "complete",
        },
      },
    }));

    return decision;
  },

  updateDecisionStatus: (decisionId, status) => {
    set((state) => ({
      decisions: state.decisions.map((d) =>
        d.id === decisionId ? { ...d, status } : d
      ),
    }));
  },

  startChain: (trigger) => {
    const chainId = generateId("CHN");
    const chain: CollaborationChain = {
      id: chainId,
      trigger,
      steps: [],
      startedAt: new Date(),
      completedAt: null,
      status: "active",
    };
    set((state) => ({
      chains: [chain, ...state.chains].slice(0, 50),
      activeChainId: chainId,
    }));
    return chainId;
  },

  addStepToChain: (chainId, decision) => {
    set((state) => ({
      chains: state.chains.map((c) =>
        c.id === chainId
          ? { ...c, steps: [...c.steps, decision] }
          : c
      ),
    }));
  },

  completeChain: (chainId) => {
    set((state) => ({
      chains: state.chains.map((c) =>
        c.id === chainId
          ? { ...c, status: "complete", completedAt: new Date() }
          : c
      ),
      activeChainId: state.activeChainId === chainId ? null : state.activeChainId,
    }));
  },

  failChain: (chainId) => {
    set((state) => ({
      chains: state.chains.map((c) =>
        c.id === chainId ? { ...c, status: "failed", completedAt: new Date() } : c
      ),
      activeChainId: state.activeChainId === chainId ? null : state.activeChainId,
    }));
  },

  getActiveChain: () => {
    const { chains, activeChainId } = get();
    return chains.find((c) => c.id === activeChainId) ?? null;
  },

  getRecentDecisions: (count) => {
    return get().decisions.slice(0, count);
  },

  getDecisionsByAgent: (agentName) => {
    return get().decisions.filter((d) => d.agentName === agentName);
  },
}));

export { AGENT_META };
