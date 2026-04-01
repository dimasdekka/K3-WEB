import { JSA } from "@/types/jsa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";

async function getJSAs(): Promise<JSA[]> {
  const res = await fetch("http://localhost:8080/api/v1/jsa", { cache: "no-store", headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function JSAPage() {
  const jsas = await getJSAs();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Safety Analysis</h1>
          <p className="text-muted-foreground">Kelola form analisis keselamatan kerja (F.120.01.00.11 Rev.01).</p>
        </div>
        <Link href="/dashboard/jsa/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Buat JSA Baru
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Job / Nama Pekerjaan</TableHead>
              <TableHead>Tanggal Terbit</TableHead>
              <TableHead>Departemen / Pelaksana</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jsas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-32">
                  Belum ada dokumen JSA.
                </TableCell>
              </TableRow>
            ) : (
              jsas.map((jsa) => (
                <TableRow key={jsa.id}>
                  <TableCell className="font-medium">
                    {jsa.job_number}
                    <div className="text-xs text-muted-foreground mt-1">{jsa.job_name}</div>
                  </TableCell>
                  <TableCell>{new Date(jsa.created_at).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>{jsa.department} / {jsa.executor}</TableCell>
                  <TableCell>
                    <Badge variant={jsa.status === "APPROVED_K3" ? "default" : "secondary"}>
                      {jsa.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/jsa/${jsa.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" /> Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
