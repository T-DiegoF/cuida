"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (role === "patient") router.replace("/dashboard/patient");
    else if (role === "doctor") router.replace("/dashboard/doctor");
    else if (role === "donor") router.replace("/dashboard/donor");
    else router.replace("/dashboard/patient"); // fallback
  }, [role, loading, router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-3 w-64">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
        <p className="text-sm text-text-muted mt-2">Cuida está buscando...</p>
      </div>
    </div>
  );
}
