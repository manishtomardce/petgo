"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createClient } from "../lib/supabase";
import ClubCard from "@/components/club/ClubCard";

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
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

type ClubWithDistance = Club & {
  distanceKm: number | null;
};

type SortMode = "none" | "distance" | "rating";

const supabase = createClient();

let cachedClubs: Club[] | null = null;
let cachedUserLocation: UserLocation | null = null;

const cityOptions = ["All", "Gurgaon", "Bangalore", "Noida" , "Delhi"];
const serviceOptions = [
  "All Services",
  "Daycare",
  "Boarding",
  "Pool",
  "Park",
  "Cafe",
  "Grooming",
];

function hasService(services: string | null, selectedService: string) {
  if (selectedService === "All Services") return true;
  if (!services) return false;

  return services
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(selectedService.toLowerCase());
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

  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedService, setSelectedService] = useState("All Services");

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
            "id, name, city, area, cover_image, images, services, rating, review_count, latitude, longitude"
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
        const cityMatch =
          selectedCity === "All" ||
          club.city?.toLowerCase() === selectedCity.toLowerCase();

        const serviceMatch = hasService(club.services, selectedService);

        return cityMatch && serviceMatch;
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
  }, [clubs, selectedCity, selectedService, sortMode, userLocation]);

  const sortDropdownValue =
    sortMode === "distance"
      ? "distance"
      : sortMode === "rating"
      ? "rating"
      : "";

  const sectionTitle =
    sortMode === "distance" && userLocation
      ? "Nearest clubs"
      : sortMode === "rating"
      ? "Top rated clubs"
      : "Popular clubs";

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
              <div className="mb-2 -mx-1 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {cityOptions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                      selectedCity === city
                        ? "border-[#16386F] bg-[#16386F] text-white shadow-[0_6px_16px_rgba(22,56,111,0.16)]"
                        : "border-[#E7DED1] bg-white text-[#3E362F]"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="relative">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="h-11 w-full appearance-none rounded-full border border-[#E7DED1] bg-white px-4 pr-10 text-[14px] font-medium text-[#2E2A26] shadow-[0_6px_16px_rgba(17,24,39,0.04)] outline-none transition focus:border-[#16386F]"
                    >
                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#4A433D]">
                      ˅
                    </span>
                  </div>
                </div>

                <div className="w-[132px] shrink-0">
                  <div className="relative">
                    <select
                      value={sortDropdownValue}
                      onChange={(e) => {
                        const value = e.target.value as
                          | ""
                          | "distance"
                          | "rating"
                          | "clear";

                        if (value === "distance") {
                          setSortMode("distance");

                          if (!userLocation) {
                            requestLocationAndSort({
                              silent: false,
                              autoApplyDistance: true,
                            });
                          }
                          return;
                        }

                        if (value === "rating") {
                          setSortMode("rating");
                          return;
                        }

                        setSortMode("none");
                      }}
                      disabled={locationLoading}
                      className="h-11 w-full appearance-none rounded-full border border-[#E7DED1] bg-white px-4 pr-10 text-[14px] font-medium text-[#2E2A26] shadow-[0_6px_16px_rgba(17,24,39,0.04)] outline-none transition focus:border-[#16386F] disabled:opacity-60"
                    >
                      <option value="">Sort by</option>
                      <option value="distance">Distance</option>
                      <option value="rating">Rating</option>
                      <option value="clear">Clear</option>
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#4A433D]">
                      ˅
                    </span>
                  </div>
                </div>
              </div>

              {locationMessageVisible && (
                <div
                  className={`mt-3 px-1 text-xs font-medium text-[#7B7268] transition-opacity duration-500 ${
                    locationMessageFading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {locationMessage}
                </div>
              )}
            </section>

            {!loading && (
              <div className="mb-4 flex items-center justify-between px-1">
                <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#16386F]">
                  {sectionTitle}
                </span>
                <span className="text-sm font-medium text-[#7A7368]">
                  {filteredClubs.length} found
                </span>
              </div>
            )}
          </div>

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-[26px] border border-[#EDE4D8] bg-white overflow-hidden shadow-[0_12px_28px_rgba(17,24,39,0.05)] animate-pulse">
                    <div className="h-[220px] bg-[#F0EBE3]" />
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
              <div className="col-span-full rounded-[26px] border border-[#EDE4D8] bg-white p-8 shadow-[0_12px_28px_rgba(17,24,39,0.05)] text-center">
                <p className="text-[32px]">🐾</p>
                <p className="mt-2 text-[15px] font-semibold text-[#16386F]">No clubs found</p>
                <p className="mt-1 text-[13px] text-[#7A7368]">Try changing the city or service filter</p>
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