"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useDriverStore } from "@/store/driverStore";
import { useOrderStore } from "@/store/orderStore";
import { SF_CENTER, WAREHOUSE } from "@/lib/simulation/locations";
import { DriverStatus, OrderStatus } from "@/store/types";
import "leaflet/dist/leaflet.css";

// Custom icon creator
function createIcon(emoji: string, size: number = 28): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:${size}px;height:${size}px;
      font-size:${size * 0.6}px;
      background:rgba(10,10,20,0.85);
      border:1.5px solid rgba(255,255,255,0.15);
      border-radius:8px;
      backdrop-filter:blur(8px);
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
    ">${emoji}</div>`,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createDriverIcon(status: DriverStatus, initials: string): L.DivIcon {
  const colors: Record<string, string> = {
    [DriverStatus.IDLE]: "#10b981",
    [DriverStatus.EN_ROUTE]: "#3b82f6",
    [DriverStatus.DELIVERING]: "#f59e0b",
    [DriverStatus.RETURNING]: "#8b5cf6",
    [DriverStatus.OFFLINE]: "#71717a",
  };
  const color = colors[status] || "#3b82f6";

  return L.divIcon({
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:32px;height:32px;
      font-size:10px;font-weight:600;
      color:white;
      background:${color};
      border:2px solid rgba(255,255,255,0.3);
      border-radius:50%;
      box-shadow:0 0 12px ${color}60, 0 2px 8px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    ">${initials}</div>`,
    className: "driver-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// Map updater to handle re-centering
function MapUpdater() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export function FleetMap() {
  const drivers = useDriverStore((s) => s.drivers);
  const orders = useOrderStore((s) => s.orders);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0a0a0f] rounded-xl border border-white/[0.06]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-xs text-zinc-500">Loading map...</p>
        </div>
      </div>
    );
  }

  const warehouseIcon = createIcon("🏭", 32);

  // Active delivery routes
  const activeRoutes = drivers
    .filter((d) => d.destination && d.status !== DriverStatus.IDLE && d.status !== DriverStatus.OFFLINE)
    .map((d) => ({
      driverId: d.id,
      positions: [
        [d.location.lat, d.location.lng] as [number, number],
        [d.destination!.lat, d.destination!.lng] as [number, number],
      ],
      status: d.status,
    }));

  // Order pickup markers (only unassigned/newly created)
  const pendingOrders = orders.filter(
    (o) => o.status === OrderStatus.CREATED
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/[0.06]">
      <MapContainer
        center={[SF_CENTER.lat, SF_CENTER.lng]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
        style={{ background: "#0a0a0f" }}
      >
        <MapUpdater />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {/* Warehouse */}
        <Marker
          position={[WAREHOUSE.location.lat, WAREHOUSE.location.lng]}
          icon={warehouseIcon}
        >
          <Popup className="dark-popup">
            <div className="text-xs">
              <p className="font-semibold">🏭 {WAREHOUSE.name}</p>
              <p className="text-zinc-400">{WAREHOUSE.address}</p>
            </div>
          </Popup>
        </Marker>

        {/* Drivers */}
        {drivers
          .filter((d) => d.status !== DriverStatus.OFFLINE)
          .map((driver) => (
            <Marker
              key={driver.id}
              position={[driver.location.lat, driver.location.lng]}
              icon={createDriverIcon(driver.status, driver.avatar)}
            >
              <Popup className="dark-popup">
                <div className="text-xs space-y-1 min-w-[160px]">
                  <p className="font-semibold text-sm">{driver.name}</p>
                  <p className="capitalize text-zinc-400">Status: {driver.status}</p>
                  <p className="text-zinc-400">
                    Workload: {driver.workload}/{driver.maxWorkload}
                  </p>
                  <p className="text-zinc-400">
                    Completed: {driver.completedDeliveries} deliveries
                  </p>
                  <p className="text-zinc-400">Rating: {driver.rating}★</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Pending order markers */}
        {pendingOrders.map((order) => (
          <Marker
            key={order.id}
            position={[
              order.destination.location.lat,
              order.destination.location.lng,
            ]}
            icon={createIcon("📦", 24)}
          >
            <Popup className="dark-popup">
              <div className="text-xs space-y-1">
                <p className="font-semibold">{order.id}</p>
                <p className="text-zinc-400">{order.destination.address}</p>
                <p className="capitalize text-zinc-400">
                  Priority: {order.priority}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route lines */}
        {activeRoutes.map((route) => (
          <Polyline
            key={route.driverId}
            positions={route.positions}
            pathOptions={{
              color:
                route.status === DriverStatus.EN_ROUTE
                  ? "#3b82f6"
                  : route.status === DriverStatus.DELIVERING
                  ? "#f59e0b"
                  : "#8b5cf6",
              weight: 2,
              opacity: 0.6,
              dashArray: "8, 8",
            }}
          />
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-white/[0.06] bg-black/70 backdrop-blur-md p-2.5 space-y-1.5">
        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
          Legend
        </p>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-400">Idle</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-[10px] text-zinc-400">En Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span className="text-[10px] text-zinc-400">Delivering</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          <span className="text-[10px] text-zinc-400">Returning</span>
        </div>
      </div>

      {/* Driver count overlay */}
      <div className="absolute top-3 right-3 z-[1000] rounded-lg border border-white/[0.06] bg-black/70 backdrop-blur-md px-3 py-1.5">
        <p className="text-[10px] text-zinc-400">
          <span className="font-semibold text-zinc-200">
            {drivers.filter((d) => d.status !== DriverStatus.OFFLINE).length}
          </span>{" "}
          drivers active
        </p>
      </div>
    </div>
  );
}
