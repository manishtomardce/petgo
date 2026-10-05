import { notFound } from "next/navigation";
import {
  AirVent,
  BedDouble,
  Cctv,
  CircleCheck,
  Clock,
  Coffee,
  Droplets,
  Fence,
  GraduationCap,
  House,
  MapPin,
  Navigation,
  PartyPopper,
  PawPrint,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  Sofa,
  Star,
  Trees,
  UserCheck,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "../../../lib/supabase";
import BookNowButton from "@/components/club/BookNowButton";
import ClubDistance from "@/components/club/ClubDistance";
import ClubImageGallery from "@/components/club/ClubImageGallery";
import GoogleG from "@/components/club/GoogleG";

/**
 * Club details — ported from the app (petgo-app/app/club/[id].tsx): gallery,
 * name / location / rating, description, services, pricing, amenities,
 * policies, timings, location, and a sticky book bar. On wide screens the
 * page sits in a centred column instead of stretching across the window.
 */

type ClubDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const DEFAULT_POLICIES = [
  "Vaccinated dogs only",
  "Female dogs on heat are not advised to book",
];

/** Google Maps' pin red — the address points at a Google-sourced location. */
const MAP_PIN_RED = "#EA4335";

/** Keyed off the values actually present in club_details.amenities. */
const AMENITY_ICONS: Record<string, LucideIcon> = {
  cctv: Cctv,
  "ac rooms": AirVent,
  "fenced area": Fence,
  "fresh water": Droplets,
  "trained staff": UserCheck,
  "24x7 care": Clock,
  "hygiene maintained": ShieldCheck,
  "indoor seating": Sofa,
  "open space": Trees,
  "pet menu": Utensils,
};

const SERVICE_ICONS: Record<string, LucideIcon> = {
  daycare: House,
  boarding: BedDouble,
  pool: Waves,
  park: Trees,
  cafe: Coffee,
  grooming: Scissors,
  "play school": GraduationCap,
  events: PartyPopper,
};

function splitList(value: string | null | undefined) {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function serviceIcon(name: string) {
  return SERVICE_ICONS[name.toLowerCase()] ?? PawPrint;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[18px] font-semibold text-[#16386F]">{title}</h2>
      {children}
    </section>
  );
}

export default async function ClubDetailsPage({ params }: ClubDetailsPageProps) {
  const { id } = await params;

  const supabase = createClient();

  const { data: club, error } = await supabase
    .from("club_details")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !club) notFound();

  const images: string[] = Array.from(
    new Set([club.cover_image, ...splitList(club.images)].filter(Boolean))
  );
  const services = splitList(club.services);
  const amenities = splitList(club.amenities);
  const policies = Array.from(new Set([...DEFAULT_POLICIES, ...splitList(club.rules)]));
  const location = [club.area, club.city].filter(Boolean).join(", ");
  const hasCoords = club.latitude != null && club.longitude != null;

  // Cheapest service, so the sticky bar can say what the price is actually for.
  const prices = (
    [
      ["Pool", club.pool_price],
      ["Daycare", club.daycare_price],
      ["Boarding", club.boarding_price],
      ["Grooming", club.grooming_price],
      ["Cafe", club.cafe_price],
    ] as [string, number | null][]
  ).filter((row): row is [string, number] => row[1] != null);

  const cheapest = prices.length
    ? prices.reduce((low, row) => (row[1] < low[1] ? row : low))
    : null;

  const directionsUrl =
    club.google_maps_link ??
    (hasCoords
      ? `https://www.google.com/maps/search/?api=1&query=${club.latitude},${club.longitude}`
      : null);

  const shareText = [`${club.name}${location ? ` — ${location}` : ""}`, club.description]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="min-h-screen bg-white pb-36">
      <div className="mx-auto max-w-3xl">
        <ClubImageGallery images={images} clubName={club.name} shareText={shareText} />

        <div className="flex flex-col gap-8 px-5 pt-5">
          <div>
            <h1 className="text-[27px] font-bold leading-8 tracking-[-0.5px] text-[#16386F]">
              {club.name}
            </h1>

            {location && (
              <div className="mt-2 flex items-center gap-1.5">
                <MapPin size={15} fill={MAP_PIN_RED} color="#FFFFFF" strokeWidth={1.5} />
                <span className="text-[14px] text-[#7A746C]">{location}</span>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* Ratings come from Google Maps, so the G marks the source. */}
              <span className="flex items-center gap-1 rounded-full bg-[#FFF4DA] px-3 py-1.5">
                <GoogleG size={13} />
                <Star size={13} fill="#F4A623" color="#F4A623" />
                <span className="text-[13px] font-bold text-[#8A5A00]">{club.rating ?? "New"}</span>
                {club.review_count != null && (
                  <span className="text-[12px] text-[#8A5A00]">({club.review_count})</span>
                )}
              </span>

              <ClubDistance latitude={club.latitude} longitude={club.longitude} variant="chip" />
            </div>

            {club.description && (
              <p className="mt-4 text-[15px] leading-6 text-[#4A433D]">{club.description}</p>
            )}
          </div>

          {services.length > 0 && (
            <Section title="Services">
              <div className="flex flex-wrap gap-3">
                {services.map((service) => {
                  const Icon = serviceIcon(service);
                  return (
                    <span
                      key={service}
                      className="flex items-center gap-1.5 rounded-full bg-[#FFF7E8] px-4 py-2"
                    >
                      <Icon size={15} className="text-[#9A6200]" />
                      <span className="text-[14px] font-semibold capitalize text-[#9A6200]">
                        {service}
                      </span>
                    </span>
                  );
                })}
              </div>
            </Section>
          )}

          {prices.length > 0 && (
            <Section title="Pricing">
              <div className="overflow-hidden rounded-[22px] border border-[#EEE7DC] bg-white">
                {prices.map(([label, value], index) => {
                  const Icon = serviceIcon(label);
                  return (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-5 py-4 ${
                        index > 0 ? "border-t border-[#EEE7DC]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF7E8]">
                          <Icon size={17} className="text-[#9A6200]" />
                        </span>
                        <span className="text-[15px] font-semibold text-[#16386F]">{label}</span>
                      </div>
                      <span className="text-[16px] font-bold text-[#16386F]">₹{value}</span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {amenities.length > 0 && (
            <Section title="Amenities">
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3">
                {amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity.toLowerCase()] ?? CircleCheck;
                  return (
                    <div key={amenity} className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5]">
                        <Icon size={17} className="text-[#16386F]" />
                      </span>
                      <span className="line-clamp-2 flex-1 text-[13px] font-medium capitalize text-[#4A433D]">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          <Section title="Policies">
            <div className="overflow-hidden rounded-[22px] border border-[#EEE7DC] bg-white">
              {policies.map((policy, index) => (
                <div
                  key={policy}
                  className={`flex items-start gap-3 px-5 py-4 ${
                    index > 0 ? "border-t border-[#EEE7DC]" : ""
                  }`}
                >
                  <ShieldAlert size={17} className="mt-0.5 shrink-0 text-[#9A6200]" />
                  <span className="flex-1 text-[14px] leading-5 text-[#4A433D]">{policy}</span>
                </div>
              ))}
            </div>
          </Section>

          {club.timings && (
            <Section title="Timings">
              <div className="flex items-start gap-3 rounded-[22px] border border-[#EEE7DC] bg-white px-5 py-4">
                <Clock size={18} className="mt-0.5 shrink-0 text-[#16386F]" />
                <p className="flex-1 whitespace-pre-line text-[14px] leading-6 text-[#4A433D]">
                  {club.timings}
                </p>
              </div>
            </Section>
          )}

          {hasCoords && (
            <Section title="Location">
              <div className="h-[210px] overflow-hidden rounded-[22px] border border-[#EEE7DC] bg-[#F4EFE6] md:h-[280px]">
                <iframe
                  title={`${club.name} location map`}
                  src={`https://www.google.com/maps?q=${club.latitude},${club.longitude}&z=15&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <ClubDistance latitude={club.latitude} longitude={club.longitude} variant="line" />

              {club.address && (
                <p className="mt-2 text-[14px] leading-5 text-[#7A746C]">{club.address}</p>
              )}

              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-full border border-[#EDE4D8] bg-white py-3.5 text-[14px] font-semibold text-[#16386F] active:opacity-70"
                >
                  <Navigation size={17} />
                  Get directions
                </a>
              )}
            </Section>
          )}
        </div>
      </div>

      {/* Sticky book bar */}
      <div
        className="fixed bottom-0 left-0 z-30 w-full border-t border-[#EDE4D8] bg-white px-5 pt-4 shadow-[0_-6px_16px_rgba(17,24,39,0.06)]"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 14px)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between md:px-5">
          <div>
            <p className="text-[13px] text-[#7A746C]">
              {cheapest ? `${cheapest[0]} from` : "Starting from"}
            </p>
            <p className="text-[20px] font-bold text-[#16386F]">₹{cheapest ? cheapest[1] : "--"}</p>
          </div>

          <BookNowButton
            clubId={club.id}
            clubName={club.name}
            city={club.city}
            area={club.area}
            coverImage={images[0] ?? null}
            rating={club.rating}
            reviewCount={club.review_count}
            services={services}
            className="rounded-full bg-[#16386F] px-8 py-3.5 text-[15px] font-semibold text-white transition active:scale-[0.97] hover:opacity-95"
          />
        </div>
      </div>
    </div>
  );
}
