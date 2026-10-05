"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import GoogleG from "./GoogleG";

/**
 * Club card — ported from the app (petgo-app/src/features/clubs/ClubCard.tsx):
 * a tall photo carousel with the name and location set on the photo over a dark
 * scrim, rating pill (Google-sourced) top-right, distance top-left, a "Top rated"
 * sticker for clubs at 4.7+, then up to six services in a fixed order and the
 * starting price bottom-right.
 */

type Club = {
  id: string | number;
  name: string;
  city: string | null;
  area: string | null;
  cover_image: string | null;
  images: string | null;
  services: string | null;
  rating: number | null;
  review_count?: number | null;
  distanceKm?: number | null;
  boarding_price?: number | null;
  daycare_price?: number | null;
  pool_price?: number | null;
  grooming_price?: number | null;
  cafe_price?: number | null;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80";

// Same order as the app, so the same services sit in the same places on every card.
const SERVICE_ORDER = ["daycare", "boarding", "pool", "park", "grooming", "cafe"];

function serviceRank(service: string) {
  const index = SERVICE_ORDER.indexOf(service.trim().toLowerCase());
  return index === -1 ? SERVICE_ORDER.length : index;
}

function splitList(value: string | null | undefined) {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function getClubImages(club: Club) {
  return Array.from(
    new Set([club.cover_image, ...splitList(club.images)].filter(Boolean) as string[])
  );
}

/** Lowest price the club charges for anything — not the first non-null. */
function startingPrice(club: Club): number | null {
  const prices = [
    club.boarding_price,
    club.daycare_price,
    club.pool_price,
    club.grooming_price,
    club.cafe_price,
  ].filter((value): value is number => typeof value === "number" && value > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export default function ClubCard({ club }: { club: Club }) {
  const router = useRouter();
  const imageList = useMemo(() => getClubImages(club), [club]);
  const displayImages = imageList.length > 0 ? imageList : [FALLBACK];
  const hasMultipleImages = displayImages.length > 1;
  const [imageIndex, setImageIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const allServices = splitList(club.services);
  const ranked = [...allServices].sort((a, b) => serviceRank(a) - serviceRank(b));
  // Six cells, two rows of three; an overflow count takes the sixth cell.
  const hasExtras = ranked.length > 6;
  const shownServices = ranked.slice(0, hasExtras ? 5 : 6);
  const extraServices = allServices.length - shownServices.length;
  const price = startingPrice(club);
  const location = [club.area, club.city].filter(Boolean).join(", ");

  function openClub() {
    sessionStorage.setItem("petgo_listing_scroll", String(window.scrollY));
    sessionStorage.setItem(
      `petgo_club_preview_${club.id}`,
      JSON.stringify({
        name: club.name,
        city: club.city,
        area: club.area,
        cover_image: displayImages[imageIndex] ?? displayImages[0],
        rating: club.rating,
        review_count: club.review_count ?? null,
      })
    );
    router.push(`/clubs/${club.id}`);
  }

  function scrollToImage(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + displayImages.length) % displayImages.length;
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`${club.name}${location ? `, ${location}` : ""}`}
      onClick={openClub}
      onKeyDown={(e) => {
        if (e.key === "Enter") openClub();
      }}
      onMouseEnter={() => router.prefetch(`/clubs/${club.id}`)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[#EEE7DC] bg-white shadow-[0_12px_18px_rgba(11,27,51,0.18)] transition-transform duration-150 active:scale-[0.985] hover:-translate-y-0.5"
    >
      {/* PHOTO */}
      <div className="relative h-64 w-full overflow-hidden bg-[#F4EFE6]">
        <div
          ref={trackRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setImageIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
        >
          {displayImages.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${club.name}, photo ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              draggable={false}
              className="h-full w-full shrink-0 snap-center select-none object-cover"
            />
          ))}
        </div>

        {/* Desktop arrows — touch users swipe. */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                scrollToImage(imageIndex - 1);
              }}
              className="absolute left-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#16386F] opacity-0 shadow transition group-hover:opacity-100 md:flex"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                scrollToImage(imageIndex + 1);
              }}
              className="absolute right-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#16386F] opacity-0 shadow transition group-hover:opacity-100 md:flex"
            >
              ›
            </button>
          </>
        )}

        {/* Sticker, set at an angle on purpose — only for genuinely well-rated clubs. */}
        {(club.rating ?? 0) >= 4.7 && (
          <div className="pointer-events-none absolute left-4 top-16 -rotate-[7deg] rounded-full border-2 border-white bg-[#F4A623] px-3 py-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-[#16386F]">
              Top rated
            </span>
          </div>
        )}

        {/* Google-sourced rating */}
        <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5">
          <GoogleG size={12} />
          <StarIcon className="h-[13px] w-[13px] text-[#F4A623]" />
          <span className="text-[12px] font-bold text-[#16386F]">{club.rating ?? "4.5"}</span>
          {club.review_count != null && (
            <span className="text-[11px] text-[#7A746C]">({club.review_count})</span>
          )}
        </div>

        {club.distanceKm != null && (
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5">
            <PinIcon className="h-[13px] w-[13px] text-[#9A6200]" />
            <span className="text-[12px] font-semibold text-[#16386F]">
              {club.distanceKm.toFixed(1)} km away
            </span>
          </div>
        )}

        {/* Scrim: the name sits on the photo, so it needs something to sit on. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(8,20,40,0.45) 35%, rgba(8,20,40,0.82) 68%, rgba(6,15,32,0.97) 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end gap-3 px-5 pb-4">
          <div className="min-w-0 flex-1">
            <h3
              className="line-clamp-2 text-[21px] font-bold leading-7 tracking-[-0.3px] text-white"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
            >
              {club.name}
            </h3>
            {location && (
              <div className="mt-1 flex items-center gap-1.5">
                <PinIcon className="h-[14px] w-[14px] shrink-0 text-[#F4A623]" />
                <span
                  className="truncate text-[13.5px] font-semibold text-white"
                  style={{ textShadow: "0 1px 5px rgba(0,0,0,0.5)" }}
                >
                  {location}
                </span>
              </div>
            )}
          </div>

          {hasMultipleImages && (
            <div className="flex items-center gap-1.5 pb-1">
              {displayImages.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === imageIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SERVICES + PRICE — side by side, price centred against the chips so it
          lines up whether they take one row or two. */}
      <div className="flex flex-1 items-center gap-3 px-5 py-4">
        {/* Chips size to their full label and wrap. Fixed thirds (as in the app)
            truncate names like "Grooming" in the narrower desktop grid columns. */}
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {shownServices.map((service) => (
            <span
              key={service}
              className="whitespace-nowrap rounded-full bg-[#FFF7E8] px-3 py-1.5 text-[12px] font-semibold capitalize text-[#9A6200]"
            >
              {service}
            </span>
          ))}
          {hasExtras && (
            <span className="whitespace-nowrap rounded-full bg-[#F4EFE6] px-3 py-1.5 text-[12px] font-semibold text-[#7A746C]">
              +{extraServices}
            </span>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[19px] font-bold leading-6 text-[#16386F]">
            {price != null ? `₹${price}` : "On request"}
          </p>
          {price != null && <p className="text-[11px] leading-4 text-[#7A746C]">onwards</p>}
        </div>
      </div>
    </article>
  );
}
