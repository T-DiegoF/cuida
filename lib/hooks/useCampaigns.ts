"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Campaign,
  CampaignInsert,
  CampaignWithPatient,
  CampaignFilters,
  Donation,
  DonationInsert,
} from "@/types/database";

export function useCampaigns() {
  const supabase = createClient();

  const getAll = useCallback(
    async (filters?: CampaignFilters): Promise<CampaignWithPatient[]> => {
      let query = supabase
        .from("campaigns")
        .select(
          `
          id, title, story, status, goal_amount, current_amount, cover_image_url, created_at, patient_id,
          profiles:patient_id (
            id,
            full_name,
            avatar_url
          ),
          donations (count)
        `
        )
        .order("created_at", { ascending: false })
        .limit(20);

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar campanhas:", error.message);
        return [];
      }
      return (data ?? []) as unknown as CampaignWithPatient[];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getById = useCallback(
    async (id: string): Promise<CampaignWithPatient | null> => {
      const { data, error } = await supabase
        .from("campaigns")
        .select(
          `
          id, title, story, status, goal_amount, current_amount, cover_image_url, created_at, patient_id,
          profiles:patient_id (
            id,
            full_name,
            avatar_url,
            location,
            bio
          ),
          donations (count)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar campanha:", error.message);
        return null;
      }
      return data as unknown as CampaignWithPatient;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const create = useCallback(
    async (data: CampaignInsert): Promise<Campaign | null> => {
      const { data: created, error } = await supabase
        .from("campaigns")
        .insert({
          ...data,
          current_amount: data.current_amount ?? 0,
          status: data.status ?? "active",
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar campanha:", error.message);
        return null;
      }
      return created as Campaign;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const donate = useCallback(
    async (
      campaignId: string,
      amount: number,
      message?: string,
      anonymous = false,
      donorId?: string
    ): Promise<Donation | null> => {
      const supabaseClient = createClient();

      // Get current user if donorId not provided
      let resolvedDonorId = donorId;
      if (!resolvedDonorId) {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        resolvedDonorId = user?.id;
      }

      const donationPayload: DonationInsert = {
        campaign_id: campaignId,
        donor_id: resolvedDonorId ?? null,
        amount,
        message: message ?? null,
        anonymous,
      };

      // Insert donation
      const { data: donation, error: donationError } = await supabaseClient
        .from("donations")
        .insert(donationPayload)
        .select()
        .single();

      if (donationError) {
        console.error("Erro ao registrar doação:", donationError.message);
        return null;
      }

      // Atomic increment — single query, no race condition
      await supabaseClient.rpc("increment_campaign_amount", {
        p_campaign_id: campaignId,
        p_amount: amount,
      });

      return donation as Donation;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { getAll, getById, create, donate };
}
