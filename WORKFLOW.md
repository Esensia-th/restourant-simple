# Workflow: Restoran Simple

## Cycle

Setiap task mengikuti siklus yang sama:

`Plan -> Branch -> Implement -> Test -> Review -> Commit -> Pull Request -> Merge -> Update Docs`

1. **Plan:** pilih tepat satu task dari `docs/TASKS.md` (status `todo`), baca kriteria selesainya, dan pastikan fitur (ID F) yang terkait di `docs/PRD.md` sudah dipahami. Ubah status task menjadi `doing`.
2. **Branch:** buat branch baru dari `main` dengan nama seperti `feat/T-003-timer-jam-permainan`. Jangan pernah bekerja langsung di `main`.
3. **Implement:** kerjakan hanya cakupan task itu, ikuti `docs/CODE_STYLE.md`. Pisahkan logika di `src/game/` dari tampilan.
4. **Test:** jalankan gerbang di `docs/EVALS.md`, yaitu `npm run lint`, `npm test`, dan `npm run build`. Mainkan fitur satu putaran penuh di browser dengan `npm run dev` (R3). **Manusia wajib memeriksa hasil uji manual ini.**
5. **Review:** periksa `git status` dan `git diff`; pastikan mahasiswa bisa menjelaskan setiap perubahan. **Manusia wajib me-review diff** sebelum commit diterima.
6. **Commit:** commit kecil dengan format Conventional Commits, mis. `feat(game): tambah timer 30 detik yang berhenti saat pause`.
7. **Pull Request:** dorong branch dan buka PR memakai `.github/pull_request_template.md`; CI harus menjalankan lint, tes, dan build.
8. **Merge:** gabungkan ke `main` setelah CI hijau dan **satu review manusia**. Agen tidak boleh merge sendiri. Hapus branch setelah merge.
9. **Update Docs:** perbarui `docs/PROGRESS.md`, status task di `docs/TASKS.md`, `docs/DECISIONS.md` bila ada keputusan baru, dan `docs/REVIEW.md` untuk hasil uji manual (R3).

## Session Start Ritual

1. Baca `AGENTS.md`.
2. Baca `docs/PROGRESS.md` untuk keadaan terakhir.
3. Baca `docs/LESSONS.md` agar kesalahan lama tidak terulang.
4. Pilih tepat satu task dari `docs/TASKS.md` dengan status `todo`, lalu ubah statusnya menjadi `doing`.
5. Pastikan berada di branch yang benar (bukan `main`) dan working tree bersih (`git status`).
6. Jalankan `npm install` bila dependensi berubah sejak sesi terakhir.

## Session End Ritual

1. Jalankan gerbang di `docs/EVALS.md`: `npm run lint`, `npm test`, `npm run build`.
2. Commit kecil dengan pesan sesuai `docs/CODE_STYLE.md`.
3. Perbarui status task di `docs/TASKS.md` (`done` atau `blocked`).
4. Tulis ringkasan di `docs/PROGRESS.md`: selesai, berikutnya, dan hambatan.
5. Catat keputusan baru di `docs/DECISIONS.md` dan kesalahan agen di `docs/LESSONS.md`.
6. Catat hasil uji manual satu putaran penuh di `docs/REVIEW.md` (R3).
7. Dorong (push) branch dan buka PR.
8. Berhenti dan minta review manusia.

## Branching Strategy

- `main` selalu stabil dan dilindungi: wajib pull request dan CI lulus; tidak ada commit langsung ke `main`.
- Fitur: `feat/T-nnn-nama` (mis. `feat/T-004-penilaian-hidangan`). Perbaikan: `fix/T-nnn-nama`. Dokumen: `docs/nama`.
- Satu branch satu task; hapus branch setelah merge.
- Karena tim hanya 1 orang, satu branch aktif pada satu waktu sudah cukup. Sebelum membuka PR, **merge `main` ke branch** (bukan rebase) agar sederhana dan riwayat tidak ditulis ulang.
- Jangan force push ke `main`.

## Commit and Pull Request Rules

- Aturan commit mengikuti `docs/CODE_STYLE.md`: Conventional Commits, satu commit satu perubahan logis, ringkasan maksimal 72 karakter, dan ID task dirujuk di badan commit.
- Isi PR wajib: ringkasan perubahan, ID task, ID fitur (F1 sampai F5), cara menguji, hasil gerbang EVALS (lint, tes, build), dan tangkapan layar game bila tampilan berubah. Gunakan `.github/pull_request_template.md`.
- Ukuran PR kecil dan satu tujuan.
- Syarat merge: CI hijau dan satu review manusia.

## Human-in-the-Loop Checkpoints

Pada level **dasar**, manusia memeriksa di setiap task.

| Titik kontrol | Siapa | Yang diperiksa |
|---|---|---|
| Sebelum merge | Mahasiswa | Diff dipahami, gerbang EVALS lulus, satu putaran penuh fitur dimainkan di browser |
| Sebelum menambah dependensi baru (selain Three.js, Vite, Vitest, ESLint) | Mahasiswa | Nama paket benar, dipelihara aktif, lisensi sesuai, dan memang dibutuhkan |
| Sebelum mengubah arsitektur atau aturan permainan | Mahasiswa | Perubahan dicatat di `SPEC.json` dan `docs/DECISIONS.md` |
| Sebelum perintah destruktif | Mahasiswa | Perintah dan dampaknya ditampilkan, lalu disetujui secara eksplisit |
| Sebelum memakai layanan berbayar atau berkuota | Mahasiswa | Biaya dan batasnya jelas; hanya paket gratis tanpa persetujuan |
| Sebelum data nyata dipakai | Mahasiswa | Tidak berlaku saat ini karena tidak ada data pribadi (`personal_data`: none) |

## Handling Blockers

1. Coba maksimal tiga pendekatan berbeda untuk satu masalah.
2. Catat apa yang sudah dicoba di `docs/PROGRESS.md`.
3. Tandai task sebagai `blocked` di `docs/TASKS.md`.
4. Minta bantuan: dosen pembimbing, teman, atau dokumentasi resmi Three.js, Vite, dan Vitest.
5. Agen dilarang melewati blocker dengan mematikan tes atau lint, menurunkan keamanan, atau mengarang API.

## Level Notes

- **Dasar (AKTIF):** satu pengembang, alur sederhana, gerbang dijalankan manual di lokal dan di CI; manusia memeriksa di setiap task.
- **Menengah:** tugas terstruktur, CI wajib, review rutin di setiap PR.
- **Loop:** agen berputar dengan batas dan kondisi berhenti ketat; lihat `docs/LOOP.md` (tidak dipakai di proyek ini).
