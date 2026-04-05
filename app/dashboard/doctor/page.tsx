import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MedicalRequestWithPatient } from "@/types/database";
import DoctorDashboardClient from "./DoctorDashboardClient";

export default async function DoctorDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [
    { data: profile },
    { data: openRequests },
    { data: myRequests },
  ] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role, avatar_url, location, specialty").eq("id", user.id).single(),
    supabase.from("medical_requests").select("id, title, status, urgency, specialty_needed, location, created_at, patient_id, profiles:patient_id(id, full_name, avatar_url, location)").eq("status", "open").order("created_at", { ascending: false }).limit(20),
    supabase.from("medical_requests").select("id, title, status, urgency, specialty_needed, location, created_at, patient_id, profiles:patient_id(id, full_name, avatar_url, location)").eq("status", "in_progress").order("created_at", { ascending: false }).limit(3),
  ]);

  return (
    <DoctorDashboardClient
      profile={profile}
      openRequests={(openRequests ?? []) as unknown as MedicalRequestWithPatient[]}
      myRequests={(myRequests ?? []) as unknown as MedicalRequestWithPatient[]}
    />
  );
}
