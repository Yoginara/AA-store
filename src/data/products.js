// Database produk lokal berkualitas dari toko tradisional UD ABANG ADIK
export const products = [
  {
    id: 1,
    name: "Sepatu Pantofel Kulit Klasik Jawa",
    category: "sepatu laki-laki",
    price: 385000,
    originalPrice: 450000,
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-148573422979-f5c462d49f74?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    rating: 4.8,
    reviewsCount: 34,
    description: "Dibuat langsung oleh pengrajin lokal berpengalaman menggunakan bahan kulit sapi asli berkualitas tinggi. Sepatu pantofel ini menawarkan kenyamanan luar biasa dengan ketahanan jangka panjang. Dilengkapi dengan lapisan dalam busa yang empuk serta sol karet anti-selip. Sangat cocok untuk acara formal, seragam kerja, kantor, atau aktivitas semi-formal harian.",
    specs: {
      material: "100% Kulit Sapi Asli",
      sole: "Sol Karet Anti-Selip Premium",
      weight: "750g per pasang",
      origin: "Cibaduyut, Jawa Barat"
    },
    inStock: true,
    isBestSeller: true
  },
  {
    id: 2,
    name: "Sepatu Sekolah Patriot Aktif Hitam",
    category: "sepatu anak",
    price: 195000,
    originalPrice: 220000,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
    rating: 4.7,
    reviewsCount: 112,
    description: "Didesain khusus untuk menunjang aktivitas padat siswa di sekolah sehari-hari. Menggunakan bahan kanvas berkualitas tinggi yang breathable, dipadukan dengan pelindung jari berbahan kulit sintetis tebal agar tahan gores. Sol dalam busa ganda memberikan kenyamanan ekstra untuk berlari, berjalan, dan bermain.",
    specs: {
      material: "Kanvas Premium & Kulit Sintetis",
      sole: "Sol Karet Keras Vulcanized",
      weight: "600g per pasang",
      origin: "Tangerang, Banten"
    },
    inStock: true,
    isBestSeller: false
  },
  {
    id: 3,
    name: "Sepatu Kets AeroStrider Modern",
    category: "sepatu perempuan",
    price: 275000,
    originalPrice: 320000,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512374382149-43345095a84f?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    rating: 4.9,
    reviewsCount: 56,
    description: "Sepatu kets kasual super ringan yang memadukan kenyamanan tradisional dengan tren gaya jalanan modern. Dilengkapi dengan jaring rajut fleksibel yang menyesuaikan dengan bentuk kaki Anda serta sol tengah Phylon elastis tinggi yang meredam benturan di setiap langkah.",
    specs: {
      material: "Rajutan Mesh Flyknit Bernapas",
      sole: "Sol Ringan Phylon Cushioning",
      weight: "500g per pasang",
      origin: "Bandung, Jawa Barat"
    },
    inStock: true,
    isBestSeller: true
  },
  {
    id: 4,
    name: "Sandal Selop Kulit Solo Buatan Tangan",
    category: "sandal laki-laki",
    price: 135000,
    originalPrice: 165000,
    images: [
      "https://images.unsplash.com/photo-1603487988353-c8e4b3e9e30a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605733513597-a8f8d410fe3c?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    rating: 4.6,
    reviewsCount: 48,
    description: "Sandal selop kulit yang diproduksi secara lokal di Solo. Bagian atas kulit dijahit tangan dengan sangat rapi, berpadu dengan bantalan kulit sintetis ergonomis yang mengikuti bentuk telapak kaki. Sangat mudah digunakan untuk santai di rumah, jalan-jalan sore, atau pergi ke pasar.",
    specs: {
      material: "Kulit Sapi Asli Jahitan Tangan",
      sole: "Bantalan Sol Ergonomis EVA",
      weight: "350g per pasang",
      origin: "Solo, Jawa Tengah"
    },
    inStock: true,
    isBestSeller: false
  },
  {
    id: 5,
    name: "Sandal Gunung Adventure Tangguh",
    category: "sandal anak",
    price: 185000,
    originalPrice: 210000,
    images: [
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628149487026-b9a4c82b92a2?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: [38, 39, 40, 41, 42, 43],
    rating: 4.8,
    reviewsCount: 89,
    description: "Sandal yang dirancang khusus untuk kegiatan luar ruangan, mendaki gunung, menyusuri sungai, atau dipakai sehari-hari. Dilengkapi tali anyaman nilon berkekuatan tinggi dengan 3 titik pengikat velcro yang dapat disesuaikan. Sol luar berbahan karet bergerigi tebal memberikan traksi kuat pada permukaan licin, basah, maupun berbatu.",
    specs: {
      material: "Anyaman Nilon High-Tensile",
      sole: "Karet Bergerigi Anti-Selip Kuat",
      weight: "480g per pasang",
      origin: "Sleman, D.I. Yogyakarta"
    },
    inStock: true,
    isBestSeller: true
  },
  {
    id: 6,
    name: "Sandal Jepit Nyaman Busa Cloud",
    category: "sandal perempuan",
    price: 75000,
    originalPrice: 95000,
    images: [
      "https://images.unsplash.com/photo-1621996346565-e3dc69189a2a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    rating: 4.5,
    reviewsCount: 142,
    description: "Sandal jepit santai harian terbaik dengan bantalan sol EVA super empuk layaknya awan dan tali sintetis premium yang nyaman sehingga tidak melukai sela jari kaki. Tahan air dan sangat cepat kering, sangat ideal digunakan ke pantai, kamar mandi, kolam renang, atau sekadar berkeliling pasar.",
    specs: {
      material: "Tali Sintetis Lembut Tahan Air",
      sole: "Sol Cloud-Cushioned EVA Ringan",
      weight: "220g per pasang",
      origin: "Semarang, Jawa Tengah"
    },
    inStock: true,
    isBestSeller: false
  },
  {
    id: 7,
    name: "Tas Ransel Kanvas Berat Explorer",
    category: "tas sekolah",
    price: 245000,
    originalPrice: 290000,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: null,
    rating: 4.9,
    reviewsCount: 77,
    description: "Tas ransel sekolah dan kuliah dengan daya tahan legendaris. Dibuat menggunakan bahan kanvas katun tebal militer 16oz dengan perpaduan tali kulit asli berkancing gesper logam yang kokoh. Dilengkapi kantong laptop berbusa tebal ukuran 15.6 inci, kantong botol samping ganda, dan 3 saku utilitas depan.",
    specs: {
      material: "Kanvas Katun 16oz & Tali Kulit Asli",
      capacity: "Kapasitas 25 Liter",
      weight: "850g",
      origin: "Garut, Jawa Barat"
    },
    inStock: true,
    isBestSeller: true
  },
  {
    id: 8,
    name: "Tas Ransel Sekolah ErgoComfort Pastel",
    category: "tas sekolah",
    price: 215000,
    originalPrice: 250000,
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: null,
    rating: 4.7,
    reviewsCount: 93,
    description: "Ransel sekolah bertema warna pastel indah yang dirancang dengan struktur bantalan punggung sarang lebah yang ergonomis. Tali bahu tebal berbentuk S melindungi postur punggung siswa dari beban buku cetak yang berat. Terbuat dari serat nilon Oxford anti air untuk menjaga buku tetap aman saat hujan tiba-tiba.",
    specs: {
      material: "Nilon Oxford Tebal Anti Air",
      capacity: "Kapasitas 22 Liter",
      weight: "650g",
      origin: "Sidoarjo, Jawa Timur"
    },
    inStock: true,
    isBestSeller: false
  },
  {
    id: 9,
    name: "Tas Ransel Anak Ceria Junior-Brite",
    category: "tas sekolah",
    price: 155000,
    originalPrice: 185000,
    images: [
      "https://images.unsplash.com/photo-1575844012732-c11df5fb139c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop"
    ],
    sizes: null,
    rating: 4.8,
    reviewsCount: 61,
    description: "Tas sekolah ransel anak berwarna cerah dengan tingkat visibilitas tinggi untuk keselamatan, dirancang khusus untuk siswa TK dan Sekolah Dasar kelas rendah. Terbuat dari bahan poliester berkepadatan tinggi yang tidak mudah sobek dan mudah dibersihkan. Dilengkapi strip reflektif cahaya pada tali bahu, corak timbul 3D yang lucu, serta ritsleting berukuran besar yang ramah anak.",
    specs: {
      material: "Poliester 600D Anti Sobek & Gesekan",
      capacity: "Kapasitas 15 Liter",
      weight: "450g",
      origin: "Gresik, Jawa Timur"
    },
    inStock: true,
    isBestSeller: false
  }
];
