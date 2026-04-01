# 📋 Product Requirements Document (PRD)

## Sistem Informasi K3 Berbasis Web

### PT. Fonusa Agung Mulia

---

|                 |                                   |
| --------------- | --------------------------------- |
| **Versi**       | 1.0.0                             |
| **Tanggal**     | April 2026                        |
| **Status**      | Draft                             |
| **Dibuat oleh** | Tim Development                   |
| **Klien**       | PT. Fonusa Agung Mulia            |
| **Platform**    | Web Application (React + Node.js) |

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Scope & Modul Aplikasi](#2-scope--modul-aplikasi)
3. [Peran Pengguna (User Roles)](#3-peran-pengguna-user-roles)
4. [Fitur Per Modul](#4-fitur-per-modul)
5. [Rekomendasi Tech Stack](#5-rekomendasi-tech-stack)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [User Flow Utama](#7-user-flow-utama)
8. [Rencana Pengerjaan (Milestones)](#8-rencana-pengerjaan-milestones)
9. [Asumsi & Batasan](#9-asumsi--batasan)
10. [Persetujuan Dokumen](#10-persetujuan-dokumen)

---

## 1. Executive Summary

Dokumen ini merupakan Product Requirements Document (PRD) untuk pembangunan **sistem informasi K3 (Keselamatan dan Kesehatan Kerja) berbasis web** untuk PT. Fonusa Agung Mulia. Sistem ini akan mendigitalisasi seluruh proses administrasi K3 yang sebelumnya dilakukan secara manual menggunakan formulir kertas.

### Tujuan Utama

- ♻️ Mengurangi penggunaan kertas (paperless) dalam proses K3
- ⚡ Mempercepat proses pengisian, persetujuan, dan pelaporan formulir K3
- 🎯 Meningkatkan akurasi data dan kemudahan audit
- 📊 Mempermudah monitoring kondisi keselamatan kerja secara real-time
- 🗂️ Menyediakan histori dan arsip digital yang terstruktur

### Latar Belakang

PT. Fonusa Agung Mulia saat ini menggunakan formulir kertas untuk seluruh proses administrasi K3 mulai dari izin kerja, analisis keselamatan, patroli, hingga absensi kegiatan. Proses ini rentan terhadap kehilangan dokumen, lambat dalam proses persetujuan, dan sulit untuk diaudit. Sistem web ini hadir untuk menjawab tantangan tersebut.

---

## 2. Scope & Modul Aplikasi

Sistem ini mencakup **4 (empat) modul utama** yang merupakan digitalisasi dari formulir K3 yang digunakan PT. Fonusa Agung Mulia:

| No  | Nama Modul              | Kode Form             | Deskripsi                                                                                                                                             |
| --- | ----------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | F Ijin Kerja Pekerjaan  | F.120.21.00.01 Rev.02 | Formulir izin kerja untuk pekerjaan berisiko tinggi, meliputi klasifikasi pekerjaan, informasi pekerjaan, perlengkapan kerja, APD, dan validasi izin. |
| 2   | F Job Safety Analysis   | F.120.01.00.11 Rev.01 | Analisis keselamatan pekerjaan meliputi urutan pekerjaan, sumber bahaya, potensi bahaya, dan upaya pengendalian risiko.                               |
| 3   | Checklist Patrol K3     | PATROL-K3             | Checklist patroli keselamatan mencakup 15 kategori inspeksi mulai dari pengaman mesin, kelistrikan, emergency, hingga lingkungan kerja.               |
| 4   | Format Absensi Kegiatan | F.62.02.00.06 Rev.02  | Formulir absensi kegiatan K3 seperti coaching, konseling, mentoring, meeting, training, dan sharing.                                                  |

---

## 3. Peran Pengguna (User Roles)

### 3.1 Admin K3

- Akses penuh ke semua modul dan data
- Kelola master data (pengguna, departemen, area)
- Export laporan dan rekap data
- Pengaturan sistem dan konfigurasi

### 3.2 Petugas K3 / Safety Officer

- Buat dan isi formulir Ijin Kerja, JSA, Checklist Patrol
- Lakukan patrol dan input hasil checklist
- Lihat histori formulir yang dibuat sendiri
- Cetak / export formulir ke PDF

### 3.3 Pengawas Project

- Review dan approve formulir Ijin Kerja
- Input data potensi kontaminasi produk pada Ijin Kerja
- Lihat semua formulir di area yang menjadi tanggung jawabnya

### 3.4 Manager Area / PIC Area

- Approval akhir Ijin Kerja
- Lihat dashboard ringkasan kondisi K3 di areanya
- Validasi dan tanda tangan hasil patrol K3

### 3.5 Karyawan / Peserta

- Mengisi absensi kegiatan K3
- Lihat jadwal dan histori kegiatan K3 yang diikuti

---

## 4. Fitur Per Modul

### 4.1 Modul F Ijin Kerja Pekerjaan

> Digitalisasi formulir **F.120.21.00.01 Rev.02**. Digunakan sebelum melaksanakan pekerjaan yang termasuk kategori berisiko tinggi.

| ID    | Fitur                 | Prioritas | Deskripsi                                                                                                                                                                                   |
| ----- | --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IK-01 | Input Ijin Kerja      | 🔴 High   | Form input lengkap: nomor, tanggal, klasifikasi pekerjaan (checkbox), informasi pekerjaan (lokasi, area, plant, subkon, pengawas), daftar personel, perlengkapan kerja, APD, validasi izin. |
| IK-02 | Klasifikasi Pekerjaan | 🔴 High   | Pilihan checkbox: Kerja Panas, Kerja Listrik, Ketinggian, Alat Berat, Perpipaan, Tangki, Ruang Tertutup, Galian, Subkon, Risiko Tinggi, Potensi Kontaminasi Produk.                         |
| IK-03 | Perlengkapan Kerja    | 🔴 High   | Tabel input dinamis untuk Alat, Mesin, Material, dan Alat Berat beserta jumlahnya. Baris bisa ditambah dan dihapus.                                                                         |
| IK-04 | Checklist APD         | 🔴 High   | Checklist APD yang diperlukan: helm, kacamata, goggle, masker, sarung tangan berbagai jenis, harness, pelampung, dll.                                                                       |
| IK-05 | Alur Approval         | 🔴 High   | Alur: Diisi Pengawas Project → disetujui Manager Area → diperiksa Pengawas K3. Termasuk izin lembur dan pembatalan.                                                                         |
| IK-06 | Potensi Kontaminasi   | 🟡 Medium | Tabel aktifitas, potensi bahaya, dan langkah aman pekerjaan (diisi khusus oleh Pengawas Project).                                                                                           |
| IK-07 | Export PDF            | 🔴 High   | Export formulir yang sudah diisi ke format PDF dengan layout sesuai form asli.                                                                                                              |
| IK-08 | Histori Izin Kerja    | 🟡 Medium | Daftar semua izin kerja dengan filter status, tanggal, area, dan pencarian.                                                                                                                 |

---

### 4.2 Modul F Job Safety Analysis (JSA)

> Digitalisasi formulir **F.120.01.00.11 Rev.01**. Dokumen analisis bahaya sebelum pekerjaan dimulai.

| ID     | Fitur                  | Prioritas | Deskripsi                                                                                                                                                                          |
| ------ | ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JSA-01 | Input JSA              | 🔴 High   | Form header: No Job, Nama Pekerjaan, Pengawas, APD, Tgl. Terbit, Departemen, Pelaksana. Tabel baris analisis: urutan pekerjaan, sumber bahaya, potensi bahaya, upaya pengendalian. |
| JSA-02 | Sumber Bahaya          | 🔴 High   | Pilihan checkbox sumber bahaya: (1) Mesin, (2) Peralatan, (3) Lingkungan Kerja, (4) Material, (5) OPL/Metode Kerja, (6) Perilaku.                                                  |
| JSA-03 | Tabel Analisis Dinamis | 🔴 High   | Baris analisis bisa ditambah/dihapus sesuai kompleksitas pekerjaan.                                                                                                                |
| JSA-04 | Export PDF             | 🔴 High   | Export JSA ke PDF dengan format sesuai form F.120.01.00.11 Rev.01.                                                                                                                 |
| JSA-05 | Histori JSA            | 🟡 Medium | Daftar semua JSA dengan filter dan pencarian berdasarkan nama pekerjaan, pelaksana, tanggal.                                                                                       |

---

### 4.3 Modul Checklist Patrol K3

> Digitalisasi **Checklist Patrol K3 PT. Fonusa Agung Mulia**. Digunakan saat petugas melakukan patroli keselamatan di area kerja.

| ID    | Fitur                | Prioritas | Deskripsi                                                                                                                                                                                                                                            |
| ----- | -------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CP-01 | Input Patrol         | 🔴 High   | Header: tanggal, gedung/area, petugas patrol. Penilaian 15 kategori: Pengaman Mesin, Kelistrikan, Emergency, Kotak P3K, Eye Wash, APAR, Dokumen/Sign, Bahan Kimia, Lalu Lintas, Peralatan Angkat-Angkut, Lingkungan Kerja, APD, Manusia, LOTO, Umum. |
| CP-02 | Penilaian Item       | 🔴 High   | Setiap item patrol dinilai: **N.A / OK / Minor / Major / Kritikal** dengan kolom keterangan bebas.                                                                                                                                                   |
| CP-03 | Scoring Otomatis     | 🔴 High   | Sistem menghitung total score otomatis. Menampilkan Total Score, Hasil Patrol, dan flag 🚨 Kritikal jika ada temuan kritikal.                                                                                                                        |
| CP-04 | Tanda Tangan Digital | 🟡 Medium | Tanda tangan digital (e-sign) untuk Petugas Patrol dan PIC Area.                                                                                                                                                                                     |
| CP-05 | Export PDF           | 🔴 High   | Export checklist patrol ke PDF dengan layout sesuai form asli.                                                                                                                                                                                       |
| CP-06 | Dashboard Patrol     | 🟡 Medium | Grafik tren hasil patrol per area dan per periode. Highlight temuan kritikal yang belum ditindaklanjuti.                                                                                                                                             |

**Kategori Patrol (15 Kategori):**

| No  | Kategori                       | Jumlah Item |
| --- | ------------------------------ | ----------- |
| 1   | Pengaman Mesin                 | 6 item      |
| 2   | Electrical / Kelistrikan       | 5 item      |
| 3   | Emergency                      | 8 item      |
| 4   | Kotak P3K                      | 3 item      |
| 5   | Eye Wash dan Body Shower       | 2 item      |
| 6   | APAR (Alat Pemadam Api Ringan) | 5 item      |
| 7   | Dokumen / Sign                 | 2 item      |
| 8   | Bahan Kimia                    | 6 item      |
| 9   | Lalu Lintas                    | 3 item      |
| 10  | Peralatan Angkat-Angkut        | 3 item      |
| 11  | Lingkungan Kerja               | 7 item      |
| 12  | APD                            | 9 item      |
| 13  | Manusia                        | 1 item      |
| 14  | LOTO                           | 3 item      |
| 15  | Umum                           | 4 item      |

---

### 4.4 Modul Format Absensi Kegiatan

> Digitalisasi formulir **F.62.02.00.06 Rev.02**. Digunakan untuk mencatat kehadiran peserta pada kegiatan K3.

| ID    | Fitur             | Prioritas | Deskripsi                                                                                                                                              |
| ----- | ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AB-01 | Input Absensi     | 🔴 High   | Header: Jenis Kegiatan (Coaching / Konseling / Mentoring / Meeting / Training / Sharing), Tgl. Pelaksanaan, Materi, Sub Materi, Tutor, Waktu, Ruangan. |
| AB-02 | Daftar Peserta    | 🔴 High   | Tabel peserta: NIK/No ID Card, Nama Peserta, Departemen, kolom tanda tangan (upload foto TTD atau e-sign). Kapasitas hingga 26 peserta per form.       |
| AB-03 | Auto-fill Peserta | 🟡 Medium | Input NIK otomatis mengisi Nama dan Departemen dari database karyawan.                                                                                 |
| AB-04 | Export PDF        | 🔴 High   | Export absensi ke PDF dengan format F.62.02.00.06 Rev.02.                                                                                              |
| AB-05 | Rekap Kegiatan    | 🟡 Medium | Laporan rekap kegiatan K3 per periode: jumlah peserta, jenis kegiatan, frekuensi training.                                                             |

---

## 5. Rekomendasi Tech Stack

### 5.1 Frontend

| Teknologi                  | Kegunaan                 |
| -------------------------- | ------------------------ |
| **React.js** (Vite)        | UI Framework             |
| **TypeScript**             | Type safety              |
| **Tailwind CSS**           | Styling utility-first    |
| **Shadcn/UI**              | Komponen UI              |
| **React Hook Form + Zod**  | Form handling & validasi |
| **Zustand**                | State management         |
| **React Query (TanStack)** | Server state & caching   |
| **jsPDF + html2canvas**    | Export PDF               |
| **react-signature-canvas** | Tanda tangan digital     |
| **React Router v6**        | Routing                  |

### 5.2 Backend

| Teknologi          | Kegunaan                            |
| ------------------ | ----------------------------------- |
| **Node.js**        | Runtime                             |
| **Express.js**     | Framework HTTP                      |
| **TypeScript**     | Type safety                         |
| **PostgreSQL**     | Database utama                      |
| **Prisma**         | ORM                                 |
| **JWT**            | Autentikasi                         |
| **Zod**            | Validasi input API                  |
| **MinIO / AWS S3** | File storage (upload TTD, lampiran) |

### 5.3 Infrastruktur

| Teknologi                   | Kegunaan               |
| --------------------------- | ---------------------- |
| **Docker + Docker Compose** | Containerization       |
| **Nginx**                   | Reverse proxy          |
| **GitHub Actions**          | CI/CD                  |
| **PostgreSQL backup**       | Backup otomatis harian |

---

## 6. Non-Functional Requirements

### 6.1 Performa

- Halaman utama load dalam **< 3 detik** pada koneksi normal
- Mendukung minimal **50 pengguna aktif** secara bersamaan
- Export PDF selesai dalam **< 10 detik**
- API response time **< 500ms** untuk query standar

### 6.2 Keamanan

- Autentikasi menggunakan JWT dengan expiry **8 jam** (access token 15 menit + refresh token)
- **Role-based access control (RBAC)** ketat untuk setiap endpoint dan halaman
- Semua password di-hash menggunakan bcrypt (cost factor ≥ 12)
- **HTTPS wajib** untuk semua komunikasi
- **Audit trail** — log setiap aksi pengguna (create, update, approve, reject)
- Input sanitization untuk mencegah XSS dan SQL injection

### 6.3 Ketersediaan

- Uptime minimal **99%** pada jam kerja (06.00 – 22.00 WIB)
- Maintenance dijadwalkan di luar jam kerja
- Data backup otomatis setiap hari pukul 02.00 WIB

### 6.4 Usability

- Responsif untuk **desktop dan tablet** (minimal 768px)
- Antarmuka sepenuhnya berbahasa **Indonesia**
- Mendukung browser: Chrome, Firefox, Edge (2 versi terbaru)
- Accessible: kontras warna memenuhi WCAG AA

---

## 7. User Flow Utama

### 7.1 Alur Pengajuan Izin Kerja

```
[Petugas K3]
    │
    ├─ 1. Login ke sistem
    ├─ 2. Pilih menu 'Ijin Kerja' > 'Buat Baru'
    ├─ 3. Isi formulir: klasifikasi, info pekerjaan, personel, APD
    └─ 4. Submit ke Pengawas Project
            │
            [Pengawas Project]
            ├─ 5. Review formulir
            ├─ 6. Isi tabel Potensi Kontaminasi Produk
            └─ 7. Submit ke Manager Area
                    │
                    [Manager Area]
                    ├─ 8. Review dan Approve / Reject
                    └─ 9. Diteruskan ke Pengawas K3
                            │
                            [Pengawas K3]
                            ├─ 10. Pemeriksaan akhir
                            ├─ 11. Tanda tangan & sahkan
                            └─ 12. ✅ Izin Kerja AKTIF & siap cetak
```

### 7.2 Alur Patrol K3

```
[Petugas Patrol]
    │
    ├─ 1. Login ke sistem
    ├─ 2. Pilih 'Patrol K3' > 'Mulai Patrol Baru'
    ├─ 3. Isi header: tanggal, area, nama petugas
    ├─ 4. Isi penilaian item satu per satu (N.A/OK/Minor/Major/Kritikal)
    ├─ 5. Tambah keterangan untuk item bermasalah
    ├─ 6. Submit → sistem hitung score otomatis
    ├─ 7. Tanda tangan digital Petugas Patrol
    └─ 8. Dikirim ke PIC Area untuk tanda tangan
            │
            [PIC Area]
            └─ 9. ✅ Tanda tangan → Patrol tersimpan & bisa dicetak
```

### 7.3 Alur Absensi Kegiatan

```
[Petugas K3 / Admin]
    │
    ├─ 1. Buat form absensi baru
    ├─ 2. Isi header kegiatan (jenis, materi, tutor, waktu, ruangan)
    ├─ 3. Tambah daftar peserta (input NIK → auto-fill nama & departemen)
    ├─ 4. Peserta tanda tangan (e-sign atau upload foto TTD)
    └─ 5. ✅ Simpan & export PDF
```

---

## 8. Rencana Pengerjaan (Milestones)

| Fase  | Deliverable        | Estimasi | Keterangan                                                         |
| ----- | ------------------ | -------- | ------------------------------------------------------------------ |
| **1** | Setup & Arsitektur | 1 Minggu | Setup project, database schema, autentikasi, RBAC, struktur folder |
| **2** | Modul Ijin Kerja   | 2 Minggu | Form lengkap, alur approval multi-level, export PDF                |
| **3** | Modul JSA          | 1 Minggu | Form JSA, tabel dinamis, export PDF                                |
| **4** | Modul Patrol K3    | 2 Minggu | Form checklist 15 kategori, scoring otomatis, dashboard            |
| **5** | Modul Absensi      | 1 Minggu | Form absensi, auto-fill NIK, export PDF                            |
| **6** | Testing & UAT      | 1 Minggu | User Acceptance Testing bersama klien, perbaikan bug               |
| **7** | Go Live & Training | 3 Hari   | Deploy ke server produksi, training user, serah terima dokumen     |

**Total estimasi: ±8 minggu**

---

## 9. Asumsi & Batasan

### 9.1 Asumsi

- Klien menyediakan server (VPS/on-premise) untuk deployment
- Data master karyawan (NIK, nama, departemen) tersedia dalam format Excel untuk diimpor
- Pengguna memiliki akses internet yang stabil selama jam kerja
- Klien menyediakan logo, nomor dokumen resmi, dan aset visual lainnya
- Browser yang digunakan pengguna adalah versi modern (bukan IE)

### 9.2 Batasan (Out of Scope)

Fitur berikut **tidak termasuk** dalam scope pengerjaan ini:

- ❌ Aplikasi mobile native (iOS/Android)
- ❌ Integrasi dengan sistem HR atau ERP eksternal
- ❌ Notifikasi otomatis via SMS atau WhatsApp
- ❌ Mode offline tanpa koneksi internet
- ❌ Modul formulir K3 di luar 4 modul yang telah disebutkan
- ❌ Business Intelligence / BI dashboard lanjutan

---

## 10. Persetujuan Dokumen

Dokumen PRD ini telah ditinjau dan disetujui oleh pihak-pihak berikut:

| Peran           | Nama | Tanda Tangan | Tanggal |
| --------------- | ---- | ------------ | ------- |
| Product Owner   |      |              |         |
| Project Manager |      |              |         |
| Tech Lead       |      |              |         |
| Klien / PIC FAM |      |              |         |

---

> 📌 **Catatan:** Dokumen ini bersifat _living document_ dan akan diperbarui sesuai hasil diskusi dan perubahan kebutuhan. Setiap perubahan wajib dicatat di tabel revisi dan disetujui oleh semua pihak terkait.

---

_PRD v1.0.0 — Sistem Informasi K3 Web PT. Fonusa Agung Mulia — April 2026_
