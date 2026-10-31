# Untuk Teh Una - Next.js

Aplikasi web ucapan ulang tahun interaktif untuk Teh Una (Dennysha Priecilla Aulia Nur’Izmha), dimigrasikan dari file HTML single-file ke Next.js (React).

---

## Fitur Lengkap (100% Sesuai Aslinya)

1. **Gatekeeper / Kunci Tanggal**:
   - Meminta input tanggal pertama kali bertemu (`10 Oktober 2025` / `2025-10-10`).
   - Efek getar (*shake*) & pesan petunjuk jika tanggal salah.
2. **Countdown Screen**:
   - Hitung mundur live menuju 3 November 2026.
   - Fitur rahasia: ketuk judul *"Sabar ya, Teh Una"* sebanyak 5 kali untuk membuka langsung.
3. **Audio Synthesizer (Web Audio API)**:
   - Melodi romantis 16-nada synthesizer triangle-wave otomatis dengan tombol mute/unmute (🔊 / 🔇).
4. **Canvas Fireworks & Confetti**:
   - Fisika partikel kembang api dan konfeti halus di latar belakang saat momen-momen spesial (hero reveal, bintang rasi, tiup lilin, dsb).
5. **Animasi Ambient & Partikel Sentuh**:
   - Kelopak sakura dan hati berjatuhan lembut di latar belakang.
   - Ketukan/klik di layar memunculkan hati melayang (💗, 💖, 🌸, ✨).
   - Mawar & hati melayang ke atas (*rising elements*).
6. **9 Slide Cerita Romantis**:
   - **Slide 0**: Hero pembuka puitis dengan efek blur teks bergantian, nama emas berkilau, hitungan hari (*365 hari*), dan efek glow.
   - **Slide 1**: Cerita Lembang & Dreezel Coffee dengan tumpukan kartu Polaroid yang bisa digeser/dibalik saat diketuk.
   - **Slide 2**: Cerita chat Telegram pertama.
   - **Slide 3**: Cerita konser pertama dengan efek animasi hujan dan kartu langkah 1 sampai 8.
   - **Slide 4**: Rasi bintang interaktif (menghubungkan 4 bintang kenangan, di mana bintang ke-4 baru bisa dinyalakan setelah bintang 1-3 aktif).
   - **Slide 5**: Galeri 5 Polaroid kenangan setahun (*tap to cycle*).
   - **Slide 6**: Video ucapan khusus dengan tombol play interaktif.
   - **Slide 7**: Surat cinta dengan efek mesin tik (*typewriter*) berirama nyata (jeda baris baru, kursor berkedip, dan opsi ketuk untuk langsung menyelesaikan teks).
   - **Slide 8**: Kue ulang tahun SVG interaktif dengan api lilin berkedip, tiup lilin (api padam & ledakan kembang api), tombol kejutan, serta ajakan dinner romantis.

---

## Cara Menjalankan

### 1. Masuk ke folder proyek
```bash
cd "d:\Ultah\untuk-teh-una"
```

### 2. Jalankan Mode Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 3. Build & Jalankan Mode Production
```bash
npm run build
npm run start
```

---

## Menambahkan Foto & Video Nyata

1. Buat folder `public/photos` atau `public/videos`.
2. Simpan file foto (JPG, PNG, WebP) atau video (MP4).
3. Anda bisa langsung memasang path file di `app/page.jsx` (misalnya pada komponen Polaroid atau `<video src="/videos/pesan.mp4">`).

