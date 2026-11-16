# Progress: Restoran Simple

Dokumen hidup. Diperbarui di **akhir setiap sesi** supaya sesi berikutnya (oleh agen atau manusia) dapat langsung melanjutkan.

## Current State

Tanggal: 2026-11-16

T-001 sampai T-007 sudah ter-merge ke `main`. T-008 (Pelanggan 2D dan dialog pesanan) selesai dikerjakan di branch `feat/T-008-pelanggan-dialog` dan berstatus `review`. Ilustrasi pelanggan 2D gaya visual novel (SVG mandiri di `public/`) beserta kotak dialog yang menyebut tepat satu menu dengan kalimat santai dan atribut alt aksesibel telah terpasang dan teruji.

## Completed

| Tanggal | Task | PR/Commit | Catatan |
|---|---|---|---|
| 2026-11-16 | T-001 Setup repositori, tooling, dan kerangka minimal | PR #1 | Vite, Vitest, ESLint terpasang; `lint`, `test`, `build` lulus |
| 2026-11-16 | Pembaruan vitest ke 5.1.0 | PR #5 (Dependabot) | Menutup 3 temuan `npm audit` (1 moderate, 2 critical) |
| 2026-11-16 | T-002 Katalog menu dan data petunjuk | PR #8 | 10 menu persis SPEC dan tesnya |
| 2026-11-16 | T-003 Logika timer dan jam permainan | PR #9 | Timer 30 detik, proses 3 detik, Pause/Resume, timer habis membatalkan proses |
| 2026-11-16 | T-004 Penilaian hidangan | PR #10 | Hidangan benar bila bahan, proses, dan urutan persis resep |
| 2026-11-16 | T-005 State game, aturan 10 pelanggan, dan uang | PR #11 | State alur 10 pelanggan, menang/kalah, dan uang |
| 2026-11-16 | T-006 Halaman awal, Start, dan layar hasil | PR #12 | Layar awal, Start, layar hasil menang/kalah, dan tombol Main lagi |
| 2026-11-16 | T-007 HUD, Pause, dan Resume di layar | PR #13 | HUD timer, nomor pelanggan, uang, dan tombol Pause/Resume |

## In Progress

T-008 Pelanggan 2D dan dialog pesanan (status `review`, PR siap diajukan). Berkas: `src/ui/customer-dialog.js`, `public/customer-*.svg`, `src/styles/main.css`, `src/main.js`, `tests/customer-dialog.test.js`, dan `tests/app-integration.test.js`.

## Next Up

1. T-009: Scene 3D alat dan bahan
2. T-010: Interaksi alat, bahan, dan proses 3 detik
3. T-011: Tombol Sajikan dan alur penilaian di layar

## Blockers

Tidak ada.

Catatan desain `src/game/game-state.js` (bahan untuk T-006 sampai T-011; ubah bila tidak sesuai keinginan):
- State berisi `screen` (`awal`, `main`, `hasil`), `customerNumber`, `totalMoneyIdr`, `paused`, `result`, `order`, dan `dish`. Semua aksi murni dan mengembalikan state yang sama bila tidak valid.
- Menu pelanggan dan fungsi acak dimasukkan dari luar (`pickRandomMenuId(random)`); waktu maju lewat `tickGame(state, deltaSeconds)`. Panggil `tickGame` hanya setelah pelanggan selesai menyebut pesanan, supaya timer 30 detik mulai pada saat yang benar.
- Satu pelanggan pergi (hidangan salah atau waktu habis) langsung mengakhiri game dengan hasil kalah, sesuai keputusan menang/kalah di `docs/DECISIONS.md`.
- Setelah Sajikan benar, pelanggan berstatus `terlayani` dan UI memanggil `nextCustomer(state, menuId)` setelah tampilan pembayaran selesai. Pada pelanggan ke-10, Sajikan benar langsung menghasilkan `menang`.
- **Main lagi** (`playAgain`) langsung memulai permainan baru dengan uang 0 dan pelanggan 1/10 (bukan kembali ke halaman awal). Jika yang diinginkan kembali ke halaman awal, ubah di T-006 dan catat di `docs/DECISIONS.md`.

Catatan lain (bukan hambatan): cabang Dependabot untuk `vite`, `three`, `eslint`, `actions/checkout`, dan `actions/setup-node` sengaja dibiarkan terbuka sampai game punya tes yang cukup. PR ESLint 10 (#7) gagal di CI; tangani belakangan di PR tersendiri.

Format satu baris untuk hambatan berikutnya: `tanggal | task | hambatan | yang sudah dicoba | siapa yang bisa membantu`.

## Session Log

Format entri: `tanggal | siapa (manusia atau nama alat) | task | hasil | catatan untuk sesi berikutnya`.

2026-11-15 | asisten penyusun dokumen | pembuatan dokumen | 16 dokumen dan pendukung git | mulai dari T-001
2026-11-16 | Antigravity (agen) | T-001 | setup proyek selesai dan ter-merge (PR #1) | pindah proyek ke C:\dev di luar OneDrive
2026-11-16 | manusia | perbaikan keamanan dependensi | vitest naik ke 5.1.0 (PR #5), npm audit bersih | cabang Dependabot lain dibiarkan
2026-11-16 | Antigravity (agen) | T-002 | katalog 10 menu dan tes ter-merge (PR #8) | lanjut T-003
2026-11-16 | manual (tanpa agen) | T-003 | timer dan proses 3 detik ter-merge (PR #9), tes lulus | lanjut T-004
2026-11-16 | manual (kode dari asisten chat) | T-004 | penilaian hidangan dan tesnya ter-merge, tes lulus | lanjut T-005
2026-11-16 | manual (kode dari asisten chat) | T-005 | state game dan tesnya selesai, lint/test/build lulus | lanjut T-006 (UI)
