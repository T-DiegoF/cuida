"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MedicalRequest,
  MedicalRequestInsert,
  MedicalRequestWithPatient,
  RequestFilters,
  RequestStatus,
} from "@/types/database";

export function useRequests() {
  const supabase = createClient();

  const getAll = useCallback(
    async (
      filters?: RequestFilters
    ): Promise<MedicalRequestWithPatient[]> => {
      let query = supabase
        .from("medical_requests")
        .select(
          `
          id, title, status, urgency, specialty_needed, location, created_at, patient_id,
          profiles:patient_id (
            id,
            full_name,
            avatar_url,
            location
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(20);

      if (filters?.specialty) {
        query = query.ilike("specialty_needed", `%${filters.specialty}%`);
      }
      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters?.urgency) {
        query = query.eq("urgency", filters.urgency);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar pedidos:", error.message);
        return [];
      }
      return (data ?? []) as unknown as MedicalRequestWithPatient[];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getById = useCallback(
    async (id: string): Promise<MedicalRequestWithPatient | null> => {
      const { data, error } = await supabase
        .from("medical_requests")
        .select(
          `
          *,
          profiles:patient_id (
            id,
            full_name,
            avatar_url,
            location
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar pedido:", error.message);
        return null;
      }
      return data as MedicalRequestWithPatient;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const create = useCallback(
    async (
      data: MedicalRequestInsert
    ): Promise<MedicalRequest | null> => {
      const { data: created, error } = await supabase
        .from("medical_requests")
        .insert({ ...data, status: data.status ?? "open" })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar pedido:", error.message);
        return null;
      }
      return created as MedicalRequest;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const updateStatus = useCallback(
    async (
      id: string,
      status: RequestStatus
    ): Promise<MedicalRequest | null> => {
      const { data, error } = await supabase
        .from("medical_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar status:", error.message);
        return null;
      }
      return data as MedicalRequest;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { getAll, getById, create, updateStatus };
}
