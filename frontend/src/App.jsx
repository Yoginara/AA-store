import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import OfferModal from "./components/OfferModal";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminSecretModal from "./components/AdminSecretModal";
import { products as staticProducts } from "./data/products";
import { settings } from "./config/settings";
import { Award, TrendingUp, HeartHandshake, MessageSquare, ShieldCheck, Tag, MapPin, Clock, Phone, ShoppingBag, ArrowRight, ChevronRight, User, Heart, Smile, Footprints, Sparkles, Backpack } from "lucide-react";

export default function App() {
  // State Navigasi Halaman (home, products, profile, contact, admin-login, admin-dashboard)
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // State Katalog Produk Dinamis dari Server / Fallback
  const [productsList, setProductsList] = useState(staticProducts);

  // State Otentikasi Admin
  const [adminToken, setAdminToken] = useState(localStorage.getItem("admin_token") || "");
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem("admin_user") || "null"));

  // State Modal Penawaran Tawar Harga
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  // State Modal Akses Rahasia Admin
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);

  // Penormalisasi data produk dari server/API ke skema storefront
  const normalizeProducts = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((prod) => {
      // 1. Tangani best seller
      const isBestSeller = prod.isBestSeller !== undefined
        ? prod.isBestSeller
        : (prod.is_best_seller === 1 || prod.is_best_seller === true || prod.is_best_seller === "1");

      // 2. Tangani rating & reviewsCount
      const rating = prod.rating !== undefined ? parseFloat(prod.rating) : 4.5;
      const reviewsCount = prod.reviewsCount !== undefined
        ? prod.reviewsCount
        : (prod.reviews_count !== undefined ? prod.reviews_count : 0);

      // 3. Tangani list images
      let imagesList = [];
      if (Array.isArray(prod.images)) {
        imagesList = prod.images;
      } else if (prod.images && typeof prod.images === "string") {
        try {
          imagesList = JSON.parse(prod.images);
        } catch (e) {
          imagesList = [prod.images];
        }
      }
      if (imagesList.length === 0) {
        imagesList = prod.image_url
          ? [prod.image_url]
          : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"];
      }

      // 4. Tangani original price
      const originalPrice = prod.originalPrice || prod.original_price || Math.round(prod.price * 1.15);

      // 5. Tangani sizes array
      let sizesList = null;
      if (prod.category && !prod.category.toLowerCase().startsWith("tas")) {
        if (Array.isArray(prod.sizes)) {
          sizesList = prod.sizes;
        } else if (prod.sizes && typeof prod.sizes === "string") {
          try {
            sizesList = JSON.parse(prod.sizes);
          } catch (e) {
            sizesList = [38, 39, 40, 41, 42, 43, 44];
          }
        } else {
          sizesList = [38, 39, 40, 41, 42, 43, 44];
        }
      }

      // 6. Tangani specs object
      let specsObj = {
        material: "Bahan Pilihan",
        weight: "500g",
        origin: "Lokal"
      };

      if (prod.specs && typeof prod.specs === "object" && prod.specs !== null) {
        specsObj = { ...prod.specs };
      } else if (prod.specs && typeof prod.specs === "string") {
        try {
          specsObj = JSON.parse(prod.specs);
        } catch (e) {
          // Keep default
        }
      }

      return {
        ...prod,
        isBestSeller,
        reviewsCount,
        images: imagesList,
        originalPrice,
        sizes: sizesList,
        specs: specsObj
      };
    });
  };

  // Ambil katalog produk dari Express API Server saat aplikasi dibuka
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${settings.apiBaseUrl}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProductsList(normalizeProducts(data));
      } else {
        throw new Error("Gagal memuat produk.");
      }
    } catch (err) {
      console.warn("⚠️  [OFFLINE STOREFRONT] Server API tidak aktif. Menggunakan katalog produk lokal...");
      setProductsList(normalizeProducts(staticProducts));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Buka Modal Penawaran
  const handleOpenOfferModal = (product) => {
    setModalProduct(product);
    setIsOfferModalOpen(true);
  };

  // Filter Kategori
  const categories = [
    { id: "all", name: "Semua" },
    { id: "sepatu laki-laki", name: "Sepatu Laki-Laki" },
    { id: "sepatu perempuan", name: "Sepatu Perempuan" },
    { id: "sepatu anak", name: "Sepatu Anak" },
    { id: "sandal laki-laki", name: "Sandal Laki-Laki" },
    { id: "sandal perempuan", name: "Sandal Perempuan" },
    { id: "sandal anak", name: "Sandal Anak" },
    { id: "tas sekolah", name: "Tas Sekolah" }
  ];

  const filteredProducts = productsList.filter((p) => {
    if (selectedCategory === "all") return true;
    return p.category && p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // --- JIKA HALAMAN ADALAH PORTAL ADMIN ---
  if (currentPage === "admin-login") {
    return (
      <AdminLogin
        onLoginSuccess={(token, user) => {
          localStorage.setItem("admin_token", token);
          localStorage.setItem("admin_user", JSON.stringify(user));
          setAdminToken(token);
          setAdminUser(user);
          setCurrentPage("admin-dashboard");
        }}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "admin-dashboard") {
    if (!adminToken) {
      setCurrentPage("admin-login");
      return null;
    }
    return (
      <AdminDashboard
        token={adminToken}
        fallbackProducts={staticProducts}
        onLogout={() => {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          setAdminToken("");
          setAdminUser(null);
          setCurrentPage("home");
        }}
        onProductsUpdate={(newProducts) => {
          setProductsList(normalizeProducts(newProducts));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-950 text-primary-50">

      {/* 1. Header & Bar Navigasi */}
      <header className="w-full bg-primary-900 border-b border-primary-800 py-6 px-4 text-center">
        <h1 className="font-serif text-3xl font-black tracking-tight text-white sm:text-4xl">
          UD ABANG ADIK
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-primary-400 font-bold mt-1">
          Katalog Digital Pasar Tradisional
        </p>

        {/* Menu Navigasi */}
        <nav className="flex justify-center gap-6 mt-4 border-t border-primary-850 pt-4 text-xs font-bold text-primary-350">
          <button
            onClick={() => setCurrentPage("home")}
            className={`hover:text-white cursor-pointer transition-colors ${currentPage === "home" ? "text-accent-orange font-black" : ""}`}
          >
            Beranda
          </button>
          <button
            onClick={() => setCurrentPage("products")}
            className={`hover:text-white cursor-pointer transition-colors ${currentPage === "products" ? "text-accent-orange font-black" : ""}`}
          >
            Produk
          </button>
          <button
            onClick={() => setCurrentPage("profile")}
            className={`hover:text-white cursor-pointer transition-colors ${currentPage === "profile" ? "text-accent-orange font-black" : ""}`}
          >
            Profil Toko
          </button>
          <button
            onClick={() => setCurrentPage("contact")}
            className={`hover:text-white cursor-pointer transition-colors ${currentPage === "contact" ? "text-accent-orange font-black" : ""}`}
          >
            Kontak
          </button>
        </nav>
      </header>

      {/* Konten Halaman Aktif */}
      <main className="flex-grow w-full">

        {/* A. HALAMAN BERANDA (HOMEPAGE) */}
        {currentPage === "home" && (
          <div className="w-full text-center">

            {/* 1. Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 py-16 sm:py-20 md:py-24 border-b border-primary-800 shadow-xl px-4 text-center">
              {/* Decorative radial glows */}
              <div className="absolute top-0 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-accent-orange/5 blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 h-72 w-72 translate-x-1/2 rounded-full bg-accent-gold/5 blur-[100px]" />

              <div className="relative mx-auto max-w-3xl space-y-6 z-10">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-accent-orange/10 px-3.5 py-1 text-[10px] font-black text-accent-orange tracking-widest uppercase border border-accent-orange/20">
                  ★ Toko Ritel Terpercaya Beringharjo
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                  UD <span className="text-accent-gold">ABANG ADIK</span>
                </h1>
                <p className="font-sans text-sm sm:text-base md:text-lg font-bold text-primary-300 max-w-2xl mx-auto leading-relaxed">
                  Pusat Sepatu, Sandal, dan Tas Sekolah Berkualitas dengan Harga Terjangkau
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setCurrentPage("products");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent-orange px-8 py-3.5 text-xs font-bold text-white shadow-md shadow-accent-orange/15 hover:bg-accent-orange-dark cursor-pointer transition-colors"
                  >
                    <span>Lihat Produk</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Featured Categories Section */}
            <section className="mx-auto max-w-7xl px-4 py-12">
              <div className="text-center pb-8 max-w-xl mx-auto space-y-1">
                <h2 className="font-serif text-xl sm:text-2xl font-black text-white">Kategori Pilihan</h2>
                <p className="text-[11px] text-primary-400 font-bold uppercase tracking-wider">Temukan persediaan alas kaki dan ransel sekolah terlengkap</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {categories.filter(c => c.id !== "all").map((cat) => {
                  let icon = ShoppingBag;
                  if (cat.id === "sepatu laki-laki") icon = User;
                  if (cat.id === "sepatu perempuan") icon = Heart;
                  if (cat.id === "sepatu anak") icon = Smile;
                  if (cat.id === "sandal laki-laki") icon = Footprints;
                  if (cat.id === "sandal perempuan") icon = Sparkles;
                  if (cat.id === "sandal anak") icon = Smile;
                  if (cat.id === "tas sekolah") icon = Backpack;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage("products");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group flex flex-col items-center text-center p-4 bg-primary-900 border border-primary-800 rounded-xl cursor-pointer hover:border-accent-orange/40 hover:bg-primary-850 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-orange/10 text-accent-orange mb-3 border border-accent-orange/20 shrink-0">
                        {React.createElement(icon, { className: "h-5 w-5" })}
                      </div>
                      <span className="block text-xs font-bold text-white group-hover:text-accent-gold transition-colors">
                        {cat.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Why Choose Us Section */}
            <section className="bg-primary-900 border-y border-primary-800 py-12 px-4 text-center">
              <div className="mx-auto max-w-7xl">
                <div className="text-center pb-8 max-w-xl mx-auto space-y-1">
                  <h2 className="font-serif text-xl sm:text-2xl font-black text-white">Mengapa Memilih Kami</h2>
                  <p className="text-[11px] text-primary-400 font-bold uppercase tracking-wider">Komitmen kami demi kepuasan dan kenyamanan belanja Anda</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-primary-950 p-5 rounded-xl border border-primary-800 space-y-3 text-left shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-xs font-bold text-white">Produk Berkualitas</h3>
                    <p className="text-[11px] text-primary-400 font-semibold leading-relaxed">Bahan tebal tepercaya, jahitan presisi yang kuat, dan daya tahan sol antiselip premium.</p>
                  </div>

                  <div className="bg-primary-950 p-5 rounded-xl border border-primary-800 space-y-3 text-left shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                      <Tag className="h-5 w-5" />
                    </div>
                    <h3 className="text-xs font-bold text-white">Harga Terjangkau</h3>
                    <p className="text-[11px] text-primary-400 font-semibold leading-relaxed">Paling ekonomis dan ramah di dompet keluarga, menawarkan nilai terbaik dari produsen.</p>
                  </div>

                  <div className="bg-primary-950 p-5 rounded-xl border border-primary-800 space-y-3 text-left shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <h3 className="text-xs font-bold text-white">Pelayanan Ramah</h3>
                    <p className="text-[11px] text-primary-400 font-semibold leading-relaxed">Layanan tanya-jawab kekeluargaan khas pasar tradisional Beringharjo yang sopan dan cepat tanggap.</p>
                  </div>

                  <div className="bg-primary-950 p-5 rounded-xl border border-primary-800 space-y-3 text-left shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h3 className="text-xs font-bold text-white">Penawaran Langsung WA</h3>
                    <p className="text-[11px] text-primary-400 font-semibold leading-relaxed">Hitung harga tawaran terbaik Anda dan ajukan langsung secara cepat dan aman via WhatsApp.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Featured Products Section */}
            <section className="mx-auto max-w-7xl px-4 py-12">
              <div className="text-center pb-8 max-w-xl mx-auto space-y-1">
                <h2 className="font-serif text-xl sm:text-2xl font-black text-white">Rekomendasi Unggulan</h2>
                <p className="text-[11px] text-primary-400 font-bold uppercase tracking-wider">Produk alas kaki & tas sekolah paling banyak dicari</p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 animate-none">
                {productsList.slice(0, 4).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenOfferModal={handleOpenOfferModal}
                  />
                ))}
              </div>

              <div className="pt-8 text-center">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setCurrentPage("products");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-900 border border-primary-800 px-6 py-2.5 text-xs font-bold text-primary-300 hover:text-white cursor-pointer transition-colors"
                >
                  <span>Lihat Semua Produk</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </section>

            {/* 5. Company Profile Preview Section */}
            <section className="bg-primary-900 border-y border-primary-800 py-12 px-4 text-left shadow-sm">
              <div className="mx-auto max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-1 text-[10px] font-black text-accent-orange uppercase tracking-wider">
                  ✦ Kenali Toko Kami
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-black text-white">UD ABANG ADIK Pematangsiantar</h2>
                <p className="text-xs sm:text-sm text-primary-300 leading-relaxed font-medium">
                  UD ABANG ADIK adalah toko ritel tradisional tepercaya yang khusus menyediakan sepatu, sandal, dan tas sekolah berkualitas tinggi untuk laki-laki, perempuan, dan anak-anak. Toko kami berkomitmen untuk menawarkan produk terbaik dengan harga yang sangat terjangkau bagi semua kalangan, melayani pembeli langsung di kios Pasar Horas Pematangsiantar maupun pelanggan online di seluruh Indonesia.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setCurrentPage("profile");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent-orange/10 border border-accent-orange/20 px-6 py-2.5 text-xs font-bold text-accent-orange hover:bg-accent-orange hover:text-white cursor-pointer transition-colors"
                  >
                    <span>Selengkapnya</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* 6. Contact & Lapak Info Section */}
            <section className="mx-auto max-w-3xl px-4 py-12 text-left">
              <div className="text-center pb-8 max-w-xl mx-auto space-y-1">
                <h2 className="font-serif text-xl sm:text-2xl font-black text-white">Hubungi Kios Kami</h2>
                <p className="text-[11px] text-primary-400 font-bold uppercase tracking-wider">Kunjungi lapak Pasar Horas Pematangsiantar atau hubungi hotline kami</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-900 p-5 rounded-xl border border-primary-800 flex items-start gap-3.5 shadow-sm">
                  <Phone className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <span className="block text-[10px] font-bold text-primary-400 uppercase tracking-wide">WhatsApp</span>
                    <span className="text-xs text-white font-extrabold block mt-1">{settings.storeDetails.phone}</span>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/qNbykV8MpBhjCZo29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-900 p-5 rounded-xl border border-primary-800 flex items-start gap-3.5 shadow-sm hover:border-accent-orange/40 hover:bg-primary-850 transition-colors cursor-pointer text-left"
                >
                  <MapPin className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <span className="block text-[10px] font-bold text-primary-400 uppercase tracking-wide">Alamat Toko</span>
                    <span className="text-xs text-white font-extrabold block mt-1 leading-normal">Gedung 2 Lantai 2, Pasar Horas Pematangsiantar</span>
                    <span className="block text-[9px] text-accent-orange font-bold mt-1">★ Buka Google Maps</span>
                  </div>
                </a>

                <div className="bg-primary-900 p-5 rounded-xl border border-primary-800 flex items-start gap-3.5 shadow-sm">
                  <Clock className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <span className="block text-[10px] font-bold text-primary-400 uppercase tracking-wide">Jam Buka</span>
                    <span className="text-xs text-white font-extrabold block mt-1">{settings.storeDetails.hours}</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* B. HALAMAN PRODUK (KATALOG) */}
        {currentPage === "products" && (
          <div className="w-full">
            {/* Tombol Filter Kategori */}
            <section className="mx-auto max-w-7xl px-4 py-6 w-full text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${isActive
                        ? "bg-accent-orange border-accent-orange text-white"
                        : "bg-primary-900 border-primary-800 text-primary-300 hover:text-white"
                        }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Grid Produk */}
            <section className="mx-auto max-w-7xl px-4 pb-12 w-full">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-primary-400 text-xs font-bold">
                  Tidak ada produk dalam kategori ini.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-none">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onOpenOfferModal={handleOpenOfferModal}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* C. HALAMAN PROFIL TOKO (HAMALAN BARU) */}
        {currentPage === "profile" && (
          <div className="mx-auto max-w-3xl px-4 py-8 space-y-6 text-left">

            {/* Seksi 1: Tentang UD ABANG ADIK */}
            <div className="bg-primary-900 border border-primary-800 p-6 rounded-xl space-y-3 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-white border-l-2 border-accent-orange pl-3">
                Tentang UD ABANG ADIK
              </h2>
              <p className="text-xs sm:text-sm text-primary-300 leading-relaxed font-medium">
                UD ABANG ADIK adalah toko ritel tradisional tepercaya yang khusus menyediakan sepatu, sandal, dan tas sekolah berkualitas tinggi untuk laki-laki, perempuan, dan anak-anak. Toko kami berkomitmen untuk menawarkan produk terbaik dengan harga yang sangat terjangkau bagi semua kalangan, melayani pembeli langsung di kios Pasar Beringharjo maupun pelanggan online di seluruh Indonesia.
              </p>
            </div>

            {/* Seksi 2 & 3: Visi & Misi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Seksi 2: Visi */}
              <div className="bg-primary-900 border border-primary-800 p-5 rounded-xl space-y-2 flex flex-col justify-start shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-accent-orange" />
                  <h3 className="font-serif text-base font-bold text-white">Visi</h3>
                </div>
                <p className="text-xs text-primary-350 leading-relaxed font-medium">
                  Menjadi penyedia alas kaki dan tas sekolah tradisional yang terpercaya, modern, dan paling terjangkau, dengan mempertahankan tradisi tawar-menawar kekeluargaan yang adil dan transparan bagi semua masyarakat Indonesia.
                </p>
              </div>

              {/* Seksi 3: Misi */}
              <div className="bg-primary-900 border border-primary-800 p-5 rounded-xl space-y-2 flex flex-col justify-start shadow-sm">
                <div className="flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-accent-gold" />
                  <h3 className="font-serif text-base font-bold text-white">Misi</h3>
                </div>
                <ul className="space-y-1.5 text-xs text-primary-355 leading-relaxed font-medium list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-orange font-bold">•</span>
                    <span>Menjamin mutu jahitan tebal, kekuatan sol produk, dan kenyamanan pemakaian.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-orange font-bold">•</span>
                    <span>Menawarkan harga kaki lima yang jujur dengan mutu barang bintang lima.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-orange font-bold">•</span>
                    <span>Menyediakan proses tawar-menawar online yang aman, cepat, dan transparan lewat WhatsApp.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Seksi 4: Keunggulan Kami */}
            <div className="bg-primary-900 border border-primary-800 p-6 rounded-xl space-y-4 shadow-sm">
              <h3 className="font-serif text-base font-bold text-white border-l-2 border-accent-orange pl-3">
                Keunggulan Kami
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="flex items-start gap-3 bg-primary-950 p-3 rounded-lg border border-primary-800 shadow-inner">
                  <ShieldCheck className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Produk Berkualitas</h4>
                    <p className="text-[11px] text-primary-400 font-semibold mt-0.5">Bahan tebal tepercaya, jahitan kuat rapi, dan ketahanan sol antiselip.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-primary-950 p-3 rounded-lg border border-primary-800 shadow-inner">
                  <Tag className="h-5 w-5 text-accent-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Harga Terjangkau</h4>
                    <p className="text-[11px] text-primary-400 font-semibold mt-0.5">Sangat ekonomis dan bersahabat di dompet keluarga pasar tradisional.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-primary-950 p-3 rounded-lg border border-primary-800 shadow-inner">
                  <HeartHandshake className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Pelayanan Ramah</h4>
                    <p className="text-[11px] text-primary-400 font-semibold mt-0.5">Layanan tanya-jawab kekeluargaan yang ramah, sopan, dan cepat tanggap.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-primary-950 p-3 rounded-lg border border-primary-800 shadow-inner">
                  <MessageSquare className="h-5 w-5 text-accent-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Sistem Penawaran WhatsApp</h4>
                    <p className="text-[11px] text-primary-400 font-semibold mt-0.5">Ajukan harga tawar Anda secara mandiri dan langsung deal via WhatsApp.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* D. HALAMAN KONTAK */}
        {currentPage === "contact" && (
          <div className="mx-auto max-w-3xl px-4 py-8 space-y-6 text-left">
            <div className="bg-primary-900 border border-primary-800 p-6 rounded-xl space-y-4 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-white border-l-2 border-accent-orange pl-3">
                Informasi Lapak & Hubungi Kami
              </h2>

              <ul className="space-y-3.5 text-xs sm:text-sm text-primary-350 font-semibold">
                <a
                  href="https://maps.app.goo.gl/qNbykV8MpBhjCZo29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 bg-primary-950 p-3 rounded-lg border border-primary-800 shadow-inner hover:border-accent-orange/30 transition-colors cursor-pointer text-left block"
                >
                  <MapPin className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white text-[10px] uppercase tracking-wider mb-0.5">Alamat Kios</span>
                    <span className="text-xs text-primary-300 leading-normal block">{settings.storeDetails.address}</span>
                    <span className="block text-[9px] text-accent-orange font-bold mt-1">★ Klik untuk Petunjuk Peta</span>
                  </div>
                </a>

                <li className="flex items-start gap-3 bg-primary-950 p-3 rounded-lg border border-primary-800 shadow-inner">
                  <Phone className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white text-[10px] uppercase tracking-wider mb-0.5">Hotline WhatsApp</span>
                    <span className="text-xs">{settings.storeDetails.phone} (Respon Cepat)</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-primary-950 p-3 rounded-lg border border-primary-800 shadow-inner">
                  <Clock className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white text-[10px] uppercase tracking-wider mb-0.5">Jam Operasional Kios</span>
                    <span className="text-xs">{settings.storeDetails.hours}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Denah Lokasi */}
            <div className="bg-primary-900 border border-primary-800 p-4 rounded-xl space-y-2 shadow-sm">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-accent-gold">Petunjuk Denah Lapak Fisik</h4>
              <div className="h-36 w-full bg-primary-950 rounded-lg border border-primary-800 flex items-center justify-center p-4">
                <div className="text-center space-y-1.5">
                  <MapPin className="h-5 w-5 text-accent-orange mx-auto" />
                  <span className="block text-[11px] text-white font-bold">Pasar Horas Pematangsiantar Gedung 2 Lantai 2</span>
                  <span className="block text-[9px] text-primary-500">Jl. Sutoyo, Dwikora, Kec. Siantar Bar., Kota Pematang Siantar, Sumatera Utara 21146</span>
                  <a
                    href="https://maps.app.goo.gl/qNbykV8MpBhjCZo29"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-accent-orange/15 border border-accent-orange/30 text-accent-orange px-3.5 py-1 rounded-lg text-[10px] font-bold hover:bg-accent-orange hover:text-white transition-colors cursor-pointer mt-1"
                  >
                    <span>Buka Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 4. Footer */}
      <footer className="bg-primary-900 border-t border-primary-800 py-6 px-4 text-center mt-auto text-xs text-primary-350 font-bold space-y-2">
        <div className="text-white text-sm font-serif font-bold">UD ABANG ADIK</div>
        <div>WhatsApp: {settings.storeDetails.phone}</div>
        <div className="max-w-md mx-auto text-[11px] leading-relaxed">
          Alamat: {settings.storeDetails.address}
        </div>
        <div className="pt-4 text-[10px] text-primary-500 border-t border-primary-950 flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} UD ABANG ADIK.</span>
          <button
            onClick={() => setIsSecretModalOpen(true)}
            className="text-primary-800 hover:text-accent-orange transition-colors cursor-pointer text-[10px]"
            title="Portal Admin"
          >
            🔒
          </button>
        </div>
      </footer>

      {/* 5. Modal Ajukan Penawaran */}
      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        product={modalProduct}
      />

      {/* 6. Modal Akses Rahasia Admin */}
      <AdminSecretModal
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
        onSuccess={() => {
          setIsSecretModalOpen(false);
          setCurrentPage("admin-login");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

    </div>
  );
}

