"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createClient } from "../lib/supabase";
import ClubCard from "@/components/club/ClubCard";
import ExperienceIcon from "@/components/club/ExperienceIcon";

type Club = {
  id: string;
  name: string;
  city: string | null;
  area: string | null;
  cover_image: string | null;
  images: string | null;
  services: string | null;
  rating: number | null;
  review_count: number | null;
  latitude: number | null;
  longitude: number | null;
  boarding_price: number | null;
  daycare_price: number | null;
  pool_price: number | null;
  grooming_price: number | null;
  cafe_price: number | null;
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

type ClubWithDistance = Club & {
  distanceKm: number | null;
};

// Two modes, and the control flips between them — same as the app.
type SortMode = "distance" | "rating";

const supabase = createClient();

let cachedClubs: Club[] | null = null;
let cachedUserLocation: UserLocation | null = null;

// Same experiences, in the same order, as the app's Discover screen.
const EXPERIENCES = [
  "Daycare",
  "Boarding",
  "Pool",
  "Park",
  "Cafe",
  "Grooming",
  "Play School",
  "Events",
];

function splitServices(services: string | null) {
  if (!services) return [];
  return services
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  userLat: number,
  userLng: number,
  clubLat: number,
  clubLng: number
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(clubLat - userLat);
  const dLng = toRadians(clubLng - userLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(userLat)) *
      Math.cos(toRadians(clubLat)) *
      Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getClosestKnownCity(latitude: number, longitude: number) {
  const cityCenters = [
    { city: "Gurgaon", latitude: 28.4595, longitude: 77.0266 },
    { city: "Noida", latitude: 28.5355, longitude: 77.391 },
    { city: "Delhi", latitude: 28.6139, longitude: 77.209 },
  ];

  let closestCity = cityCenters[0].city;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const item of cityCenters) {
    const distance = getDistanceKm(
      latitude,
      longitude,
      item.latitude,
      item.longitude
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestCity = item.city;
    }
  }

  return closestCity;
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#16386F] animate-splashExit">
      <h1 className="leading-none text-[52px] font-extrabold tracking-[-0.03em]">
        <span className="text-[#F4A623]">Pet</span>
        <span className="text-white">Go</span>
      </h1>

      <div className="mt-4 text-center text-[26px] font-medium text-white/90">
        <p className="animate-fall1">Let them run free</p>
        <p className="animate-fall2">Let them be happy</p>
      </div>

      <style jsx global>{`
        @keyframes fallDown {
          0% {
            opacity: 0;
            transform: translateY(-28px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splashExit {
          0%,
          78% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.02);
          }
        }

        .animate-fall1 {
          animation: fallDown 0.6s ease-out forwards;
        }

        .animate-fall2 {
          animation: fallDown 0.6s ease-out forwards;
          animation-delay: 0.28s;
          opacity: 0;
        }

        .animate-splashExit {
          animation: splashExit 2s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(false);

  const [clubs, setClubs] = useState<Club[]>(() => cachedClubs ?? []);
  const [loading, setLoading] = useState(() => cachedClubs === null);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [sortMode, setSortMode] = useState<SortMode>("distance");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => cachedUserLocation);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [locationMessageVisible, setLocationMessageVisible] = useState(false);
  const [locationMessageFading, setLocationMessageFading] = useState(false);

  const hasAutoCheckedLocation = useRef(false);
  const locationMessageTimers = useRef<number[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem("petgo_splash_shown")) return;
    sessionStorage.setItem("petgo_splash_shown", "1");

    setShowSplash(true);

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (cachedClubs !== null) return;

    async function fetchClubs() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("club_details")
          .select(
            "id, name, city, area, cover_image, images, services, rating, review_count, latitude, longitude, boarding_price, daycare_price, pool_price, grooming_price, cafe_price"
          )
          .order("rating", { ascending: false });

        if (error) {
          console.error("Error fetching clubs:", error);
          setClubs([]);
          return;
        }

        cachedClubs = data || [];
        setClubs(cachedClubs);
      } finally {
        setLoading(false);
      }
    }

    fetchClubs();
  }, []);

  useLayoutEffect(() => {
    if (loading) return;

    const savedScroll = sessionStorage.getItem("petgo_listing_scroll");
    if (savedScroll === null) return;

    sessionStorage.removeItem("petgo_listing_scroll");
    window.scrollTo(0, Number(savedScroll));
  }, [loading]);

  useEffect(() => {
    return () => {
      locationMessageTimers.current.forEach((timer) =>
        window.clearTimeout(timer)
      );
    };
  }, []);

  useEffect(() => {
    if (hasAutoCheckedLocation.current) return;
    hasAutoCheckedLocation.current = true;

    if (cachedUserLocation !== null) return;

    const locationTimer = setTimeout(() => {
      requestLocationAndSort({
        silent: false,
        autoApplyDistance: true,
      });
    }, 3000);

    return () => clearTimeout(locationTimer);
  }, []);

  function clearLocationMessageTimers() {
    locationMessageTimers.current.forEach((timer) =>
      window.clearTimeout(timer)
    );
    locationMessageTimers.current = [];
  }

  function showLocationNotice(message: string) {
    clearLocationMessageTimers();
    setLocationMessage(message);
    setLocationMessageVisible(true);
    setLocationMessageFading(false);

    const fadeTimer = window.setTimeout(() => {
      setLocationMessageFading(true);
    }, 2500);

    const hideTimer = window.setTimeout(() => {
      setLocationMessageVisible(false);
      setLocationMessage("");
      setLocationMessageFading(false);
    }, 3200);

    locationMessageTimers.current = [fadeTimer, hideTimer];
  }

  function requestLocationAndSort(options?: {
    silent?: boolean;
    autoApplyDistance?: boolean;
  }) {
    const silent = options?.silent ?? false;
    const autoApplyDistance = options?.autoApplyDistance ?? true;

    if (!navigator.geolocation) {
      setLocationLoading(false);

      if (!silent) {
        showLocationNotice("Location is not supported on this device");
      }
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        cachedUserLocation = nextLocation;
        setUserLocation(nextLocation);

        if (autoApplyDistance) {
          setSortMode("distance");
        }

        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        // No location means no distances to sort by — fall back to rating.
        setSortMode("rating");

        const code = error.code;

        if (code === 1) {
          if (!silent) {
            showLocationNotice(
              "Please allow location access for this website in Safari"
            );
          }
          return;
        }

        if (code === 3) {
          if (!silent) {
            showLocationNotice("Location is taking longer than usual. Try again");
          }
          return;
        }

        if (code === 2) {
          if (!silent) {
            showLocationNotice("Unable to fetch your location right now");
          }
          return;
        }

        if (!silent) {
          showLocationNotice("Could not get your location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  }

  const filteredClubs = useMemo(() => {
    const result: ClubWithDistance[] = clubs
      .filter((club) => {
        // All-of, not any-of: Pool + Boarding means somewhere that does both.
        const clubServices = splitServices(club.services);
        return selectedServices.every((service) =>
          clubServices.includes(service.toLowerCase())
        );
      })
      .map((club) => {
        let distanceKm: number | null = null;

        if (userLocation && club.latitude !== null && club.longitude !== null) {
          distanceKm = getDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            club.latitude,
            club.longitude
          );
        }

        return { ...club, distanceKm };
      });

    if (sortMode === "distance" && userLocation) {
      return [...result].sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    if (sortMode === "rating") {
      return [...result].sort((a, b) => {
        const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.review_count ?? 0) - (a.review_count ?? 0);
      });
    }

    return result;
  }, [clubs, selectedServices, sortMode, userLocation]);

  function toggleSort() {
    const next: SortMode = sortMode === "distance" ? "rating" : "distance";
    setSortMode(next);
    if (next === "distance" && !userLocation) {
      requestLocationAndSort({ silent: false, autoApplyDistance: true });
    }
  }

  function toggleService(label: string) {
    setSelectedServices((current) =>
      current.includes(label)
        ? current.filter((service) => service !== label)
        : [...current, label]
    );
  }

  function clearFilters() {
    setSelectedServices([]);
  }

  const hasFilters = selectedServices.length > 0;

  // Name what's actually narrowing the list.
  const emptyStateHint = (() => {
    if (selectedServices.length > 1) {
      return `No club offers ${selectedServices.join(" and ")} together. Try one at a time.`;
    }
    if (selectedServices.length === 1) return `No clubs offer ${selectedServices[0]} yet.`;
    return "Try again in a moment.";
  })();

  const sortLabel = sortMode === "distance" ? "Nearest" : "Top rated";

  const sectionTitle =
    sortMode === "rating"
      ? "Top rated clubs"
      : userLocation
      ? "Nearest clubs"
      : "All clubs";

  return (
    <>
      {showSplash ? <SplashScreen /> : null}

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-3">
          <div className="mx-auto max-w-md lg:max-w-2xl">
            <section className="mb-5">
              <div className="mb-3">
                <div className="flex flex-col items-center">
                  <h1 className="leading-none text-[42px] font-extrabold tracking-[-0.03em]">
                    <span className="text-[#F4A623]">Pet</span>
                    <span className="text-[#16386F]">Go</span>
                  </h1>

                  <div className="mt-3 text-center">
                    <p className="text-[14px]  text-[#2d2b28]">
                      Discover & Book the perfect club for your dog
                    </p>

                  </div>
                </div>
              </div>
            </section>

            <section className="mb-4">
              {/* One row of experiences: centred when it fits, scrolls when it does not. The -5px offsets the tile inset so tile edges line up with the column. */}
              <div className="no-scrollbar -mx-[5px] flex gap-1 overflow-x-auto pb-1.5 pt-3">
                {EXPERIENCES.map((label) => {
                  const active = selectedServices.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleService(label)}
                      aria-pressed={active}
                      className="flex w-17.5 shrink-0 flex-col items-center px-0.5 transition first:ml-auto last:mr-auto active:scale-95"
                    >
                      {/* Transparent tile; selecting fills it with a soft brand tint. */}
                      <span
                        className={`flex h-15 w-15 items-center justify-center rounded-2xl border-[1.5px] transition-colors duration-200 ${
                          active
                            ? "border-[#16386F] bg-[#DCE6F5]"
                            : "border-[#E6DED2] bg-transparent"
                        }`}
                      >
                        <ExperienceIcon label={label} size={40} />
                      </span>
                      <span
                        className={`mt-1.5 truncate text-[11.5px] ${
                          active ? "font-bold text-[#16386F]" : "font-semibold text-[#7A746C]"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {locationMessageVisible && (
                <div
                  className={`mt-2 px-1 text-xs font-medium text-[#7B7268] transition-opacity duration-500 ${
                    locationMessageFading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {locationMessage}
                </div>
              )}
            </section>
          </div>

          {/* Spans the same width as the grid so the title and sort line up with the cards. */}
          {!loading && (
            <div className="mb-4 mt-2 flex items-center justify-between gap-3">
              <span className="flex-1 text-[13px] font-semibold uppercase tracking-[0.5px] text-[#7A746C]">
                {sectionTitle}
              </span>
              <button
                type="button"
                onClick={toggleSort}
                disabled={locationLoading}
                className="flex items-center gap-1 text-[13px] font-semibold text-[#16386F] active:opacity-60 disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
                </svg>
                {sortLabel}
              </button>
            </div>
          )}

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-[26px] border border-[#EDE4D8] bg-white overflow-hidden shadow-[0_12px_28px_rgba(17,24,39,0.05)] animate-pulse">
                    <div className="h-64 bg-[#F0EBE3]" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-2/3 rounded-full bg-[#F0EBE3]" />
                      <div className="h-4 w-1/3 rounded-full bg-[#F0EBE3]" />
                      <div className="flex gap-2 pt-1">
                        <div className="h-7 w-20 rounded-full bg-[#F0EBE3]" />
                        <div className="h-7 w-20 rounded-full bg-[#F0EBE3]" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : filteredClubs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center px-8 py-16 text-center">
                <p className="text-[32px]">🐾</p>
                <p className="mt-2 text-[15px] font-semibold text-[#16386F]">No clubs found</p>
                <p className="mt-1 text-[13px] leading-5 text-[#7A7368]">{emptyStateHint}</p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full bg-[#16386F] px-5 py-3 text-[14px] font-semibold text-white active:opacity-90"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredClubs.map((club) => <ClubCard key={club.id} club={club} />)
            )}
          </section>
        </div>
      </main>
    </>
  );
}