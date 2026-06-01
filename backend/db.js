import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Seeding Data Awal (dalam Bahasa Indonesia) untuk In-Memory fallback
let memoryProducts = [
  {
    id: 1,
    name: "Sepatu Pantofel Kulit Klasik Jawa",
    category: "sepatu laki-laki",
    price: 385000,
    stock: 12,
    description: "Dibuat langsung oleh pengrajin lokal berpengalaman menggunakan bahan kulit sapi asli berkualitas tinggi. Sepatu pantofel ini menawarkan kenyamanan luar biasa dengan ketahanan jangka panjang.",
    image_url: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviews_count: 34,
    is_best_seller: true
  },
  {
    id: 2,
    name: "Sepatu Sekolah Patriot Aktif Hitam",
    category: "sepatu anak",
    price: 195000,
    stock: 25,
    description: "Didesain khusus untuk menunjang aktivitas padat siswa di sekolah sehari-hari. Menggunakan bahan kanvas berkualitas tinggi yang breathable.",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    reviews_count: 112,
    is_best_seller: false
  },
  {
    id: 3,
    name: "Sepatu Kets AeroStrider Modern",
    category: "sepatu perempuan",
    price: 275000,
    stock: 8,
    description: "Sepatu kets kasual super ringan yang memadukan kenyamanan tradisional dengan tren gaya jalanan modern.",
    image_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviews_count: 56,
    is_best_seller: true
  },
  {
    id: 4,
    name: "Sandal Selop Kulit Solo Buatan Tangan",
    category: "sandal laki-laki",
    price: 135000,
    stock: 20,
    description: "Sandal selop kulit yang diproduksi secara lokal di Solo. Bagian atas kulit dijahit tangan dengan sangat rapi.",
    image_url: "https://images.unsplash.com/photo-1603487988353-c8e4b3e9e30a?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    reviews_count: 48,
    is_best_seller: false
  },
  {
    id: 5,
    name: "Sandal Gunung Adventure Tangguh",
    category: "sandal anak",
    price: 185000,
    stock: 15,
    description: "Sandal yang dirancang khusus untuk kegiatan luar ruangan, mendaki gunung, menyusuri sungai, atau dipakai sehari-hari.",
    image_url: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviews_count: 89,
    is_best_seller: true
  },
  {
    id: 6,
    name: "Tas Ransel Kanvas Berat Explorer",
    category: "tas sekolah",
    price: 245000,
    stock: 10,
    description: "Tas ransel sekolah dan kuliah dengan daya tahan legendaris. Dibuat menggunakan bahan kanvas katun tebal militer 16oz.",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviews_count: 77,
    is_best_seller: true
  }
];

let useMemoryDb = false;
let pool = null;

// Password hash default untuk akun: admin / admin123
const defaultPasswordHash = bcrypt.hashSync("admin123", 10);

try {
  let sslConfig = null;

  // Prioritas 1: DB_CA_CERT (env variable langsung — untuk Vercel Serverless)
  // Prioritas 2: DB_CA_PATH (file lokal — untuk development)
  if (process.env.DB_CA_CERT) {
    // Bisa berupa PEM string langsung atau base64-encoded
    let certData = process.env.DB_CA_CERT;
    // Deteksi jika base64: tidak mengandung newline atau "-----BEGIN"
    if (!certData.includes("-----BEGIN") && !certData.includes("\n")) {
      certData = Buffer.from(certData, "base64").toString("utf-8");
    }
    sslConfig = {
      ca: certData,
      minVersion: "TLSv1.2",
      rejectUnauthorized: true
    };
    console.log("🔐 [SSL] Menggunakan CA cert dari environment variable DB_CA_CERT");
  } else {
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
            console.warn("⚠️ [DATABASE CA cert load error]:", e3.message);
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
  }

  // Hubungkan ke MySQL menggunakan driver pool
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ud_abang_adik",
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Uji koneksi awal
  const conn = await pool.getConnection();
  console.log("✔️ [DATABASE SUCCESS] Berhasil terhubung ke TiDB Cloud Database.");
  conn.release();
} catch (err) {
  console.warn("⚠️ [DATABASE WARNING] Gagal terhubung ke TiDB Cloud / MySQL Server:", err.message);
  console.warn("   Mengaktifkan Sistem Penyimpanan Sementara In-Memory Fallback...");
  useMemoryDb = true;
}

// In-Memory query executor
const executeMemoryQuery = async (sql, params = []) => {
  const statement = sql.trim().toLowerCase();
  
  // 1. SELECT ADMINS (Login Check)
  if (statement.startsWith("select") && statement.includes("from admins")) {
    const usernameParam = params[0];
    if (usernameParam === "admin") {
      return [[{ id: 1, username: "admin", password: defaultPasswordHash }]];
    }
    return [[]];
  }

  // 2. SELECT PRODUCTS (Fetch Listings)
  if (statement.startsWith("select") && statement.includes("from products")) {
    // Jika mengambil detail produk per ID: "SELECT * FROM products WHERE id = ?"
    if (statement.includes("where id =")) {
      const targetId = params[0];
      const match = memoryProducts.find(p => p.id === parseInt(targetId));
      return match ? [[match]] : [[]];
    }
    // Mengembalikan semua produk
    return [memoryProducts];
  }

  // 3. INSERT PRODUCT (Create)
  if (statement.startsWith("insert into products")) {
    // Parameter urutan: name, category, price, stock, description, image_url, rating, reviews_count, is_best_seller
    const newId = memoryProducts.length > 0 ? Math.max(...memoryProducts.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: params[0],
      category: params[1],
      price: parseFloat(params[2]) || 0,
      stock: parseInt(params[3]) || 0,
      description: params[4] || "",
      image_url: params[5] || "",
      rating: parseFloat(params[6]) || 4.5,
      reviews_count: parseInt(params[7]) || 0,
      is_best_seller: params[8] === true || params[8] === 1 ? true : false
    };
    memoryProducts.push(newProduct);
    return [{ insertId: newId, affectedRows: 1 }];
  }

  // 4. UPDATE PRODUCT (Edit)
  if (statement.startsWith("update products")) {
    // Parameter urutan: name, category, price, stock, description, image_url, id
    const nameVal = params[0];
    const catVal = params[1];
    const priceVal = parseFloat(params[2]) || 0;
    const stockVal = parseInt(params[3]) || 0;
    const descVal = params[4] || "";
    const imgVal = params[5] || "";
    const idVal = parseInt(params[6]);

    const idx = memoryProducts.findIndex(p => p.id === idVal);
    if (idx !== -1) {
      memoryProducts[idx] = {
        ...memoryProducts[idx],
        name: nameVal,
        category: catVal,
        price: priceVal,
        stock: stockVal,
        description: descVal,
        image_url: imgVal
      };
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  // 5. DELETE PRODUCT (Delete)
  if (statement.startsWith("delete from products")) {
    const targetId = parseInt(params[0]);
    const originalLength = memoryProducts.length;
    memoryProducts = memoryProducts.filter(p => p.id !== targetId);
    const affected = originalLength - memoryProducts.length;
    return [{ affectedRows: affected }];
  }

  return [[]];
};

// Ekspor query wrapper yang membungkus pemanggilan MySQL atau In-Memory
export const db = {
  query: async (sql, params = []) => {
    if (useMemoryDb) {
      return executeMemoryQuery(sql, params);
    }
    try {
      return await pool.query(sql, params);
    } catch (error) {
      console.error("⛔ [DATABASE ERROR] Gagal mengeksekusi kueri pada MySQL:", error.message);
      console.log("   Mengalihkan eksekusi kueri ke In-Memory Driver...");
      return executeMemoryQuery(sql, params);
    }
  },
  isFallbackActive: () => useMemoryDb
};
