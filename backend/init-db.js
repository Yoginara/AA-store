import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "ud_abang_adik";

// Data Awal Produk (Bahasa Indonesia) untuk di-seed ke MySQL
const seedProducts = [
  {
    name: "Sepatu Pantofel Kulit Klasik Jawa",
    category: "sepatu",
    price: 385000,
    stock: 15,
    description: "Dibuat langsung oleh pengrajin lokal berpengalaman menggunakan bahan kulit sapi asli berkualitas tinggi. Sepatu pantofel ini menawarkan kenyamanan luar biasa dengan ketahanan jangka panjang. Dilengkapi dengan lapisan dalam busa yang empuk serta sol karet anti-selip. Sangat cocok untuk acara formal, seragam kerja, kantor, atau aktivitas semi-formal harian.",
    image_url: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
    rating: 4.80,
    reviews_count: 34,
    is_best_seller: true
  },
  {
    name: "Sepatu Sekolah Patriot Aktif Hitam",
    category: "sepatu",
    price: 195000,
    stock: 30,
    description: "Didesain khusus untuk menunjang aktivitas padat siswa di sekolah sehari-hari. Menggunakan bahan kanvas berkualitas tinggi yang breathable, dipadukan dengan pelindung jari berbahan kulit sintetis tebal agar tahan gores.",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    rating: 4.70,
    reviews_count: 112,
    is_best_seller: false
  },
  {
    name: "Sepatu Kets AeroStrider Modern",
    category: "sepatu",
    price: 275000,
    stock: 12,
    description: "Sepatu kets kasual super ringan yang memadukan kenyamanan tradisional dengan tren gaya jalanan modern. Dilengkapi dengan jaring rajut fleksibel yang menyesuaikan dengan bentuk kaki Anda.",
    image_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
    rating: 4.90,
    reviews_count: 56,
    is_best_seller: true
  },
  {
    name: "Sandal Selop Kulit Solo Buatan Tangan",
    category: "sandal",
    price: 135000,
    stock: 22,
    description: "Sandal selop kulit yang diproduksi secara lokal di Solo. Bagian atas kulit dijahit tangan dengan sangat rapi, berpadu dengan bantalan kulit sintetis ergonomis yang mengikuti bentuk telapak kaki.",
    image_url: "https://images.unsplash.com/photo-1603487988353-c8e4b3e9e30a?q=80&w=600&auto=format&fit=crop",
    rating: 4.60,
    reviews_count: 48,
    is_best_seller: false
  },
  {
    name: "Sandal Gunung Adventure Tangguh",
    category: "sandal",
    price: 185000,
    stock: 18,
    description: "Sandal yang dirancang khusus untuk kegiatan luar ruangan, mendaki gunung, menyusuri sungai, atau dipakai sehari-hari. Dilengkapi tali anyaman nilon berkekuatan tinggi.",
    image_url: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=600&auto=format&fit=crop",
    rating: 4.80,
    reviews_count: 89,
    is_best_seller: true
  },
  {
    name: "Tas Ransel Kanvas Berat Explorer",
    category: "tas sekolah",
    price: 245000,
    stock: 14,
    description: "Tas ransel sekolah dan kuliah dengan daya tahan legendaris. Dibuat menggunakan bahan kanvas katun tebal militer 16oz dengan perpaduan tali kulit asli berkancing gesper logam yang kokoh.",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    rating: 4.90,
    reviews_count: 77,
    is_best_seller: true
  }
];

async function initializeDatabase() {
  console.log("🛠️  Memulai Inisialisasi Database MySQL untuk UD ABANG ADIK...");

  let connection;
  try {
    let sslConfig = null;
    const caFileName = process.env.DB_CA_PATH;
    if (caFileName) {
      let certData = null;
      try {
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        certData = fs.readFileSync(path.join(currentDir, caFileName));
      } catch (e) {
        try {
          certData = fs.readFileSync(path.join(process.cwd(), caFileName));
        } catch (e2) {
          try {
            certData = fs.readFileSync(caFileName);
          } catch (e3) {
            console.warn("⚠️ [CA cert load error]:", e3.message);
          }
        }
      }

      if (certData) {
        sslConfig = {
          ca: certData,
          minVersion: "TLSv1.2",
          rejectUnauthorized: true
        };
      }
    }

    // Hubungkan langsung ke Database TiDB Cloud / MySQL Server
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: sslConfig
    });

    console.log(`✔️  Berhasil terhubung ke database '${DB_NAME}' via SSL.`);

    // 3. Buat tabel 'admins'
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✔️  Tabel 'admins' berhasil diverifikasi/dibuat.");

    // 4. Buat tabel 'products'
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(12, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        description TEXT,
        image_url TEXT,
        rating DECIMAL(3, 2) DEFAULT 4.50,
        reviews_count INT DEFAULT 0,
        is_best_seller BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✔️  Tabel 'products' berhasil diverifikasi/dibuat.");

    // 5. Seed Akun Admin Default ditiadakan untuk alasan keamanan
    // Admin harus dibuat manual via database console

    // 6. Seed Produk Awal jika masih kosong
    const [productRows] = await connection.query("SELECT * FROM products");
    if (productRows.length === 0) {
      for (const prod of seedProducts) {
        await connection.query(
          "INSERT INTO products (name, category, price, stock, description, image_url, rating, reviews_count, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [prod.name, prod.category, prod.price, prod.stock, prod.description, prod.image_url, prod.rating, prod.reviews_count, prod.is_best_seller]
        );
      }
      console.log(`✨ Berhasil menambahkan ${seedProducts.length} produk katalog awal ke database MySQL!`);
    } else {
      console.log("ℹ️  Tabel 'products' sudah memiliki data. Seeding produk dilewati.");
    }

    console.log("🎉 [INITIALIZATION SUCCESS] Database MySQL UD ABANG ADIK berhasil dikonfigurasi penuh!");
  } catch (error) {
    console.error("⛔ [INITIALIZATION ERROR] Gagal menginisialisasi MySQL:");
    console.error(`   Pesan Error: ${error.message}`);
    console.warn("\n💡 SARAN PEMECAHAN MASALAH:");
    console.warn("   1. Pastikan layanan MySQL Server (seperti XAMPP, Laragon, Docker, atau daemon mysql) sudah berjalan.");
    console.warn("   2. Periksa kembali kredensial DB_USER dan DB_PASSWORD di berkas backend/.env.");
    console.warn("   3. Jangan khawatir! Express Server tetap dapat berjalan dengan normal menggunakan mode In-Memory Database Fallback.");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();
