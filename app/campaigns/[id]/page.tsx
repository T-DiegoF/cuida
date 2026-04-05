import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CampaignWithPatient, DonationWithDonor } from "@/types/database";
import CampaignDetailClient from "./CampaignDetailClient";

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: campaign }, { data: donations }] = await Promise.all([
    user
      ? supabase.from("profiles").select("full_name, role, avatar_url").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from("campaigns")
      .select(`
        id, title, story, status, goal_amount, current_amount, cover_image_url, created_at, patient_id,
        profiles:patient_id (id, full_name, avatar_url, location, bio),
        donations (count)
      `)
      .eq("id", params.id)
      .single(),
    supabase
      .from("donations")
      .select("*, profiles:donor_id(id, full_name, avatar_url)")
      .eq("campaign_id", params.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  if (!campaign) notFound();

  return (
    <CampaignDetailClient
      campaign={campaign as unknown as CampaignWithPatient}
      initialDonors={(donations ?? []) as unknown as DonationWithDonor[]}
      profile={profile}
    />
  );
}
