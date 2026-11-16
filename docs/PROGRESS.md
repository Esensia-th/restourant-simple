# Progress: Restoran Simple

Dokumen hidup. Diperbarui di **akhir setiap sesi** supaya sesi berikutnya (oleh agen atau manusia) dapat langsung melanjutkan.

## Current State

Tanggal: 2026-11-16

T-001 (setup) dan T-002 (katalog menu) sudah ter-merge ke `main`. Vitest dinaikkan ke 5.1.0 lewat PR Dependabot (PR #5) sehingga `npm audit` bersih (0 vulnerabilities). T-003 (logika timer dan jam permainan) selesai dikerjakan di branch `feat/T-003-timer-jam-permainan` dan menunggu pull request, CI, dan merge. Pekerjaan dilakukan dari `C:\dev\restourant-simple` (di luar OneDrive).

## Completed

| Tanggal | Task | PR/Commit | Catatan |
|---|---|---|---|
| 2026-11-16 | T-001 Setup repositori, tooling, dan kerangka minimal | PR #1 | Vite, Vitest, ESLint terpasang; `lint`, `test`, `build` lulus |
| 2026-11-16 | Pembaruan vitest ke 5.1.0 | PR #5 (Dependabot) | Menutup 3 temuan `npm audit` (1 moderate, 2 critical) |
| 2026-11-16 | T-002 Katalog menu dan data petunjuk | PR #8 | 10 menu persis SPEC dan tesnya |

## In Progress

T-003 Logika timer dan jam permainan (status `review`, PR belum dibuka). Berkas: `src/game/timer.js` dan `tests/timer.test.js`.

## Next Up

1. T-004: Penilaian hidangan
2. T-005: State game, aturan 10 pelanggan, dan uang
3. T-006: Halaman awal, Start, dan layar hasil

## Blockers

Tidak ada.

Catatan (bukan hambatan): cabang Dependabot untuk `vite`, `three`, `eslint`, `actions/checkout`, dan `actions/setup-node` sengaja dibiarkan terbuka sampai game punya tes yang cukup; tangani satu per satu dan pastikan CI hijau sebelum merge. Peringatan `esbuild` (install-scripts) tidak berdampak pada `lint`, `test`, maupun `build`.

Format satu baris untuk hambatan berikutnya: `tanggal | task | hambatan | yang sudah dicoba | siapa yang bisa membantu`.

## Session Log

Format entri: `tanggal | siapa (manusia atau nama alat) | task | hasil | catatan untuk sesi berikutnya`.

2026-11-15 | asisten penyusun dokumen | pembuatan dokumen | 16 dokumen dan pendukung git | mulai dari T-001
2026-11-16 | Antigravity (agen) | T-001 | setup proyek selesai dan ter-merge (PR #1) | pindah proyek ke C:\dev di luar OneDrive
2026-11-16 | manusia | perbaikan keamanan dependensi | vitest naik ke 5.1.0 (PR #5), npm audit bersih | cabang Dependabot lain dibiarkan
2026-11-16 | Antigravity (agen) | T-002 | katalog 10 menu dan tes ter-merge (PR #8) | lanjut T-003
2026-11-16 | manual (tanpa agen) | T-003 | timer dan proses 3 detik selesai, tes lulus | lanjut T-004
