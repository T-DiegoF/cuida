import { createClient } from "@/lib/supabase/server";
import { MedicalRequestWithPatient } from "@/types/database";
import RequestsClient from "./RequestsClient";

export default async function RequestsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: requests }] = await Promise.all([
    user
      ? supabase.from("profiles").select("full_name, role, avatar_url").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from("medical_requests")
      .select(`
        id, title, status, urgency, specialty_needed, location, created_at, patient_id,
        profiles:patient_id (id, full_name, avatar_url, location)
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <RequestsClient
      initialRequests={(requests ?? []) as unknown as MedicalRequestWithPatient[]}
      profile={profile}
    />
  );
}
