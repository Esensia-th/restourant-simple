# Code Style: Restoran Simple

## Language and Tooling

- **Bahasa:** JavaScript modern (ES modules), tanpa TypeScript. Versi Node.js: LTS aktif (verifikasi: `node --version` dan nodejs.org). Versi Three.js, Vite, dan Vitest: latest stable (verifikasi: `npm view three version`, `npm view vite version`, `npm view vitest version`). `stack.versions` kosong karena mahasiswa tidak menyebut versi pasti.
- **Linter:** ESLint, dijalankan dengan perintah persis `npm run lint`. Skrip `lint` dan konfigurasi ESLint dibuat di task setup T-001.
- **Pemformat:** Prettier (opsional, diputuskan di T-001). Bila dipakai, aturan format tidak boleh diperdebatkan di review; ikuti keluaran alat.
- **Mode ketat:** gunakan `"use strict"` implisit lewat ES modules, `const` sebagai default, dan `let` hanya bila nilainya berubah. `var` tidak dipakai.
- **Pemeriksaan tipe:** tidak ada (`typecheck` kosong); jelaskan bentuk data penting lewat komentar JSDoc singkat pada fungsi publik di `src/game/`.

## Naming

| Objek | Konvensi | Contoh |
|---|---|---|
| Berkas dan folder | kebab-case | `menu-catalog.js`, `game-clock.js`, `src/game/`, `src/scene/` |
| Berkas tes | `<nama>.test.js` di `tests/` | `tests/timer.test.js`, `tests/evaluate-dish.test.js` |
| Variabel dan fungsi | camelCase, fungsi diawali kata kerja | `timeLeftSeconds`, `evaluateDish()`, `startOrder()` |
| Kelas dan tipe | PascalCase | `GameClock`, `OrderTimer` |
| Konstanta | UPPER_SNAKE_CASE | `ORDER_TIME_LIMIT_SECONDS = 30`, `PROCESS_DURATION_SECONDS = 3`, `TOTAL_CUSTOMERS = 10` |
| Entitas data | Nama entitas PascalCase di dokumen, objek camelCase di kode | `Menu` → `menu`, `Pesanan` → `order`, `StatusGame` → `gameState` |
| ID menu | `M` + dua digit | `M01` (Telur Goreng) sampai `M10` (Smoothie Buah Susu) |
| Nilai status | huruf kecil, bahasa Indonesia seperti di spec | `'menunggu'`, `'terlayani'`, `'pergi'`, `'menang'`, `'kalah'` |
| Kelas dan ID CSS | kebab-case | `hud-timer`, `hint-panel`, `dialog-box`, `button-serve` |
| Komponen UI (fungsi pembuat DOM) | camelCase diawali `render` atau `create` | `renderHud()`, `createHintPanel()` |
| Variabel lingkungan | UPPER_SNAKE_CASE (saat ini tidak ada) | - |

Istilah di kode mengikuti glosarium di `docs/DESIGN_SYSTEM.md` (mis. Sajikan = `serve`, Pesanan = `order`).

## Structure and Patterns

- **Pisahkan tanggung jawab:** `src/game/` berisi logika murni (menu, resep, penilaian, timer, state) **tanpa** impor Three.js atau DOM; `src/scene/` mengurus Three.js; `src/ui/` mengurus HTML/CSS. `src/main.js` hanya merangkai ketiganya.
- **Aliran data satu arah:** UI dan scene mengirim aksi ke logika game; logika mengembalikan state baru; UI dan scene menggambar ulang dari state itu.
- **Satu sumber waktu:** semua timer (30 detik dan proses 3 detik) memakai satu jam permainan (game clock) yang berhenti saat Pause (F4).
- **Ukuran saran:** fungsi maksimal sekitar 40 baris, berkas maksimal sekitar 300 baris; pecah bila lebih.
- **Pola yang dipakai:** fungsi murni yang menerima state lama dan mengembalikan state baru (mudah diuji), data tetap (`menu_catalog`) dipisah dari logika.
- **Pola yang dihindari:** state global yang diubah dari banyak tempat, logika game di dalam penanganan klik, dan `setInterval` mentah untuk timer utama.

Contoh untuk F4 (timer berhenti saat Pause):

```js
// BENAR - src/game/timer.js: fungsi murni, mudah diuji dengan Vitest (R1)
export function tick(order, deltaSeconds, paused) {
  if (paused || order.status !== 'menunggu') return order; // Pause menghentikan timer
  const timeLeftSeconds = Math.max(0, order.timeLeftSeconds - deltaSeconds);
  return {
    ...order,
    timeLeftSeconds,
    status: timeLeftSeconds === 0 ? 'pergi' : order.status,
  };
}
```

```js
// SALAH - timer tetap berjalan saat Pause dan logika bercampur dengan tampilan
setInterval(() => {
  order.timeLeftSeconds -= 1;
  document.getElementById('hud-timer').innerHTML = order.timeLeftSeconds;
}, 1000);
```

## Error Handling

- Jangan menelan error diam-diam: tidak ada `catch` kosong; minimal catat ke konsol dengan konteks.
- Bedakan error yang bisa dipulihkan (aksi tidak valid, mis. mengetuk alat saat Pause: abaikan tanpa error) dari error fatal (state rusak atau pengecualian tak terduga: tampilkan layar error).
- Pasang penanganan error global (`window.onerror` dan `unhandledrejection`) yang menampilkan pesan "Terjadi kesalahan" dengan tombol kembali ke halaman awal, bukan layar putih atau game membeku (R2).
- Pesan untuk pemain singkat, ramah, dan tanpa detail internal; detail teknis (nama fungsi, stack) hanya di konsol pengembang.
- Game tidak butuh jaringan setelah halaman dimuat. Bila aset gagal dimuat, tampilkan pesan yang menjelaskan langkah berikutnya (muat ulang halaman), jangan biarkan layar kosong.

## Comments and Documentation

- Komentar menjelaskan **mengapa**, bukan **apa** (mis. alasan Pause menghentikan proses 3 detik).
- Fungsi publik di `src/game/` diberi JSDoc singkat berisi tujuan, parameter, dan nilai kembali.
- Jangan meninggalkan kode yang dikomentari; hapus, riwayatnya ada di Git.
- Perbarui dokumen bersamaan dengan kode: `docs/PROGRESS.md` setiap selesai task, dan `docs/DECISIONS.md` bila ada keputusan baru (mis. aturan permainan berubah).

## Commit Messages

Format Conventional Commits: `tipe(ruang-lingkup): ringkasan imperatif`.

| Tipe | Contoh untuk proyek ini |
|---|---|
| feat | `feat(game): tambah timer 30 detik yang berhenti saat pause` |
| fix | `fix(game): cegah uang bertambah dua kali saat Sajikan diklik ganda` |
| docs | `docs: perbarui PROGRESS setelah T-003 selesai` |
| test | `test(game): tambah tes timer habis di tengah proses` |
| refactor | `refactor(ui): pisahkan renderHud dari main.js` |
| chore | `chore: tambah Vitest dan skrip test` |
| ci | `ci: jalankan lint, tes, dan build di pull request` |

Aturan: satu commit satu perubahan logis, ringkasan maksimal 72 karakter, dan rujuk ID task (mis. `Refs: T-003`) di badan commit atau PR.

## Dependencies

- Tambah dependensi hanya bila benar-benar dibutuhkan, dipelihara aktif, dan lisensinya kompatibel dengan tugas kuliah.
- **Verifikasi nama paket** benar-benar ada dan milik penerbit yang dimaksud sebelum instal (waspadai nama karangan atau salah eja); contoh nama yang diharapkan: `three`, `vite`, `vitest`, `eslint`.
- `package-lock.json` di-commit; pin versi untuk rilis produksi.
- Jangan menambah dua dependensi untuk fungsi yang sama.
- Catat dependensi besar atau keputusan memilihnya di `docs/DECISIONS.md`.

## Forbidden Patterns

1. Rahasia, token, atau kata sandi di kode, dokumen, atau chat.
2. Mengimpor Three.js atau menyentuh DOM di dalam `src/game/` (logika jadi sulit diuji, padahal R1 mensyaratkan tes).
3. Memakai `innerHTML` untuk teks dinamis (dialog, nama menu, petunjuk); gunakan `textContent`.
4. `setInterval` atau `setTimeout` mentah untuk timer utama dan proses 3 detik; pakai jam permainan yang bisa dijeda.
5. Menonaktifkan lint atau tes agar lulus (`eslint-disable` tanpa alasan, `test.skip`, `.only` yang tertinggal).
6. Mengubah tes agar lulus tanpa memperbaiki penyebab masalah.
7. Kode tak terpakai, impor tak terpakai, atau `console.log` sisa debugging di cabang `main`.
8. Dependensi ganda untuk fungsi yang sama, atau paket yang tidak diverifikasi.
9. Pesan error yang membocorkan detail internal (stack trace, nama fungsi) kepada pemain.
10. Menyimpan progres atau data di `localStorage`, cookie, atau server (di luar lingkup, non-goal).
11. Memuat skrip atau aset dari CDN atau situs luar yang tidak diverifikasi; simpan aset di `public/`.
12. Menambah menu, fitur, atau aturan di luar SPEC tanpa memperbarui `SPEC.json` dan `docs/DECISIONS.md`.

## AI-Generated Code Rules

- Penulis (mahasiswa) wajib bisa menjelaskan setiap perubahan yang diterima, termasuk mengapa logika timer atau penilaian bekerja seperti itu.
- Minta perubahan kecil dan fokus satu tugas (satu task di `docs/TASKS.md` per sesi).
- Jalankan `npm run lint` dan `npm test` sebelum menerima perubahan.
- Periksa bahwa API, fungsi, atau paket yang disarankan benar-benar ada (mis. cek di dokumentasi resmi Three.js atau `npm view <paket>`); versi Three.js sering berubah, jadi jangan percaya contoh kode lama begitu saja.
- Jangan menerima kode yang tidak dipahami; minta penjelasan atau sederhanakan.
- Catat kesalahan berulang agen (mis. API Three.js yang salah) di `docs/LESSONS.md`.
