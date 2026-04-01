import { PatrolK3 } from "@/types/patrol";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Plus, Eye, AlertTriangle } from "lucide-react";

async function getPatrols(): Promise<PatrolK3[]> {
  const res = await fetch("http://localhost:8080/api/v1/patrol", { cache: "no-store", headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function PatrolPage() {
  const patrols = await getPatrols();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklist Patrol K3</h1>
          <p className="text-muted-foreground">Monitor inspeksi 15 kategori dan kalkulasi skor keselamatan area Anda.</p>
        </div>
        <Link href="/dashboard/patrol/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Mulai Patrol
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Patrol</TableHead>
              <TableHead>Area / Gedung</TableHead>
              <TableHead>Tanggal Inspeksi</TableHead>
              <TableHead>Petugas</TableHead>
              <TableHead>Keselamatan Score</TableHead>
              <TableHead>Status Sign</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patrols.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                  Belum ada log patrol K3 tercatat.
                </TableCell>
              </TableRow>
            ) : (
              patrols.map((patrol) => (
                <TableRow key={patrol.id} className={patrol.has_critical ? "bg-red-50/50" : ""}>
                  <TableCell className="font-medium">
                     {patrol.patrol_number}
                  </TableCell>
                  <TableCell>{patrol.area}</TableCell>
                  <TableCell>{new Date(patrol.date).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>{patrol.patrol_officer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       {patrol.has_critical && <AlertTriangle className="w-4 h-4 text-red-600" />}
                       <span className={patrol.total_score < 70 ? "text-red-600 font-bold" : "text-green-700 font-medium"}>
                         {patrol.total_score}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={patrol.status === "APPROVED_PIC" ? "default" : "secondary"}>
                      {patrol.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/patrol/${patrol.id}`}>
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
