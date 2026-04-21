import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase";

type BookingConfirmationPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ whatsapp?: string; debug?: string }>;
};

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

          <div className="mt-4 rounded-2xl border border-[#e7f3ea] bg-[#f4fbf6] px-4 py-3 text-sm text-[#2f6b45]">
            {whatsappSent
              ? "WhatsApp notification sent successfully."
              : "Booking saved successfully. WhatsApp notification is pending or could not be sent."}
          </div>

          <div className="mt-6 rounded-[24px] border border-[#f1ebe3] bg-[#fffaf5] p-5">
            <h2 className="text-base font-semibold text-[#2d241c]">
              Booking details
            </h2>

            <div className="mt-4 space-y-3 text-sm text-[#5f5448]">
              <div className="flex justify-between gap-4">
                <span>Booking ID</span>
                <span className="font-medium text-[#2d241c]">{booking.id}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Club</span>
                <span className="text-right font-medium text-[#2d241c]">
                  {booking.club_name || club?.name || "-"}
                </span>
              </div>

             

              <div className="flex justify-between gap-4">
                <span>Address</span>
                <span className="text-right font-medium text-[#2d241c]">
                  {clubAddress}
                </span>
              </div>

             

              {googleMapsLink && (
                <div className="flex justify-between gap-4">
                  <span>Location</span>
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-right font-semibold text-[#cf8750] underline underline-offset-2"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span>Owner</span>
                <span className="text-right font-medium text-[#2d241c]">
                  {booking.owner_name || "-"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Phone</span>
                <span className="text-right font-medium text-[#2d241c]">
                  {booking.owner_phone || booking.phone || "-"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Service</span>
                <span className="text-right font-medium text-[#2d241c]">
                  {booking.service_type || booking.service || "-"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Pet</span>
                <span className="text-right font-medium text-[#2d241c]">
                  {booking.pet_name || "-"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Check-in</span>
                <span className="text-right font-medium text-[#2d241c]">
                  {booking.check_in || booking.booking_date || "-"}
                </span>
              </div>

              {booking.check_out && (
                <div className="flex justify-between gap-4">
                  <span>Check-out / Time</span>
                  <span className="text-right font-medium text-[#2d241c]">
                    {booking.check_out}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span>Status</span>
                <span className="rounded-full bg-[#f7eadf] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9a5c2e]">
                  {booking.status || "confirmed"}
                </span>
              </div>

              {booking.instructions && (
                <div className="border-t border-[#efe7dc] pt-3">
                  <p className="text-xs uppercase tracking-wide text-[#8d7f72]">
                    Notes
                  </p>
                  <p className="mt-1 text-sm text-[#5f5448]">
                    {booking.instructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {debugMode && (
            <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#fffaf5] p-4">
              <h3 className="text-sm font-semibold text-[#2d241c]">
                Debug info
              </h3>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-[#5f5448]">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-[#e8e1d8] bg-white px-4 py-4">
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
              className="inline-flex w-full items-center justify-center rounded-full bg-[#cf8750] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:w-auto"
            >
              Return to Home
            </Link>

            <Link
              href={`/clubs/${booking.club_id}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#e7ded3] bg-white px-5 py-3 text-sm font-semibold text-[#2d241c] transition hover:bg-[#faf7f2] sm:w-auto"
            >
              View Club
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}