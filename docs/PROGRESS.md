# Progress: Restoran Simple

Dokumen hidup. Diperbarui di **akhir setiap sesi** supaya sesi berikutnya (oleh agen atau manusia) dapat langsung melanjutkan.

## Current State

Tanggal: 2026-11-16

Task T-002 (Katalog menu dan data petunjuk) telah selesai dikerjakan pada branch `feat/T-002-katalog-menu`. Modul `src/game/menu-catalog.js` memuat 10 menu (5 makanan dan 5 minuman) persis seperti `SPEC.json` (data.menu_catalog) beserta urutan langkah bahan/proses, alat, dan durasi tiap proses 3 detik tanpa menyentuh DOM atau mengimpor Three.js. Pengujian otomatis di `tests/menu-catalog.test.js` memverifikasi tepat 10 menu, 10 harga berbeda, kelengkapan bahan dan urutan langkah, serta batas waktu proses ≤ 20 detik. Seluruh gerbang kualitas (`npm run lint`, `npm test`, `npm run build`) telah lulus. Menunggu review manusia sebelum merge ke `main`.

## Completed

| Tanggal | Task | PR/Commit | Catatan |
|---|---|---|---|
| - | Dokumen proyek dihasilkan | - | Paket dokumen awal dari SPEC.json |
| 2026-11-16 | T-001: Setup repositori, tooling, dan kerangka minimal | feat/T-001-setup-proyek | Dimerge ke main; Vite + Three.js + Vitest + ESLint terpasang |
| 2026-11-16 | T-002: Katalog menu dan data petunjuk | feat/T-002-katalog-menu | src/game/menu-catalog.js dan tests/menu-catalog.test.js selesai; lint, test, build lulus |

## In Progress

T-002: Menunggu review manusia (status: `review`).

## Next Up

1. Review dan merge T-002 ke `main`
2. T-003: Logika timer dan jam permainan
3. T-004: Penilaian hidangan

## Blockers

Tidak ada.

Format satu baris untuk hambatan berikutnya: `tanggal | task | hambatan | yang sudah dicoba | siapa yang bisa membantu`.

## Session Log

Format entri: `tanggal | siapa (manusia atau nama alat) | task | hasil | catatan untuk sesi berikutnya`.

2026-11-15 | asisten penyusun dokumen | pembuatan dokumen | 16 dokumen dan pendukung git | mulai dari T-001
2026-11-16 | agen Antigravity | T-001 | setup tooling, kerangka src/, tests, lint/test/build lulus | dimerge ke main
2026-11-16 | agen Antigravity | T-002 | katalog 10 menu & unit test dibuat, lint/test/build lulus | siap di-review manusia
