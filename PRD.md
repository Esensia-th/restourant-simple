# Product Requirements Document: Restoran Simple

> Game simulasi coffee shop di browser: pelanggan 2D gaya visual novel, alat dan bahan 3D yang bisa dipakai.

## Overview

| Field | Isi |
|---|---|
| Nama produk | Restoran Simple |
| Platform | web |
| Level proses | dasar |
| Tagline | Layani pelanggan, racik pesanan, dan kenali bahan tiap menu. |
| Tim dan waktu | 1 orang, 1 minggu |

## Problem

Pemain ingin memainkan game simulasi melayani pesanan di coffee shop. Siapa pun bisa menjadi pemainnya, dan saat ini tidak ada alternatif yang mereka pakai untuk kebutuhan ini. Sebagian orang mungkin tidak tahu bahwa makanan atau minuman tertentu terbuat dari bahan apa saja. Karena itu setiap menu di game perlu petunjuk pembuatan yang menunjukkan bahan, alat, dan langkahnya.

## Goals and Non-Goals

### Goals

1. Pemain dapat menyelesaikan satu pesanan dari pelanggan datang sampai uang tampil di layar, hanya dengan alat dan bahan yang tersedia. Hal ini teramati lewat satu putaran penuh Start → pesanan → bayar tanpa error.
2. Pemain dapat mengetahui bahan penyusun tiap menu lewat petunjuk langkah pembuatan. Hal ini teramati karena ke-10 menu menampilkan daftar bahan dan urutan langkahnya di layar game.

### Non-Goals

- **Login atau akun pengguna**: game dimainkan langsung tanpa akun, jadi tidak ada data pribadi yang perlu dikelola.
- **Multiplayer**: lingkup 1 orang dan 1 minggu hanya cukup untuk permainan satu pemain.
- **Penyimpanan skor atau progres (tiap main mulai dari nol)**: tanpa server dan database, game dibuat selesai dalam satu sesi.
- **Versi mobile atau native**: platform dibatasi ke web agar fokus pada satu target.
- **Animasi pelanggan yang rumit (pelanggan 2D statis gaya visual novel)**: gambar statis menghemat waktu, sedangkan usaha utama diarahkan ke objek 3D yang interaktif.
- **Menu di luar 10 menu yang direncanakan**: jumlah menu dibatasi supaya semua resep, petunjuk, dan tes dapat selesai dalam seminggu.

## Target Users

| Persona | Kebutuhan | Kutipan |
|---|---|---|
| Pemain umum (siapa saja) | Bermain simulasi coffee shop sambil tahu bahan penyusun tiap makanan dan minuman. | "Saya ingin bermain santai sambil tahu makanan dan minuman ini dibuat dari bahan apa saja." (ilustrasi, dirumuskan asisten) |
| Kondisi pengguna | Antarmuka dalam Bahasa Indonesia. | - |

## Core Features

### F1 - Halaman awal dan Start (must)

Halaman awal tampil saat game dibuka dengan tombol Start untuk memulai permainan.

Acceptance Criteria:
- Jika game dibuka, halaman awal tampil dengan tombol Start, dan belum ada pelanggan atau timer yang berjalan.
- Jika tombol Start ditekan, halaman awal tertutup dan pelanggan pertama (1/10) muncul.

### F2 - Pesanan pelanggan, penilaian, dan uang (must)

Pelanggan 2D gaya visual novel datang satu per satu dan menyebut satu dari 10 menu; hidangan dinilai, lalu pelanggan membayar atau pergi. Game berakhir setelah 10 pelanggan atau saat ada pelanggan yang pergi. Daftar 10 menu, harga, dan urutan langkahnya ada di `docs/ARCHITECTURE.md` bagian Data Model.

Acceptance Criteria:
- Jika pelanggan muncul, dialognya menyebut tepat satu menu dari 10 menu, dan pelanggan berikutnya baru muncul setelah pelanggan sebelumnya terlayani atau pergi.
- Jika pemain menekan Sajikan dan urutan bahan serta proses di hidangan sama persis dengan resep menu yang dipesan, pelanggan membayar sebesar harga menu itu dan total uang di layar bertambah sebesar harga tersebut.
- Jika pemain menekan Sajikan dan bahan, proses, atau urutannya tidak sesuai resep, pelanggan pergi, uang tidak bertambah, dan game berakhir dengan hasil kalah.
- Layar selalu menampilkan nomor pelanggan (mis. 3/10) dan total uang.
- Jika ke-10 pelanggan terlayani benar, layar hasil menang muncul berisi total uang dan tombol Main lagi; jika game berakhir kalah, layar hasil kalah muncul dengan isi yang sama.
- Jika tombol Main lagi ditekan, game kembali ke awal dengan uang 0 dan pelanggan 1/10.
- Ke-10 menu memiliki harga yang berbeda satu sama lain.

### F3 - Interaksi alat dan bahan 3D (must)

Alat dan bahan berupa objek 3D yang bisa dipilih dan dipakai pemain; tiap proses berlangsung 3 detik.

Acceptance Criteria:
- Jika pemain memilih salah satu dari 7 alat (kompor, penggorengan, spatula, alat pembuat kopi, wadah es batu, galon air, blender buah) atau salah satu dari 9 bahan (susu, buah, roti, telur, sayur, garam, gula, biji kopi, air), objek itu merespons dengan perubahan yang terlihat (mis. sorotan atau gerakan).
- Jika pemain menjalankan sebuah proses (goreng, panggang, aduk, balik, seduh, blender), proses berlangsung 3 detik dengan indikator progres, lalu hasilnya terlihat berubah pada objek.
- Jika pemain memakai kombinasi atau urutan bahan dan alat di luar resep, tidak terjadi error, dan urutan itu tercatat di hidangan untuk dinilai saat Sajikan ditekan.
- Total waktu proses otomatis tiap resep dari 10 menu paling lama 20 detik (maksimal 6 proses × 3 detik).

### F4 - Timer 30 detik, pause, dan resume (must)

Tiap pesanan punya batas waktu 30 detik yang dapat dijeda dan dilanjutkan.

Acceptance Criteria:
- Jika pelanggan selesai menyebut pesanan, timer 30 detik mulai berjalan dan hitung mundurnya tampil di layar.
- Jika tombol Pause ditekan, timer dan proses 3 detik berhenti, interaksi alat dan bahan dinonaktifkan; jika Resume ditekan, keduanya berlanjut dari sisa waktu terakhir.
- Jika timer mencapai 0 sebelum hidangan disajikan, proses yang sedang berjalan dibatalkan dan pelanggan pergi (game berakhir kalah).

### F5 - Petunjuk langkah pembuatan (must)

Panel petunjuk selalu tampil di layar game dan berisi daftar bahan, alat, dan urutan langkah menu yang dipesan.

Acceptance Criteria:
- Jika ada pesanan aktif, panel petunjuk tampil di layar game yang sama (tanpa tombol buka/tutup) dan menampilkan bahan, alat, dan urutan langkah menu yang dipesan.
- Ke-10 menu memiliki petunjuk berisi daftar bahan dan urutan langkah (diperiksa lewat tes data).
- Jika panel petunjuk dilihat atau digulir, timer 30 detik tidak berhenti dan tidak berubah kecepatannya.

## User Flows

**Alur 1 - Satu pesanan berhasil (F1, F2, F3, F4, F5)**
1. Pemain membuka game dan melihat halaman awal (F1), lalu menekan Start.
2. Pelanggan 1/10 muncul dan menyebut satu menu; timer 30 detik mulai berjalan (F2, F4).
3. Pemain membaca bahan dan urutan langkah di panel petunjuk yang selalu tampil (F5).
4. Pemain memilih bahan dan alat 3D sesuai urutan; tiap proses berjalan 3 detik dengan indikator progres (F3).
5. Pemain menekan Sajikan; hidangan dinilai dan, bila sesuai resep, pelanggan membayar serta total uang bertambah (F2).
6. Pelanggan berikutnya muncul sampai pelanggan ke-10 terlayani, lalu layar hasil menang muncul dengan tombol Main lagi (F2).

**Alur 2 - Pelanggan pergi dan game kalah (F2, F3, F4)**
1. Pelanggan menyebut pesanan dan timer berjalan (F2, F4).
2. Pemain salah memakai bahan, proses, atau urutan (F3), lalu menekan Sajikan; atau waktu 30 detik habis sebelum Sajikan ditekan (F4).
3. Pelanggan pergi tanpa membayar, uang tidak bertambah, dan layar hasil kalah muncul dengan total uang (F2).
4. Pemain menekan Main lagi; game kembali ke awal dengan uang 0 dan pelanggan 1/10 (F2).

**Alur 3 - Pause dan error saat bermain (F4, F1)**
1. Saat pesanan berjalan, pemain menekan Pause; timer dan proses 3 detik berhenti serta interaksi alat dan bahan dinonaktifkan (F4).
2. Pemain menekan Resume; timer dan proses berlanjut dari sisa waktu terakhir (F4).
3. Jika terjadi error saat game berjalan, pemain melihat pesan "Terjadi kesalahan" dengan tombol kembali ke halaman awal, bukan layar putih (R2, F1).

## AI Features

Tidak ada fitur AI di dalam aplikasi ini.

## Non-Functional Requirements

| Kategori | Persyaratan |
|---|---|
| Performa | Gerakan objek 3D dan hitung mundur timer tetap lancar saat pemain berinteraksi; ukuran aset dijaga kecil karena game dimuat penuh di browser. Angka target (mis. frame per detik) belum ditetapkan dan menjadi pertanyaan terbuka. |
| Aksesibilitas | Mengikuti WCAG 2.2 AA untuk elemen HTML/CSS (kontras, fokus keyboard terlihat, target klik memadai, tidak mengandalkan warna saja); rincian ada di `docs/DESIGN_SYSTEM.md`. |
| Kondisi pengguna | Antarmuka dalam Bahasa Indonesia. |
| Bahasa antarmuka | Bahasa Indonesia saja; tidak ada dukungan bahasa lain. |
| Privasi data | Tidak ada data pribadi yang diproses (`personal_data`: none); tidak ada akun, cookie pelacakan, maupun penyimpanan di server. |
| Ketersediaan | Game berupa situs statis di Vercel tanpa server aplikasi; tidak ada penyimpanan progres, sehingga tiap sesi mulai dari nol. |

## Success Metrics

| Metrik | Target | Cara Ukur |
|---|---|---|
| Waktu proses resep | Ke-10 menu ≤ 20 detik total waktu proses | Tes Vitest yang menjumlahkan durasi proses tiap resep |
| Kelengkapan petunjuk | 10 dari 10 menu punya daftar bahan dan langkah | Tes data Vitest dan daftar periksa manual |
| Putaran permainan tanpa error | Satu putaran penuh (Start → pesanan → bayar atau pergi) berjalan tanpa error di browser untuk tiap menu | Uji manual per menu di browser, dicatat di docs/REVIEW.md |

## Risks and Open Questions

### Risiko menurut mahasiswa

"tidak selesai, takut banyak bug dan eror"

### Kendali risiko yang disetujui mahasiswa

- **R1** (berdampak pada F2, F3, F4): Logika game (resep 10 menu, penilaian benar/salah, harga, aturan menang/kalah 10 pelanggan, timer yang berhenti saat pause dan lanjut saat resume) dijaga tes Vitest; jika npm test gagal, perubahan tidak boleh digabung ke main.
- **R2** (berdampak pada F1 sampai F5): Jika terjadi error saat game berjalan, pemain melihat pesan "Terjadi kesalahan" dengan tombol kembali ke halaman awal, bukan layar putih atau game membeku.
- **R3** (berdampak pada F1 sampai F5): Tiap fitur dimainkan satu putaran penuh (Start → pesanan → bayar atau pergi) di browser dan hasilnya dicatat di docs/REVIEW.md sebelum task ditutup.

### Risiko teknis dan mitigasinya

- **Lingkup 5 fitur must (10 menu, objek 3D interaktif, timer, pause) harus selesai oleh 1 orang dalam 1 minggu.** Mitigasi: kerjakan task kecil berurutan (`docs/TASKS.md`) dan selesaikan F1 sampai F4 sebelum merapikan tampilan.
- **Timer 30 detik, proses 3 detik, dan pause saling bergantung sehingga rawan bug keadaan (state).** Mitigasi: pakai satu jam permainan (game clock) yang berhenti saat pause, dan tulis tes untuk kasus pause serta timer habis di tengah proses (R1).
- **Aset 3D alat dan bahan belum tersedia; bentuk dasar Three.js dipakai lebih dulu bila model siap pakai belum ada.** Mitigasi: mulai dengan bentuk geometri sederhana yang dapat diganti model nanti tanpa mengubah logika game.

### Pertanyaan terbuka

1. Berapa target performa yang diterima (mis. frame per detik) dan di perangkat seperti apa game diuji?
2. Apakah aset 3D dibuat sendiri, dicari yang siap pakai, atau memakai bentuk geometri sederhana untuk versi pertama?
3. Bagaimana pemain memakai objek: klik bahan lalu klik alat, atau seret-lepas (drag and drop)?
4. Apakah interaksi objek 3D perlu alternatif keyboard? Bila ya, itu menambah pekerjaan di luar lingkup 1 minggu.
5. Versi Three.js, Vite, dan Vitest belum ditetapkan (`latest stable`); verifikasi dengan `npm view three version`, `npm view vite version`, dan `npm view vitest version`.
6. Aksi **Sajikan** diasumsikan sebagai tombol atau tindakan eksplisit pemain; bentuk tampilannya perlu dipastikan saat mengerjakan F2.
