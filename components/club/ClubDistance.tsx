"use client";

import { Route } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * "x km away" for the club page. Only reads the position when the visitor has
 * already granted location (on the listing page), so this never prompts.
 */

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function useDistanceKm(latitude: number | null, longitude: number | null) {
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  useEffect(() => {
    if (latitude == null || longitude == null) return;
    if (!navigator.geolocation || !navigator.permissions) return;

    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (cancelled || status.state !== "granted") return;
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (cancelled) return;
            setDistanceKm(
              getDistanceKm(pos.coords.latitude, pos.coords.longitude, latitude, longitude)
            );
          },
          () => {},
          { maximumAge: 5 * 60 * 1000, timeout: 10000 }
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  return distanceKm;
}

export default function ClubDistance({
  latitude,
  longitude,
  variant,
}: {
  latitude: number | null;
  longitude: number | null;
  variant: "chip" | "line";
}) {
  const distanceKm = useDistanceKm(latitude, longitude);
  if (distanceKm == null) return null;

  if (variant === "chip") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#FAF8F5] px-3 py-1.5">
        <Route size={13} className="text-[#9A6200]" />
        <span className="text-[13px] font-semibold text-[#16386F]">
          {distanceKm.toFixed(1)} km away
        </span>
      </span>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-1.5">
      <Route size={16} className="text-[#9A6200]" />
      <span className="text-[14px] font-semibold text-[#16386F]">
        {distanceKm.toFixed(1)} km from you
      </span>
    </div>
  );
}
