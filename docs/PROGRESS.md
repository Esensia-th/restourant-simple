# Progress: Restoran Simple

Dokumen hidup. Diperbarui di **akhir setiap sesi** supaya sesi berikutnya (oleh agen atau manusia) dapat langsung melanjutkan.

## Current State

Tanggal: 2026-11-16

T-001 (setup), T-002 (katalog menu), dan T-003 (logika timer) sudah ter-merge ke `main`. T-004 (penilaian hidangan) selesai dikerjakan di branch `feat/T-004-penilaian-hidangan` dan menunggu pull request, CI, dan merge. Vitest sudah 5.1.0 (PR #5) dan `npm audit` bersih. Pekerjaan dilakukan dari `C:\dev\restourant-simple` (di luar OneDrive).

## Completed

| Tanggal | Task | PR/Commit | Catatan |
|---|---|---|---|
| 2026-11-16 | T-001 Setup repositori, tooling, dan kerangka minimal | PR #1 | Vite, Vitest, ESLint terpasang; `lint`, `test`, `build` lulus |
| 2026-11-16 | Pembaruan vitest ke 5.1.0 | PR #5 (Dependabot) | Menutup 3 temuan `npm audit` (1 moderate, 2 critical) |
| 2026-11-16 | T-002 Katalog menu dan data petunjuk | PR #8 | 10 menu persis SPEC dan tesnya |
| 2026-11-16 | T-003 Logika timer dan jam permainan | PR #9 | Timer 30 detik, proses 3 detik, Pause/Resume, timer habis membatalkan proses |

## In Progress

T-004 Penilaian hidangan (status `review`, PR belum dibuka). Berkas: `src/game/evaluate-dish.js` dan `tests/evaluate-dish.test.js`.

## Next Up

1. T-005: State game, aturan 10 pelanggan, dan uang
2. T-006: Halaman awal, Start, dan layar hasil
3. T-007: HUD, Pause, dan Resume di layar

## Blockers

Tidak ada.

Catatan (bukan hambatan): cabang Dependabot untuk `vite`, `three`, `eslint`, `actions/checkout`, dan `actions/setup-node` sengaja dibiarkan terbuka sampai game punya tes yang cukup. PR ESLint 10 (#7) gagal di CI; tangani belakangan di PR tersendiri. Catatan desain untuk T-005 dan T-010: hidangan (`dish`) berisi urutan bahan dan proses yang SUDAH SELESAI, sedangkan `timer.js` hanya mencatat proses selesai (`completedProcesses`); state game perlu menambahkan bahan lewat `addIngredient` dan proses lewat `addProcess` (dari `evaluate-dish.js`) saat proses selesai, agar urutannya tetap benar.

Format satu baris untuk hambatan berikutnya: `tanggal | task | hambatan | yang sudah dicoba | siapa yang bisa membantu`.

## Session Log

Format entri: `tanggal | siapa (manusia atau nama alat) | task | hasil | catatan untuk sesi berikutnya`.

2026-11-15 | asisten penyusun dokumen | pembuatan dokumen | 16 dokumen dan pendukung git | mulai dari T-001
2026-11-16 | Antigravity (agen) | T-001 | setup proyek selesai dan ter-merge (PR #1) | pindah proyek ke C:\dev di luar OneDrive
2026-11-16 | manusia | perbaikan keamanan dependensi | vitest naik ke 5.1.0 (PR #5), npm audit bersih | cabang Dependabot lain dibiarkan
2026-11-16 | Antigravity (agen) | T-002 | katalog 10 menu dan tes ter-merge (PR #8) | lanjut T-003
2026-11-16 | manual (tanpa agen) | T-003 | timer dan proses 3 detik ter-merge (PR #9), tes lulus | lanjut T-004
2026-11-16 | manual (kode dari asisten chat) | T-004 | penilaian hidangan dan tesnya selesai, lint/test/build lulus | lanjut T-005
