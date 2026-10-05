import { createClient } from "@/lib/supabase";
import { CLUB_LIST_COLUMNS } from "@/lib/clubList";
import HomeClient, { type Club } from "@/components/home/HomeClient";

// Clubs ship inside the page HTML, so phones see them without waiting for the
// app to boot and fetch. Refreshed at most once a minute.
export const revalidate = 60;

export default async function HomePage() {
  const { data, error } = await createClient()
    .from("club_details")
    .select(CLUB_LIST_COLUMNS)
    .order("rating", { ascending: false });

  if (error) console.error("Error fetching clubs:", error);

  // On failure, hand over null and let the client fetch as before.
  return <HomeClient initialClubs={error ? null : ((data ?? []) as Club[])} />;
}
