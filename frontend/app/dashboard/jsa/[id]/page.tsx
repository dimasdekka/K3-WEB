"use client";

import { useEffect, useState } from "react";
import { getJSAById, approveJSAByK3, downloadJSAPDF } from "@/lib/api/jsa";
import { JSA } from "@/types/jsa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function JSADetailPage() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop(); 
  
  const [jsa, setJsa] = useState<JSA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getJSAById(Number(id)).then(setJsa).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-6">Memuat Data JSA...</div>;
  if (!jsa) return <div className="p-6">JSA tidak ditemukan.</div>;

  const handleK3Approve = async () => {
    try {
      await approveJSAByK3(Number(id));
      alert("JSA Disetujui Pengawas K3.");
      window.location.reload();
    } catch {
      alert("Gagal memproses persetujuan K3.");
    }
  };

  const handleDownload = () => {
    downloadJSAPDF(Number(id), jsa.job_number).catch(console.error);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/jsa">
            <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{jsa.job_number}</h1>
            <p className="text-muted-foreground">Job Safety Analysis - {jsa.job_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={jsa.status === "APPROVED_K3" ? "default" : "secondary"} className="text-sm px-4">
             {jsa.status}
          </Badge>
          <Button variant="default" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Print PDF JSA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Metadata Pekerjaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Tanggal Terbit: </strong>{new Date(jsa.date).toLocaleDateString()}</p>
            <p><strong>Pengawas: </strong>{jsa.supervisor}</p>
            <p><strong>Departemen: </strong>{jsa.department}</p>
            <p><strong>Pelaksana: </strong>{jsa.executor}</p>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle>Persetujuan K3</CardTitle>
            <CardDescription>Otorisasi langkah keselamatan dasar.</CardDescription>
           </CardHeader>
           <CardContent>
              <Button 
                variant="outline" 
                onClick={handleK3Approve}
                disabled={jsa.status !== "WAITING_K3"}
                className={jsa.status === "APPROVED_K3" ? "bg-green-50" : ""}
              >
                {jsa.status === "APPROVED_K3" ? <CheckCircle className="mr-2 text-green-600" /> : null}
                {jsa.status === "APPROVED_K3" ? "Telah Disetujui Petugas K3" : "Persetujuan K3"}
              </Button>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>Analisis Potensi Bahaya (Dinamis)</CardTitle>
           <CardDescription>Rincian langkah operasional dan mitigasi.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Seq</TableHead>
                 <TableHead>Urutan Kerja</TableHead>
                 <TableHead>Sumber Bahaya</TableHead>
                 <TableHead>Potensi Dampak Bahaya</TableHead>
                 <TableHead>Pengendalian Mutlak</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
                {jsa.analysis_steps.map((step) => (
                   <TableRow key={step.id}>
                     <TableCell className="font-bold">{step.sequence}</TableCell>
                     <TableCell>{step.work_step}</TableCell>
                     <TableCell>{step.hazard_source}</TableCell>
                     <TableCell className="text-red-600">{step.potential_hazard}</TableCell>
                     <TableCell className="text-green-700 font-medium">{step.control_measure}</TableCell>
                   </TableRow>
                ))}
             </TableBody>
           </Table>
        </CardContent>
      </Card>
    </div>
  );
}
