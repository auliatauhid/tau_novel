# Taunovel — Platform Membaca Novel Online

**Taunovel** adalah platform membaca novel online modern, minimalis, dan elegan yang memungkinkan pembaca menikmati pengalaman membaca yang nyaman serta memungkinkan administrator mengelola novel dan mengimpor novel secara otomatis menggunakan file Microsoft Word (`.docx`).

---

## 🚀 Fitur Utama

### 📖 Sisi Pembaca (Reader)
- **Katalog & Pencarian**: Jelajahi novel berdasarkan genre, status (Ongoing, Completed, Hiatus), popularitas (views), serta pencarian judul & penulis dengan debounce.
- **Detail Novel**: Tampilan sinopsis lengkap, statistik bab, total view, genre badges, dan daftar bab.
- **Dedicated Chapter Reader**:
  - Pengaturan tampilan (Theme: Light, Dark, Sepia).
  - Skala ukuran huruf (A-, A, A+, A++).
  - Lebar halaman membaca (Sempit, Normal, Lebar).
  - Navigasi bab sebelumnya & berikutnya dengan shortcut keyboard (`←` dan `→`).
  - Modal pemilih bab langsung.
- **Reading Progress & Continue Reading**:
  - Pelacakan progress scroll membaca (0–100%) dengan penyimpanan hemat daya (debounced server synchronization).
  - Fitur "Lanjutkan Membaca" di Homepage dan Library.
- **Library Pribadi**:
  - Daftar novel yang sedang dibaca dengan persentase chapter terakhir.
  - Daftar bookmark novel favorit.

### 🛡️ Sisi Administrator (Admin)
- **Server-Side Protected Admin Routes**: Akses rute `/admin/*` diverifikasi ketat di server-side (role `ADMIN`).
- **Dashboard Statistik**: Total novel, novel terbit, novel draft, total bab, pengguna, views, dan riwayat impor.
- **Manajemen Novel**: CRUD novel, filter status publikasi, toggle Publish/Unpublish, dan hapus data cascading.
- **Manajemen Bab**: Tambah bab baru, edit konten dengan formatting toolbar (Bold, Italic, Heading, Quote, Break, Paragraf), hapus bab, split bab, merge bab, dan reorder urutan nomor bab.
- **DOCX Import Engine**:
  - Validasi berkas (hanya `.docx`, magic bytes zip check, batas ukuran berkas 25MB).
  - Ekstraksi metadata otomatis (Judul, Penulis, Genre, Bahasa, Status, Sinopsis).
  - Deteksi bab otomatis (`BAB 1`, `Bab 1 — Judul`, `CHAPTER 1`, roman numerals, mixed casing).
  - Normalisasi & sanitasi HTML (pencegahan XSS, pembersihan tag Word XML).
  - Toleransi kesalahan (`NEEDS_REVIEW` jika tidak terdeteksi bab, deteksi nomor bab hilang / duplikat).
  - Review UI interaktif: Edit metadata, split bab, merge bab, ubah urutan, dan preview tampilan reader.
  - Simpan sebagai Draft atau langsung Publikasikan.
- **Preview Reader yang Identik**: Administrator dapat melihat pratinjau chapter menggunakan komponen Reader yang sama persis dengan yang dilihat pengguna.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router) & React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Autentikasi**: Auth.js (NextAuth) dengan Credentials & JWT Session
- **DOCX Parser**: Mammoth & Docx generator
- **Sanitasi Konten**: DOMPurify / sanitize-html
- **Validasi**: Zod

---

## 📂 Struktur Direktori

```text
app/
├── (public)/
│   ├── page.tsx                    # Homepage
│   ├── novels/page.tsx             # Katalog novel
│   ├── novel/[slug]/page.tsx       # Detail novel
│   ├── novel/[slug]/chapter/[chapterNumber]/page.tsx # Reader novel
│   └── library/page.tsx            # Library pengguna
├── (auth)/
│   ├── login/page.tsx              # Halaman login
│   └── register/page.tsx           # Halaman registrasi
├── admin/
│   ├── layout.tsx                  # Server-side auth protected layout
│   ├── page.tsx                    # Admin Dashboard
│   ├── novels/
│   │   ├── page.tsx                # Kelola novel
│   │   ├── new/page.tsx            # Tambah manual
│   │   ├── import/page.tsx         # Alur impor Word .docx
│   │   └── [id]/
│   │       ├── page.tsx            # Edit novel
│   │       ├── chapters/page.tsx   # Kelola bab (split, merge, reorder)
│   │       └── preview/page.tsx    # Reader preview admin
│   └── users/page.tsx              # Kelola pengguna
├── api/                            # Next.js Route Handlers (Auth, Progress, Admin)
components/
├── layout/                         # Navbar, Footer, AdminHeader, AdminSidebar
├── novel/                          # NovelCard, NovelGrid, NovelDetail, SearchBar, dll.
├── reader/                         # ChapterReader, ReaderSettings
├── admin/                          # DocxUploader, ImportProgress, ImportReview, dll.
└── ui/                             # Button, Input, Card, Modal, Skeleton
lib/
├── auth/                           # NextAuth options & auth utilities
├── db/                             # Prisma client instance
├── docx-parser/                    # Modul parser .docx modular & teruji
└── services/                       # Business logic services
prisma/
├── schema.prisma                   # PostgreSQL database schema
└── seed.ts                         # Sample data seeder
docs/
├── templates/                      # Template resmi Word
└── DOCX_IMPORT.md                  # Dokumentasi teknis impor .docx
```

---

## ⚙️ Persyaratan Sistem & Instalasi

### 1. Prasyarat
- Node.js versi 20+
- PostgreSQL Server aktif

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env` dan sesuaikan nilainya:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/taunovel?schema=public"
AUTH_SECRET="your-auth-secret-here"
NEXTAUTH_SECRET="your-auth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-admin-password"
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Setup Database & Seed Data
Jalankan sinkronisasi database Prisma dan buat data awal:
```bash
# Sinkronkan skema ke database PostgreSQL
npm run db:push

# Isi database dengan data contoh (novel, bab, genre)
npm run db:seed
```

Data contoh yang dibuat oleh seed mencakup:
- **Koleksi Novel Fiktif Original**: Lengkap dengan genre, cover, bab pembuka, dan metrik bacaan.
- **Kategori Genre Populer**: Fantasy, Romance, Action, Adventure, Sci-Fi, Drama, dll.

---

## 🧪 Menjalankan Parser Tests

Taunovel memiliki rangkaian pengujian unit otomatis untuk engine parser `.docx` sesuai skenario spesifikasi (8 pengujian sintaksis + 1 pengujian berkas biner `.docx` nyata):

```bash
npm run test:parser
```

Seluruh pengujian mencakup:
1. Ekstraksi chapter standar (`BAB 1`, `BAB 2`, `BAB 3`).
2. Ekstraksi judul bab bertanda (`BAB 1 — Pertemuan`).
3. Ekstraksi penulisan berbahasa Inggris (`CHAPTER 1`).
4. Variasi huruf besar-kecil (`Bab 1`, `CHAPTER 2`, `bab 3`).
5. Dokumen tanpa penanda bab (`NEEDS_REVIEW`).
6. Peringatan nomor bab duplikat (`DUPLICATE_CHAPTER_NUMBER`).
7. Peringatan nomor bab hilang (`MISSING_CHAPTER`).
8. Peringatan bab kosong (`EMPTY_CHAPTER`).
9. Pengujian berkas `.docx` biner asli (`Template_Import_Novel.docx`).

---

## 💻 Menjalankan Aplikasi

### Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3001`.

### Mode Production Build
```bash
npm run build
npm run start
```

---

## 📄 Template Word Resmi
File template resmi dapat ditemukan di `docs/templates/Template_Import_Novel.docx` atau diunduh langsung dari menu **Import DOCX** di dashboard admin.
Panduan lengkap mengenai format Word dan teknik Manual Split / Merge dapat dibaca di [Panduan DOCX Import](docs/DOCX_IMPORT.md).

---

&copy; 2026 Taunovel. Dikembangkan dengan kesederhanaan dan kenyamanan membaca.
