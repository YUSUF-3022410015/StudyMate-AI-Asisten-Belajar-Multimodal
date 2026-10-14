# Product Requirements Document (PRD)

# StudyMate AI — Asisten Belajar Multimodal

| Informasi | Detail |
|---|---|
| Nama produk | StudyMate AI |
| Deskripsi | Asisten belajar berbasis AI untuk membantu siswa memahami materi dan soal melalui teks maupun gambar |
| Status dokumen | Final untuk ruang lingkup dan arah produk; implementasi belum diverifikasi |
| Versi | 1.0 |
| Tanggal | 14 Oktober 2026 |
| Target pengguna utama | Siswa SMA/SMK; dapat digunakan masyarakat umum |
| Model akses | Website publik tanpa login |
| Target biaya | Rp0 selama dapat ditopang oleh layanan free tier dan kuotanya |
| Repositori yang sudah ada | https://github.com/YUSUF-3022410015/StudyMate-AI-Asisten-Belajar-Multimodal.git |

> **Catatan status:** PRD ini menetapkan kebutuhan dan keputusan produk. Dokumen ini tidak menyatakan bahwa kode, konfigurasi, deployment, atau file Obsidian sudah diubah. Repositori wajib diperiksa sebelum implementasi agar perubahan menyesuaikan kondisi kode yang benar-benar ada.

## 1. Latar Belakang

Siswa sering membutuhkan bantuan untuk memahami materi, merangkum catatan, dan menyelesaikan soal. StudyMate AI dirancang sebagai website yang mudah diakses tanpa harus membuat akun. Pengguna dapat bertanya melalui teks, mengirim foto soal, dan memilih bentuk penjelasan yang sesuai dengan kebutuhannya.

Proyek ini dikembangkan sebagai proyek portofolio yang dapat dipakai publik, dengan perhatian pada pengalaman pengguna, keamanan API, biaya operasional, dan dokumentasi pengembangan.

## 2. Tujuan Produk

1. Membantu pengguna memahami materi, bukan hanya memberikan jawaban akhir.
2. Menyediakan pengalaman belajar yang sederhana dan responsif di desktop maupun perangkat seluler.
3. Mendukung pertanyaan teks, analisis gambar, penjelasan bertahap, petunjuk, dan ringkasan materi.
4. Mengutamakan layanan gratis selama masih tersedia kuota dan sesuai ketentuan penyedia.
5. Menjaga dokumentasi keputusan, aktivitas, masalah, pengujian, dan perubahan melalui Obsidian.

## 3. Pengguna Sasaran

- **Utama:** siswa SMA/SMK yang membutuhkan bantuan belajar.
- **Sekunder:** mahasiswa dan masyarakat umum yang ingin memahami atau merangkum materi.
- **Kebutuhan utama:** akses cepat tanpa login, jawaban yang mudah dipahami, bantuan dari foto soal, dan kendali atas kedalaman penjelasan.

## 4. Ruang Lingkup MVP

### 4.1 Fitur yang termasuk

- Chat belajar berbasis teks.
- Unggah foto soal atau materi untuk dibaca dan dianalisis AI.
- Mode **Petunjuk**, **Langkah demi Langkah**, dan **Penjelasan Lengkap**.
- Fitur untuk merangkum teks atau materi yang diberikan pengguna.
- Riwayat percakapan yang disimpan secara lokal di browser pengguna.
- Percakapan baru, memilih percakapan sebelumnya, dan menghapus riwayat lokal.
- Status loading, penanganan kesalahan, serta pesan yang jelas ketika layanan AI gagal atau kuota habis.
- Antarmuka responsif dan aksesibilitas dasar.
- Konfigurasi provider AI agar mode publik dan mode lokal dapat dipisahkan.
- Dokumentasi produk dan aktivitas pengembangan di Obsidian.

### 4.2 Di luar ruang lingkup MVP

- Login, registrasi, profil, dan sinkronisasi lintas perangkat.
- Penyimpanan riwayat percakapan di server.
- Pembayaran, langganan, atau fitur berbayar.
- Klaim penggunaan AI tanpa batas.
- Jaminan jawaban AI selalu benar.
- Aplikasi native Android/iOS.
- Dashboard admin lengkap atau analitik pengguna yang mengidentifikasi individu.

Fitur di luar ruang lingkup hanya ditambahkan setelah ada kebutuhan dan keputusan baru yang dicatat di Obsidian.

## 5. Kebutuhan Fungsional

### FR-01 — Akses tanpa login
Pengguna dapat membuka website dan mulai menggunakan chat tanpa membuat akun.

**Kriteria penerimaan:** halaman utama dan fitur chat utama dapat dibuka tanpa proses registrasi.

### FR-02 — Chat teks
Pengguna dapat mengetik pertanyaan dan menerima jawaban AI.

**Kriteria penerimaan:** pesan pengguna dan jawaban ditampilkan dengan jelas; kegagalan permintaan menampilkan pesan yang dapat dipahami dan opsi mencoba kembali bila sesuai.

### FR-03 — Mode belajar
Pengguna dapat memilih salah satu mode berikut:

- **Petunjuk:** AI memberi arahan awal dan tidak langsung membocorkan semua langkah.
- **Langkah demi Langkah:** AI menguraikan proses penyelesaian secara runtut.
- **Penjelasan Lengkap:** AI memberi penjelasan lebih menyeluruh, termasuk alasan dan konsep terkait.

**Kriteria penerimaan:** mode yang dipilih diteruskan ke instruksi backend dan memengaruhi bentuk jawaban.

### FR-04 — Analisis gambar
Pengguna dapat mengunggah foto soal atau materi dalam format JPEG, PNG, atau WebP. Batas awal ukuran berkas adalah 10 MB dan dapat disesuaikan setelah pengujian provider.

**Kriteria penerimaan:** tipe dan ukuran berkas divalidasi; gambar yang tidak valid ditolak dengan pesan yang jelas; berkas tidak disimpan sebagai riwayat di server.

### FR-05 — Ringkasan materi
Pengguna dapat memasukkan teks dan meminta ringkasan yang terstruktur.

**Kriteria penerimaan:** hasil ringkasan ditampilkan di chat dan dapat disalin oleh pengguna.

### FR-06 — Riwayat lokal
Percakapan disimpan pada browser pengguna menggunakan IndexedDB. Pengguna dapat membuka kembali atau menghapus riwayatnya.

**Batasan:** riwayat tidak tersinkron antardevice dan bisa hilang jika data situs/browser dihapus atau penyimpanan lokal dibersihkan.

### FR-07 — Pengelolaan percakapan
Pengguna dapat memulai percakapan baru, memilih percakapan lama, dan menghapus percakapan.

**Kriteria penerimaan:** perubahan riwayat tercermin pada penyimpanan lokal dan tampilan antarmuka.

### FR-08 — Informasi status layanan
Website menampilkan status proses dan penjelasan ketika provider gagal, jaringan bermasalah, input tidak valid, atau kuota tersedia telah habis.

**Kriteria penerimaan:** pesan kesalahan tidak mengungkap secret, stack trace, atau detail internal yang berisiko.

### FR-09 — Pemilihan provider
Aplikasi menyediakan lapisan adapter untuk memisahkan logika chat dari provider AI. Mode deployment publik dan mode lokal harus memiliki konfigurasi serta instruksi penggunaan yang jelas.

**Kriteria penerimaan:** pergantian provider tidak mengharuskan perubahan komponen UI inti dan tidak membocorkan kredensial ke browser.

### FR-10 — Dokumentasi pengembangan
Setiap sesi pengembangan yang menghasilkan keputusan, perubahan, masalah, perbaikan, pengujian, atau deployment dicatat di Obsidian.

**Kriteria penerimaan:** dokumentasi membedakan perubahan yang sudah diverifikasi, yang masih direncanakan, dan yang belum berhasil.

## 6. Pengalaman Pengguna dan Alur Utama

1. Pengguna membuka website.
2. Pengguna memilih mode belajar atau menggunakan mode default.
3. Pengguna mengetik pertanyaan, atau mengunggah foto jika perlu.
4. Antarmuka menampilkan indikator proses.
5. Backend memvalidasi input, menerapkan pembatasan penggunaan, dan meneruskan permintaan ke provider yang dikonfigurasi.
6. Jawaban ditampilkan dalam percakapan.
7. Percakapan disimpan secara lokal di browser.
8. Jika permintaan gagal, pengguna menerima penjelasan yang sesuai, misalnya layanan sedang bermasalah atau kuota provider telah habis.

## 7. Antarmuka dan Desain

- Gaya visual: modern, bersih, profesional, dan berfokus pada kegiatan belajar.
- Navigasi dan fungsi utama mudah ditemukan.
- Layout responsif untuk desktop, tablet, dan ponsel.
- Area chat menjadi fokus utama halaman.
- Input teks dan unggah gambar mudah digunakan.
- Pesan pengguna, jawaban AI, indikator loading, dan pesan error mudah dibedakan.
- Gunakan komponen yang konsisten dan dapat digunakan ulang.
- Sediakan label, fokus keyboard, dan kontras yang layak untuk aksesibilitas dasar.
- Jangan menambahkan elemen visual atau fitur yang tidak mendukung tujuan belajar tanpa alasan yang jelas.

## 8. Teknologi yang Ditetapkan

- **Framework:** Next.js menggunakan App Router.
- **Bahasa:** TypeScript.
- **Styling:** Tailwind CSS.
- **Komponen UI:** shadcn/ui bila sesuai dengan kondisi proyek yang sudah ada.
- **Riwayat lokal:** IndexedDB.
- **Deployment website publik:** Vercel Hobby, dengan ketentuan dan batas free tier yang berlaku.
- **Provider AI untuk jalur publik:** Gemini API Free Tier, selama model, kuota, serta penggunaan masih memenuhi ketentuan provider.
- **Mode lokal opsional:** 9Router dan OmniRoute melalui endpoint lokal yang dikonfigurasi pada mesin pengguna.
- **Repositori:** GitHub.
- **Dokumentasi proyek:** Obsidian.

Sebelum mengganti atau menambah dependensi, periksa `package.json`, struktur folder, versi aktual, dan pola kode yang sudah digunakan. Jangan melakukan rewrite besar tanpa kebutuhan yang terverifikasi.

## 9. Arsitektur AI dan Mode Operasi

### 9.1 Mode publik

Alur yang direncanakan:

`Browser → Next.js API route/server-side handler → validasi input dan rate limit → Gemini API → hasil kembali ke browser`

- Permintaan AI publik harus melalui backend, bukan langsung dari browser ke provider menggunakan API key.
- API key disimpan sebagai environment variable server di pengaturan deployment.
- Secret tidak boleh dimasukkan ke source code, file yang dikirim ke browser, riwayat percakapan, dokumentasi, atau repositori.
- Jika kuota free tier habis, aplikasi harus menampilkan pesan bahwa layanan sedang mencapai batas penggunaan. Jangan otomatis beralih ke provider berbayar.
- Ketersediaan dan batas layanan gratis dapat berubah. Periksa dokumentasi dan ketentuan penyedia sebelum peluncuran dan secara berkala.

### 9.2 Mode lokal opsional

Mode lokal ditujukan bagi pengembang/pengguna yang menjalankan aplikasi pada komputernya sendiri dan sengaja mengonfigurasi endpoint 9Router atau OmniRoute.

- Endpoint lokal yang dipakai harus diatur melalui konfigurasi server-side, bukan dipilih dari input publik.
- Alamat localhost milik laptop tidak dapat digunakan oleh pengunjung internet sebagai backend publik dari deployment Vercel.
- Laptop tidak dijadikan server 24/7 dan bukan prasyarat bagi website publik.
- Dokumentasikan variabel environment dan cara menjalankan mode lokal, tanpa mencatat isi token atau secret.
- Jangan menganggap provider lokal tersedia ketika proses router mati atau laptop tidak aktif.

### 9.3 Perilaku fallback

Untuk MVP publik, provider utama adalah Gemini API. Saat kuota atau layanan tidak tersedia, kembalikan pesan error yang ramah dan hentikan permintaan. Jangan melakukan fallback otomatis ke model berbayar. Mode 9Router/OmniRoute adalah konfigurasi lokal yang disengaja, bukan fallback publik yang bergantung pada laptop.

## 10. Privasi dan Keamanan

1. Tidak ada login atau database riwayat percakapan di server untuk MVP.
2. Riwayat percakapan disimpan di IndexedDB milik browser pengguna.
3. Pengguna diberi keterangan bahwa data lokal tidak tersinkron antardevice dan dapat hilang saat data browser dibersihkan.
4. Validasi tipe, ukuran, dan isi input dilakukan di server; validasi di UI bukan satu-satunya perlindungan.
5. Terapkan pembatasan ukuran pesan dan gambar, batas waktu permintaan, serta rate limit untuk endpoint AI.
6. Karena website bersifat publik, batas penggunaan harus diterapkan server-side menggunakan mekanisme yang sesuai. Penyimpanan untuk rate limit boleh terpisah dari riwayat chat; gunakan layanan free tier bila tersedia dan periksa ketentuan serta batas terkini sebelum memilihnya.
7. Jangan mengandalkan variabel memori proses serverless sebagai satu-satunya rate limit global karena instans dapat berubah atau berjalan terpisah.
8. Jangan menaruh API key di `NEXT_PUBLIC_*`, kode frontend, file contoh environment berisi secret, commit Git, atau log.
9. Tambahkan `.env.local` ke `.gitignore`; sediakan `.env.example` yang hanya mencantumkan nama variabel dengan placeholder kosong/contoh palsu.
10. Jangan mencatat isi prompt sensitif, gambar, token, atau API key ke log aplikasi secara default.
11. Tampilkan batasan AI: jawaban mungkin salah, sehingga materi penting harus diverifikasi.
12. Jangan mengklaim website sepenuhnya bebas penyimpanan pihak ketiga jika hosting atau provider memiliki log operasional sendiri. Dokumentasikan alur data sesuai implementasi aktual.

## 11. Biaya dan Batas Free Tier

Target biaya operasional adalah Rp0 dengan memakai paket gratis yang tersedia. Target ini bukan jaminan bahwa layanan akan selalu gratis atau tanpa batas.

- Gunakan Gemini API Free Tier untuk jalur publik selama sesuai dengan kuota dan ketentuannya.
- Gunakan Vercel Hobby untuk deployment sesuai ketentuan paket tersebut.
- Jangan aktifkan pembayaran atau fallback berbayar otomatis tanpa keputusan eksplisit.
- Saat kuota habis, batasi atau hentikan permintaan AI dengan pesan yang jelas.
- Pantau penggunaan dan batas layanan di dashboard resmi provider.
- Rate limiting, proteksi penyalahgunaan, dan layanan penyimpanan batas penggunaan mungkin memiliki kuota tersendiri; pilih opsi gratis yang masih sesuai kebutuhan dan tinjau ulang ketika kebijakan berubah.
- Hindari klaim “AI gratis tanpa batas” pada UI atau dokumentasi.

## 12. Non-Functional Requirements

- **Responsif:** nyaman digunakan di desktop dan ponsel.
- **Keandalan:** kesalahan jaringan/provider ditangani tanpa merusak seluruh UI.
- **Keamanan:** secret hanya tersedia di server; input divalidasi dan endpoint dibatasi.
- **Kemudahan pemeliharaan:** kode TypeScript terstruktur dan komponen dapat digunakan ulang.
- **Performa:** unggah gambar dan permintaan AI menampilkan status; ukuran input dibatasi.
- **Aksesibilitas:** fungsi utama dapat dioperasikan dengan keyboard dan memiliki label yang layak.
- **Transparansi:** kegagalan, batas provider, dan batas penyimpanan riwayat dijelaskan dengan jujur.
- **Dokumentasi:** keputusan dan status implementasi dapat ditelusuri lewat Obsidian.

## 13. Pengujian dan Kriteria Selesai

MVP dinyatakan siap dipublikasikan setelah seluruh kriteria berikut diuji:

- [ ] Website dan alur chat utama dapat digunakan tanpa login.
- [ ] Pertanyaan teks berhasil dikirim dan jawabannya tampil.
- [ ] Ketiga mode belajar memberikan instruksi yang sesuai.
- [ ] Gambar JPEG/PNG/WebP yang valid dapat dikirim dan dianalisis.
- [ ] Berkas terlalu besar atau tipe yang tidak didukung ditolak dengan pesan yang jelas.
- [ ] Ringkasan materi dapat dibuat.
- [ ] Riwayat tersimpan, dapat dibuka kembali, dan dapat dihapus di browser yang sama.
- [ ] UI berfungsi pada ukuran layar ponsel dan desktop.
- [ ] Loading, timeout, kesalahan provider, serta kondisi kuota habis ditangani.
- [ ] Rate limit dan batas ukuran diuji di backend.
- [ ] Tidak ada API key atau token yang terlihat pada browser, bundle publik, log, atau repository.
- [ ] File environment berisi secret tidak ter-commit.
- [ ] Mode publik tidak bergantung pada laptop atau endpoint localhost.
- [ ] Deployment diperiksa melalui URL publik dan log yang relevan.
- [ ] Dokumentasi Obsidian diperbarui sesuai kondisi yang sudah diuji.

Status setiap item harus dicatat sebagai **Lulus**, **Gagal**, atau **Belum diuji**. Jangan menandai lulus hanya berdasarkan perkiraan.

## 14. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Kuota AI gratis habis | Batasi permintaan, tampilkan pesan jelas, jangan otomatis memakai layanan berbayar |
| Endpoint publik disalahgunakan | Server-side rate limit, validasi input, pembatasan ukuran dan waktu permintaan |
| API key bocor | Environment variable server, `.gitignore`, audit commit dan konfigurasi deployment |
| Jawaban AI salah | Beri tahu pengguna bahwa hasil perlu diverifikasi untuk materi penting |
| Riwayat hilang | Jelaskan bahwa riwayat hanya lokal; ekspor manual dapat dipertimbangkan sebagai fitur terpisah di masa depan |
| Router lokal tidak aktif | Beri pesan provider tidak tersedia; jangan menjadikannya ketergantungan website publik |
| Perubahan paket gratis/ketentuan | Periksa dokumentasi resmi sebelum peluncuran dan ketika ada perubahan provider |
| Dokumentasi tidak sesuai kode | Catat hasil pengujian dan perubahan nyata, pisahkan rencana dan implementasi |

## 15. Dokumentasi Proyek dan Knowledge Management dengan Obsidian

Obsidian menjadi sumber dokumentasi utama bagi riwayat proyek, keputusan, aktivitas pengembangan, penyelesaian masalah, pengujian, deployment, dan pembelajaran. Dokumentasi harus diperbarui setelah sesi kerja yang menghasilkan perubahan penting.

### 15.1 Struktur folder

Gunakan folder yang sudah disiapkan:

```text
Obsidian Vault/
├── projek/
│   └── Dokumentasi StudyMate AI.md.md
├── arsip/
│   └── Riwayat Pembuatan StudyMate AI.md.md
└── pengalaman/
    └── Evaluasi dan Pembelajaran StudyMate AI.md.md
```

Nama file mengikuti konvensi proyek yang sudah digunakan di vault. Jika file sejenis sudah ada, perbarui file yang ada daripada membuat salinan baru tanpa alasan.

### 15.2 Isi dokumentasi

**`projek/Dokumentasi StudyMate AI.md.md`** — dokumen utama yang memuat PRD, fitur, arsitektur, struktur kode, konfigurasi non-rahasia, status fitur, cara menjalankan proyek, prosedur pengujian, dan tautan deployment/repository.

**`arsip/Riwayat Pembuatan StudyMate AI.md.md`** — log kronologis aktivitas. Setiap catatan penting sekurang-kurangnya memuat:

- Tanggal sesi dan tujuan.
- Fitur atau masalah yang dikerjakan.
- File yang benar-benar dibuat atau diubah.
- Perintah penting yang benar-benar dijalankan, jika relevan.
- Hasil pengujian aktual dan bukti/log penting yang aman dibagikan.
- Error yang ditemukan dan solusi yang dicoba.
- Keputusan teknis beserta alasannya.
- Status akhir dan langkah berikutnya.

**`pengalaman/Evaluasi dan Pembelajaran StudyMate AI.md.md`** — pelajaran teknis, hal yang berhasil/tidak berhasil, evaluasi desain, risiko yang ditemukan, dan rekomendasi perbaikan.

### 15.3 Aturan pencatatan

1. Perbarui catatan setelah sesi pengembangan yang signifikan; jangan mengarang perubahan yang belum dilakukan.
2. Tandai dengan jelas **Rencana**, **Sedang dikerjakan**, **Selesai dan diuji**, **Gagal**, atau **Belum diuji**.
3. Catat perubahan keputusan beserta alasan dan tanggalnya; jangan menghapus sejarah keputusan lama yang masih relevan.
4. Catat nama variabel environment jika diperlukan, tetapi jangan pernah menyimpan API key, password, access token, cookie sesi, atau kredensial di Obsidian.
5. Jangan menyalin data pribadi pengguna, gambar sensitif, atau log rahasia ke catatan.
6. Sinkronkan dokumentasi dengan kondisi repository yang aktual. Jika kode berbeda dari PRD, catat perbedaannya dan tentukan apakah PRD atau implementasinya yang perlu diperbarui.
7. Jika dokumentasi dibuat oleh asisten, hasilnya tetap harus diperiksa dan disimpan ke vault lokal. Percakapan dengan asisten tidak otomatis berarti file lokal Obsidian telah berubah.

### 15.4 Template catatan sesi

```markdown
## YYYY-MM-DD — Judul sesi

**Tujuan:**

**Status:** Rencana / Sedang dikerjakan / Selesai dan diuji / Gagal / Belum diuji

**Pekerjaan:**
- 

**File yang berubah:**
- 

**Pengujian dan hasil aktual:**
- 

**Masalah dan solusi:**
- 

**Keputusan dan alasan:**
- 

**Langkah berikutnya:**
- 
```

## 16. Tahapan Implementasi

### Tahap 1 — Audit dan persiapan

- Periksa struktur repositori, branch, status Git, `package.json`, variabel environment yang dibutuhkan, serta fungsi yang sudah tersedia.
- Catat temuan sebelum memodifikasi kode.
- Simpan PRD dan struktur catatan ke Obsidian.
- Jangan menghapus atau menulis ulang fungsi lama sebelum diketahui peran dan dampaknya.

### Tahap 2 — Fondasi aplikasi

- Rapikan struktur Next.js/TypeScript sesuai kondisi repositori aktual.
- Siapkan desain responsif, layout chat, state dasar, serta penanganan loading/error.
- Pastikan aplikasi dapat dijalankan dan dibangun secara lokal.

### Tahap 3 — Integrasi AI

- Buat adapter provider dan backend handler.
- Integrasikan jalur publik Gemini dengan secret server-side.
- Implementasikan mode belajar dan ringkasan.
- Tambahkan mode analisis gambar dengan validasi.
- Buat perilaku eksplisit saat kuota atau provider tidak tersedia.

### Tahap 4 — Riwayat lokal dan keamanan

- Simpan riwayat di IndexedDB.
- Tambahkan pengelolaan percakapan.
- Implementasikan rate limit dan pembatasan input di server.
- Audit penggunaan secret dan logging.

### Tahap 5 — Pengujian dan deployment

- Jalankan checklist pengujian.
- Uji aplikasi pada desktop dan ponsel.
- Deploy ke Vercel sesuai batas paket dan konfigurasi resmi.
- Uji endpoint publik, konfigurasi environment, error handling, dan batas penggunaan.
- Perbarui dokumentasi Obsidian berdasarkan hasil aktual.

### Tahap 6 — Mode lokal opsional dan perawatan

- Dokumentasikan konfigurasi lokal untuk 9Router atau OmniRoute.
- Uji mode lokal secara terpisah dari deployment publik.
- Tinjau kuota, keamanan, dependensi, serta kebijakan provider secara berkala.

Urutan tahap dapat disesuaikan setelah audit, tetapi perubahan urutan dan alasannya wajib dicatat di Obsidian.

## 17. Definisi Selesai Proyek (MVP)

MVP dianggap selesai ketika fitur dalam ruang lingkup utama telah tersedia, checklist penerimaan yang relevan lulus pengujian, website publik tidak bergantung pada laptop, secret tetap aman, batas layanan AI disampaikan dengan jelas, dan dokumentasi Obsidian sesuai dengan implementasi aktual.

## 18. Keputusan yang Tidak Boleh Diubah Tanpa Catatan

- Website publik dapat digunakan tanpa login.
- Fokus utama adalah bantuan belajar untuk siswa SMA/SMK.
- Mode utama meliputi chat teks, analisis gambar, petunjuk, langkah demi langkah, penjelasan lengkap, dan ringkasan.
- Riwayat percakapan MVP disimpan lokal di browser; tidak ada sinkronisasi server.
- Jalur publik tidak bergantung pada 9Router, OmniRoute, atau laptop pribadi.
- Tidak ada fallback otomatis yang menimbulkan biaya berbayar tanpa persetujuan eksplisit.
- API key hanya boleh berada di environment server.
- Aktivitas pengembangan dan keputusan penting didokumentasikan di Obsidian.
- Kode yang sudah ada harus diaudit sebelum perubahan besar.

---

**Akhir PRD — StudyMate AI v1.0**
