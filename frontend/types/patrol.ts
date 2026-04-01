import { z } from "zod";

export const PatrolScoreSchema = z.enum(["N.A", "OK", "Minor", "Major", "Kritikal"]);

export const PatrolItemSchema = z.object({
  item: z.string(),
  score: PatrolScoreSchema,
  note: z.string().optional(),
});

// Using a Record dict structure mapping category to array of evaluations
export const PatrolCategoriesSchema = z.record(z.string(), z.array(PatrolItemSchema));

export const PatrolFormSchema = z.object({
  date: z.string(),
  area: z.string().min(1, "Area/Gedung wajib diisi"),
  patrol_officer: z.string().min(1, "Petugas Patrol wajib diisi"),
  patrol_categories: PatrolCategoriesSchema,
});

export type PatrolForm = z.infer<typeof PatrolFormSchema>;

export interface PatrolK3 extends PatrolForm {
  id: number;
  patrol_number: string;
  total_score: number;
  has_critical: boolean;
  status: "WAITING_PIC" | "APPROVED_PIC";
  created_at: string;
  pic_approved_at?: string;
}

// Helper to initialize the 15 master categories securely
export const INITIAL_CATEGORIES = {
  "Pengaman Mesin": [{ item: "Cover Mesin", score: "N.A" as const, note: "" }, { item: "Sensor Safety", score: "N.A" as const, note: "" }],
  "Electrical / Kelistrikan": [{ item: "Panel Listrik", score: "N.A" as const, note: "" }],
  "Emergency": [{ item: "Jalur Evakuasi", score: "N.A" as const, note: "" }, { item: "Lampu Darurat", score: "N.A" as const, note: "" }],
  "Kotak P3K": [{ item: "Obat-obatan utuh", score: "N.A" as const, note: "" }],
  "Eye Wash dan Body Shower": [{ item: "Fungsi Air", score: "N.A" as const, note: "" }],
  "APAR": [{ item: "Pressure APAR", score: "N.A" as const, note: "" }],
  "Dokumen / Sign": [{ item: "Rambu K3 Terpasang", score: "N.A" as const, note: "" }],
  "Bahan Kimia": [{ item: "Label B3", score: "N.A" as const, note: "" }],
  "Lalu Lintas": [{ item: "Jalur Forklift", score: "N.A" as const, note: "" }],
  "Peralatan Angkat-Angkut": [{ item: "SIA & SIO", score: "N.A" as const, note: "" }],
  "Lingkungan Kerja": [{ item: "Kebersihan Area (5S)", score: "N.A" as const, note: "" }],
  "APD": [{ item: "Pekerja Memakai Helm", score: "N.A" as const, note: "" }],
  "Manusia": [{ item: "Perilaku Aman", score: "N.A" as const, note: "" }],
  "LOTO": [{ item: "Padlock Terpasang", score: "N.A" as const, note: "" }],
  "Umum": [{ item: "Kondisi Fasilitas Umum", score: "N.A" as const, note: "" }],
};
