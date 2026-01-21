# Framework Pranikah - Diskusi Pra-Nikah yang Adil

Aplikasi web interaktif untuk membantu pasangan Indonesia melakukan diskusi pra-nikah yang terstruktur, adil, dan berbasis riset. Menggunakan prinsip **Tugas → Tanggung Jawab → Hak**.

## ✨ Fitur Utama

### 🔐 Authentication & Collaboration
- **Login dengan Google**: Autentikasi aman menggunakan Firebase Auth
- **Penyimpanan Cloud**: Data disimpan real-time di Firebase Firestore
- **Sharing Link Unik**: Bagikan link dengan pasangan untuk kolaborasi
- **Permission System**: Pemilik dapat menambah/menghapus kolaborator
- **Real-time Sync**: Perubahan langsung tersinkron antar user

### 📚 Konten Framework
- **10 Prinsip Hidup Pasangan**: Pedoman operasional yang ringkas
- **4 Model Struktur Keluarga**: Tradisional, Hybrid, Dual-Leadership, Rotasi Peran
- **5 Studi Kasus**: Berdasarkan data BPS 2024 dan riset akademik
- **10 Topik Diskusi Wajib**: Framework lengkap dari nilai hingga mode krisis
- **Template Kontrak Keadilan**: Kesepakatan tertulis yang dapat didownload

### 💾 Sistem Penyimpanan
- **Primary**: Firebase Firestore (saat login)
- **Fallback**: LocalStorage (saat offline/belum login)
- **Auto-save**: Debounce 1 detik untuk efisiensi
- **Export**: Download kontrak dalam format TXT
- **Print**: Cetak kontrak untuk dokumentasi fisik

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ atau PNPM
- Firebase Project dengan Firestore enabled
- Google Authentication enabled di Firebase Console

### Installation

```bash
# Clone repository
git clone https://github.com/faiz-muttaqin/framework-pranikah.git
cd framework-pranikah

# Install dependencies
pnpm install

# Setup environment variables
# Edit .env dengan kredensial Firebase Anda
```

### Environment Variables

File `.env` sudah ada dengan isi:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

### Development

```bash
# Start dev server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

Aplikasi akan berjalan di `http://localhost:4321/`

## 📖 Cara Penggunaan

### 1. Login
- Klik tombol "Login dengan Google"
- Izinkan akses dengan akun Google Anda

### 2. Mulai Diskusi Baru
- Klik "Mulai Diskusi Baru" setelah login
- Framework ID unik akan dibuat
- URL akan berubah menjadi `?fw=fw_xxxxx`

### 3. Bagikan dengan Pasangan
- Salin link sharing yang ditampilkan
- Kirim link ke pasangan via WhatsApp/Email
- Pasangan harus login dengan Google terlebih dahulu
- Pemilik dapat menambahkan email pasangan sebagai kolaborator

### 4. Isi Framework Bersama
- **Pilih Model Keluarga**: Klik salah satu dari 4 model
- **Diskusi 10 Topik**: Isi textarea dan klik "Simpan Kesepakatan"
- **Kontrak Keadilan**: Lengkapi 7 field kontrak
- Data otomatis tersimpan ke Firestore

### 5. Kelola Kolaborator (Khusus Pemilik)
- Lihat daftar kolaborator di bagian bawah
- Tambah kolaborator dengan memasukkan email
- Hapus kolaborator yang tidak diperlukan

### 6. Download/Print Kontrak
- Klik "Download PDF" untuk export file TXT
- Klik "Cetak" untuk print kontrak
- Simpan sebagai backup fisik

## 🏗️ Arsitektur Teknis

### Tech Stack
- **Framework**: Astro 5.16
- **Language**: TypeScript
- **Authentication**: Firebase Auth (Google Provider)
- **Database**: Firebase Firestore
- **Styling**: Custom CSS with CSS Variables
- **Build Tool**: Vite

### File Structure
```
framework-pranikah/
├── src/
│   ├── components/
│   │   └── Auth.astro          # Authentication & collaboration UI
│   ├── layouts/
│   │   └── Layout.astro        # Base layout with global styles
│   ├── lib/
│   │   ├── firebase.ts         # Firebase initialization
│   │   └── firestore.ts        # Firestore CRUD operations
│   └── pages/
│       └── index.astro         # Main application page
├── public/                     # Static assets
├── .env                        # Environment variables (gitignored)
└── package.json
```

### Data Model (Firestore)

```typescript
interface FrameworkData {
  id: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  collaborators: Array<{
    email: string;
    name: string;
    addedAt: Timestamp;
  }>;
  selectedModel: string | null;
  discussions: {
    D1: string;
    D2: string;
    // ... D3-D10
  };
  contract: {
    model: string;
    husband: string;
    wife: string;
    rules: string;
    transparency: string;
    crisis: string;
    review: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastEditedBy: string;
}
```

## 🔒 Security

- Environment variables tidak di-commit ke repository
- Firebase Rules harus dikonfigurasi untuk restrict access
- Hanya owner dan collaborators yang bisa read/write data
- Google Authentication memastikan identitas user

### Recommended Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /frameworks/{frameworkId} {
      allow read: if request.auth != null && (
        resource.data.ownerEmail == request.auth.token.email ||
        request.auth.token.email in resource.data.collaborators[].email
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.ownerEmail == request.auth.token.email ||
        request.auth.token.email in resource.data.collaborators[].email
      );
      allow delete: if request.auth != null && 
        resource.data.ownerEmail == request.auth.token.email;
    }
  }
}
```

## 📊 Basis Riset

Framework ini disusun berdasarkan:
- **Data BPS 2024**: Statistik perempuan breadwinner dan beban ganda
- **Penelitian FISIP UI**: Pola kemitraan suami-istri bekerja
- **Gottman Institute**: Sound Relationship House framework
- **Program PREP**: Communication & conflict management training
- **Riset Household Labor**: Persepsi keadilan dan kepuasan pernikahan

## 📝 License

This project is licensed under the MIT License. Bebas digunakan untuk edukasi non-komersial dengan menyebut sumber.

## 👥 Authors

- **Faiz Muttaqin** - [@faiz-muttaqin](https://github.com/faiz-muttaqin)

---

**Disclaimer**: Dokumen ini bukan pengganti konseling profesional. Untuk kasus rumit, disarankan berkonsultasi dengan konselor pernikahan atau psikolog keluarga.
