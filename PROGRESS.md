# Progress: Restoran Simple

Dokumen hidup. Diperbarui di **akhir setiap sesi** supaya sesi berikutnya (oleh agen atau manusia) dapat langsung melanjutkan.

## Current State

Tanggal: 2026-11-16

Task T-001 (Setup repositori, tooling, dan kerangka minimal) telah selesai dikerjakan pada branch `feat/T-001-setup-proyek`. Repositori kini memiliki `package.json`, `vite.config.js`, `eslint.config.js`, struktur direktori `src/` (`src/game/`, `src/scene/`, `src/ui/`, `src/styles/`), `tests/`, serta `.github/workflows/ci.yml`. Semua gerbang kualitas (`npm run lint`, `npm test`, `npm run build`) telah lulus. Menunggu review manusia sebelum merge ke `main`.

## Completed

| Tanggal | Task | PR/Commit | Catatan |
|---|---|---|---|
| - | Dokumen proyek dihasilkan | - | Paket dokumen awal dari SPEC.json |
| 2026-11-16 | T-001: Setup repositori, tooling, dan kerangka minimal | feat/T-001-setup-proyek | Vite + Three.js + Vitest + ESLint terpasang; lint, test, build lulus |

## In Progress

T-001: Menunggu review manusia (status: `review`).

## Next Up

1. Review dan merge T-001 ke `main`
2. T-002: Katalog menu dan data petunjuk
3. T-003: Logika timer dan jam permainan

## Blockers

Tidak ada.

Format satu baris untuk hambatan berikutnya: `tanggal | task | hambatan | yang sudah dicoba | siapa yang bisa membantu`.

## Session Log

Format entri: `tanggal | siapa (manusia atau nama alat) | task | hasil | catatan untuk sesi berikutnya`.

2026-11-15 | asisten penyusun dokumen | pembuatan dokumen | 16 dokumen dan pendukung git | mulai dari T-001
2026-11-16 | agen Antigravity | T-001 | setup tooling, kerangka src/, tests, lint/test/build lulus | siap di-review manusia
