// Konfigurasi utama untuk toko e-commerce UD ABANG ADIK

const isLocalhost = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || 
   window.location.hostname === "127.0.0.1" || 
   window.location.hostname.startsWith("192.168."));

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
  apiBaseUrl: isLocalhost ? "http://localhost:5000" : "/_/backend"
};
