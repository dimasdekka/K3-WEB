import { WorkPermit } from "@/types/work-permit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";

// Server-side fetching
async function getPermits(): Promise<WorkPermit[]> {
  const res = await fetch("http://localhost:8080/api/v1/work-permits", { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function WorkPermitsPage() {
  const permits = await getPermits();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ijin Kerja</h1>
          <p className="text-muted-foreground">Kelola form izin kerja risiko tinggi di sini.</p>
        </div>
        <Link href="/dashboard/work-permits/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Buat Izin Baru
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Izin</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-32">
                  Belum ada Izin Kerja diterbitkan.
                </TableCell>
              </TableRow>
            ) : (
              permits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell className="font-medium">{permit.permit_number}</TableCell>
                  <TableCell>{new Date(permit.created_at).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>{permit.location} - {permit.area}</TableCell>
                  <TableCell>
                    <Badge variant={permit.status === "APPROVED" ? "default" : "secondary"}>
                      {permit.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/work-permits/${permit.id}`}>
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
