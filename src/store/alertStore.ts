// ============================================================
// Alert Store — AI Alert & Human Approval Workflow
// ============================================================

import { create } from "zustand";
import {
  Alert,
  AlertType,
  AlertSeverity,
  AlertActionStatus,
} from "@/store/types";
import { generateId } from "@/lib/utils";

interface AlertStore {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id" | "createdAt" | "actionStatus" | "resolvedAt" | "resolvedBy">) => Alert;
  approveAlert: (alertId: string) => void;
  rejectAlert: (alertId: string) => void;
  getPendingAlerts: () => Alert[];
  getResolvedAlerts: () => Alert[];
  getAlertsByType: (type: AlertType) => Alert[];
  getAlertsBySeverity: (severity: AlertSeverity) => Alert[];
  clearOldAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: [],

  addAlert: (alertData) => {
    const alert: Alert = {
      ...alertData,
      id: generateId("ALT"),
      actionStatus: AlertActionStatus.PENDING,
      createdAt: new Date(),
      resolvedAt: null,
      resolvedBy: null,
    };
    set((state) => ({ alerts: [alert, ...state.alerts] }));
    return alert;
  },

  approveAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              actionStatus: AlertActionStatus.APPROVED,
              resolvedAt: new Date(),
              resolvedBy: "Operator",
            }
          : a
      ),
    }));
  },

  rejectAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              actionStatus: AlertActionStatus.REJECTED,
              resolvedAt: new Date(),
              resolvedBy: "Operator",
            }
          : a
      ),
    }));
  },

  getPendingAlerts: () => {
    return get().alerts.filter(
      (a) => a.actionStatus === AlertActionStatus.PENDING
    );
  },

  getResolvedAlerts: () => {
    return get().alerts.filter(
      (a) => a.actionStatus !== AlertActionStatus.PENDING
    );
  },

  getAlertsByType: (type) => {
    return get().alerts.filter((a) => a.type === type);
  },

  getAlertsBySeverity: (severity) => {
    return get().alerts.filter((a) => a.severity === severity);
  },

  clearOldAlerts: () => {
    set((state) => ({
      alerts: state.alerts.slice(0, 30),
    }));
  },
}));
