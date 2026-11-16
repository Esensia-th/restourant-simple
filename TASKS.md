# Tasks: Restoran Simple

## Conventions

- **ID**: `T-001`, `T-002`, ... berurutan, unik.
- **Status**: `todo`, `doing`, `review`, `done`, `blocked`.
- **Ukuran**: `S` (< 1 jam), `M` (1 sampai 3 jam), `L` (setengah hari). Task lebih besar dari `L` harus dipecah.
- Satu task = satu branch = satu PR. Hanya satu task berstatus `doing` per orang.
- Setiap task merujuk fitur (F1, F2, ...) atau "setup"/"dokumen", dan memiliki kriteria selesai yang dapat dicek.

Agen hanya mengambil task dengan status `todo` yang semua dependensinya (kolom "Bergantung pada") sudah `done`. Agen mengubah status menjadi `doing` saat mulai dan menjadi `review` saat PR dibuka. Mahasiswa mengubahnya menjadi `done` setelah merge.

## Milestones

| Milestone | Tujuan | Fitur | Perkiraan minggu |
|---|---|---|---|
| Fondasi dan setup | Repositori siap dan semua fitur *must* berjalan dari awal sampai akhir (logika teruji, UI, scene 3D, timer, petunjuk, penanganan error) | F1, F2, F3, F4, F5, R1, R2 | Minggu 1, hari 1–5 (T-001 sampai T-013) |
| Penyempurnaan dan rilis | Uji manual ke-10 menu, perbaikan bug, deploy ke Vercel, README, dan refleksi | F1, F2, F3, F4, F5, R3 | Minggu 1, hari 6–7 (T-014 dan T-015) |

## Task List

| ID | Judul | Fitur | Ukuran | Status | Branch | Bergantung pada | Kriteria selesai |
|---|---|---|---|---|---|---|---|
| T-001 | Setup repositori, tooling, dan kerangka minimal | setup | L | todo | feat/T-001-setup-proyek | - | Scaffold dengan `npm create vite@latest` (template vanilla JavaScript) di folder proyek yang sudah berisi `docs/`, `AGENTS.md`, dan `SPEC.json` tanpa menimpa ketiganya; pasang `three`, `vitest`, dan `eslint`; buat skrip `dev`, `lint`, `test` (Vitest sekali jalan), dan `build` di `package.json`; tambah satu tes contoh di `tests/`; buat `src/game/`, `src/scene/`, `src/ui/`, dan `src/styles/`; pastikan `.gitignore` dan `.env.example` ada. Di akhir task `npm install`, `npm run lint`, `npm test`, `npm run build` lulus dan CI hijau |
| T-002 | Katalog menu dan data petunjuk | F2, F5 | M | todo | feat/T-002-katalog-menu | T-001 | `src/game/menu-catalog.js` memuat 10 menu (5 makanan, 5 minuman) persis seperti SPEC: harga, bahan, dan urutan langkah; `tests/menu-catalog.test.js` lulus: tepat 10 menu, 10 harga berbeda, tiap menu punya daftar bahan dan urutan langkah, total waktu proses tiap menu ≤ 20 detik; `npm test` lulus |
| T-003 | Logika timer dan jam permainan | F4, F3, R1 | M | todo | feat/T-003-timer-jam-permainan | T-001 | `src/game/timer.js` dan `tests/timer.test.js`: timer 30 detik mulai setelah pesanan disebut; Pause menghentikan timer dan proses 3 detik; Resume melanjutkan dari sisa waktu; timer 0 sebelum Sajikan membuat pelanggan pergi dan membatalkan proses yang berjalan; tiap proses berdurasi 3 detik; `npm test` lulus |
| T-004 | Penilaian hidangan | F2, F3, R1 | M | todo | feat/T-004-penilaian-hidangan | T-002 | `src/game/evaluate-dish.js` dan `tests/evaluate-dish.test.js`: hidangan benar bila bahan, proses, dan urutannya persis resep; salah bila ada yang berbeda; kombinasi atau urutan di luar resep tidak menimbulkan error dan tercatat di hidangan; `npm test` lulus |
| T-005 | State game, aturan 10 pelanggan, dan uang | F1, F2, R1 | M | todo | feat/T-005-state-game | T-003, T-004 | `src/game/game-state.js` dan `tests/game-state.test.js`: awal di layar `awal`, Start memulai pelanggan 1/10; pelanggan berikutnya muncul setelah yang sebelumnya terlayani atau pergi; uang bertambah sebesar harga menu; 10 terlayani benar → `menang`; ada yang pergi → `kalah`; Main lagi mengembalikan uang 0 dan 1/10; Sajikan tidak diproses dua kali; `npm test` lulus |
| T-006 | Halaman awal, Start, dan layar hasil | F1, F2 | M | todo | feat/T-006-halaman-awal-hasil | T-005 | Halaman awal dengan tombol Start di HTML/CSS memakai token di `docs/DESIGN_SYSTEM.md`; Start membuka layar game dan memunculkan pelanggan 1/10; layar hasil menang dan kalah menampilkan total uang dan tombol Main lagi; teks dengan `textContent`; dicek manual di browser dan dicatat di `docs/REVIEW.md` |
| T-007 | HUD, Pause, dan Resume di layar | F4, F2 | M | todo | feat/T-007-hud-pause-resume | T-005, T-006 | HUD menampilkan hitung mundur timer, nomor pelanggan (mis. 3/10), dan total uang; tombol Pause menghentikan timer dan proses serta menonaktifkan interaksi, Resume melanjutkannya dari sisa waktu; dicek manual dan dicatat di `docs/REVIEW.md` |
| T-008 | Pelanggan 2D dan dialog pesanan | F2 | M | todo | feat/T-008-pelanggan-dialog | T-006 | Pelanggan 2D gaya visual novel (gambar statis) dan kotak dialog menyebut tepat satu menu dari 10 menu; pelanggan berikutnya muncul hanya setelah yang sebelumnya terlayani atau pergi; teks alternatif gambar tersedia; dicek manual |
| T-009 | Scene 3D alat dan bahan | F3 | L | todo | feat/T-009-scene-3d | T-001 | Scene Three.js menampilkan 7 alat (kompor, penggorengan, spatula, alat pembuat kopi, wadah es batu, galon air, blender buah) dan 9 bahan (susu, buah, roti, telur, sayur, garam, gula, biji kopi, air) memakai bentuk geometri sederhana bila model siap pakai belum ada; setiap objek merespons hover dan pilihan dengan perubahan yang terlihat; build berhasil; dicek manual |
| T-010 | Interaksi alat, bahan, dan proses 3 detik | F3, F4 | L | todo | feat/T-010-interaksi-proses | T-003, T-009 | Memilih bahan mencatatnya ke hidangan; memakai alat menjalankan proses 3 detik dengan indikator progres lalu hasil tampak berubah; interaksi dinonaktifkan saat Pause dan proses berhenti; kombinasi di luar resep tidak error; dicek manual untuk proses goreng, panggang, aduk, balik, seduh, dan blender |
| T-011 | Tombol Sajikan dan alur penilaian di layar | F2, F3 | M | todo | feat/T-011-tombol-sajikan | T-004, T-005, T-008, T-010 | Tombol Sajikan menilai hidangan dengan `evaluateDish`: benar → pelanggan membayar, uang di layar bertambah sebesar harga menu; salah → pelanggan pergi dan layar hasil kalah; klik ganda Sajikan hanya diproses sekali; dicek manual satu putaran penuh |
| T-012 | Panel petunjuk selalu tampil | F5 | M | todo | feat/T-012-panel-petunjuk | T-002, T-008 | Panel petunjuk tampil di layar game yang sama tanpa tombol buka/tutup dan menampilkan bahan, alat, dan urutan langkah menu yang dipesan; membaca atau menggulir panel tidak mengubah timer; dicek manual dan dicatat di `docs/REVIEW.md` |
| T-013 | Penanganan error global | R2, F1 | S | todo | feat/T-013-error-global | T-006 | `tests/error-handler.test.js` lulus; error runtime (`window.onerror` dan `unhandledrejection`) menampilkan pesan "Terjadi kesalahan" dengan tombol kembali ke halaman awal, tanpa layar putih atau game membeku; dicek manual dengan memicu error sengaja |
| T-014 | Uji manual 10 menu dan perbaikan bug | R3, F1, F2, F3, F4, F5 | L | todo | fix/T-014-uji-manual | T-007, T-011, T-012, T-013 | Ke-10 menu dimainkan satu putaran penuh (Start → pesanan → bayar atau pergi); daftar periksa di `docs/TESTING.md` dicentang; hasil dicatat di `docs/REVIEW.md`; tidak ada error di konsol; bug yang ditemukan diperbaiki dengan tes regresi; `npm run lint`, `npm test`, `npm run build` lulus |
| T-015 | Deploy Vercel, README, dan refleksi | F1, F2, F3, F4, F5 | M | todo | feat/T-015-deploy-rilis | T-014 | Proyek terhubung ke Vercel dan build produksi berjalan (preset Vite, hasil build statis); URL produksi dibuka dan satu putaran penuh dimainkan; `README.md` diperbarui dengan cara menjalankan dan memainkan; `docs/LESSONS.md` dan `docs/REVIEW.md` diisi sebagai refleksi |

## Backlog

Kosong: semua fitur sudah terjadwal.
