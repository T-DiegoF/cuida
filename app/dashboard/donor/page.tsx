import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CampaignWithPatient } from "@/types/database";
import DonorDashboardClient from "./DonorDashboardClient";

export default async function DonorDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [
    { data: profile },
    { data: campaigns },
    { data: donations },
  ] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role, avatar_url, location, bio, specialty").eq("id", user.id).single(),
    supabase.from("campaigns").select("id, title, story, status, goal_amount, current_amount, cover_image_url, created_at, patient_id, profiles:patient_id(id, full_name, avatar_url), donations(count)").eq("status", "active").order("created_at", { ascending: false }).limit(20),
    supabase.from("donations").select("id, amount, created_at, campaign_id, anonymous, message, campaigns(title)").eq("donor_id", user.id).order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <DonorDashboardClient
      profile={profile}
      initialCampaigns={(campaigns ?? []) as unknown as CampaignWithPatient[]}
      donations={(donations ?? []) as unknown as Parameters<typeof DonorDashboardClient>[0]["donations"]}
    />
  );
}
