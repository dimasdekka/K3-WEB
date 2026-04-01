"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkPermitForm, WorkPermitFormSchema } from "@/types/work-permit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createWorkPermit } from "@/lib/api/work-permit";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewWorkPermitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Zod Integrated Form using Client Side Hooks
  const form = useForm<WorkPermitForm>({
    resolver: zodResolver(WorkPermitFormSchema),
    defaultValues: {
      date: new Date().toISOString(),
      location: "",
      area: "",
      plant: "",
      classifications: [],
      checklist_apd: [],
      personnel: [{ name: "", role: "Pekerja" }],
      equipments: [],
    },
  });

  const onSubmit = async (data: WorkPermitForm) => {
    setLoading(true);
    try {
      await createWorkPermit(data);
      router.push("/dashboard/work-permits");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Gagal membuat permit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Buat Izin Kerja Baru</h1>
      <p className="text-muted-foreground">Formulir F.120.21.00.01 Rev.02</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pekerjaan</CardTitle>
            <CardDescription>Detail lokasi dan subkon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Lokasi</label>
                <Input {...form.register("location")} placeholder="Lokasi kerja" />
                {form.formState.errors.location && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.location.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Area</label>
                <Input {...form.register("area")} placeholder="Area Spesifik" />
              </div>
              <div>
                <label className="text-sm font-medium">Plant</label>
                <Input {...form.register("plant")} placeholder="Nama Plant" />
              </div>
              <div>
                <label className="text-sm font-medium">Subkontraktor</label>
                <Input {...form.register("subcontractor")} placeholder="(Opsional)" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personel & Peralatan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-yellow-600 font-medium">
             (Untuk Phase 2 demo, minimal isi 1 nama pekerja di bawah ini. UI dinamis untuk menambah array belum disertakan untuk menjaga form ramping.)
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-medium">Nama Ketua Regu</label>
                  <Input {...form.register("personnel.0.name")} placeholder="Nama Personil" />
               </div>
            </div>
            {/* TODO: Add FieldArray dynamically */}
          </CardContent>
        </Card>

        {/* ... Other specific Checklist cards omitted for conciseness but mapping to Array strings above ... */}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Menyimpan..." : "Ajukan Izin Kerja"}
        </Button>
      </form>
    </div>
  );
}
