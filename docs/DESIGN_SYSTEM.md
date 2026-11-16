# Design System: Restoran Simple

## Principles

1. **Santai dan tidak menekan.** Nada visual mengikuti pilihan mahasiswa, yaitu santai, sehingga warna cerah dan teks pendek. Contoh: dialog pelanggan memakai kalimat singkat seperti "Satu Kopi Susu, ya!".
2. **Informasi penting selalu terlihat.** Timer, nomor pelanggan, uang, dan petunjuk tampil bersamaan di satu layar. Contoh: panel petunjuk selalu terlihat di sisi layar dan tidak memengaruhi timer (F5).
3. **Umpan balik langsung setelah setiap aksi.** Pemain harus tahu apakah objek sudah terpilih atau proses sedang berjalan. Contoh: objek 3D yang dipilih disorot, dan proses 3 detik menampilkan indikator progres (F3).
4. **Warna punya arti yang sama di seluruh layar.** Biru untuk aksi utama, hijau untuk berhasil, merah untuk gagal atau pelanggan pergi. Contoh: uang yang bertambah muncul hijau, pelanggan pergi muncul merah.
5. **Mudah dipahami tanpa membaca panjang.** Semua teks antarmuka dalam Bahasa Indonesia sederhana (kebutuhan pengguna). Contoh: tombol berlabel "Start", "Pause", "Resume", "Sajikan", dan "Main lagi".

## Color Tokens

Mode gelap tidak disediakan (`dark_mode`: false), jadi hanya ada nilai terang. Warna primer `#2563EB` adalah usulan asisten untuk "biru" dari mahasiswa; palet mahasiswa adalah biru, putih, hijau, dan merah. Rasio kontras di bawah sudah dihitung dengan rumus WCAG 2.x (bukan dugaan).

| Token | Nilai | Penggunaan |
|---|---|---|
| `--color-primary` | `#2563EB` | Tombol aksi utama (Start, Sajikan, Main lagi), tautan, sorotan. Teks putih di atasnya 5,17:1. |
| `--color-primary-strong` | `#1D4ED8` | Keadaan hover/ditekan tombol primer; cincin fokus. Terhadap putih 6,70:1. |
| `--color-secondary` | `#15803D` | Tombol atau label sekunder bernuansa hijau (mis. Resume). Teks putih di atasnya 5,02:1. |
| `--color-bg` | `#FFFFFF` | Latar halaman dan panel (putih). |
| `--color-surface` | `#F1F5F9` | Permukaan kartu, HUD, dan panel petunjuk. Teks utama di atasnya 16,30:1. |
| `--color-text` | `#0F172A` | Teks utama. Terhadap putih 17,85:1. |
| `--color-text-muted` | `#475569` | Teks redup dan keterangan. Terhadap putih 7,58:1; di permukaan 6,92:1. |
| `--color-border` | `#64748B` | Batas elemen interaktif (tombol, kotak dialog). Terhadap putih 4,76:1 (minimal 3:1). |
| `--color-border-subtle` | `#CBD5E1` | Garis pemisah dekoratif saja; bukan satu-satunya penanda elemen (rasio 1,48:1, tidak dipakai untuk batas yang penting). |
| `--color-success` | `#15803D` | Teks atau ikon "berhasil", uang bertambah, layar menang. Terhadap putih 5,02:1; di permukaan 4,58:1. |
| `--color-warning` | `#B45309` | Indikator Pause (permainan dijeda) dan peringatan lunak. Terhadap putih 5,02:1. |
| `--color-danger` | `#B91C1C` | Teks atau ikon "gagal", pelanggan pergi, layar kalah, pesan error. Terhadap putih 6,47:1; di permukaan 5,91:1. |
| `--color-focus` | `#1D4ED8` | Cincin fokus keyboard (lebar 3 px, offset 2 px). Terhadap putih 6,70:1. |

Hijau `#16A34A` sengaja tidak dipakai untuk teks karena hanya 3,30:1 terhadap putih (di bawah 4,5:1).

## Typography

Font: `system-ui, sans-serif` (font sistem, tanpa unduhan font eksternal). Ukuran di bawah adalah usulan asisten.

| Gaya | Ukuran | Bobot | Tinggi baris | Penggunaan |
|---|---|---|---|---|
| Judul | 32 px | 700 | 1,2 | Nama game di halaman awal dan judul layar hasil |
| Subjudul | 22 px | 600 | 1,3 | Judul panel petunjuk, nama menu pesanan |
| Isi | 16 px | 400 | 1,5 | Dialog pelanggan, langkah petunjuk, teks tombol |
| Keterangan | 14 px | 400 | 1,4 | Label kecil di HUD (mis. "Pelanggan", "Uang") dan indikator progres |
| Angka HUD | 24 px | 700 | 1,2 | Timer, nomor pelanggan (mis. 3/10), dan total uang |

Ukuran isi minimal 16 px. Angka uang ditulis dengan format Rupiah Indonesia, mis. `Rp7.000`.

## Spacing and Layout

Skala jarak berbasis 4 px: `--space-1` 4 px, `--space-2` 8 px, `--space-3` 12 px, `--space-4` 16 px, `--space-6` 24 px, `--space-8` 32 px. Padding panel dan kartu memakai `--space-4`; jarak antar komponen memakai `--space-3` atau `--space-4`.

Tata letak satu layar (web), usulan asisten:
- **HUD (atas):** timer, nomor pelanggan (mis. 3/10), total uang, dan tombol Pause/Resume.
- **Area utama (tengah):** pelanggan 2D gaya visual novel dengan kotak dialog, dan kanvas Three.js berisi alat serta bahan 3D.
- **Panel petunjuk (samping atau bawah):** selalu terlihat di halaman yang sama dengan game (F5), berisi bahan, alat, dan urutan langkah menu yang dipesan.
- **Tombol Sajikan:** dekat area hidangan.

Layar utama dirancang untuk laptop atau desktop. Pada jendela sempit, panel petunjuk pindah di bawah kanvas agar tidak menutupi game; batas lebar persis menjadi pertanyaan terbuka (usulan: ditetapkan saat mengerjakan F5). Lebar konten maksimum dibatasi agar HUD tetap terbaca di layar lebar.

## Components

Tidak memakai pustaka UI; semua komponen dibuat dengan HTML/CSS sendiri memakai token di atas.

| Komponen | Varian | Status | Aturan pemakaian |
|---|---|---|---|
| Tombol | Primer (Start, Sajikan, Main lagi), sekunder (Resume), netral (Pause) | default, hover/fokus, nonaktif, ditekan | Satu tombol primer per layar. Saat game dijeda, tombol aksi (Sajikan) dinonaktifkan. |
| HUD timer | Normal, dijeda | default, dijeda (warna peringatan) | Menampilkan sisa detik dari 30; berhenti dan berwarna peringatan saat Pause. |
| HUD nomor pelanggan dan uang | Tetap | default | Selalu tampil di layar; uang bertambah dengan penanda hijau saat pelanggan membayar. |
| Kotak dialog pelanggan | Pesanan, bayar, pergi | default | Menampilkan gambar pelanggan 2D statis dan satu kalimat; nada santai. |
| Panel petunjuk | Daftar langkah | default, kosong (belum ada pesanan) | Selalu terlihat (tanpa buka/tutup); tampil bahan, alat, dan langkah berurutan menu yang dipesan. |
| Objek 3D (alat dan bahan) | Alat, bahan | default, hover/fokus (sorotan), terpilih, nonaktif (saat Pause), sedang diproses | Setiap objek merespons pilihan dengan perubahan yang terlihat (F3). |
| Indikator progres proses | Batang atau cincin | memuat (3 detik), selesai | Muncul di dekat alat saat proses berjalan; berhenti saat Pause. |
| Layar hasil | Menang, kalah | default | Menampilkan total uang dan tombol Main lagi; hijau untuk menang, merah untuk kalah. |
| Pesan error | Satu varian | galat | Teks "Terjadi kesalahan" dengan tombol kembali ke halaman awal (R2). |

## Accessibility

- [ ] Kontras teks minimal 4,5:1 dan elemen UI minimal 3:1 (WCAG 2.2 AA); pakai token di atas.
- [ ] Fokus keyboard terlihat pada semua tombol HTML (cincin `--color-focus`, 3 px).
- [ ] Urutan tab logis: Start/Pause/Resume, Sajikan, lalu Main lagi atau tombol kembali.
- [ ] Setiap tombol punya label teks jelas dalam Bahasa Indonesia atau istilah game yang sudah baku.
- [ ] Teks alternatif untuk gambar pelanggan 2D (mis. "Pelanggan memesan Kopi Susu").
- [ ] Target klik tombol minimal 24x24 CSS px (usulan 44 px agar nyaman).
- [ ] Tidak bergantung pada warna saja: status berhasil, gagal, dan dijeda selalu disertai teks atau ikon.
- [ ] Hormati `prefers-reduced-motion`: kurangi gerak objek dan transisi yang tidak penting.
- [ ] Hitung mundur timer tidak diumumkan tiap detik ke pembaca layar; umumkan hanya kejadian penting (pelanggan datang, bayar, pergi). Pembaca layar atas objek 3D belum dicakup (lihat pertanyaan terbuka di PRD).
- [ ] Kebutuhan pengguna: seluruh antarmuka dalam Bahasa Indonesia.

## Motion and Feedback

- Transisi UI singkat dan halus (usulan 150 sampai 250 ms, easing ease-out); animasi objek 3D tidak boleh memperlambat input.
- Hormati `prefers-reduced-motion`: ganti animasi dengan perubahan langsung (sorotan atau ikon).
- **Memuat:** indikator progres tampil selama proses 3 detik; berhenti saat Pause.
- **Kosong:** sebelum pesanan datang, panel petunjuk menampilkan "Menunggu pelanggan...".
- **Sukses:** pelanggan membayar, teks hijau "Terima kasih! +Rp12.000" dan uang di HUD bertambah.
- **Galat:** pelanggan pergi atau error runtime ditampilkan dengan teks merah yang menjelaskan langkah berikutnya.

Contoh pesan untuk game ini:
1. "Hidangan tidak sesuai resep. Pelanggan pergi. Tekan Main lagi untuk mencoba dari awal."
2. "Waktu habis. Pelanggan pergi. Tekan Main lagi untuk mencoba dari awal."
3. "Terjadi kesalahan. Tekan Kembali ke awal untuk memulai ulang."

## Content and Voice

Bahasa antarmuka: **Bahasa Indonesia**, nada santai dan ramah, kalimat pendek (maksimal sekitar 12 kata), tanpa jargon teknis. Label tombol memakai istilah yang sama dengan SPEC dan PRD.

Glosarium:

| Istilah | Arti di aplikasi ini |
|---|---|
| Pelanggan | Karakter 2D yang datang dan memesan satu menu (10 pelanggan per permainan). |
| Pesanan | Menu yang diminta pelanggan. |
| Menu | Salah satu dari 10 makanan dan minuman yang bisa dibuat. |
| Petunjuk | Panel berisi bahan, alat, dan urutan langkah menu yang dipesan. |
| Proses | Aksi memakai alat selama 3 detik (goreng, panggang, aduk, balik, seduh, blender). |
| Hidangan | Hasil susunan bahan dan proses yang dibuat pemain. |
| Sajikan | Aksi menyerahkan hidangan ke pelanggan untuk dinilai. |
| Pause / Resume | Tombol menjeda dan melanjutkan permainan. |
| Uang | Total rupiah yang terkumpul dari pelanggan yang membayar. |

Format angka dan mata uang: Rupiah dengan titik pemisah ribuan, mis. `Rp7.000`; nomor pelanggan ditulis `3/10`; waktu ditulis dalam detik, mis. `30 detik`.
