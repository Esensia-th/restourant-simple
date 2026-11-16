# Decisions: Restoran Simple

Catatan keputusan arsitektur (Architecture Decision Records). Keputusan **tidak dibatalkan diam-diam**: untuk mengubahnya, tambahkan ADR baru yang berstatus `Supersedes ADR-nnn` dan jelaskan alasannya.

## How to Use

1. Buat ADR baru saat ada pilihan teknologi, perubahan struktur data, kompromi keamanan, penambahan dependensi besar, atau perubahan aturan permainan yang sudah disepakati.
2. Format ADR: Status, Tanggal, Konteks, Keputusan, Konsekuensi, Alternatif yang dipertimbangkan.
3. Agen wajib membaca ADR di bawah sebelum mengusulkan perubahan arsitektur.

## Decision Records

Semua ADR di bawah memakai tanggal 2026-11-15 kecuali dibuat kemudian.

### ADR-001: Platform web

- **Status:** Accepted
- **Tanggal:** 2026-11-15
- **Konteks:** Game simulasi coffee shop dengan objek 3D dan pelanggan 2D, dimainkan siapa saja. Mahasiswa memilih platform web (C-02: A) dan tidak memerlukan platform pendukung.
- **Keputusan:** Platform utama adalah web, dimainkan lewat browser tanpa instalasi.
- **Konsekuensi:** Mudah dibagikan lewat tautan; versi mobile atau native menjadi non-goal; kinerja bergantung pada browser pemain.
- **Alternatif yang dipertimbangkan:** Mobile, desktop, dan IoT (tidak dipilih; IoT tidak cocok untuk game).

### ADR-002: Frontend dan UI

- **Status:** Accepted
- **Tanggal:** 2026-11-15
- **Konteks:** Stack dipilih mahasiswa (`stack.source`: custom) dengan alasan: "karena ketentuan tugas dan sekalian ingin belajar". Lapisan yang ditentukan: Three.js untuk objek 3D, HTML/CSS untuk lapisan 2D, JavaScript sebagai bahasa, dan Vite sebagai build. Tidak ada risiko khusus yang disampaikan saat wawancara.
- **Keputusan:** Three.js (objek 3D), HTML/CSS (pelanggan 2D, dialog, HUD, panel petunjuk), JavaScript, dan Vite. Versi: latest stable (verifikasi: `npm view three version`, `npm view vite version`).
- **Konsekuensi:** Seluruh interaksi 3D dan tampilan dibangun sendiri tanpa pustaka UI; Three.js hanyalah pustaka grafis sehingga struktur proyek (logika, scene, UI) ditentukan di `docs/ARCHITECTURE.md`; API Three.js dapat berubah antar versi sehingga contoh kode lama perlu diverifikasi.
- **Alternatif yang dipertimbangkan:** Rekomendasi kit untuk web (framework full-stack dengan Tailwind CSS dan shadcn/ui) dicatat hanya sebagai pembanding; pilihan mahasiswa dihormati dan tidak ada saran perpindahan.

### ADR-003: Backend dan data

- **Status:** Accepted
- **Tanggal:** 2026-11-15
- **Konteks:** Game tanpa login, tanpa skor online, dan tanpa penyimpanan progres (non-goals di PRD); tiap sesi mulai dari nol.
- **Keputusan:** Tidak ada backend dan tidak ada database. State game (Menu, Pesanan, StatusGame) hidup di memori browser; katalog 10 menu dimuat dari data tetap di dalam aplikasi.
- **Konsekuensi:** Tidak ada server yang perlu dipelihara dan tidak ada data pengguna; progres hilang saat halaman ditutup. Bila kelak butuh skor online atau penyimpanan, buat ADR baru dan kaji ulang `docs/SECURITY.md`.
- **Alternatif yang dipertimbangkan:** Penyimpanan di `localStorage` dan backend dengan database (tidak dipilih karena di luar lingkup).

### ADR-004: Autentikasi dan keamanan

- **Status:** Accepted
- **Tanggal:** 2026-11-15
- **Konteks:** Data pribadi tidak diproses (`personal_data`: none), hanya ada satu peran (pemain), dan login masuk non-goals.
- **Keputusan:** Tidak ada autentikasi (`auth`: tidak ada; `auth_method`: tidak ada login). Peran tunggal: pemain. Kontrol keamanan difokuskan pada rantai dependensi, penulisan teks dengan `textContent`, dan penanganan error global (R2).
- **Konsekuensi:** Seluruh kode dan data menu bersifat publik; pemain bisa memanipulasi state lewat konsol browser (diterima karena tidak ada skor online). Bila kelak ada login atau data pribadi, otorisasi harus di server dan UU PDP perlu dikaji.
- **Alternatif yang dipertimbangkan:** Login dengan layanan auth terkelola (tidak dipilih karena tidak dibutuhkan).

### ADR-005: Hosting dan deployment

- **Status:** Accepted
- **Tanggal:** 2026-11-15
- **Konteks:** Hasil build Vite berupa berkas statis; mahasiswa memilih Vercel.
- **Keputusan:** Hosting statis di Vercel. Alur: merge ke `main`, CI (lint, tes, build), Vercel membangun dengan `npm run build` dan mempublikasikan.
- **Konsekuensi:** Deployment sederhana dan tanpa server; batas paket gratis Vercel perlu dicek ("cek paket terbaru"); pengaturan preset Vite dan direktori keluaran diperiksa pada deployment pertama.
- **Alternatif yang dipertimbangkan:** Layanan hosting statis lain (mis. GitHub Pages) disebut sebagai cadangan di `docs/ARCHITECTURE.md`, bukan pilihan utama.

### ADR-006: Strategi pengujian dan level proses

- **Status:** Accepted
- **Tanggal:** 2026-11-15
- **Konteks:** Mahasiswa memilih level dasar (C-10: A) dengan tim 1 orang dan waktu 1 minggu (C-13). Risiko terbesar menurut mahasiswa: "tidak selesai, takut banyak bug dan eror". Fakta teknis: logika game (resep, penilaian, harga, timer, menang/kalah) dapat dipisah dari tampilan dan diuji dengan Vitest, sedangkan scene 3D dan UI sulit diuji otomatis.
- **Keputusan:** Pengujian memakai Vitest untuk logika di `src/game/` (R1), tanpa E2E otomatis, dengan uji manual per fitur dicatat di `docs/REVIEW.md` (R3) dan penanganan error global (R2). Level proses: dasar.
- **Konsekuensi:** Tes unit cepat dijalankan di CI; bagian visual bergantung pada disiplin uji manual; level dasar berarti manusia memeriksa di setiap task.
- **Alternatif yang dipertimbangkan:** Playwright untuk E2E (tidak dipilih; tidak dalam pilihan mahasiswa) dan level menengah atau loop (tidak dipilih).

## Delegated Choices

| ID pertanyaan | Pilihan yang diambil asisten | Alasan | Disetujui mahasiswa |
|---|---|---|---|
| C-20 | Tujuan, ukuran keberhasilan (metrik), dan batasan (non-goals) dirumuskan asisten dari jawaban mahasiswa | Mahasiswa memilih "Z" dan menyetujui usulan yang diturunkan dari jawabannya | ya |

## Assistant Proposals

| Bidang SPEC | Nilai yang diusulkan asisten | Alasan singkat | Disetujui mahasiswa |
|---|---|---|---|
| `meta.slug` | `restoran-simple` | Bentuk kebab-case dari nama aplikasi | ya (konfirmasi SPEC) |
| `meta.one_liner` | "Game simulasi coffee shop di browser: pelanggan 2D gaya visual novel, alat dan bahan 3D yang bisa dipakai." | Merangkum ide mahasiswa dalam satu kalimat | ya (konfirmasi SPEC) |
| `goals` | Dua tujuan: menyelesaikan satu pesanan sampai uang tampil; mengetahui bahan lewat petunjuk | Diturunkan dari masalah dan fitur yang disebut mahasiswa (C-20: Z) | ya |
| `non_goals` | Login, multiplayer, penyimpanan skor/progres, mobile/native, animasi pelanggan rumit, menu di luar 10 | Menjaga lingkup 1 orang dan 1 minggu (C-20: Z) | ya |
| `metrics` | Waktu proses ≤ 20 detik; petunjuk 10/10 menu; satu putaran tanpa error | Diukur dari batas yang mahasiswa sebut (20 detik, petunjuk tiap menu) dan risiko bug (C-20: Z) | ya |
| `features[*].acceptance` | Kriteria penerimaan teruji untuk F1 sampai F5 | Mengubah permintaan mahasiswa menjadi kriteria yang dapat dicek; menggabungkan fitur tak ditandai ke 5 must | ya (konfirmasi SPEC, K1, K2) |
| `users[0].quote` | "Saya ingin bermain santai sambil tahu makanan dan minuman ini dibuat dari bahan apa saja." (ilustrasi) | Kutipan persona dirumuskan asisten dan diberi label ilustrasi | ya (konfirmasi SPEC) |
| `data.menu_catalog` | 10 menu (5 makanan, 5 minuman), harga berbeda, dan urutan langkah | Menu disusun dari alat dan bahan yang mahasiswa sebut; urutan ditetapkan agar K2 (urutan dinilai) dapat diuji | ya |
| `design.primary_color` | `#2563EB` | Mewakili "biru" dari palet mahasiswa (biru, putih, hijau, merah) dengan kontras 5,17:1 terhadap putih | ya (konfirmasi SPEC) |
| `design.font` | `system-ui (sans-serif bawaan sistem)` | Mahasiswa tidak menyebut font; font sistem tanpa unduhan | ya (konfirmasi SPEC) |
| `risks` | Lingkup padat untuk 1 minggu; keterkaitan timer, proses, dan pause; aset 3D belum tersedia | Risiko teknis dari fitur dan batas waktu | ya (konfirmasi SPEC) |
| `student_reflection.risk_controls` | R1, R2, R3 | Usulan kendali untuk risiko "tidak selesai, takut banyak bug dan eror"; teks dipilih mahasiswa (C-14b: A) | ya |

**Konflik antar kriteria yang diselesaikan saat menyusun SPEC:**

1. **Pause dan proses 3 detik.** Saat Pause, timer 30 detik dan proses 3 detik sama-sama berhenti; Resume melanjutkan dari sisa waktu. Disetujui mahasiswa.
2. **Timer habis di tengah proses.** Proses yang berjalan dibatalkan dan pelanggan langsung pergi (game berakhir kalah). Disetujui mahasiswa.
3. **K1: panel petunjuk dan timer.** Mahasiswa memutuskan panel petunjuk selalu tampil di halaman yang sama dengan game (tanpa buka/tutup), sehingga petunjuk tidak memengaruhi timer.
4. **K2: cara menilai hidangan.** Mahasiswa memutuskan opsi B: benar bila bahan, proses, dan urutannya sama dengan resep; karena itu setiap menu memiliki urutan langkah yang pasti.
5. **Aksi Sajikan.** Penilaian dilakukan saat pemain menekan Sajikan; salah dinilai pada saat itu, bukan saat memakai bahan atau alat.
6. **Menang dan kalah.** Mahasiswa memutuskan menang hanya bila ke-10 pelanggan terlayani benar; satu pelanggan pergi berarti langsung kalah.

## Open Questions

| Pertanyaan | Pemilik | Kapan diputuskan |
|---|---|---|
| Versi Three.js, Vite, Vitest, dan Node.js LTS belum ditetapkan; verifikasi dengan `npm view three version`, `npm view vite version`, `npm view vitest version`, dan `node --version` (tech-baseline.md: verifikasi sebelum dipakai) | Mahasiswa | Saat T-001 |
| Struktur proyek dipastikan mengikuti hasil `npm create vite@latest` (template vanilla JavaScript); subfolder `src/game`, `src/scene`, `src/ui`, `src/styles` adalah usulan | Mahasiswa | Saat T-001 |
| Apakah memakai Prettier selain ESLint | Mahasiswa | Saat T-001 |
| Perlindungan branch `main`, secret scanning, dan 2FA diaktifkan di GitHub | Mahasiswa | Saat T-001 |
| Batas paket gratis Vercel dan pengaturan preset Vite (cek paket terbaru) | Mahasiswa | Saat T-015 |
| Aset 3D: dibuat sendiri, dicari siap pakai, atau memakai bentuk geometri sederhana | Mahasiswa | Sebelum T-009 |
| Cara interaksi: klik bahan lalu alat, atau seret-lepas (drag and drop) | Mahasiswa | Sebelum T-010 |
| Target performa (mis. frame per detik) dan perangkat uji | Mahasiswa | Sebelum T-014 |
| Perlu atau tidak alternatif keyboard untuk objek 3D (menambah pekerjaan di luar lingkup 1 minggu) | Mahasiswa dan dosen | Sebelum T-009 |
| Tata letak pada jendela sempit (batas lebar untuk memindahkan panel petunjuk) | Mahasiswa | Saat T-012 |
| Cache dependensi di CI dan pin versi GitHub Actions ke SHA untuk produksi | Mahasiswa | Sebelum T-015 |
