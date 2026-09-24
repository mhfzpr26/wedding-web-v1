# Product Requirements Document (PRD): Wedding Invitation Platform (Agency Edition)

**Project Name:** Wedding Invitation Web App (Template V1 - Floral Arch Edition)  
**Model Bisnis:** Agency / Done-For-You (Admin-Controlled)  
**Versi Dokumen:** 1.0 (Final - Approved)  
**Status:** Ready for Development  

---

## 1. Project Overview & Objective
Membangun web aplikasi undangan pernikahan digital berbasis template yang ringan, elegan, responsif, dan siap dikomersialkan untuk model bisnis **Agency / Done-For-You**. 

Seluruh pengelolaan data klien, pemilihan template, pemilihan palet warna, dan deployment dikendalikan secara terpusat oleh Admin/Agensi. Pengantin tinggal terima beres, sementara tamu undangan mendapatkan pengalaman membuka undangan yang cepat, mewah, dan interaktif di smartphone mereka.

### Nilai Jual Utama (Unique Selling Points):
1. **Konsep Karakter Vektor / Tanpa Foto:** Menggunakan ilustrasi vektor/karakter estetik di dalam bingkai lengkung kubah (*dome arch*). Menjawab kebutuhan pengantin syar'i/privat dan memangkas waktu *loading* hingga di bawah 1 detik.
2. **Template V1 Multi-Warna (3-in-1 Palet):** 1 template memiliki 3 preset warna instan (*Royal Navy*, *Botanical Sage*, *Dusty Rose*) yang bisa diganti seketika melalui panel admin.
3. **Arsitektur Multi-Template (Masa Depan):** Menggunakan sistem *Template Registry* sehingga penambahan Template V2, V3, dst. di masa mendatang tidak akan mengganggu data klien maupun koneksi database.
4. **Keamanan RSVP Maksimal (Locked Guest Name):** Nama tamu pada form RSVP terkunci permanen sesuai tautan personal, membasmi nama lelucon/spam.
5. **Database Nol Biaya Server:** Terintegrasi langsung ke Google Sheets milik masing-masing klien via Google Apps Script.
6. **Admin Helper Tool (WhatsApp Bulk Link Generator):** Memudahkan pengantin menyebarkan ratusan link undangan personal hanya dengan *copy-paste* daftar nama.

---

## 2. Core Tech Stack
- **Frontend Framework:** React.js + Vite (Single Page Application dengan performa tinggi)
- **Styling & Design System:** Tailwind CSS (dengan CSS Custom Properties untuk pergantian warna dinamis)
- **Icons & Visual Ornaments:** Lucide React, Floral Vector Dividers, Dome Arch Frames
- **Tipografi:** Google Fonts (*Playfair Display* / *Cormorant Garamond* untuk Serif Elegan, dan *Plus Jakarta Sans* untuk Teks Isi Modern)
- **Data Backend (Per-Client):** Google Apps Script + Google Sheets (1 Google Sheet privat per klien)
- **Demo / Fallback Mode:** LocalStorage + Mock Data (agar template tetap berjalan lancar saat pitching ke calon klien tanpa perlu setup spreadsheet)

---

## 3. System Architecture & File Structure

### 3.1. Struktur Direktori Proyek
```text
wedding-web-v1/
├── index.html                     # Entry point & WhatsApp Open Graph meta tags
├── src/
│   ├── main.jsx                   # React mounting
│   ├── App.jsx                    # Core renderer & route/query parameter handler
│   ├── index.css                  # Tailwind styles, font imports, & CSS variables
│   │
│   ├── config/
│   │   └── weddingConfig.js       # SINGLE SOURCE OF TRUTH (Data teks, acara, tema terpilih, & link Google Sheets)
│   │
│   ├── context/
│   │   └── WeddingContext.jsx     # Context provider data pernikahan, status audio, dan active theme
│   │
│   ├── templates/
│   │   ├── registry.js            # DAFTAR TEMPLATE (Menghubungkan V1, V2, V3 ke sistem)
│   │   │
│   │   └── v1-floral-arch/        # TEMPLATE V1 (Floral Vector Arch)
│   │       ├── index.jsx          # Layout utama Template V1
│   │       ├── presets.js         # Definisi 3 Palet Warna (Navy, Sage, Rose)
│   │       ├── assets/            # Ornamen floral SVG & karakter vektor
│   │       └── components/
│   │           ├── CoverModal.jsx       # Layar pembuka & unlock audio
│   │           ├── OpeningQuote.jsx     # Ayat suci / kutipan romantis
│   │           ├── CharacterArch.jsx    # Karakter mempelai dalam bingkai kubah
│   │           ├── EventSection.jsx     # Akad & Resepsi, Countdown, Google Calendar & Maps
│   │           ├── RSVPSection.jsx      # Form kehadiran (Nama terkunci) & Buku Ucapan
│   │           ├── DigitalGift.jsx      # Amplop digital & copy nomor rekening
│   │           └── FooterSection.jsx    # Watermark agensi & copyright
│   │
│   ├── components/
│   │   ├── common/                # Komponen universal
│   │   │   ├── FloatingMusic.jsx  # Floating button play/pause audio latar
│   │   │   ├── CountdownTimer.jsx # Hitung mundur acara
│   │   │   └── CopyButton.jsx     # Tombol interaktif salin nomor rekening
│   │   │
│   │   └── admin/                 # PANEL ADMIN / HELPER (Dibuka via ?admin=true)
│   │       ├── AdminDrawer.jsx         # Kontainer panel geser admin
│   │       ├── TemplateSelector.jsx    # Pemilih template (V1, V2, dst)
│   │       ├── ColorPresetPicker.jsx   # Pemilih warna real-time (Navy, Sage, Rose)
│   │       └── BulkWhatsAppTool.jsx    # Generator link WA massal untuk pengantin
│   │
│   └── services/
│       └── rsvpService.js         # Handler POST/GET ke Google Apps Script / LocalStorage
│
├── docs/
│   └── GoogleAppsScript_Template.js # Template kode Apps Script siap copas ke Google Sheets klien
└── PRD.md                         # Dokumen spesifikasi ini
```

---

## 4. Key Features & Functional Requirements

### 4.1. Dynamic Guest Greeting & Personalization
- Menangkap parameter URL query `?to=Nama+Tamu` (contoh: `domain.com/?to=Budi+Santoso+%26+Partner`).
- Nama tamu ditampilkan secara terhormat pada sampul pembuka:
  > *"Kepada Yth. Bapak/Ibu/Saudara/i: **Budi Santoso & Partner**"*
- Jika tautan dibuka tanpa parameter `?to=`, sistem menampilkan salam ramah default (*"Tamu Undangan"*).

### 4.2. Cover & Opening Experience (Audio Policy Compliance)
- Layar pembuka menutup seluruh halaman sebelum undangan dibuka.
- Menampilkan nama kedua mempelai, nama tamu undangan, dan tombol utama **"Buka Undangan"**.
- Mengklik "Buka Undangan" akan:
  1. Membuka tirai/cover secara halus (*smooth transition*).
  2. Memicu pemutaran musik latar secara otomatis (*autoplay audio unlock* sesuai regulasi browser Chrome/Safari).
- **Floating Music Controller:** Tombol melayang di pojok kanan/kiri bawah dengan ikon piringan/gelombang suara beranimasi untuk *Play / Pause* audio kapan saja oleh tamu.

### 4.3. Character / Avatar Section (Karakter Pengantin Estetik)
- Menggantikan foto asli dengan ilustrasi vektor garis (*line art/vector silhouette*) di dalam bingkai kubah lengkung (*dome arch*).
- Mendukung variasi karakter di `weddingConfig.js`:
  - Mempelai Wanita: Opsi Hijab vs Non-Hijab.
  - Mempelai Pria: Opsi Peci/Tradisional vs Jas Formal.
- Menampilkan nama lengkap, nama panggilan, nama orang tua, dan tautan media sosial.

### 4.4. 3-Color Dynamic Theme Switcher (Template V1)
Template V1 dilengkapi dengan 3 variasi palet warna yang dapat diganti secara *real-time*:
1. **Royal Navy & Slate (Default):** Deep Navy (`#132238`), Slate Blue (`#5B7B9A`), Warm Ivory (`#FBF9F5`), Champagne Gold (`#C5A880`).
2. **Botanical Sage Green:** Deep Forest (`#1E352F`), Eucalyptus Sage (`#6B8E7D`), Soft Linen (`#F9FAF7`), Warm Khaki (`#BFA36F`).
3. **Romantic Dusty Rose:** Warm Burgundy (`#3E2328`), Dusty Rose (`#A86D78`), Alabaster Cream (`#FDF8F7`), Rose Gold (`#C89B7B`).
- Di sisi Admin/Pitching, warna dapat diuji coba langsung via panel pengubah warna.
- Di sisi Klien yang sudah *publish*, warna dikunci melalui `weddingConfig.js`.

### 4.5. Multi-Template Registry Architecture
- Seluruh template didaftarkan pada file `src/templates/registry.js`.
- Setiap template menerima data yang sama dari `WeddingContext`.
- Di masa depan, agensi dapat membuat `v2-modern-minimalist` atau `v3-batik-traditional` tanpa perlu membuat ulang sistem audio, RSVP, amplop, atau database.

### 4.6. Event Details & Interactive Utilities
- **Countdown Timer:** Menghitung mundur hari, jam, menit, dan detik menuju waktu acara utama.
- **Detail Akad & Resepsi:** Informasi hari, tanggal, waktu mulai-selesai, zona waktu, nama gedung, dan alamat lengkap.
- **Tombol "Add to Google Calendar":** Satu klik langsung membuka halaman penambahan jadwal Google Calendar tamu dengan judul, deskripsi, dan tanggal acara yang sudah terisi otomatis.
- **Tombol "Petunjuk Lokasi (Google Maps)":** Membuka rute Google Maps / Waze langsung ke titik lokasi gedung.

### 4.7. Digital Gift (Amplop Digital & Kado Fisik)
- Komponen bersifat *configurable* (bisa diaktifkan/dinonaktifkan via config `gift.enabled`).
- Kartu rekening bank (BCA, Mandiri, BRI, dll.) atau e-wallet (DANA, GoPay, QRIS) dengan tombol interaktif **"Salin Nomor Rekening"** (*copy-to-clipboard* disertai feedback notifikasi "Tersalin!").
- Alamat pengiriman kado fisik bagi tamu yang ingin mengirim kado langsung ke rumah mempelai.

### 4.8. High-Security RSVP & Digital Guestbook
- **Nama Terkunci (Locked Name):** Kolom nama pada formulir RSVP diisi otomatis dari parameter URL `?to=` dan berstatus `readOnly`. Tamu tidak dapat mengubah nama, mencegah pengisian nama aneh, samaran, atau spam.
- **Form Input Tamu:**
  - Status Kehadiran: Pilihan radio/tombol "Hadir" atau "Berhalangan".
  - Jumlah Kehadiran: Dropdown 1 orang / 2 orang.
  - Doa & Ucapan: Text area untuk ucapan tulus.
- **Penyimpanan Dua Arah (Google Apps Script):**
  - Data langsung terkirim ke Google Sheets privat milik pengantin.
  - Daftar ucapan doa terbaru dimuat di feed buku tamu secara rapi.
- **Proteksi Pengiriman Ganda (Anti-Spam Submit):** Setelah submit berhasil, status tersimpan di browser tamu (`localStorage`) dan form berubah menjadi kartu konfirmasi kehadiran.

### 4.9. Admin Control Panel (Internal Agensi)
Dapat diakses secara rahasia oleh Admin dengan menambahkan parameter `?admin=true` pada URL:
1. **Design & Color Studio:** Memilih template aktif dan mengganti palet warna secara instan dengan tombol salin konfigurasi.
2. **Bulk WhatsApp Link Generator:**
   - Admin/Pengantin dapat menempelkan daftar 50–200 nama tamu sekaligus ke dalam kolom teks.
   - Sistem memecah teks menjadi daftar tabel rapi dengan tautan personal masing-masing.
   - Tombol **"Kirim WA"** satu per satu yang membuka WhatsApp Web / Aplikasi WA pengantin dengan salam resmi yang sudah terisi nama tamu.
3. **Database Status:** Memantau apakah web sedang terhubung ke Google Sheets atau berjalan dalam mode demo offline.

---

## 5. Specification of Central Configuration (`weddingConfig.js`)
File ini menjadi satu-satunya tempat bagi Admin untuk mengatur data klien:

```javascript
export const weddingConfig = {
  // Pengaturan Template & Warna
  theme: {
    templateId: 'v1-floral-arch',     // ID template yang aktif dari registry
    colorPreset: 'navy',              // 'navy' | 'sage' | 'rose'
    allowLivePreview: false,           // Set true untuk demo ke calon klien
  },

  // Metadata & Musik
  meta: {
    title: "The Wedding of Kevin & Sarah",
    description: "Undangan Pernikahan Digital Kevin & Sarah",
    ogImage: "/images/og-preview.jpg",
    audioUrl: "/audio/soundtrack.mp3",
    audioTitle: "Beautiful In White - Instrumental",
  },

  // Integrasi Google Sheets (Kosongkan string untuk mode demo LocalStorage)
  integration: {
    googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec",
  },

  // Kutipan Suci / Ayat
  quote: {
    verse: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...",
    source: "QS. Ar-Rum: 21",
  },

  // Data Kedua Mempelai
  groom: {
    fullName: "Kevin Pratama, S.T.",
    shortName: "Kevin",
    parents: "Putra pertama dari Bpk. Ir. H. Bambang Irawan & Ibu Hj. Sri Wahyuni",
    instagram: "https://instagram.com/kevinpratama",
    avatarType: "suit",               // 'suit' | 'peci'
  },
  bride: {
    fullName: "Sarah Amanda, S.Kom.",
    shortName: "Sarah",
    parents: "Putri kedua dari Bpk. Hendra Gunawan & Ibu Rina Marlina",
    instagram: "https://instagram.com/sarahamanda",
    avatarType: "hijab",              // 'hijab' | 'non-hijab'
  },

  // Detail Acara
  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      dateFormatted: "Sabtu, 24 Oktober 2026",
      dateIso: "2026-10-24",
      time: "08.00 - 10.00 WIB",
      venue: "Masjid Agung Al-Ikhlas",
      address: "Jl. Melati Raya No. 12, Kebayoran Baru, Jakarta Selatan",
      googleMapsUrl: "https://maps.google.com/?q=Masjid+Agung+Al-Ikhlas",
      calendarStart: "20261024T080000",
      calendarEnd: "20261024T100000",
    },
    {
      id: "resepsi",
      title: "Resepsi Pernikahan",
      dateFormatted: "Sabtu, 24 Oktober 2026",
      dateIso: "2026-10-24",
      time: "11.00 - 13.00 WIB",
      venue: "Grand Ballroom Sapphire",
      address: "Hotel Sapphire Jakarta, Jl. Jend. Sudirman Kav. 45, Jakarta Selatan",
      googleMapsUrl: "https://maps.google.com/?q=Hotel+Sapphire+Jakarta",
      calendarStart: "20261024T110000",
      calendarEnd: "20261024T130000",
    },
  ],

  // Amplop Digital & Hadiah
  gift: {
    enabled: true,
    accounts: [
      { bankName: "BCA", accountNumber: "8830123456", accountHolder: "Kevin Pratama" },
      { bankName: "Bank Mandiri", accountNumber: "1370009876543", accountHolder: "Sarah Amanda" },
    ],
    physicalGift: {
      enabled: true,
      recipientName: "Kevin & Sarah",
      phone: "0812-3456-7890",
      address: "Jl. Kemang Selatan No. 20, Bangka, Mampang Prapatan, Jakarta Selatan 12730",
    },
  },
};
```

---

## 6. Integrasi Google Apps Script (RSVP Handler)

### Alur Kerja:
1. Admin membuat Google Spreadsheet baru bernama: `RSVP - [Nama Pengantin]`.
2. Admin menyalin skrip Google Apps Script yang disediakan di folder `docs/GoogleAppsScript_Template.js`.
3. Skrip di-deploy sebagai Web App dengan izin akses *"Anyone"*.
4. URL deployment ditempel ke `weddingConfig.js` pada bagian `integration.googleAppsScriptUrl`.
5. Pengantin diberi akses Viewer/Editor ke Google Sheet tersebut untuk memantau tamu langsung dari HP mereka.

### Format Data Kolom Google Sheets:
- `A: Timestamp` (Waktu pengisian otomatis)
- `B: Nama Tamu` (Terkunci sesuai URL)
- `C: Status Kehadiran` (Hadir / Tidak Hadir)
- `D: Jumlah Tamu` (1 Orang / 2 Orang)
- `E: Ucapan & Doa` (Teks doa dari tamu)

---

## 7. Metrik Sukses & Standar Kualitas (Quality Assurance)
1. **Lighthouse Score:** Minimal 90 pada *Performance*, *Accessibility*, dan *Best Practices* di tampilan mobile.
2. **Mobile-First Responsiveness:** Tampilan sempurna dan nyaman dibaca pada layar smartphone selebar 360px hingga 430px (iPhone & Android modern).
3. **Bandwidth Efisien:** Ukuran seluruh aset halaman di bawah 2 MB saat pertama kali dimuat.
4. **WhatsApp Link Sharing:** Menampilkan judul elegan, deskripsi manis, dan gambar thumbnail preview yang pas saat link disebar.
