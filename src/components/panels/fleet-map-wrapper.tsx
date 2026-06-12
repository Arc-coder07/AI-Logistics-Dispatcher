"use client";

import dynamic from "next/dynamic";

const FleetMap = dynamic(
  () => import("@/components/panels/fleet-map").then((mod) => mod.FleetMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-xs text-zinc-500">Loading fleet map...</p>
        </div>
      </div>
    ),
  }
);

export function FleetMapWrapper() {
  return <FleetMap />;
}
