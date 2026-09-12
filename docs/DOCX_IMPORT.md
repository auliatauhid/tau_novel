# Panduan Import Dokumen Word (.docx) — Taunovel

Fitur import dokumen Microsoft Word `.docx` adalah salah satu fitur inti dari platform **Taunovel**. Fitur ini memungkinkan administrator mengunggah draf novel dalam format Word, mengekstrak metadata secara otomatis, mendeteksi seluruh bab cerita, melakukan normalisasi dan sanitasi HTML, mengedit hasil parsing, memecah (split) atau menggabungkan (merge) bab, meninjau lewat Reader Preview, dan mempublikasikannya ke pembaca.

---

## 1. Lokasi Berkas Template

Template resmi Taunovel tersedia di:
- `docs/templates/Template_Import_Novel.docx`
- `public/templates/Template_Import_Novel.docx` (dapat diunduh langsung dari halaman admin import)

---

## 2. Struktur Dokumen Resmi

Dokumen Word yang optimal memiliki dua bagian utama:
1. **Bagian Metadata Novel** (di bagian awal dokumen)
2. **Bagian Bab & Isi Cerita** (Bab 1, Bab 2, dst.)

### Format Metadata
```text
METADATA NOVEL

Judul Novel: Legenda Pedang Bintang
Penulis: Aria Wijaya
Genre: Fantasy, Action, Adventure
Bahasa: Indonesia
Status: Ongoing
Sinopsis:
Kisah petualangan seorang pemuda pedesaan bernama Rey yang secara tak sengaja menemukan Pedang Bintang di sebuah gua purba.
```

Kunci metadata yang dikenali parser:
- **Judul Novel / Title / Judul**: Judul novel yang akan ditampilkan.
- **Penulis / Author / Pengarang**: Nama pembuat cerita.
- **Genre / Kategori**: Daftar genre dipisahkan koma.
- **Bahasa / Language**: Bahasa novel (default: Indonesia).
- **Status**: Status novel (`Ongoing`, `Completed` / `Tamat`, atau `Hiatus`).
- **Cover / URL Cover / Link Cover / Tautan Cover**: Tautan link gambar cover (mendukung link langsung, Google Drive, Dropbox, dll.).
- **Sinopsis / Deskripsi / Synopsis**: Ringkasan cerita (mendukung multi-paragraf).

### Format Bab (Chapter)
Parser Taunovel mendukung berbagai format penulisan bab yang umum dan case-insensitive:
- `BAB 1 — Judul Bab`
- `BAB 1 - Judul Bab`
- `Bab 1 : Judul Bab`
- `Bab 1`
- `CHAPTER 1 — Judul Bab`
- `Chapter 1`
- `Chapter One`

Jika judul bab tidak dituliskan (misal hanya `BAB 10`), parser akan otomatis menggunakan `BAB 10` sebagai judul bab agar judul tidak kosong.

---

## 3. Alur Kerja Import (Workflow)

```text
UPLOAD (.docx)
      ↓
VALIDASI BERKAS (MIME, Magic Bytes, Ekstensi, Ukuran Maks. 25MB)
      ↓
EKSTRAKSI TEKS & HTML (Mammoth)
      ↓
DETEKSI METADATA & BAB
      ↓
NORMALISASI & SANITASI HTML (Pembersihan Word HTML & XSS)
      ↓
REVIEW & EDITING (Metadata, Daftar Bab)
      ↓
FITUR INTERAKTIF (Split Bab, Merge Bab, Reorder Bab)
      ↓
READER PREVIEW (Tampilan Reader Nyata)
      ↓
SAVE DRAFT / PUBLISH NOVEL
```

---

## 4. Validasi Keamanan & Integritas Dokumen

1. **Format File**: Hanya berkas dengan ekstensi `.docx` dan berkas arsip zip valid (`PK\x03\x04`) yang diterima. Format `.doc`, `.pdf`, `.txt`, `.exe`, dll. akan ditolak otomatis.
2. **Ukuran File**: Maksimal 25MB per berkas.
3. **HTML Sanitization**: Semua konten HTML dibersihkan menggunakan whitelist tag aman (`p`, `b`, `i`, `strong`, `em`, `h1-h6`, `blockquote`, `hr`, `br`, dll.) dan membuang script injection berbahaya.
4. **Normalisasi Konten**: Menghapus paragraf kosong berganda, tag XML Microsoft Word (`o:p`), dan inline styles berlebih.

---

## 5. Chapter Validation & Fallback (Toleransi Kesalahan)

Sistem secara cerdas memeriksa:
- **Nomor bab melompat**: Jika dokumen memiliki `BAB 1`, `BAB 2`, dan `BAB 4`, parser akan memberikan peringatan: *"Chapter 3 tidak ditemukan"*.
- **Nomor bab duplikat**: Memberikan peringatan bahwa ada bab dengan nomor yang sama.
- **Bab kosong**: Memberikan peringatan jika suatu bab tidak memiliki isi.
- **Chapter tidak terdeteksi**: **Sistem TIDAK PERNAH membuang isi novel.** Status akan diatur ke `NEEDS_REVIEW`, dan seluruh konten disiapkan dalam bab draf agar admin dapat menggunakan **Manual Split**.

---

## 6. Fitur Manajemen Bab Hasil Import

### Manual Split
Admin dapat memecah satu bab menjadi dua bab terpisah:
1. Klik tombol gunting (**Split**) pada baris bab yang diinginkan.
2. Masukkan kata atau penanda pemisah (misal `***` atau kata pertama paragraf kedua), atau kosongkan untuk memecah tepat di tengah konten.
3. Beri judul bab kedua.
4. Sistem otomatis membelah konten dan menomori ulang seluruh bab berikutnya.

### Merge Bab
Admin dapat menyatukan dua atau lebih bab menjadi satu:
1. Klik tombol **Gabung Bab (Merge)**.
2. Pilih bab yang ingin disatukan.
3. Klik **Gabungkan Bab**. Sistem akan menyatukan isi bab dengan pemisah horizontal dan menomori ulang bab yang tersisa.

### Reorder Bab
Gunakan tombol panah **Naik (↑)** atau **Turun (↓)** untuk memindahkan urutan bab. Nomor bab akan dinormalisasi secara berurutan.

---

## 7. Reader Preview & Publikasi

- Sebelum menyimpan atau mempublikasikan, admin dapat menekan tombol **Preview** untuk membaca novel menggunakan komponen Reader yang sama persis dengan yang dilihat pembaca publik (termasuk font, tema Light/Dark/Sepia, dan lebar baca).
- **Save Draft**: Menyimpan novel ke database dengan status `published = false` (novel tidak muncul di katalog publik).
- **Publish Novel**: Menyimpan novel dan langsung menampilkannya di katalog publik Taunovel.
