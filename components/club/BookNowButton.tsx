"use client";

import Link from "next/link";

type BookNowButtonProps = {
  clubId: number | string;
  service?: string;
};

export default function BookNowButton({
  clubId,
  service,
}: BookNowButtonProps) {
  const href = service
    ? `/book/${clubId}?service=${encodeURIComponent(service)}`
    : `/book/${clubId}`;

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl bg-[#CF8750] px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
    >
      Book Now
    </Link>
  );
}