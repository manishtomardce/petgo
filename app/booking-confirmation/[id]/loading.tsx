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
  const bookingId = pathname.split("/").pop() || "";

  useEffect(() => {
    if (!bookingId) return;

    const raw = sessionStorage.getItem(`petgo_confirmation_preview_${bookingId}`);
    if (!raw) return;

    try {
      setPreview(JSON.parse(raw));
    } catch {
      // ignore malformed cache entry
    }
  }, [bookingId]);

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="animate-checkPop flex h-20 w-20 items-center justify-center rounded-full bg-[#16386F]">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className="animate-checkDraw"
                d="M5 13l4 4L19 7"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
              />
            </svg>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[#16386F] md:text-3xl">
            Booking Confirmed!
          </h1>

          <p className="mt-2 text-sm text-[#7A746C] md:text-base">
            {preview?.club_name
              ? `${preview.club_name} will get in touch with you shortly.`
              : "We've received your booking request."}
          </p>
        </div>

        <div className="mt-6 h-11 animate-pulse rounded-2xl bg-[#EDE4D8]/60" />

        <div className="mt-4 animate-pulse rounded-[26px] border border-[#EDE4D8] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold text-[#16386F]">
                {preview?.club_name || "Club"}
              </h2>
              <div className="mt-2 h-4 w-2/3 rounded-full bg-[#EDE4D8]" />
            </div>
          </div>
        </div>

        {preview && (
          <div className="mt-4 rounded-[26px] border border-[#EDE4D8] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#16386F]">
                Service Details
              </h2>
              <span className="rounded-full bg-[#FFF7E8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9A6200]">
                confirmed
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm text-[#4A433D]">
              <div className="flex justify-between gap-4">
                <span>Service</span>
                <span className="text-right font-medium text-[#16386F] capitalize">
                  {preview.service_type || preview.service}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Check-in</span>
                <span className="text-right font-medium text-[#16386F]">
                  {preview.check_in}
                </span>
              </div>

              {preview.check_out && (
                <div className="flex justify-between gap-4">
                  <span>Check-out / Time</span>
                  <span className="text-right font-medium text-[#16386F]">
                    {preview.check_out}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {preview?.pet_name && (
          <div className="mt-4 rounded-[26px] border border-[#EDE4D8] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
            <h2 className="text-lg font-semibold text-[#16386F]">
              Pet Details
            </h2>

            <div className="mt-4">
              <div className="rounded-2xl border border-[#EDE4D8] bg-[#FAF8F5] px-4 py-3 text-sm">
                <span className="font-semibold text-[#16386F]">
                  {preview.pet_name}
                </span>
              </div>
            </div>
          </div>
        )}

        {preview && (
          <div className="mt-4 rounded-[26px] border border-[#EDE4D8] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
            <h2 className="text-lg font-semibold text-[#16386F]">
              Owner Details
            </h2>

            <div className="mt-4 space-y-3 text-sm text-[#4A433D]">
              <div className="flex justify-between gap-4">
                <span>Owner</span>
                <span className="text-right font-medium text-[#16386F]">
                  {preview.owner_name}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Phone</span>
                <span className="text-right font-medium text-[#16386F]">
                  {preview.phone}
                </span>
              </div>

              {preview.instructions && (
                <div className="border-t border-[#EDE4D8] pt-3">
                  <p className="text-xs uppercase tracking-wide text-[#7A746C]">
                    Notes
                  </p>
                  <p className="mt-1 text-[#4A433D]">{preview.instructions}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 h-16 animate-pulse rounded-2xl bg-[#EDE4D8]/60" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="h-11 w-full animate-pulse rounded-full bg-[#EDE4D8]/60 sm:w-40" />
          <div className="h-11 w-full animate-pulse rounded-full bg-[#EDE4D8]/60 sm:w-32" />
        </div>

        {bookingId && (
          <p className="mt-4 text-center text-xs text-[#B8AFA3]">
            Booking ID: {bookingId}
          </p>
        )}
      </div>

      <style>{`
        @keyframes checkPop {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          60% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        .animate-checkPop {
          animation: checkPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .animate-checkDraw {
          animation: checkDraw 0.4s 0.3s ease-out both;
        }
      `}</style>
    </main>
  );
}
