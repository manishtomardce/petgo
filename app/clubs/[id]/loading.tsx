"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

type ClubPreview = {
  name: string;
  city: string | null;
  area: string | null;
  cover_image: string | null;
  rating: number | null;
  review_count: number | null;
};

export default function ClubDetailsLoading() {
  const pathname = usePathname();
  const router = useRouter();
  const [preview, setPreview] = useState<ClubPreview | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const id = pathname.split("/").pop();
    if (!id) return;

    const raw = sessionStorage.getItem(`petgo_club_preview_${id}`);
    if (!raw) return;

    try {
      setPreview(JSON.parse(raw));
    } catch {
      // ignore malformed cache entry
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white pb-36">
      <div className="mx-auto max-w-3xl">
        {/* Same frame as the gallery: 320px on phones, 3:2 on wider screens. */}
        <div className="md:px-5 md:pt-5">
          <div className="relative h-80 w-full overflow-hidden bg-[#F4EFE6] md:h-auto md:aspect-3/2 md:rounded-[28px]">
            {preview?.cover_image && (
              <img
                src={preview.cover_image}
                alt={preview.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
            )}

            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#16386F] shadow-[0_6px_16px_rgba(17,24,39,0.13)]"
              style={{ top: "calc(env(safe-area-inset-top) + 8px)" }}
              aria-label="Go back"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="h-20" />
        </div>

        <div className="flex flex-col gap-8 px-5 pt-5">
          <div>
            {preview ? (
              <>
                <h1 className="text-[27px] font-bold leading-8 tracking-[-0.5px] text-[#16386F]">
                  {preview.name}
                </h1>
                <p className="mt-2 text-[14px] text-[#7A746C]">
                  {[preview.area, preview.city].filter(Boolean).join(", ")}
                </p>
                <div className="mt-3 h-8 w-28 animate-pulse rounded-full bg-[#F4EFE6]" />
              </>
            ) : (
              <>
                <div className="h-7 w-3/4 animate-pulse rounded-full bg-[#F4EFE6]" />
                <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-[#F4EFE6]" />
                <div className="mt-4 flex gap-2">
                  <div className="h-8 w-24 animate-pulse rounded-full bg-[#F4EFE6]" />
                  <div className="h-8 w-28 animate-pulse rounded-full bg-[#F4EFE6]" />
                </div>
              </>
            )}
            <div className="mt-6 h-4 w-full animate-pulse rounded-full bg-[#F4EFE6]" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-[#F4EFE6]" />
          </div>

          <div>
            <div className="h-5 w-28 animate-pulse rounded-full bg-[#F4EFE6]" />
            <div className="mt-4 flex gap-3">
              <div className="h-9 w-28 animate-pulse rounded-full bg-[#F4EFE6]" />
              <div className="h-9 w-28 animate-pulse rounded-full bg-[#F4EFE6]" />
            </div>
          </div>

          <div>
            <div className="h-5 w-24 animate-pulse rounded-full bg-[#F4EFE6]" />
            <div className="mt-4 h-[164px] w-full animate-pulse rounded-[22px] bg-[#F4EFE6]" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-30 w-full border-t border-[#EDE4D8] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between md:px-5">
          <div>
            <div className="h-3 w-20 animate-pulse rounded-full bg-[#F4EFE6]" />
            <div className="mt-2 h-6 w-16 animate-pulse rounded-full bg-[#F4EFE6]" />
          </div>
          <div className="h-12 w-[132px] animate-pulse rounded-full bg-[#F4EFE6]" />
        </div>
      </div>
    </div>
  );
}
