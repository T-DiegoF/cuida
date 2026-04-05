import { createClient } from "@/lib/supabase/server";
import { CampaignWithPatient } from "@/types/database";
import CampaignsClient from "./CampaignsClient";

export default async function CampaignsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: campaigns }] = await Promise.all([
    user
      ? supabase.from("profiles").select("full_name, role, avatar_url").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from("campaigns")
      .select(`
        id, title, story, status, goal_amount, current_amount, cover_image_url, created_at, patient_id,
        profiles:patient_id (id, full_name, avatar_url),
        donations (count)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <CampaignsClient
      initialCampaigns={(campaigns ?? []) as unknown as CampaignWithPatient[]}
      profile={profile}
    />
  );
}
