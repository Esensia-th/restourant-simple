# Testing: Restoran Simple

## Strategy

Pengujian memakai Vitest (`stack.testing`) pada level proses dasar untuk game web statis yang dikerjakan 1 orang dalam 1 minggu. Strategi mengikuti piramida: banyak tes unit pada logika murni di `src/game/` (resep, penilaian, harga, timer, aturan menang/kalah), tanpa E2E otomatis, karena tampilan 3D dan interaksi pointer sulit dan mahal diuji otomatis dalam seminggu. Bagian yang tidak tercakup tes otomatis (scene Three.js dan UI) dijaga uji manual per fitur sesuai R3. Logika dipisah dari tampilan agar sebagian besar risiko bug (kendali R1) berada di area yang bisa diuji cepat.

## Test Types

| Jenis | Alat | Lokasi berkas | Kapan dijalankan | Perintah |
|---|---|---|---|---|
| Unit logika game | Vitest | `tests/*.test.js` (mis. `timer.test.js`, `evaluate-dish.test.js`, `game-state.test.js`) | Setiap perubahan dan di CI | `npm test` |
| Tes data menu | Vitest | `tests/menu-catalog.test.js` | Setiap perubahan data menu dan di CI | `npm test` |
| Tes penanganan error | Vitest | `tests/error-handler.test.js` | Di CI | `npm test` |
| Uji manual di browser | Browser (server pengembang Vite) | Daftar periksa di bawah dan `docs/REVIEW.md` | Sebelum menutup tiap task (R3) dan sebelum rilis | `npm run dev` |

Tidak ada E2E otomatis (Playwright tidak dipilih); keputusan ini dicatat di `docs/DECISIONS.md`.

## What Must Be Tested

| Fitur | Perilaku kunci yang diuji | Jenis tes |
|---|---|---|
| F1 Halaman awal dan Start | Transisi state `awal` → `main` hanya terjadi saat Start; belum ada pelanggan atau timer sebelum Start; tampilan halaman awal dan tombol Start | Unit (state) + manual |
| F2 Pesanan pelanggan, penilaian, dan uang | Penilaian benar bila urutan bahan dan proses persis resep; salah → pelanggan pergi dan uang tetap; uang bertambah sebesar harga menu; 10 harga unik; menang setelah 10 pelanggan terlayani; kalah bila ada yang pergi; Main lagi mengembalikan uang 0 dan 1/10; Sajikan tidak diproses dua kali | Unit |
| F3 Interaksi alat dan bahan 3D | Durasi tiap proses 3 detik; total waktu proses tiap resep ≤ 20 detik; kombinasi di luar resep tidak error dan tercatat di hidangan; objek 3D merespons pilihan dan hasil proses tampak berubah | Unit (durasi, pencatatan) + manual (objek 3D) |
| F4 Timer 30 detik, pause, dan resume | Timer mulai 30 detik saat pesanan disebut; Pause menghentikan timer dan proses 3 detik; Resume melanjutkan dari sisa waktu; timer habis di tengah proses membatalkan proses dan pelanggan pergi | Unit |
| F5 Petunjuk langkah pembuatan | Ke-10 menu punya daftar bahan, alat, dan urutan langkah; petunjuk tidak memengaruhi timer; panel tampil di layar game | Unit (data) + manual (tampilan) |

Wajib uji keamanan dan galat:
- **Otorisasi per peran:** tidak berlaku (satu peran, tanpa login).
- **Validasi input:** ID bahan, alat, atau proses di luar daftar diabaikan tanpa error; aksi saat `paused` benar atau pesanan bukan `menunggu` diabaikan; klik ganda Sajikan hanya sekali.
- **Perilaku saat galat:** error runtime memicu pesan "Terjadi kesalahan" dan tombol kembali ke awal (R2); jaringan putus setelah halaman dimuat tidak memengaruhi permainan.

## Commands

Perintah utama (dari `stack.commands`, identik dengan AGENTS.md, EVALS.md, dan CI):

| Tujuan | Perintah |
|---|---|
| Instal | `npm install` |
| Lint | `npm run lint` |
| Semua tes | `npm test` |
| Build | `npm run build` |

Perintah tambahan:
- Server pengembangan untuk uji manual: `npm run dev`.
- Satu berkas tes: `npx vitest run tests/timer.test.js`.
- Mode watch saat menulis tes: `npx vitest`.
- Pemeriksaan tipe: tidak ada (`typecheck` kosong).
- E2E: tidak ada.

Skrip `test` (menjalankan Vitest sekali, mis. `vitest run`), `lint`, dan `dev` belum ada di repositori awal; task setup **T-001** yang membuatnya.

## Coverage and Quality Bar

- Target cakupan (usulan): logika di `src/game/` tinggi (sekitar 90 persen atau lebih); `src/scene/` dan `src/ui/` tidak dipaksa karena diuji manual. Jangan mengejar 100 persen.
- Tes tidak boleh dihapus atau dilemahkan agar lulus; bila sebuah tes salah, perbaiki tes dengan alasan yang dicatat di PR.
- Setiap bug yang diperbaiki wajib mendapat tes baru yang gagal sebelum perbaikan dan lulus sesudahnya.

## Test Data

- Data uji utama adalah katalog 10 menu (`menu_catalog` di SPEC) yang dimuat dari satu berkas data yang sama dengan game.
- Tidak ada data pribadi (`personal_data`: none), jadi data uji aman dan fiktif.
- Gunakan jam permainan palsu (fake clock) atau nilai `deltaSeconds` eksplisit agar tes timer tidak bergantung pada waktu nyata.
- Bila ada pemilihan menu acak, suntikkan fungsi acak atau seed agar tes deterministik.
- Tidak ada database yang perlu direset dan tidak ada layanan eksternal yang perlu sandbox.

## Manual Test Checklist

- [ ] Game berjalan di peramban utama yang dipakai (mis. Chrome dan Firefox) tanpa error di konsol.
- [ ] Halaman awal tampil dengan tombol Start; game belum berjalan sebelum Start ditekan.
- [ ] Setelah Start, pelanggan 1/10 muncul dan dialog menyebut satu menu.
- [ ] Ke-10 menu dapat dibuat satu per satu dan dinilai benar bila mengikuti petunjuk.
- [ ] Menyajikan hidangan dengan urutan salah membuat pelanggan pergi dan layar hasil kalah tampil.
- [ ] Membiarkan timer habis membuat pelanggan pergi dan layar hasil kalah tampil.
- [ ] Pause menghentikan timer dan proses 3 detik; Resume melanjutkan dari sisa waktu.
- [ ] Panel petunjuk selalu tampil di layar game dan tidak memengaruhi timer.
- [ ] Setiap alat dan bahan 3D merespons saat dipilih dengan perubahan yang terlihat.
- [ ] Setelah 10 pelanggan terlayani benar, layar hasil menang tampil dengan total uang; tombol Main lagi mengembalikan uang 0 dan 1/10.
- [ ] Uang yang tampil bertambah sesuai harga menu setiap pelanggan membayar.
- [ ] Layar sempit: tata letak tidak patah dan panel petunjuk tetap terbaca.
- [ ] Keyboard saja: tombol Start, Pause, Resume, Sajikan, dan Main lagi bisa dijangkau dengan Tab dan fokusnya terlihat.
- [ ] Pesan "Terjadi kesalahan" dengan tombol kembali ke awal muncul saat error sengaja dipicu (R2).
- [ ] Mode gerak berkurang (`prefers-reduced-motion`) diuji; animasi tidak berlebihan.

## Definition of Done

- [ ] Kriteria acceptance fitur di `docs/PRD.md` terpenuhi.
- [ ] Tes baru ditulis dan `npm test` lulus.
- [ ] `npm run lint` bersih.
- [ ] `npm run build` berhasil.
- [ ] Tidak ada rahasia di diff.
- [ ] Satu putaran penuh fitur dimainkan di browser dan dicatat di `docs/REVIEW.md` (R3).
- [ ] `docs/PROGRESS.md` dan `docs/DECISIONS.md` diperbarui bila ada keputusan baru.
- [ ] Pull request di-review dan CI hijau.
