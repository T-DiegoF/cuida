// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "patient" | "doctor" | "donor";

export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type RequestStatus = "open" | "in_progress" | "resolved";

export type CampaignStatus = "active" | "completed" | "paused";

// ─── Table types ──────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole | null;
  avatar_url: string | null;
  specialty: string | null;
  location: string | null;
  bio: string | null;
  created_at: string;
}

export interface MedicalRequest {
  id: string;
  patient_id: string;
  title: string;
  description: string | null;
  specialty_needed: string | null;
  location: string | null;
  urgency: UrgencyLevel;
  status: RequestStatus;
  created_at: string;
}

export interface Campaign {
  id: string;
  patient_id: string;
  title: string;
  story: string | null;
  goal_amount: number;
  current_amount: number;
  cover_image_url: string | null;
  status: CampaignStatus;
  created_at: string;
}

export interface Donation {
  id: string;
  campaign_id: string;
  donor_id: string | null;
  amount: number;
  message: string | null;
  anonymous: boolean;
  created_at: string;
}

// ─── Joined / enriched types ─────────────────────────────────────────────────

export interface MedicalRequestWithPatient extends MedicalRequest {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "location"> | null;
}

export interface CampaignWithPatient extends Campaign {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
  donations?: { count: number }[];
}

export interface DonationWithDonor extends Donation {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
}

// ─── Insert types (omit auto-generated fields) ───────────────────────────────

export type ProfileInsert = Omit<Profile, "created_at">;

export type MedicalRequestInsert = Omit<MedicalRequest, "id" | "created_at"> & {
  status?: RequestStatus;
};

export type CampaignInsert = Omit<Campaign, "id" | "created_at" | "current_amount"> & {
  current_amount?: number;
  status?: CampaignStatus;
};

export type DonationInsert = Omit<Donation, "id" | "created_at"> & {
  anonymous?: boolean;
};

// ─── Filter types ─────────────────────────────────────────────────────────────

export interface RequestFilters {
  specialty?: string;
  location?: string;
  urgency?: UrgencyLevel;
  status?: RequestStatus;
}

export interface CampaignFilters {
  status?: CampaignStatus;
  category?: string;
}

// ─── Database schema (for Supabase client typing) ─────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
      };
      medical_requests: {
        Row: MedicalRequest;
        Insert: MedicalRequestInsert;
        Update: Partial<MedicalRequestInsert>;
      };
      campaigns: {
        Row: Campaign;
        Insert: CampaignInsert;
        Update: Partial<CampaignInsert>;
      };
      donations: {
        Row: Donation;
        Insert: DonationInsert;
        Update: Partial<DonationInsert>;
      };
    };
  };
}
