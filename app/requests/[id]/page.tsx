import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MedicalRequestWithPatient } from "@/types/database";
import RequestDetailClient from "./RequestDetailClient";

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: request }] = await Promise.all([
    user
      ? supabase.from("profiles").select("full_name, role, avatar_url").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from("medical_requests")
      .select(`
        id, title, description, status, urgency, specialty_needed, location, created_at, patient_id,
        profiles:patient_id (id, full_name, avatar_url, location)
      `)
      .eq("id", params.id)
      .single(),
  ]);

  if (!request) notFound();

  return (
    <RequestDetailClient
      initialRequest={request as unknown as MedicalRequestWithPatient}
      profile={profile}
      userRole={profile?.role ?? null}
    />
  );
}
