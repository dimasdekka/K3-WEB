"use client";

import { useEffect, useState } from "react";
import { getWorkPermitById, approveByManager, approveByK3, downloadPDF } from "@/lib/api/work-permit";
import { WorkPermit } from "@/types/work-permit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WorkPermitDetailPage() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop(); // Client param fallback
  
  const [permit, setPermit] = useState<WorkPermit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getWorkPermitById(Number(id)).then(setPermit).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-6">Loading Permit...</div>;
  if (!permit) return <div className="p-6">Permit not found.</div>;

  const handleManagerApprove = async () => {
    try {
      await approveByManager(Number(id));
      alert("Disetujui Manager Area.");
      window.location.reload();
    } catch {
      alert("Gagal memproses persetujuan.");
    }
  };

  const handleK3Approve = async () => {
    try {
      await approveByK3(Number(id));
      alert("Disetujui Pengawas K3.");
      window.location.reload();
    } catch {
      alert("Gagal memproses persetujuan.");
    }
  };

  const handleDownload = () => {
    downloadPDF(Number(id), permit.permit_number).catch(console.error);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/work-permits">
            <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{permit.permit_number}</h1>
            <p className="text-muted-foreground">Detail Izin Kerja - {new Date(permit.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={permit.status === "APPROVED" ? "default" : "secondary"} className="text-sm px-4">
            {permit.status}
          </Badge>
          <Button variant="default" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> PDF Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Lokasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Lokasi: </strong>{permit.location}</p>
            <p><strong>Area: </strong>{permit.area}</p>
            <p><strong>Plant: </strong>{permit.plant}</p>
            <p><strong>Subkon: </strong>{permit.subcontractor || "-"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tindakan Persetujuan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={handleManagerApprove}
                disabled={permit.status !== "WAITING_MANAGER" && permit.status !== "DRAFT"} 
                className={permit.manager_approved_at ? "bg-green-50" : ""}
              >
                {permit.manager_approved_at ? <CheckCircle className="mr-2 text-green-600" /> : null}
                {permit.manager_approved_at ? "Telah Disetujui Manager Area" : "Persetujuan Manager Area"}
              </Button>

              <Button 
                variant="outline" 
                onClick={handleK3Approve}
                disabled={permit.status !== "WAITING_K3"}
                className={permit.k3_officer_approved_at ? "bg-green-50" : ""}
              >
                {permit.k3_officer_approved_at ? <CheckCircle className="mr-2 text-green-600" /> : null}
                {permit.k3_officer_approved_at ? "Telah Disetujui Pengawas K3" : "Persetujuan Pengawas K3"}
              </Button>
            </div>
            {permit.status === "APPROVED" && (
              <p className="text-sm text-green-700 font-medium">✨ Izin Kerja telah sepenuhnya disetujui (AKTIF).</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
