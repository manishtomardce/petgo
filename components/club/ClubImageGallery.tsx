"use client";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type ClubImageGalleryProps = {
  images: string[];
  clubName: string;
};

const SWIPE_THRESHOLD = 50;
const EDGE_RESISTANCE = 0.35;

export default function ClubImageGallery({
  images,
  clubName,
}: ClubImageGalleryProps) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeImages = useMemo(() => {
    const cleaned = images
      .map((img) => (typeof img === "string" ? img.trim() : ""))
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : ["/placeholder-club.jpg"];
  }, [images]);

  const hasMultipleImages = safeImages.length > 1;

  const goPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goNext = () => {
    setActiveIndex((prev) =>
      prev < safeImages.length - 1 ? prev + 1 : prev
    );
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) return;
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleImages || touchStartX.current === null) return;

    let delta = e.touches[0].clientX - touchStartX.current;
    const atFirstImage = activeIndex === 0;
    const atLastImage = activeIndex === safeImages.length - 1;

    if ((atFirstImage && delta > 0) || (atLastImage && delta < 0)) {
      delta *= EDGE_RESISTANCE;
    }

    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    if (!hasMultipleImages || touchStartX.current === null) return;

    if (dragOffset < -SWIPE_THRESHOLD) goNext();
    else if (dragOffset > SWIPE_THRESHOLD) goPrev();

    setDragOffset(0);
    setIsDragging(false);
    touchStartX.current = null;
  };

  const handleImageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) goPrev();
    else goNext();
  };

  return (
    <div className="relative w-full bg-white">
      <div
        className="relative w-full overflow-hidden bg-neutral-100"
        style={{
          height: "calc(50vh + env(safe-area-inset-top))",
          marginTop: "calc(-1 * env(safe-area-inset-top))",
        }}
      >
        <div
          className="flex h-full w-full"
          style={{
            transform: `translateX(calc(${-activeIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging
              ? "none"
              : "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleImageTap}
        >
          {safeImages.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${clubName} image ${index + 1}`}
              className="h-full w-full shrink-0 select-none object-cover object-center"
              draggable={false}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />

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

        {hasMultipleImages ? (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">
            {safeImages.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`pointer-events-auto rounded-full transition-all ${
                  activeIndex === index
                    ? "h-2 w-5 bg-white"
                    : "h-2 w-2 bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        ) : null}

        {hasMultipleImages ? (
          <div className="pointer-events-none absolute bottom-4 right-4 z-20 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
            {activeIndex + 1}/{safeImages.length}
          </div>
        ) : null}
      </div>
    </div>
  );
}
