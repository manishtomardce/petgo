"use client";

import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-[#FAF8F5] pb-28">
      <div
        className="relative w-full overflow-hidden bg-neutral-200"
        style={{
          height: "calc(50vh + env(safe-area-inset-top))",
          marginTop: "calc(-1 * env(safe-area-inset-top))",
        }}
      >
        {preview?.cover_image && (
          <img
            src={preview.cover_image}
            alt={preview.name}
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
        )}

        <div
          className="absolute left-4 z-20"
          style={{ top: "calc(env(safe-area-inset-top) + 16px)" }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm backdrop-blur"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-8 px-4 pt-5">
        <div>
          {preview ? (
            <>
              <h1 className="text-[26px] font-semibold text-[#16386F]">
                {preview.name}
              </h1>
              <p className="mt-1 text-sm text-[#7A746C]">
                {[preview.area, preview.city].filter(Boolean).join(", ")}
              </p>
              <p className="mt-2 text-sm text-[#7A746C]">
                ⭐ {preview.rating ?? "New"} · {preview.review_count ?? 0} reviews
              </p>
            </>
          ) : (
            <>
              <div className="h-7 w-2/3 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-3 h-4 w-1/3 animate-pulse rounded-full bg-neutral-200" />
            </>
          )}
        </div>

        <div>
          <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-neutral-200" />
          <div className="flex flex-wrap gap-3">
            <div className="h-9 w-20 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-9 w-24 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-9 w-16 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>

        <div>
          <div className="mb-3 h-5 w-20 animate-pulse rounded-full bg-neutral-200" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 animate-pulse rounded-xl bg-neutral-200" />
          <div className="h-12 animate-pulse rounded-xl bg-neutral-200" />
          <div className="h-12 animate-pulse rounded-xl bg-neutral-200" />
          <div className="h-12 animate-pulse rounded-xl bg-neutral-200" />
        </div>

        <div className="h-[240px] w-full animate-pulse rounded-[22px] bg-neutral-200" />
      </div>

      <div className="fixed bottom-0 left-0 z-30 w-full border-t border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200" />
            <div className="mt-2 h-6 w-16 animate-pulse rounded-full bg-neutral-200" />
          </div>
          <div className="h-11 w-[160px] animate-pulse rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
