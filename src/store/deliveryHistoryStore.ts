import { create } from "zustand";
import { DeliveryRecord } from "./types";
import { eventBus } from "@/agents/eventBus";

interface DeliveryHistoryStore {
  records: DeliveryRecord[];
  addRecord: (record: DeliveryRecord) => void;
  getRecordsByDriver: (driverId: string) => DeliveryRecord[];
  getAllRecords: () => DeliveryRecord[];
}

export const useDeliveryHistoryStore = create<DeliveryHistoryStore>((set, get) => ({
  records: [],

  addRecord: (record) => {
    set((state) => ({
      records: [record, ...state.records].slice(0, 100), // Keep last 100 records
    }));
    eventBus.emit("DELIVERY_RECORD_SAVED", { recordId: record.id });
  },

  getRecordsByDriver: (driverId) => {
    return get().records.filter((r) => r.driverId === driverId);
  },

  getAllRecords: () => {
    return get().records;
  },
}));
