"use client";

import { useState } from "react";
import { useDeliveryHistoryStore } from "@/store/deliveryHistoryStore";
import { DeliveryRecord } from "@/store/types";
import { X, Play, RotateCcw, Package, Clock, Truck, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryReplayProps {
  isExpanded?: boolean;
  onExpand?: () => void;
}

export function DeliveryReplay({ isExpanded, onExpand }: DeliveryReplayProps = {}) {
  const records = useDeliveryHistoryStore((s) => s.records);
  const displayRecords = isExpanded ? records : records.slice(0, 50);
  const [selectedRecord, setSelectedRecord] = useState<DeliveryRecord | null>(null);

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-500">
            <RotateCcw className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">Delivery Replay</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600">{records.length} records</span>
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1 hover:bg-white/[0.1] rounded text-zinc-500 hover:text-zinc-300 transition"
              title="Expand Replay"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {!selectedRecord ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
          {displayRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center text-zinc-500">
              <RotateCcw className="h-8 w-8 mb-3 opacity-20" />
              <p className="text-xs">No completed deliveries yet.</p>
              <p className="text-[10px]">History will appear here for replay.</p>
            </div>
          ) : (
            displayRecords.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="w-full text-left flex items-center justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs font-semibold text-zinc-200">
                      {record.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-400">
                      {record.order.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {record.driverName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {record.totalTime.toFixed(1)}m
                    </span>
                  </div>
                </div>
                <Play className="h-4 w-4 text-zinc-600" />
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="border-b border-white/[0.06] p-3 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-zinc-200">
                Replaying {selectedRecord.id}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400">
              {selectedRecord.events.length} events
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedRecord.events.map((event, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                  {i !== selectedRecord.events.length - 1 && (
                    <div className="w-px h-full bg-white/[0.06] mt-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-[10px] text-zinc-500 mb-0.5">
                    {event.timestamp.toLocaleTimeString()}
                  </p>
                  <p className="text-xs font-medium text-zinc-200">
                    {event.title}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
