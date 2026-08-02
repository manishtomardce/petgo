type ClubDetails = {
  name: string;
  city: string | null;
  area: string | null;
  cover_image: string | null;
  rating: number | null;
  review_count: number | null;
  services?: string[] | null;
  distance_km?: number | null;
};

type ClubSummaryCardProps = {
  club: ClubDetails;
  selectedService: string;
};

function formatDistance(distance?: number | null) {
  if (distance == null || Number.isNaN(distance)) return null;

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  return `${distance.toFixed(1)} km away`;
}

export default function ClubSummaryCard({
  club,
  selectedService,
}: ClubSummaryCardProps) {
  const services = club.services?.filter(Boolean) ?? [];
  const distanceText = formatDistance(club.distance_km);

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#EDE4D8] bg-white shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
      <div className="flex gap-4 p-4">
        {club.cover_image && (
          <img
            src={club.cover_image}
            alt={club.name}
            className="h-20 w-20 shrink-0 rounded-2xl object-cover"
            draggable={false}
          />
        )}

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-[#16386F]">
            {club.name}
          </h2>

          <p className="mt-0.5 text-sm text-[#7A746C]">
            {[club.area, club.city].filter(Boolean).join(", ")}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#7A746C]">
            {club.rating ? (
              <span>
                ⭐ {club.rating} ({club.review_count ?? 0} reviews)
              </span>
            ) : null}

            {distanceText ? (
              <span className="font-medium">{distanceText}</span>
            ) : null}
          </div>
        </div>
      </div>

      {services.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-[#EDE4D8] px-4 py-3">
          {services.map((item) => {
            const isActive =
              item.trim().toLowerCase() === selectedService.trim().toLowerCase();

            return (
              <span
                key={item}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  isActive
                    ? "bg-[#16386F] text-white"
                    : "bg-[#FFF7E8] text-[#9A6200]"
                }`}
              >
                {item}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}