"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSAForm, JSAFormSchema } from "@/types/jsa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createJSA } from "@/lib/api/jsa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function NewJSAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<JSAForm>({
    resolver: zodResolver(JSAFormSchema),
    defaultValues: {
      date: new Date().toISOString(),
      job_name: "",
      supervisor: "",
      department: "",
      executor: "",
      hazard_sources: ["Peralatan"], // pre-filled for phase demo
      required_apd: ["Helm", "Kacamata"],
      analysis_steps: [
        { work_step: "", hazard_source: "", potential_hazard: "", control_measure: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "analysis_steps",
    control: form.control,
  });

  const onSubmit = async (data: JSAForm) => {
    setLoading(true);
    try {
      await createJSA(data);
      router.push("/dashboard/jsa");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Gagal membuat JSA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Buat Job Safety Analysis (JSA)</h1>
      <p className="text-muted-foreground">Formulir Analisis F.120.01.00.11 Rev.01</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Header Informasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nama Pekerjaan</label>
                <Input {...form.register("job_name")} placeholder="Contoh: Pengelasan Pipa" />
                {form.formState.errors.job_name && (
                   <p className="text-red-500 text-xs mt-1">{form.formState.errors.job_name.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Pengawas</label>
                <Input {...form.register("supervisor")} placeholder="Nama Supervisor" />
              </div>
              <div>
                <label className="text-sm font-medium">Departemen</label>
                <Input {...form.register("department")} placeholder="Nama Departemen" />
              </div>
              <div>
                <label className="text-sm font-medium">Pelaksana</label>
                <Input {...form.register("executor")} placeholder="Nama Pelaksana / Vendor" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Langkah Analisis Keselamatan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 items-start border p-4 rounded-md">
                <div className="col-span-1 flex flex-col items-center justify-center font-bold text-lg mt-8">
                  #{index + 1}
                </div>
                <div className="col-span-10 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Urutan Pekerjaan</label>
                    <Input {...form.register(`analysis_steps.${index}.work_step`)} placeholder="Urutan kerja..." />
                    {form.formState.errors.analysis_steps?.[index]?.work_step && (
                      <p className="text-red-500 text-xs mt-1">{form.formState.errors.analysis_steps[index]?.work_step?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sumber Bahaya</label>
                    <Input {...form.register(`analysis_steps.${index}.hazard_source`)} placeholder="Aktivitas dominan..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Potensi Bahaya</label>
                    <Input {...form.register(`analysis_steps.${index}.potential_hazard`)} placeholder="Apa bahayanya..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Upaya Pengendalian</label>
                    <Input {...form.register(`analysis_steps.${index}.control_measure`)} placeholder="Tindakan mitigasi..." />
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-center mt-8">
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
               type="button" 
               variant="outline" 
               className="w-full" 
               onClick={() => append({ work_step: "", hazard_source: "", potential_hazard: "", control_measure: "" })}
            >
              <Plus className="w-4 h-4 mr-2" /> Tambah Urutan Pekerjaan
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Menyimpan JSA..." : "Simpan dan Ajukan JSA"}
        </Button>
      </form>
    </div>
  );
}
