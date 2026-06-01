// Konfigurasi utama untuk toko e-commerce UD ABANG ADIK
// API Base URL diambil dari environment variable saat build (Vite)
// - Development: set di frontend/.env → VITE_API_BASE_URL=http://localhost:5000
// - Production (Vercel): kosongkan agar pakai Vercel Serverless (/api/...)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const settings = {
  storeName: "UD ABANG ADIK",
  tagline: "Pusat Sepatu, Sandal, dan Tas Sekolah Berkualitas dengan Harga Terjangkau",
  whatsappNumber: "+6281360640668", // Format nomor telepon WhatsApp pembeli (dengan +)
  whatsappNumberClean: "6281360640668", // Format bersih untuk URL API WhatsApp
  currency: {
    symbol: "Rp",
    code: "IDR",
    locale: "id-ID"
  },
  storeDetails: {
    address: "Pasar Horas UD.ABANG ADIK GD.2 LT.2 Jl. Sutoyo, Dwikora, Kec. Siantar Bar., Kota Pematang Siantar, Sumatera Utara 21146",
    hours: "Setiap Hari: 08.00 WIB - 17.00 WIB",
    phone: "+62 813-6064-0668",
    email: "kontak@udabangadik.com",
    established: "1998"
  },
  apiBaseUrl
};
