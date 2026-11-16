# Evals: Restoran Simple

Evals adalah kriteria lulus yang **dapat dicek mesin**. Agen dan manusia memakai dokumen ini untuk memutuskan apakah suatu pekerjaan selesai.

## Purpose

Evals dipakai agar setiap perubahan pada Restoran Simple punya ukuran selesai yang jelas dan tidak bergantung pada perasaan, terutama karena risiko terbesar proyek ini adalah banyak bug dan error (R1 sampai R3). Pada level dasar, gerbang dijalankan secara manual di komputer lokal dan juga di CI saat pull request; agen berhenti dan meminta peninjauan manusia setelah gerbang lulus.

## Quality Gates

Semua gerbang di tabel harus lulus sebelum merge ke `main`.

| Gerbang | Perintah | Kriteria lulus | Dijalankan di |
|---|---|---|---|
| Lint | `npm run lint` | Tanpa galat | Lokal dan CI |
| Tes | `npm test` | Semua tes lulus | Lokal dan CI |
| Build | `npm run build` | Build berhasil | Lokal dan CI |

Gerbang tambahan:

| Gerbang | Perintah atau cara | Kriteria lulus | Dijalankan di |
|---|---|---|---|
| Pemeriksaan tipe | Tidak ada (`typecheck` kosong) | Tidak berlaku | - |
| E2E | Tidak ada (Playwright tidak dipilih) | Tidak berlaku; diganti uji manual per fitur (R3) | - |
| Audit dependensi | `npm audit` | Tidak ada kerentanan tinggi atau kritis yang belum ditangani | Lokal (disarankan sebelum rilis) |
| Secret scanning | Secret scanning GitHub | Tidak ada temuan rahasia | GitHub |
| Uji manual | Daftar periksa di `docs/TESTING.md`, hasilnya di `docs/REVIEW.md` | Satu putaran penuh tiap fitur tanpa error di konsol | Lokal sebelum menutup task |

## Feature Acceptance Evals

Skrip `test`, `lint`, dan `dev` dibuat di task setup T-001; nama berkas tes di bawah adalah rencana yang dibuat oleh task terkait di `docs/TASKS.md`.

| ID | Eval | Cara dijalankan | Kriteria lulus |
|---|---|---|---|
| F1 | State awal dan Start (`tests/game-state.test.js`) | Otomatis: `npm test`; tampilan halaman awal: manual | Saat game dibuka, `screen` adalah `awal` dan belum ada pelanggan atau timer berjalan; setelah Start, pelanggan pertama (1/10) muncul |
| F2 | Penilaian hidangan dan uang (`tests/evaluate-dish.test.js`) | Otomatis: `npm test` | Urutan bahan dan proses persis resep → pelanggan membayar sebesar harga menu dan uang bertambah; bahan, proses, atau urutan tidak sesuai → pelanggan pergi dan uang tidak bertambah |
| F2 | Alur 10 pelanggan dan layar hasil (`tests/game-state.test.js`) | Otomatis: `npm test` | Pelanggan berikutnya muncul setelah yang sebelumnya terlayani atau pergi; 10 terlayani benar → hasil `menang` dengan total uang; ada yang pergi → hasil `kalah`; Main lagi → uang 0 dan 1/10 |
| F2 | Katalog menu (`tests/menu-catalog.test.js`) | Otomatis: `npm test` | Ada tepat 10 menu dan setiap menu memiliki harga yang berbeda; dialog pelanggan hanya menyebut satu dari 10 menu |
| F2 | Tampilan HUD dan layar hasil | Manual: mainkan satu putaran penuh | Nomor pelanggan (mis. 3/10) dan total uang selalu tampil; layar hasil menang dan kalah memuat total uang dan tombol Main lagi |
| F3 | Durasi proses (`tests/timer.test.js`) | Otomatis: `npm test` | Tiap proses berlangsung 3 detik; total waktu proses tiap resep dari 10 menu ≤ 20 detik |
| F3 | Pencatatan hidangan (`tests/evaluate-dish.test.js`) | Otomatis: `npm test` | Kombinasi atau urutan di luar resep tidak menimbulkan error dan tercatat di hidangan untuk dinilai saat Sajikan |
| F3 | Objek 3D | Manual: pilih satu per satu 7 alat dan 9 bahan | Setiap objek merespons dengan perubahan yang terlihat; proses menampilkan indikator progres 3 detik, lalu hasilnya tampak berubah |
| F4 | Timer, pause, resume (`tests/timer.test.js`) | Otomatis: `npm test` | Timer mulai 30 detik setelah pesanan disebut; Pause menghentikan timer dan proses 3 detik; Resume melanjutkan dari sisa waktu |
| F4 | Timer habis (`tests/timer.test.js`) | Otomatis: `npm test` | Timer mencapai 0 sebelum Sajikan → proses yang berjalan dibatalkan dan pelanggan pergi (hasil kalah) |
| F5 | Data petunjuk (`tests/menu-catalog.test.js`) | Otomatis: `npm test` | Ke-10 menu memiliki daftar bahan dan urutan langkah |
| F5 | Panel petunjuk | Manual: mainkan satu pesanan | Panel tampil di layar game yang sama tanpa tombol buka/tutup; membaca atau menggulir panel tidak mengubah timer |
| R1 | Gerbang tes sebelum merge | Otomatis: CI menjalankan `npm test` dan branch `main` dilindungi | `npm test` gagal → PR tidak bisa digabung; tes mencakup resep 10 menu, penilaian, harga, aturan menang/kalah 10 pelanggan, dan timer pause/resume |
| R2 | Penanganan error global (`tests/error-handler.test.js`) | Otomatis: `npm test`; manual: picu error sengaja di mode dev | Error runtime memunculkan pesan "Terjadi kesalahan" dengan tombol kembali ke halaman awal; tidak ada layar putih atau game membeku |
| R3 | Uji manual per fitur | Manual: ikuti daftar periksa di `docs/TESTING.md` | Tiap fitur dimainkan satu putaran penuh (Start → pesanan → bayar atau pergi) dan hasilnya tercatat di `docs/REVIEW.md` sebelum task ditutup |

## CI Configuration

Berkas `.github/workflows/ci.yml` berjalan pada pull request dan push ke `main`. Urutan langkahnya: checkout, setup Node.js (`lts/*`), instal dependensi dengan `npm install`, lint dengan `npm run lint`, tes dengan `npm test`, lalu build dengan `npm run build`. Perintahnya identik dengan tabel Quality Gates di atas. Versi runtime mengikuti Node.js LTS aktif (verifikasi di nodejs.org). Cache dependensi belum diaktifkan oleh scaffold dan dapat ditambahkan bila CI terasa lambat. Branch `main` dilindungi sehingga pull request hanya dapat digabung bila CI hijau. Versi GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`) harus dicek ulang secara berkala, dan untuk produksi di-pin ke SHA commit.

## Regression Policy

- Setiap bug yang diperbaiki mendapat tes yang gagal sebelum perbaikan dan lulus sesudahnya.
- Tes yang gagal tidak boleh dinonaktifkan (`test.skip`) agar CI lulus.
- Jika sebuah tes harus berubah, jelaskan alasannya di pull request dan catat di `docs/DECISIONS.md`.

## Failure Handling

1. Baca log gerbang yang gagal (lint, tes, atau build) dan cari penyebabnya, bukan gejalanya.
2. Perbaiki penyebab, lalu jalankan ulang gerbang yang sama sebelum gerbang lain.
3. Agen boleh mencoba memperbaiki otomatis maksimal 3 kali per masalah; setelah itu berhenti dan minta mahasiswa meninjau.
4. Catat masalah yang berulang atau menarik di `docs/LESSONS.md`.
