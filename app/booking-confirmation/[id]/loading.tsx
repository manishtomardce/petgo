"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ConfirmationPreview = {
  club_name: string;
  club_id: string;
  owner_name: string;
  phone: string;
  service: string;
  service_type: string;
  pet_name: string;
  check_in: string;
  check_out: string | null;
  instructions: string;
};

export default function BookingConfirmationLoading() {
  const pathname = usePathname();
  const [preview, setPreview] = useState<ConfirmationPreview | null>(null);

  useEffect(() => {
    const id = pathname.split("/").pop();
    if (!id) return;

    const raw = sessionStorage.getItem(`petgo_confirmation_preview_${id}`);
    if (!raw) return;

    try {
      setPreview(JSON.parse(raw));
    } catch {
      // ignore malformed cache entry
    }
  }, [pathname]);

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[28px] border border-[#eee7de] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#2d241c] md:text-3xl">
              Booking confirmed
            </h1>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f8ee] text-xl">
              ✅
            </div>
          </div>

          <p className="mt-2 text-sm text-[#6f6256] md:text-base">
            Your booking request has been received successfully.
          </p>

          <div className="mt-6 rounded-[24px] border border-[#f1ebe3] bg-[#fffaf5] p-5">
            <h2 className="text-base font-semibold text-[#2d241c]">
              Booking details
            </h2>

            {preview ? (
              <div className="mt-4 space-y-3 text-sm text-[#5f5448]">
                <div className="flex justify-between gap-4">
                  <span>Club</span>
                  <span className="text-right font-medium text-[#2d241c]">
                    {preview.club_name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Owner</span>
                  <span className="text-right font-medium text-[#2d241c]">
                    {preview.owner_name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Phone</span>
                  <span className="text-right font-medium text-[#2d241c]">
                    {preview.phone}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Service</span>
                  <span className="text-right font-medium text-[#2d241c] capitalize">
                    {preview.service_type || preview.service}
                  </span>
                </div>

                {preview.pet_name && (
                  <div className="flex justify-between gap-4">
                    <span>Pet</span>
                    <span className="text-right font-medium text-[#2d241c]">
                      {preview.pet_name}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-4">
                  <span>Check-in</span>
                  <span className="text-right font-medium text-[#2d241c]">
                    {preview.check_in}
                  </span>
                </div>

                {preview.check_out && (
                  <div className="flex justify-between gap-4">
                    <span>Check-out / Time</span>
                    <span className="text-right font-medium text-[#2d241c]">
                      {preview.check_out}
                    </span>
                  </div>
                )}

                <div className="animate-pulse space-y-3 border-t border-[#efe7dc] pt-3">
                  <div className="h-4 w-2/3 rounded-full bg-[#f1ebe3]" />
                  <div className="h-4 w-1/2 rounded-full bg-[#f1ebe3]" />
                </div>
              </div>
            ) : (
              <div className="mt-4 animate-pulse space-y-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div className="h-4 w-20 rounded-full bg-[#f1ebe3]" />
                    <div className="h-4 w-28 rounded-full bg-[#f1ebe3]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 h-16 animate-pulse rounded-2xl bg-[#f6f1ea]" />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="h-12 w-full animate-pulse rounded-full bg-[#f1ebe3] sm:w-40" />
            <div className="h-12 w-full animate-pulse rounded-full bg-[#f1ebe3] sm:w-32" />
          </div>
        </div>
      </div>
    </main>
  );
}
