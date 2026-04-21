import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase";
import BookingPageClient from "../../../components/booking/BookingPageClient";

type BookPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ service?: string }>;
};

export default async function BookPage({
  params,
  searchParams,
}: BookPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const cleanId = String(id).trim();

  const supabase = createClient();

  const { data: club, error } = await supabase
    .from("club_details")
    .select(`
      id,
      name,
      city,
      area,
      cover_image,
      rating,
      review_count,
      services,
      pool_price,
      daycare_price,
      boarding_price,
      grooming_price,
      cafe_price
    `)
    .eq("id", cleanId)
    .maybeSingle();

  if (error || !club) {
    notFound();
  }

  return (
    <BookingPageClient
      club={club}
      initialService={resolvedSearchParams?.service || ""}
    />
  );
}