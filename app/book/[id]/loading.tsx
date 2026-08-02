"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type BookPreview = {
  name: string;
  city: string | null;
  area: string | null;
  cover_image: string | null;
  rating: number | null;
  review_count: number | null;
  services: string[];
};

export default function BookPageLoading() {
  const pathname = usePathname();
  const [preview, setPreview] = useState<BookPreview | null>(null);

  useEffect(() => {
    const id = pathname.split("/").pop();
    if (!id) return;

    const raw = sessionStorage.getItem(`petgo_book_preview_${id}`);
    if (!raw) return;

    try {
      setPreview(JSON.parse(raw));
    } catch {
      // ignore malformed cache entry
    }
  }, [pathname]);

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16386F]">Book Now</h1>
        </div>

        {preview ? (
          <div className="overflow-hidden rounded-[26px] border border-[#EDE4D8] bg-white shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
            <div className="flex gap-4 p-4">
              {preview.cover_image && (
                <img
                  src={preview.cover_image}
                  alt={preview.name}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  draggable={false}
                />
              )}

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold text-[#16386F]">
                  {preview.name}
                </h2>

                <p className="mt-0.5 text-sm text-[#7A746C]">
                  {[preview.area, preview.city].filter(Boolean).join(", ")}
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#7A746C]">
                  {preview.rating ? (
                    <span>
                      ⭐ {preview.rating} ({preview.review_count ?? 0} reviews)
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {preview.services.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-[#EDE4D8] px-4 py-3">
                {preview.services.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[#FFF7E8] px-3 py-1.5 text-xs font-semibold capitalize text-[#9A6200]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-pulse rounded-[26px] border border-[#EDE4D8] bg-white p-4 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
            <div className="flex gap-4">
              <div className="h-20 w-20 shrink-0 rounded-2xl bg-neutral-200" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-5 w-2/3 rounded-full bg-neutral-200" />
                <div className="h-4 w-1/2 rounded-full bg-neutral-200" />
                <div className="h-4 w-1/3 rounded-full bg-neutral-200" />
              </div>
            </div>
          </div>
        )}

        <div className="animate-pulse rounded-[26px] border border-[#EDE4D8] bg-white px-5 py-4 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-neutral-200" />
            <div className="h-[2px] flex-1 rounded-full bg-neutral-200" />
            <div className="h-8 w-8 rounded-full bg-neutral-200" />
            <div className="h-[2px] flex-1 rounded-full bg-neutral-200" />
            <div className="h-8 w-8 rounded-full bg-neutral-200" />
          </div>
        </div>

        <div className="animate-pulse rounded-[26px] border border-[#EDE4D8] bg-white p-4 shadow-[0_12px_28px_rgba(17,24,39,0.05)] sm:p-5">
          <div className="h-5 w-32 rounded-full bg-neutral-200" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-11 rounded-2xl bg-neutral-200 sm:col-span-2" />
            <div className="h-11 rounded-2xl bg-neutral-200" />
            <div className="h-11 rounded-2xl bg-neutral-200" />
          </div>
        </div>

        <div className="h-14 animate-pulse rounded-2xl bg-neutral-200" />
      </div>
    </main>
  );
}
