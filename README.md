# UD ABANG ADIK — Toko Online

Katalog digital toko sepatu, sandal, dan tas sekolah **UD ABANG ADIK** — berlokasi di Pasar Horas, Pematangsiantar, Sumatera Utara.

---

## 🗂️ Struktur Proyek (Monorepo)

```
AA-store/
├── frontend/          ← React + Vite (Storefront & Admin UI)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/           ← Express.js + MySQL/TiDB (REST API)
│   ├── server.js      ← Entry point API server
│   ├── db.js          ← Koneksi MySQL + In-Memory fallback
│   ├── init-db.js     ← Inisialisasi tabel & seeding data
│   ├── schema.sql     ← Skema tabel MySQL
│   ├── package.json
│   └── .env.example
│
├── api/               ← Vercel Serverless adapter
│   └── index.js       ← Re-export Express app untuk Vercel
│
├── vercel.json        ← Konfigurasi deploy Vercel
└── package.json       ← Monorepo helper scripts
```

---

## 🚀 Fitur Utama

- **Katalog Produk Dinamis**: Data diambil secara realtime dari TiDB.
- **Admin Dashboard**: Portal admin aman dengan JWT.
- **Tawar Harga via WhatsApp**: Pembeli dapat menawar harga produk dengan langsung terhubung ke WhatsApp penjual.
- **Penyimpanan Base64**: Mengingat sifat _Read-Only_ serverless Vercel, gambar produk kini dikonversi menjadi format Base64 dan disimpan langsung ke dalam tabel database.
- **Keamanan Ganda (Double Security)**: Halaman admin dilindungi oleh prompt kode akses rahasia (Secret Code) di frontend sebelum masuk ke halaman form login (Backend).

---

## 💻 Cara Menjalankan (Development Lokal)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Yoginara/AA-store.git
cd AA-store

# Install semua dependencies sekaligus
npm run install:all
```

### 2. Konfigurasi Backend

```bash
cd backend
cp .env.example .env
# Edit .env dengan kredensial TiDB Cloud Anda
```

### 3. Inisialisasi Database

```bash
npm run init-db
# atau: cd backend && node init-db.js
```

> **Catatan Keamanan:** Kami telah menghapus penambahan (seeding) otomatis akun Admin default demi alasan keamanan. Silakan tambahkan user admin pertama Anda secara manual menggunakan klien database (misal DBeaver atau TiDB Cloud Console). Sandi harus di-hash menggunakan `bcrypt`.

### 4. Konfigurasi Frontend

```bash
cd frontend
cp .env.example .env
# Isi VITE_API_BASE_URL=http://localhost:5000
# Isi VITE_ADMIN_SECRET_CODE=Pudan2004 (atau kode rahasia lain untuk gembok admin)
```

### 5. Jalankan Servers

```bash
# Terminal 1 — Backend API (port 5000)
npm run dev:backend

# Terminal 2 — Frontend Dev Server (port 5173)
npm run dev:frontend
```

Buka `http://localhost:5173` di browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| POST | `/api/auth/login` | ❌ | Login admin (verifikasi bcrypt) |
| GET | `/api/products` | ❌ | Ambil semua produk |
| GET | `/api/products/:id` | ❌ | Detail produk |
| POST | `/api/products` | ✅ JWT | Tambah produk baru (Upload Base64) |
| PUT | `/api/products/:id` | ✅ JWT | Edit produk |
| DELETE | `/api/products/:id` | ✅ JWT | Hapus produk |

---

## ☁️ Deploy

Proyek ini telah dikonfigurasi penuh untuk mendukung arsitektur *Monorepo Serverless* di **Vercel** menggunakan `vercel.json` dan folder `api/`. 

```bash
# Cara cepat deploy ke Vercel
npx vercel --prod
```

### Pastikan Anda Mendaftarkan Environment Variables di Vercel:
- Variabel Backend: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `DB_CA_CERT`
- Variabel Frontend: `VITE_ADMIN_SECRET_CODE`

---

## 🛠️ Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | Node.js, Express 4 |
| Database | TiDB Cloud (MySQL-compatible) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Keamanan | Frontend Secret Gate Prompt |
| Storage | DB Storage (Base64 MEDIUMTEXT) |
| Deploy | Vercel (Frontend + Serverless API) |
