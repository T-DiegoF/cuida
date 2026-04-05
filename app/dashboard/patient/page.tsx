import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MedicalRequestWithPatient, CampaignWithPatient } from "@/types/database";
import PatientDashboardClient from "./PatientDashboardClient";

export default async function PatientDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [
    { data: profile },
    { data: requests },
    { data: campaigns },
  ] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role, avatar_url, location, bio, specialty").eq("id", user.id).single(),
    supabase.from("medical_requests").select("id, title, status, urgency, specialty_needed, location, created_at, patient_id, profiles:patient_id(id, full_name, avatar_url, location)").eq("patient_id", user.id).eq("status", "open").order("created_at", { ascending: false }).limit(10),
    supabase.from("campaigns").select("id, title, story, status, goal_amount, current_amount, cover_image_url, created_at, patient_id, profiles:patient_id(id, full_name, avatar_url), donations(count)").eq("patient_id", user.id).eq("status", "active").order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <PatientDashboardClient
      profile={profile}
      requests={(requests ?? []) as unknown as MedicalRequestWithPatient[]}
      campaigns={(campaigns ?? []) as unknown as CampaignWithPatient[]}
    />
  );
}
