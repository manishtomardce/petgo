"use client";

import { ChevronLeft, ChevronRight, Images, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * Swipeable hero plus a thumbnail rail — ported from the app
 * (petgo-app/src/features/clubs/ClubGallery.tsx).
 *
 * The hero keeps a photo-friendly shape at every width: 320px tall on phones
 * (as in the app), a 3:2 frame on wider screens. Stretching it across a laptop
 * window at half the viewport height cropped most of each photo away.
 */

type ClubImageGalleryProps = {
  images: string[];
  clubName: string;
  shareText: string;
};

export default function ClubImageGallery({ images, clubName, shareText }: ClubImageGalleryProps) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  // Some stored photo URLs have gone dead upstream; drop them rather than show a blank frame.
  const [broken, setBroken] = useState<Set<string>>(() => new Set());

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const photos = useMemo(() => {
    const cleaned = images.map((img) => img?.trim()).filter((img) => img && !broken.has(img));
    return cleaned.length > 0 ? cleaned : ["/placeholder-club.jpg"];
  }, [images, broken]);

  function markBroken(src: string) {
    setBroken((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }

  // An image can fail before hydration attaches onError; catch those on mount.
  useEffect(() => {
    rootRef.current?.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0) markBroken(img.getAttribute("src") ?? "");
    });
  }, []);

  const total = photos.length;

  function goTo(next: number) {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.max(0, Math.min(total - 1, next));
    track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
  }

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: clubName, text: shareText, url });
      } catch {
        // dismissed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked; nothing useful to do
    }
  }

  return (
    <div ref={rootRef} className="md:px-5 md:pt-5">
      <div className="group relative h-80 w-full overflow-hidden bg-[#F4EFE6] md:h-auto md:aspect-3/2 md:rounded-[28px]">
        <div
          ref={trackRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
        >
          {photos.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt={`${clubName}, photo ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
              onError={() => markBroken(src)}
              className="h-full w-full shrink-0 snap-center select-none object-cover"
            />
          ))}
        </div>

        {/* Scrims so the controls, dots and counter stay legible over a bright photo. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{ background: "linear-gradient(to bottom, rgba(8,20,40,0.35), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(8,20,40,0.55))" }}
        />

        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#16386F] shadow-[0_6px_16px_rgba(17,24,39,0.13)] active:opacity-80"
          style={{ top: "calc(env(safe-area-inset-top) + 8px)" }}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={share}
          aria-label={`Share ${clubName}`}
          className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#16386F] shadow-[0_6px_16px_rgba(17,24,39,0.13)] active:opacity-80"
          style={{ top: "calc(env(safe-area-inset-top) + 8px)" }}
        >
          <Share2 size={18} />
        </button>
        {copied && (
          <span className="absolute right-4 top-16 rounded-full bg-black/70 px-3 py-1 text-[12px] font-semibold text-white">
            Link copied
          </span>
        )}

        {total > 1 && (
          <>
            {/* Desktop arrows — touch users swipe. */}
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#16386F] opacity-0 shadow transition group-hover:opacity-100 disabled:invisible md:flex"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo(index + 1)}
              disabled={index === total - 1}
              className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#16386F] opacity-0 shadow transition group-hover:opacity-100 disabled:invisible md:flex"
            >
              <ChevronRight size={22} />
            </button>

            <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/45 px-3 py-1.5">
              <Images size={12} className="text-white" />
              <span className="text-[12px] font-semibold text-white">
                {index + 1} / {total}
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-5 flex items-center justify-center gap-1.5">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3 md:px-0">
          {photos.map((src, i) => (
            <button
              key={`thumb-${src}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Photo ${i + 1} of ${total}`}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === index ? "border-[#16386F]" : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <img src={src} alt="" loading="lazy" draggable={false} onError={() => markBroken(src)} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
