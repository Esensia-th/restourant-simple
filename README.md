# Restoran Simple

> Game simulasi coffee shop di browser: pelanggan 2D gaya visual novel, alat dan bahan 3D yang bisa dipakai.

## About

Restoran Simple adalah game simulasi coffee shop yang dimainkan di browser. Pemain melayani 10 pelanggan satu per satu dengan meracik pesanan dari alat dan bahan 3D yang bisa dipakai (kompor, penggorengan, blender, dan lainnya) sambil mengikuti petunjuk langkah tiap menu. Jika hidangan sesuai resep, pelanggan membayar dan uangnya tampil di layar; jika salah atau waktu 30 detik habis, pelanggan pergi. Game ini ditujukan untuk pemain umum dan membantu orang mengenali bahan penyusun makanan dan minuman.

## Features

| ID | Fitur | Prioritas | Status |
|---|---|---|---|
| F1 | Halaman awal dan Start | must | direncanakan |
| F2 | Pesanan pelanggan, penilaian, dan uang | must | direncanakan |
| F3 | Interaksi alat dan bahan 3D | must | direncanakan |
| F4 | Timer 30 detik, pause, dan resume | must | direncanakan |
| F5 | Petunjuk langkah pembuatan | must | direncanakan |

## Tech Stack

- **Rendering dan UI:** Three.js (objek 3D), HTML/CSS (lapisan 2D), JavaScript, Vite
- **Backend, database, dan auth:** tidak ada (game berjalan sepenuhnya di browser)
- **Hosting:** Vercel (hosting statis)
- **Pengujian:** Vitest
- **Kata kunci:** Three.js, JavaScript, Vite, HTML/CSS, Vitest, Vercel
- **Versi:** latest stable (verifikasi dengan `npm view three version`, `npm view vite version`, dan `npm view vitest version`)

## Getting Started

1. Pasang prasyarat: Git dan Node.js versi LTS terbaru (cek `node --version`).
2. Clone repositori: `git clone <url-repositori>` lalu masuk ke foldernya.
3. Instal dependensi: `npm install` (tersedia setelah T-001).
4. Salin `.env.example` menjadi `.env` bila berkas itu memuat variabel; saat ini tidak ada variabel yang wajib diisi.
5. Jalankan mode pengembangan: `npm run dev` (tersedia setelah T-001).
6. Buka alamat yang tercetak di terminal (biasanya `http://localhost:5173`) di browser untuk memainkan game.

Perintah di atas sama dengan yang ada di `AGENTS.md`. Sebelum T-001 selesai, repositori belum memiliki `package.json` sehingga perintah belum bisa dijalankan.

## Scripts and Commands

| Perintah | Fungsi |
|---|---|
| `npm install` | Memasang dependensi (tersedia setelah T-001) |
| `npm run dev` | Menjalankan server pengembangan Vite untuk uji manual |
| `npm run lint` | Memeriksa gaya dan kesalahan kode dengan ESLint |
| `npm test` | Menjalankan semua tes Vitest sekali |
| `npm run build` | Membangun versi produksi (berkas statis) dengan Vite |

## Project Structure

```text
restoran-simple/
├── AGENTS.md      # Instruksi untuk agen AI
├── README.md      # Dokumen ini
├── SPEC.json      # Sumber kebenaran spesifikasi proyek
├── docs/          # PRD, arsitektur, tugas, keputusan, dan dokumen lain
├── src/           # Kode: game/ (logika), scene/ (Three.js), ui/ (HTML/CSS), styles/
├── tests/         # Tes Vitest untuk logika game
├── public/        # Berkas statis dan aset
└── .github/       # CI, Dependabot, template PR
```

Folder `src/`, `tests/`, dan `public/` dibuat pada T-001.

## Documentation

| Dokumen | Fungsi |
|---|---|
| [AGENTS.md](AGENTS.md) | Instruksi singkat untuk agen AI |
| [docs/PRD.md](docs/PRD.md) | Kebutuhan produk dan kriteria acceptance |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, struktur, model data, dan katalog menu |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Warna, tipografi, komponen, dan aksesibilitas |
| [docs/SECURITY.md](docs/SECURITY.md) | Model ancaman dan checklist OWASP |
| [docs/CODE_STYLE.md](docs/CODE_STYLE.md) | Gaya kode dan konvensi commit |
| [docs/TESTING.md](docs/TESTING.md) | Strategi tes dan daftar uji manual |
| [docs/EVALS.md](docs/EVALS.md) | Gerbang kualitas dan kriteria lulus |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Siklus kerja dan aturan branch/PR |
| [docs/GUARDRAILS.md](docs/GUARDRAILS.md) | Batas yang tidak boleh dilanggar |
| [docs/TASKS.md](docs/TASKS.md) | Daftar task dan milestone |
| [docs/PROGRESS.md](docs/PROGRESS.md) | Keadaan terakhir pekerjaan |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Keputusan arsitektur (ADR) |
| [docs/REVIEW.md](docs/REVIEW.md) | Checklist review dan catatan uji manual |
| [docs/LESSONS.md](docs/LESSONS.md) | Pelajaran dan pola kesalahan |

## Contributing

Ikuti `docs/WORKFLOW.md`: satu branch per task, pull request kecil, CI hijau, dan review manusia sebelum merge. Pesan commit mengikuti `docs/CODE_STYLE.md` (Conventional Commits). Agen AI yang bekerja di repositori ini mengikuti `AGENTS.md`.

## AI Usage Disclosure

Proyek ini disusun dengan bantuan alat AI (Claude Code dan Gemini CLI). Dokumen awal dihasilkan dari `SPEC.json` oleh asisten penyusun dokumen. Aturan proyek: setiap perubahan harus ditinjau dan dipahami oleh penulis sebelum digabung.

## Status

Tahap perencanaan: dokumen proyek siap, implementasi belum dimulai. Lihat `docs/PROGRESS.md`.
