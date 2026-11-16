# Lessons: Restoran Simple

Kesalahan berulang dan pelajaran dari proyek ini. **Dibaca agen di awal setiap sesi.** Entri baru ditambahkan oleh mahasiswa atau agen setelah kesalahan ditemukan.

## How to Use

1. Tambahkan entri saat ada error yang memakan waktu lebih dari 30 menit, agen melakukan kesalahan yang sama berulang, atau review menemukan masalah yang layak dicatat.
2. Format entri satu baris tabel: tanggal, kesalahan atau gejala, akar masalah, aturan baru, dan dokumen tempat aturan diterapkan.
3. Ubah pelajaran menjadi aturan: tambahkan ke `docs/CODE_STYLE.md`, `docs/GUARDRAILS.md`, atau `docs/EVALS.md` supaya tidak bergantung pada ingatan.
4. Tulis entri singkat dan tanpa menyalahkan siapa pun; fokus pada penyebab dan pencegahan.

## Lessons Log

| Tanggal | Kesalahan atau gejala | Akar masalah | Aturan baru | Diterapkan di |
|---|---|---|---|---|
| Awal (belum terjadi di proyek ini) | Agen memakai kelas atau fungsi Three.js yang sudah tidak ada atau berubah | Model mengajarkan API versi lama dan bisa mengarang nama | Cek di dokumentasi resmi Three.js dan versi yang terpasang sebelum memakai API | `docs/CODE_STYLE.md` (AI-Generated Code Rules) |
| Awal (belum terjadi di proyek ini) | Tes diubah atau dinonaktifkan agar CI hijau | Mengejar status lulus tanpa memperbaiki penyebab | Tes tidak boleh dilemahkan; jelaskan alasan di PR bila tes harus berubah | `docs/EVALS.md` (Regression Policy) |
| Awal (belum terjadi di proyek ini) | Timer tetap berjalan saat Pause karena memakai `setInterval` mentah | Waktu dihitung di luar jam permainan yang bisa dijeda | Semua timer memakai jam permainan; `setInterval` mentah dilarang untuk timer utama | `docs/CODE_STYLE.md` (Forbidden Patterns) |
| Awal (belum terjadi di proyek ini) | Agen mengerjakan beberapa task sekaligus dalam satu sesi | Cakupan tidak dibatasi di awal sesi | Satu task per sesi, mulai dari branch baru | `docs/WORKFLOW.md` (Session Start Ritual) |
| Awal (belum terjadi di proyek ini) | Agen menyatakan fitur selesai tanpa pernah dimainkan di browser | Hanya mengandalkan tes unit untuk bagian 3D dan UI | Mainkan satu putaran penuh dan catat di `docs/REVIEW.md` sebelum menutup task (R3) | `docs/TESTING.md` (Definition of Done) |

## Patterns to Watch

1. **API Three.js usang atau salah.** Contoh kode di internet dan jawaban model sering memakai versi lama. Deteksi: error di konsol browser saat `npm run dev`, atau fungsi yang tidak ditemukan di dokumentasi versi yang terpasang (`npm view three version`).
2. **Objek 3D menumpuk setelah Main lagi.** Geometri, material, atau listener yang tidak dilepas membuat game melambat setelah beberapa putaran. Deteksi: mainkan beberapa putaran berturut-turut dan perhatikan pemakaian memori atau penurunan kelancaran di alat pengembang browser.
3. **Loncatan waktu saat tab browser tidak aktif.** Loop animasi browser berhenti saat tab tersembunyi, sehingga selisih waktu bisa sangat besar saat kembali dan timer melompat. Deteksi: pindah tab selama beberapa detik saat pesanan berjalan, lalu kembali dan periksa sisa waktu.
4. **Format konfigurasi ESLint atau Vitest yang kedaluwarsa.** Agen dapat menulis format konfigurasi lama (mis. `.eslintrc` versus `eslint.config.js`) sehingga `npm run lint` gagal. Deteksi: jalankan `npm run lint` dan baca pesan error; cocokkan dengan dokumentasi resmi untuk versi terpasang.
5. **Aset atau jalur berkas yang benar di dev tetapi rusak di build produksi.** Jalur aset di Vite berbeda antara `public/` dan impor modul. Deteksi: jalankan `npm run build` lalu periksa hasilnya di browser (mis. dengan `npm run preview` bila skripnya ada) sebelum deploy.

## Reflection Prompts

Jawab sendiri di akhir proyek:

1. Keputusan apa yang kamu ubah selama proyek ini, dan mengapa?
2. Bagian mana yang dikerjakan AI dengan baik, dan bagian mana yang salah atau harus kamu perbaiki?
3. Bug atau error apa yang paling memakan waktu, dan aturan apa yang akan kamu tambahkan agar tidak terulang?
4. Apa yang kamu pelajari tentang Three.js dan membangun logika game yang bisa diuji?
5. Apa yang akan kamu lakukan berbeda jika mengulang proyek ini dari awal?
