import { z } from "zod";
import { APDSchema } from "./work-permit"; // reuse APD definitions

export const HazardSourceSchema = z.enum([
  "Mesin",
  "Peralatan",
  "Lingkungan Kerja",
  "Material",
  "OPL/Metode Kerja",
  "Perilaku",
]);

export const JSAAnalysisStepSchema = z.object({
  work_step: z.string().min(1, "Urutan pekerjaan wajib diisi"),
  hazard_source: z.string().min(1, "Sumber bahaya wajib diisi"),
  potential_hazard: z.string().min(1, "Potensi bahaya wajib diisi"),
  control_measure: z.string().min(1, "Upaya pengendalian wajib diisi"),
});

export const JSAFormSchema = z.object({
  job_number: z.string().min(1, "No Job wajib diisi").optional(), // set by BE
  job_name: z.string().min(1, "Nama Pekerjaan wajib diisi"),
  date: z.string(), // ISO format
  supervisor: z.string().min(1, "Nama Pengawas wajib diisi"),
  department: z.string().min(1, "Departemen wajib diisi"),
  executor: z.string().min(1, "Nama Pelaksana wajib diisi"),
  required_apd: z.array(APDSchema),
  hazard_sources: z.array(HazardSourceSchema).min(1, "Pilih minimal 1 sumber bahaya"),
  analysis_steps: z.array(JSAAnalysisStepSchema).min(1, "Minimal 1 langkah analisis"),
});

export type JSAForm = z.infer<typeof JSAFormSchema>;

export interface JSAAnalysisStep extends z.infer<typeof JSAAnalysisStepSchema> {
  id?: number;
  sequence: number;
}

export interface JSA extends JSAForm {
  id: number;
  job_number: string;
  analysis_steps: JSAAnalysisStep[];
  status: "DRAFT" | "WAITING_MANAGER" | "WAITING_K3" | "APPROVED_K3" | "REJECTED";
  created_at: string;
}
