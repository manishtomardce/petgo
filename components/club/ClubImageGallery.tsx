"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type ClubImageGalleryProps = {
  images: string[];
  clubName: string;
};

export default function ClubImageGallery({
  images,
  clubName,
}: ClubImageGalleryProps) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages = useMemo(() => {
    const cleaned = images
      .map((img) => (typeof img === "string" ? img.trim() : ""))
      .filter(Boolean);

    return cleaned.length > 0 ? cleaned : ["/placeholder-club.jpg"];
  }, [images]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goNext = () => {
    setActiveIndex((prev) =>
      prev < safeImages.length - 1 ? prev + 1 : prev
    );
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;

    if (touchStartX.current === null || touchEndX.current === null) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (deltaX > minSwipeDistance) {
      goNext();
    } else if (deltaX < -minSwipeDistance) {
      goPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative w-full bg-white">
      <div
        className="relative h-[50vh] w-full overflow-hidden bg-neutral-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={safeImages[activeIndex]}
          alt={`${clubName} image ${activeIndex + 1}`}
          className="h-full w-full object-cover object-center"
          draggable={false}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="absolute left-4 top-4 z-20">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm backdrop-blur"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {safeImages.length > 1 ? (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">
            {safeImages.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-full transition-all ${
                  activeIndex === index
                    ? "h-2 w-5 bg-white"
                    : "h-2 w-2 bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        ) : null}

        {safeImages.length > 1 ? (
          <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
            {activeIndex + 1}/{safeImages.length}
          </div>
        ) : null}
      </div>
    </div>
  );
}