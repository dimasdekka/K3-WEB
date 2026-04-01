import { z } from "zod";

export const ClassificationSchema = z.enum([
  "Kerja Panas",
  "Kerja Listrik",
  "Ketinggian",
  "Alat Berat",
  "Perpipaan",
  "Tangki",
  "Ruang Tertutup",
  "Galian",
  "Subkon",
  "Risiko Tinggi",
  "Potensi Kontaminasi Produk",
]);

export const APDSchema = z.enum([
  "Helm",
  "Kacamata",
  "Goggle",
  "Masker",
  "Sarung Tangan",
  "Harness",
  "Pelampung",
  "Lain-lain",
]);

export const PersonnelSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  role: z.string().min(1, "Role wajib diisi"),
});

export const EquipmentSchema = z.object({
  type: z.enum(["Alat", "Mesin", "Material", "Alat Berat"]),
  name: z.string().min(1, "Nama wajib diisi"),
  quantity: z.number().min(1, "Minimal 1"),
});

export const ContaminationRiskSchema = z.object({
  activity: z.string().min(1, "Aktivitas wajib diisi"),
  hazard: z.string().min(1, "Temuan bahaya wajib diisi"),
  safety_measure: z.string().min(1, "Tindakan pencegahan wajib diisi"),
});

export const WorkPermitFormSchema = z.object({
  date: z.string(), // ISO String or date-picker string
  location: z.string().min(1, "Lokasi wajib diisi"),
  area: z.string().min(1, "Area wajib diisi"),
  plant: z.string().min(1, "Plant wajib diisi"),
  subcontractor: z.string().optional(),
  classifications: z.array(ClassificationSchema).min(1, "Pilih minimal 1 klasifikasi"),
  checklist_apd: z.array(APDSchema),
  personnel: z.array(PersonnelSchema).min(1, "Pekerjaan minimal membutuhkan 1 personel"),
  equipments: z.array(EquipmentSchema),
  risks: z.array(ContaminationRiskSchema).optional(), // Only for Manager Review usually
});

export type WorkPermitForm = z.infer<typeof WorkPermitFormSchema>;

export interface WorkPermit extends WorkPermitForm {
  id: number;
  permit_number: string;
  status: "DRAFT" | "WAITING_MANAGER" | "WAITING_K3" | "APPROVED" | "REJECTED";
  created_at: string;
  manager_approved_at?: string;
  k3_officer_approved_at?: string;
}
