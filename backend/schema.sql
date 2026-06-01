-- Skema Database MySQL untuk UD ABANG ADIK e-commerce

CREATE DATABASE IF NOT EXISTS ud_abang_adik;
USE ud_abang_adik;

-- Tabel Admin
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Produk
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
