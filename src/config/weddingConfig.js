/**
 * =======================================================================
 * INVATERA - WEDDING CONFIGURATION (SINGLE SOURCE OF TRUTH)
 * =======================================================================
 * File ini mengatur seluruh data teks, mempelai, acara, tema, dan integrasi
 * Google Sheets untuk klien pernikahan.
 */

export const weddingConfig = {
  version: '2026.11.14-v1', // Versi data untuk auto-invalidation cache localStorage browser
  // Brand Agensi
  brand: {
    name: 'INVATERA',
    tagline: 'DIGITAL INVITATIONS',
    logo: '/images/invatera-logo.png',
    website: 'https://invatera.com',
    instagram: '@invatera.id',
    whatsapp: '6281234567890',
  },

  // Konfigurasi Tema & Tampilan
  theme: {
    templateId: 'v1-floral-arch', // 'v1-floral-arch' (dan template masa depan lainnya)
    colorPreset: 'navy', // 'navy' | 'sage' | 'rose'
    allowLivePreview: true, // Buka panel switcher saat pitching ke calon klien
  },

  // Monogram Inisial Paling Atas Isi Undangan (Frameless Organic Botanical Monogram)
  monogram: {
    enabled: true,
    useCustomInitials: false,
    customInitials: 'D & R',
    separator: '&', // '&' | '•' | '|' | '♥'
    style: 'spray-horizontal', // 'spray-horizontal' (Pendekatan B: Ranting melintang/asimetris anggun) | 'intertwined' | 'crest-footing'
    tagline: 'The Wedding of',
    showTagline: true,
    showDate: false,
  },

  // Musik Latar Belakang
  audio: {
    // Royalty-free acoustic wedding piano audio stream
    url: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg', // safe fallback or royalty-free track
    externalAudio:
      'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes_Music/Documentary__TV_series/Scott_Holmes_Music_-_04_-_Storybook.mp3',
    title: 'A Thousand Years (Acoustic Piano Cover)',
    artist: 'Romantic Wedding Melodies',
  },

  // Google Sheets Apps Script URL untuk RSVP (Kosongkan string = mode offline / LocalStorage Demo)
  integration: {
    googleAppsScriptUrl: '', // Isi dengan URL Web App Google Apps Script klien
  },

  // Salam & Pembuka Sambutan Mempelai (Bisa disesuaikan untuk berbagai agama/adat/nasional)
  greeting: {
    bismillah: 'Bismillahirrohmaanirrohiim',
    salam: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',
    introText:
      'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:',
  },

  // Kutipan Pembuka / Ayat Suci
  quote: {
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    translation:
      'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
  },

  // Data Mempelai Pria & Wanita
  groom: {
    fullName: 'Rakafansa Saputra',
    shortName: 'Raka',
    parents: 'Putra dari Bpk. Mashudi & Ibu Lenny Gusnita',
    instagram: 'https://instagram.com/rakafansa',
    avatarType: 'suit', // 'suit' (jas modern) | 'peci' (busana muslim/adat)
  },
  bride: {
    fullName: 'Destia Dwi Ramadhani',
    shortName: 'Destia',
    parents: 'Putri dari Alm. Bpk. M. Hastronugi & Ibu Sri Mulyati',
    instagram: 'https://instagram.com/destiadwir',
    avatarType: 'hijab', // 'hijab' (syar'i/hijab) | 'modern' (non-hijab elegan)
  },

  // Tanggal Target Countdown (Akad)
  countdownTarget: '2026-11-14T08:00:00+07:00',

  // Detail Acara Pernikahan
  events: [
    {
      id: 'akad',
      title: 'Akad Nikah',
      dateFormatted: 'Sabtu, 14 November 2026',
      dateIso: '2026-11-14',
      time: '08.00 - 10.00 WIB',
      venue: 'Masjid Agung Al-Ikhlas',
      address: 'Jl. Melati Raya No. 12, Kebayoran Baru, Jakarta Selatan',
      googleMapsUrl:
        'https://maps.google.com/?q=Masjid+Agung+Al-Ikhlas+Jakarta',
      calendarTitle: 'Akad Nikah Destia & Raka',
      calendarStart: '20261114T080000',
      calendarEnd: '20261114T100000',
    },
    {
      id: 'resepsi',
      title: 'Resepsi Pernikahan',
      dateFormatted: 'Sabtu, 14 November 2026',
      dateIso: '2026-11-14',
      time: '11.00 - 13.00 WIB',
      venue: 'Grand Ballroom Hotel Sapphire',
      address:
        'Hotel Sapphire Jakarta, Jl. Jend. Sudirman Kav. 45, Jakarta Selatan',
      googleMapsUrl: 'https://maps.google.com/?q=Hotel+Sapphire+Jakarta',
      calendarTitle: 'Resepsi Pernikahan Destia & Raka',
      calendarStart: '20261114T110000',
      calendarEnd: '20261114T130000',
    },
  ],

  // Kisah Cinta (Timeline)
  storiesEnabled: true,
  stories: [
    {
      year: '2021',
      title: 'Pertemuan Pertama',
      description:
        'Pertama kali bertukar sapa di acara orientasi mahasiswa pascasarjana. Dari obrolan sederhana hingga menemukan banyak kecocokan pandangan hidup.',
    },
    {
      year: '2023',
      title: 'Pertemuan Dua Keluarga',
      description:
        'Dengan niat yang tulus dan restu kedua orang tua, kami mengikat janji pertunangan untuk melangkah ke jenjang yang lebih serius.',
    },
    {
      year: '2026',
      title: 'Menuju Babak Baru',
      description:
        'Hari yang kami nanti akhirnya tiba. Mempersatukan dua hati dan dua keluarga besar dalam ikatan suci pernikahan seumur hidup.',
    },
  ],

  // Amplop Digital & Hadiah Fisik
  gift: {
    enabled: true,
    accounts: [
      {
        id: 'bca',
        bankName: 'BCA',
        accountNumber: '8830123456',
        accountHolder: 'Destia Dwi Ramadhani',
      },
      {
        id: 'mandiri',
        bankName: 'Bank Mandiri',
        accountNumber: '1370009876543',
        accountHolder: 'Rakafansa Saputra',
      },
    ],
    physicalGift: {
      enabled: true,
      recipientName: 'Destia Dwi Ramadhani & Rakafansa Saputra',
      phone: '0812-3456-7890',
      address:
        'Jl. Kemang Selatan No. 20, RT 05 / RW 02, Bangka, Mampang Prapatan, Jakarta Selatan 12730',
      notes: 'Mohon konfirmasi via WhatsApp setelah pengiriman kado fisik.',
    },
  },

  // Mock Wishes Awal (Tampil di mode demo sebelum ada input dari tamu)
  initialWishes: [
    {
      id: 'wish-1',
      name: 'Bapak H. Sukardi & Keluarga',
      attendance: 'hadir',
      guestsCount: 2,
      message:
        "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat menempuh hidup baru Destia & Raka, semoga menjadi keluarga sakinah mawaddah warahmah.",
      timestamp: 'Kemarin, 14:20 WIB',
    },
    {
      id: 'wish-2',
      name: 'Dinda Kirana & Partner',
      attendance: 'hadir',
      guestsCount: 2,
      message:
        'Happy wedding Destia & Raka! Cantik dan ganteng banget, semoga pernikahannya selalu dipenuhi kebahagiaan dan cinta sampai kakek nenek aamiin!',
      timestamp: 'Kemarin, 16:45 WIB',
    },
    {
      id: 'wish-3',
      name: 'Rian Anggara',
      attendance: 'tidak_hadir',
      guestsCount: 0,
      message:
        'Selamat ya bro Raka! Mohon maaf belum bisa hadir langsung karena masih di luar kota, tapi doa terbaik selalu mengiringi langkah kalian berdua.',
      timestamp: 'Hari ini, 09:12 WIB',
    },
  ],
};
