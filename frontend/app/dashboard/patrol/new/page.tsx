"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatrolForm, PatrolFormSchema, INITIAL_CATEGORIES } from "@/types/patrol";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPatrol } from "@/lib/api/patrol";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewPatrolPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Pengaman Mesin");

  const form = useForm<PatrolForm>({
    resolver: zodResolver(PatrolFormSchema),
    defaultValues: {
      date: new Date().toISOString(),
      area: "",
      patrol_officer: "",
      patrol_categories: INITIAL_CATEGORIES,
    },
  });

  const categories = Object.keys(INITIAL_CATEGORIES);

  const onSubmit = async (data: PatrolForm) => {
    setLoading(true);
    try {
      await createPatrol(data);
      alert("Patrol K3 berhasil dikirimkan ke PIC Area!");
      router.push("/dashboard/patrol");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Gagal memproses data patrol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/patrol">
           <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formulir Checklist Patrol K3</h1>
          <p className="text-muted-foreground">Isi 15 Kategori inspeksi harian.</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Inspeksi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-sm font-medium">Area / Gedung</label>
                <Input {...form.register("area")} placeholder="Misal: Area Utility Plant 2" />
                {form.formState.errors.area && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.area.message}</p>
                )}
             </div>
             <div>
                <label className="text-sm font-medium">Petugas Patrol</label>
                <Input {...form.register("patrol_officer")} placeholder="Nama Petugas" />
                {form.formState.errors.patrol_officer && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.patrol_officer.message}</p>
                )}
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>15 Kategori Inspeksi Safety</CardTitle>
             <CardDescription>Berikan parameter kritis terhadap temuan bahaya</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-6">
               <TabsList className="md:w-64 flex flex-col items-stretch h-auto justify-start border bg-slate-50/50">
                  {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="justify-start px-4 py-2 border-b last:border-0 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-sm">
                       {cat}
                    </TabsTrigger>
                  ))}
               </TabsList>

               <div className="flex-1 min-h-[400px]">
                 {categories.map((cat) => (
                    <TabsContent key={cat} value={cat} className="mt-0">
                       <h3 className="text-lg font-bold border-b pb-2 mb-4">{cat}</h3>
                       
                       <div className="space-y-6">
                         {Array.isArray(form.watch(`patrol_categories.${cat}`)) && 
                          form.watch(`patrol_categories.${cat}`).map((itemLog: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-4 border rounded-md">
                               <div className="col-span-5 font-medium text-sm">
                                  {itemLog.item}
                               </div>
                               
                               <div className="col-span-3">
                                 <Controller
                                    name={`patrol_categories.${cat}.${idx}.score`}
                                    control={form.control}
                                    render={({ field }) => (
                                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Pilih Skor" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="N.A">N.A (Abaikan)</SelectItem>
                                            <SelectItem value="OK">OK (Aman)</SelectItem>
                                            <SelectItem value="Minor">Minor</SelectItem>
                                            <SelectItem value="Major">Major</SelectItem>
                                            <SelectItem value="Kritikal">KRITIKAL</SelectItem>
                                          </SelectContent>
                                       </Select>
                                    )}
                                 />
                               </div>

                               <div className="col-span-4">
                                  <Input {...form.register(`patrol_categories.${cat}.${idx}.note`)} placeholder="Catatan (wajib jika Major/Kritikal)" />
                               </div>
                            </div>
                         ))}
                       </div>
                    </TabsContent>
                 ))}
               </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-8">
           <Button type="submit" size="lg" disabled={loading} className="w-48">
              {loading ? "Menyimpan..." : <><Save className="w-4 h-4 mr-2" /> Akhiri Patrol</>}
           </Button>
        </div>
      </form>
    </div>
  );
}
