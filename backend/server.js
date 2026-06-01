import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "ud_abang_adik_sec_2026_key_99";

// Menyelesaikan __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan folder 'uploads' selalu tersedia untuk menampung berkas unggahan
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Middlewares
app.use(cors({ origin: "*" })); // Mengizinkan semua akses cors demi kemudahan testing dev
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sediakan akses statis ke folder uploads gambar
app.use("/uploads", express.static(uploadDir));

// Konfigurasi Multer untuk penyimpanan di memori (Base64) - Cocok untuk Vercel Serverless
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Hanya berkas gambar (.jpg, .png, .webp, .gif) yang diizinkan!"));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB
});

// Middleware untuk memverifikasi JWT Token Admin
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Token otentikasi tidak ditemukan." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token kadaluarsa atau tidak sah." });
    }
    req.user = user;
    next();
  });
};

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. POST: Login Admin
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi." });
  }

  try {
    // Cari admin di database
    const [rows] = await db.query("SELECT * FROM admins WHERE username = ?", [username]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: "Kredensial salah. Username tidak terdaftar." });
    }

    const admin = rows[0];
    // Verifikasi password hash
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Kredensial salah. Sandi tidak cocok." });
    }

    // Buat JWT Token
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
      expiresIn: "24h"
    });

    res.json({
      message: "Login berhasil!",
      token: token,
      admin: { id: admin.id, username: admin.username }
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server saat login.", error: error.message });
  }
});

// 2. GET: Ambil Semua Produk (Public)
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data produk.", error: error.message });
  }
});

// 3. GET: Detail Produk per ID (Public)
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail produk.", error: error.message });
  }
});

// 4. POST: Tambah Produk Baru (Protected - Admin Only)
app.post("/api/products", authenticateToken, upload.single("image"), async (req, res) => {
  const { name, category, price, image_url } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ message: "Form wajib (Nama, Kategori, Harga) belum lengkap." });
  }

  // Tentukan URL gambar: unggah Base64 atau fallback teks input tautan
  let finalImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"; // Fallback awal
  if (req.file) {
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;
    finalImageUrl = `data:${mimeType};base64,${base64Image}`;
  } else if (image_url) {
    finalImageUrl = image_url;
  }

  const ratingMock = 4.5;
  const reviewsCountMock = 0;
  const isBestSellerMock = false;

  try {
    const [result] = await db.query(
      "INSERT INTO products (name, category, price, image_url, rating, reviews_count, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, category, parseFloat(price), finalImageUrl, ratingMock, reviewsCountMock, isBestSellerMock]
    );

    res.status(201).json({
      message: "Produk berhasil ditambahkan!",
      productId: result.insertId,
      product: {
        id: result.insertId,
        name,
        category,
        price: parseFloat(price),
        image_url: finalImageUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan produk baru.", error: error.message });
  }
});

// 5. PUT: Edit Produk (Protected - Admin Only)
app.put("/api/products/:id", authenticateToken, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, category, price, image_url } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ message: "Data edit wajib (Nama, Kategori, Harga) belum lengkap." });
  }

  try {
    // Cek keberadaan produk
    const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Produk yang akan diedit tidak ditemukan." });
    }

    const currentProduct = existing[0];
    let finalImageUrl = currentProduct.image_url;

    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype;
      finalImageUrl = `data:${mimeType};base64,${base64Image}`;
    } else if (image_url) {
      finalImageUrl = image_url;
    }

    await db.query(
      "UPDATE products SET name = ?, category = ?, price = ?, image_url = ? WHERE id = ?",
      [name, category, parseFloat(price), finalImageUrl, parseInt(id)]
    );

    res.json({
      message: "Produk berhasil diperbarui!",
      product: {
        id: parseInt(id),
        name,
        category,
        price: parseFloat(price),
        image_url: finalImageUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui data produk.", error: error.message });
  }
});

// 6. DELETE: Hapus Produk (Protected - Admin Only)
app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan atau sudah terhapus." });
    }
    res.json({ message: "Produk berhasil dihapus dari sistem." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk.", error: error.message });
  }
});

// Booting Express Server
app.listen(PORT, () => {
  console.log(`🚀 [SERVER RUNNING] Express API Server mengudara di http://localhost:${PORT}`);
  if (db.isFallbackActive()) {
    console.log("⚠️  [RUNNING MODE] Server berjalan dalam mode In-Memory Database Fallback.");
  } else {
    console.log("✔️  [RUNNING MODE] Server terhubung penuh ke database MySQL.");
  }
});

export default app;
