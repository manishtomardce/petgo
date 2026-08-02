import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase";

type BookingConfirmationPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ whatsapp?: string; debug?: string }>;
};

type PetDetail = {
  name?: string;
  breed?: string;
  size?: string;
};

function parsePetDetails(booking: any): PetDetail[] {
  if (Array.isArray(booking.pet_details) && booking.pet_details.length) {
    return booking.pet_details;
  }

  if (booking.pet_name) {
    return [
      {
        name: booking.pet_name,
        breed: booking.pet_breed,
        size: booking.pet_size,
      },
    ];
  }

  return [];
}

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: BookingConfirmationPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const whatsappSent = resolvedSearchParams?.whatsapp === "1";
  const debugMode = resolvedSearchParams?.debug === "1";

  const supabase = createClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !booking) {
    notFound();
  }

  const bookingClubId = String(booking.club_id ?? "").trim();
  const bookingClubName = String(booking.club_name ?? "").trim();

  const { data: clubById, error: clubByIdError } = bookingClubId
    ? await supabase
        .from("club_details")
        .select("id, name, city, area, address, latitude, longitude")
        .eq("id", bookingClubId)
        .maybeSingle()
    : { data: null, error: null };

  const { data: clubByName, error: clubByNameError } =
    !clubById && bookingClubName
      ? await supabase
          .from("club_details")
          .select("id, name, city, area, address, latitude, longitude")
          .eq("name", bookingClubName)
          .maybeSingle()
      : { data: null, error: null };

  const club = clubById || clubByName || null;

  const clubCity = String(club?.city ?? booking.city ?? "").trim() || "-";
  const clubArea = String(club?.area ?? booking.area ?? "").trim() || "-";
  const clubAddress =
    String(club?.address ?? booking.address ?? "").trim() || "-";

  const latitude =
    club?.latitude !== null && club?.latitude !== undefined
      ? Number(club.latitude)
      : null;

  const longitude =
    club?.longitude !== null && club?.longitude !== undefined
      ? Number(club.longitude)
      : null;

  const hasCoordinates =
    latitude !== null &&
    longitude !== null &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  const mapsQuery = [clubAddress, clubArea, clubCity]
    .filter((value) => value && value !== "-")
    .join(", ");

  const googleMapsLink = hasCoordinates
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        mapsQuery
      )}`
    : null;

  const pets = parsePetDetails(booking);

  const whatsappSupportText = [
    "Hi PetGo, I need help with my booking.",
    `Booking ID: ${booking.id}`,
    `Club: ${booking.club_name || club?.name || "-"}`,
    `Owner: ${booking.owner_name || "-"}`,
    `Phone: ${booking.owner_phone || booking.phone || "-"}`,
    `Service: ${booking.service_type || booking.service || "-"}`,
    `Pet: ${booking.pet_name || "-"}`,
    `Check-in: ${booking.check_in || booking.booking_date || "-"}`,
    booking.check_out ? `Check-out: ${booking.check_out}` : null,
    clubCity !== "-" ? `City: ${clubCity}` : null,
    clubArea !== "-" ? `Area: ${clubArea}` : null,
    clubAddress !== "-" ? `Address: ${clubAddress}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappSupportUrl = `https://wa.me/919667078411?text=${encodeURIComponent(
    whatsappSupportText
  )}`;

  const debugData = {
    bookingId: booking.id,
    bookingClubIdRaw: booking.club_id,
    bookingClubIdTrimmed: bookingClubId,
    bookingClubNameRaw: booking.club_name,
    clubByIdFound: Boolean(clubById),
    clubByNameFound: Boolean(clubByName),
    clubByIdError: clubByIdError?.message ?? null,
    clubByNameError: clubByNameError?.message ?? null,
    resolvedClub: club,
    resolvedAddress: clubAddress,
    resolvedArea: clubArea,
    resolvedCity: clubCity,
    latitude,
    longitude,
    hasCoordinates,
    mapsQuery,
    googleMapsLink,
  };

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
            {booking.club_name || club?.name
              ? `${booking.club_name || club?.name} will get in touch with you shortly.`
              : "We've received your booking request."}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[#EDE4D8] bg-[#F4FBF7] px-4 py-3 text-sm text-[#2F6B45]">
          {whatsappSent
            ? "WhatsApp notification sent successfully."
            : "Booking saved successfully. WhatsApp notification is pending or could not be sent."}
        </div>

        {(clubAddress !== "-" || googleMapsLink) && (
          <div className="mt-4 rounded-[26px] border border-[#EDE4D8] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-[#16386F]">
                  {booking.club_name || club?.name || "Club"}
                </h2>
                {clubAddress !== "-" && (
                  <p className="mt-1 text-sm text-[#7A746C]">{clubAddress}</p>
                )}
              </div>

              {googleMapsLink && (
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-semibold text-[#16386F]"
                >
                  Open map
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-[26px] border border-[#EDE4D8] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#16386F]">
              Service Details
            </h2>
            <span className="rounded-full bg-[#FFF7E8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9A6200]">
              {booking.status || "confirmed"}
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm text-[#4A433D]">
            <div className="flex justify-between gap-4">
              <span>Service</span>
              <span className="text-right font-medium text-[#16386F] capitalize">
                {booking.service_type || booking.service || "-"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Check-in</span>
              <span className="text-right font-medium text-[#16386F]">
                {booking.check_in || booking.booking_date || "-"}
              </span>
            </div>

            {booking.check_out && (
              <div className="flex justify-between gap-4">
                <span>Check-out / Time</span>
                <span className="text-right font-medium text-[#16386F]">
                  {booking.check_out}
                </span>
              </div>
            )}
          </div>
        </div>

        {pets.length > 0 && (
          <div className="mt-4 rounded-[26px] border border-[#EDE4D8] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#16386F]">
                Pet Details
              </h2>
              <span className="rounded-full bg-[#FFF7E8] px-3 py-1 text-xs font-semibold text-[#9A6200]">
                {pets.length} {pets.length === 1 ? "pet" : "pets"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {pets.map((pet, index) => (
                <div
                  key={`${pet.name}-${index}`}
                  className="rounded-2xl border border-[#EDE4D8] bg-[#FAF8F5] px-4 py-3 text-sm text-[#4A433D]"
                >
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-[#16386F]">
                      {pet.name || `Pet ${index + 1}`}
                    </span>
                    <span className="capitalize text-[#7A746C]">
                      {pet.size || "small"}
                    </span>
                  </div>
                  {pet.breed && (
                    <p className="mt-1 text-[#7A746C]">{pet.breed}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-[26px] border border-[#EDE4D8] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
          <h2 className="text-lg font-semibold text-[#16386F]">
            Owner Details
          </h2>

          <div className="mt-4 space-y-3 text-sm text-[#4A433D]">
            <div className="flex justify-between gap-4">
              <span>Owner</span>
              <span className="text-right font-medium text-[#16386F]">
                {booking.owner_name || "-"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span>Phone</span>
              <span className="text-right font-medium text-[#16386F]">
                {booking.owner_phone || booking.phone || "-"}
              </span>
            </div>

            {booking.instructions && (
              <div className="border-t border-[#EDE4D8] pt-3">
                <p className="text-xs uppercase tracking-wide text-[#7A746C]">
                  Notes
                </p>
                <p className="mt-1 text-[#4A433D]">{booking.instructions}</p>
              </div>
            )}
          </div>
        </div>

        {debugMode && (
          <div className="mt-4 rounded-2xl border border-[#EDE4D8] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#16386F]">
              Debug info
            </h3>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-[#4A433D]">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-[#EDE4D8] bg-white px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-neutral-800">
              Need help with this booking?
            </p>

            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#25D366",
                color: "#ffffff",
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.5 2.1 7.9L.3 31.7l8-2.1c2.3 1.3 4.9 2 7.7 2 8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm0 28.5c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5c-1.3-2.1-2-4.5-2-6.9 0-7.3 5.9-13.2 13.2-13.2S29.2 8.7 29.2 16 23.3 28.9 16 28.9zm7.3-9.8c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2s-.9 1.2-1.1 1.5c-.2.2-.4.3-.7.1-.4-.2-1.5-.6-2.8-1.9-1-1-1.7-2.2-1.9-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2.1-.5 0-.7s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5s-1.3 1.2-1.3 2.9 1.3 3.4 1.5 3.6c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.7-.5z"
                />
              </svg>
              Support
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#CF8750] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:w-auto"
          >
            Return to Home
          </Link>

          <Link
            href={`/clubs/${booking.club_id}`}
            className="inline-flex w-full items-center justify-center rounded-full border border-[#E7DED1] bg-white px-5 py-3 text-sm font-semibold text-[#16386F] transition hover:bg-[#FAF8F5] sm:w-auto"
          >
            View Club
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-[#B8AFA3]">
          Booking ID: {booking.id}
        </p>
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
