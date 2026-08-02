"use client";

import Link from "next/link";

type BookNowButtonProps = {
  clubId: number | string;
  service?: string;
  clubName?: string;
  city?: string | null;
  area?: string | null;
  coverImage?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  services?: string[];
};

export default function BookNowButton({
  clubId,
  service,
  clubName,
  city,
  area,
  coverImage,
  rating,
  reviewCount,
  services,
}: BookNowButtonProps) {
  const href = service
    ? `/book/${clubId}?service=${encodeURIComponent(service)}`
    : `/book/${clubId}`;

  return (
    <Link
      href={href}
      onClick={() => {
        if (!clubName) return;
        sessionStorage.setItem(
          `petgo_book_preview_${clubId}`,
          JSON.stringify({
            name: clubName,
            city: city ?? null,
            area: area ?? null,
            cover_image: coverImage ?? null,
            rating: rating ?? null,
            review_count: reviewCount ?? null,
            services: services ?? [],
          })
        );
      }}
      className="inline-flex w-full items-center justify-center rounded-xl bg-[#CF8750] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(207,135,80,0.32)] transition-all duration-150 active:scale-[0.97] hover:opacity-95"
    >
      Book Now
    </Link>
  );
}