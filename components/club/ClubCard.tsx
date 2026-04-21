"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
};

function parseServices(services: string | null) {
  if (!services) return [];

  return services
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function getClubImages(club: Club) {
  const rawImages = [
    club.cover_image,
    ...(club.images ? club.images.split(",").map((item) => item.trim()) : []),
  ].filter(Boolean) as string[];

  return Array.from(new Set(rawImages));
}

export default function ClubCard({ club }: { club: Club }) {
  const serviceList = parseServices(club.services);
  const imageList = useMemo(() => getClubImages(club), [club]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const hasMultipleImages = imageList.length > 1;
  const currentImage =
    imageList[currentIndex] ||
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80";

  function goToPrevious() {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  }

  function goToNext() {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEndX(e.targetTouches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!hasMultipleImages || touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  }

  function handleImageTap(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (!hasMultipleImages) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const halfWidth = rect.width / 2;

    if (clickX < halfWidth) {
      goToPrevious();
    } else {
      goToNext();
    }
  }

  return (
    <Link href={`/clubs/${club.id}`} className="block">
      <article className="overflow-hidden rounded-[28px] border border-[#EEE7DC] bg-white shadow-[0_14px_34px_rgba(17,24,39,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(17,24,39,0.12)]">
        
        {/* IMAGE */}
        <div
          className="relative h-52 w-full overflow-hidden bg-[#f4efe6]"
          onClick={handleImageTap}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={currentImage}
            alt={club.name}
            className="h-full w-full select-none object-cover"
            draggable={false}
          />

          {/* gradient overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

          {/* dots */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 backdrop-blur-sm">
              {imageList.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[20px] font-semibold text-[#16386F]">
                {club.name}
              </h3>

              <p className="mt-1 text-[14px] text-[#7A746C]">
                {[club.area, club.city].filter(Boolean).join(", ")}
              </p>

              {club.distanceKm != null && (
                <div className="mt-1 flex items-center gap-1 text-xs text-[#7A746C]">
                  <span>📍</span>
                  <span>{club.distanceKm.toFixed(1)} km away</span>
                </div>
              )}
            </div>

            {/* RATING */}
            <div className="shrink-0 rounded-full bg-[#FFF4DA] px-3 py-1.5 text-xs font-semibold text-[#8A5A00]">
              ⭐ {club.rating ?? "4.5"}
            </div>
          </div>

          {/* SERVICES */}
          {serviceList.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {serviceList.map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-[#FFF7E8] px-3.5 py-1.5 text-[12px] font-semibold capitalize text-[#9A6200]"
                >
                  {service}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}