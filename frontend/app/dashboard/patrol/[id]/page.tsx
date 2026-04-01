"use client";

import { useEffect, useState } from "react";
import { getPatrolById, approvePatrolByPIC, downloadPatrolPDF } from "@/lib/api/patrol";
import { PatrolK3 } from "@/types/patrol";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, CheckCircle, ArrowLeft, AlertOctagon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PatrolDetailPage() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop(); 
  
  const [patrol, setPatrol] = useState<PatrolK3 | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPatrolById(Number(id)).then(setPatrol).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-6">Memuat Data Patrol K3...</div>;
  if (!patrol) return <div className="p-6">Patrol K3 tidak ditemukan.</div>;

  const handlePICApprove = async () => {
    try {
      await approvePatrolByPIC(Number(id));
      alert("Patrol K3 telah diverifikasi dan disahkan oleh PIC Area.");
      window.location.reload();
    } catch {
      alert("Gagal memproses pengesahan PIC.");
    }
  };

  const handleDownload = () => {
    downloadPatrolPDF(Number(id), patrol.patrol_number).catch(console.error);
  };

  const categoriesKeys = Object.keys(patrol.patrol_categories || {});

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {patrol.has_critical && (
         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center gap-3">
             <AlertOctagon className="w-6 h-6" />
             <div>
                <p className="font-bold">CRITICAL ALARM DETECTED</p>
                <p className="text-sm">Patrol ini mencatat temuan Major/Kritikal. Segera lakukan eskalasi mitigasi.</p>
             </div>
         </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/patrol">
            <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{patrol.patrol_number}</h1>
            <p className="text-muted-foreground">{patrol.area} Inspeksi</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
           <div className="flex flex-col text-right mr-4">
               <span className="text-xs text-muted-foreground">K3 Score</span>
               <span className={`text-2xl font-bold ${patrol.total_score < 70 ? 'text-red-600' : 'text-green-600'}`}>
                   {patrol.total_score}
               </span>
           </div>
          <Badge variant={patrol.status === "APPROVED_PIC" ? "default" : "secondary"} className="text-sm px-4 py-1 h-fit">
             {patrol.status}
          </Badge>
          <Button variant="default" onClick={handleDownload} className="h-fit">
            <Download className="w-4 h-4 mr-2" /> PDF Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Metadata Inspeksi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Tanggal:</span>
                <span className="font-medium">{new Date(patrol.date).toLocaleDateString("id-ID")}</span>
                
                <span className="text-muted-foreground">Petugas Patrol:</span>
                <span className="font-medium">{patrol.patrol_officer}</span>
                
                <span className="text-muted-foreground">Area Gedung:</span>
                <span className="font-medium">{patrol.area}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle>Persetujuan PIC Area</CardTitle>
            <CardDescription>Otorisasi hasil checklist inspeksi.</CardDescription>
           </CardHeader>
           <CardContent>
              <Button 
                variant="outline" 
                onClick={handlePICApprove}
                disabled={patrol.status !== "WAITING_PIC"}
                className={patrol.status === "APPROVED_PIC" ? "bg-green-50 text-green-700 font-bold border-green-200" : ""}
              >
                {patrol.status === "APPROVED_PIC" ? <CheckCircle className="mr-2 text-green-600 w-5 h-5" /> : null}
                {patrol.status === "APPROVED_PIC" ? "Disahkan PIC (" + new Date(patrol.created_at).toLocaleDateString() + ")" : "✅ Verifikasi sebagai PIC Area"}
              </Button>
           </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {categoriesKeys.map((catKey) => {
            const items = patrol.patrol_categories[catKey];
            const hasIssues = items.some(i => i.score === "Minor" || i.score === "Major" || i.score === "Kritikal");

            return (
              <Card key={catKey} className={hasIssues ? "border-amber-200" : ""}>
                <CardHeader className="py-3 bg-slate-50/50">
                    <CardTitle className="text-lg flex justify-between">
                        {catKey}
                        {hasIssues && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Temuan Ditemukan</span>}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead className="w-1/2">Item Inspeksi</TableHead>
                         <TableHead className="w-32">Skor</TableHead>
                         <TableHead>Catatan</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                        {items.map((item, idx) => (
                           <TableRow key={idx}>
                             <TableCell className="font-medium">{item.item}</TableCell>
                             <TableCell>
                                <Badge variant={item.score === "OK" ? "default" : item.score === "N.A" ? "secondary" : "destructive"}>
                                    {item.score}
                                </Badge>
                             </TableCell>
                             <TableCell className={item.score !== "OK" && item.score !== "N.A" ? "text-red-600 font-medium" : "text-muted-foreground"}>
                                 {item.note || "-"}
                             </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                   </Table>
                </CardContent>
              </Card>
            );
        })}
      </div>
    </div>
  );
}
