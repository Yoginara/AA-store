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
│   ├── uploads/       ← Gambar produk yang diunggah
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

## 🚀 Cara Menjalankan (Development Lokal)

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
# Edit .env dengan kredensial database Anda
```

### 3. Inisialisasi Database

```bash
npm run init-db
# atau: cd backend && node init-db.js
```

**Login Admin Default:**
- Username: `admin`
- Password: `admin123`

### 4. Konfigurasi Frontend

```bash
cd frontend
cp .env.example .env
# Isi VITE_API_BASE_URL=http://localhost:5000
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
| POST | `/api/auth/login` | ❌ | Login admin |
| GET | `/api/products` | ❌ | Ambil semua produk |
| GET | `/api/products/:id` | ❌ | Detail produk |
| POST | `/api/products` | ✅ JWT | Tambah produk baru |
| PUT | `/api/products/:id` | ✅ JWT | Edit produk |
| DELETE | `/api/products/:id` | ✅ JWT | Hapus produk |

---

## ☁️ Deploy

### Frontend + API (Vercel)

```bash
# Build frontend
npm run build

# Push ke GitHub → Vercel akan auto-deploy
git push
```

### Backend Mandiri (Railway / Render)

```bash
cd backend
# Set env variables di dashboard Railway/Render
# Lalu deploy dari GitHub
```

---

## 🛠️ Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | Node.js, Express 4 |
| Database | TiDB Cloud (MySQL-compatible) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Upload | Multer |
| Deploy | Vercel (Frontend + Serverless API) |
