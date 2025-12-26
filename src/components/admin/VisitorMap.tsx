"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface LocationData {
  country: string;
  countryCode: string;
  city: string;
  count: number;
  latitude: number;
  longitude: number;
}

interface VisitorMapProps {
  locations: LocationData[];
}

export function VisitorMap({ locations }: VisitorMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[500px] w-full animate-pulse rounded-xl bg-warm-800/30">
        <div className="flex h-full items-center justify-center text-warm-500">
          Loading map...
        </div>
      </div>
    );
  }

  const center: LatLngExpression = [20, 0]; // Center of world
  const maxCount = Math.max(...locations.map((l) => l.count));

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-xl border border-warm-700/30">
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        scrollWheelZoom={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => {
          const size = Math.max(
            10,
            Math.min(40, (location.count / maxCount) * 40)
          );
          const opacity = Math.max(0.4, (location.count / maxCount) * 0.9);

          return (
            <CircleMarker
              key={`${location.city}-${location.countryCode}`}
              center={[location.latitude, location.longitude]}
              radius={size}
              fillColor="#f97316"
              color="#ea580c"
              weight={2}
              opacity={opacity}
              fillOpacity={opacity * 0.6}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{location.city}</div>
                  <div className="text-xs text-warm-500">{location.country}</div>
                  <div className="mt-1 text-warm-600">
                    {location.count} {location.count === 1 ? "visit" : "visits"}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
