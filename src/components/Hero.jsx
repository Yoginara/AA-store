import React from "react";
import { ArrowRight, Sparkles, MessageSquareCode, HeartHandshake, ShieldCheck, BadgePercent, Hammer } from "lucide-react";
import { settings } from "../config/settings";

export default function Hero({ setSelectedCategory, setCurrentPage, setSelectedProductId }) {
  const categories = [
    {
      id: "sepatu",
      name: "Sepatu Premium",
      tagline: "Pantofel Kulit & Sneaker Sekolah",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
      count: "3 Produk Tersedia"
    },
    {
      id: "sandal",
      name: "Sandal Nyaman",
      tagline: "Selop Solo & Sandal Gunung Tangguh",
      image: "https://images.unsplash.com/photo-1603487988353-c8e4b3e9e30a?q=80&w=600&auto=format&fit=crop",
      count: "3 Produk Tersedia"
    },
    {
      id: "tas sekolah",
      name: "Tas Sekolah",
      tagline: "Kanvas Ransel Kuliah & Ransel Anak",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      count: "3 Produk Tersedia"
    }
  ];

  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    setSelectedProductId(null);
    setCurrentPage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 py-12 sm:py-16 md:py-20 lg:py-24 border-b border-primary-800 shadow-2xl">
      {/* Decorative neon light elements for dark style */}
      <div className="absolute top-0 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-orange/10 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 translate-x-1/2 rounded-full bg-accent-gold/5 blur-[120px]" />
      <div className="absolute top-0 right-0 left-0 bottom-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-primary-950/60 to-primary-950 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left max-w-2xl mx-auto lg:mx-0 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-xl bg-accent-orange/10 px-3.5 py-1.5 text-xs font-bold text-accent-orange tracking-wider uppercase border border-accent-orange/20 shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-accent-orange animate-pulse" />
              <span>Toko Tradisional Digital Modern</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] !margin-0">
              UD <span className="text-accent-gold text-glow-gold">{settings.storeName.split(" ").slice(1).join(" ")}</span>
            </h1>
            
            <p className="font-sans text-lg sm:text-xl font-bold text-primary-300">
              {settings.tagline}
            </p>

            <p className="text-sm sm:text-base text-primary-400 leading-relaxed">
              Selamat datang di <span className="font-semibold text-white">{settings.storeName}</span>! Kami menghadirkan sepatu kulit lokal, sandal kasual ergonomis, dan ransel sekolah berkualitas militer. Dapatkan harga terbaik dengan mengajukan tawar-menawar Anda secara <strong>langsung lewat WhatsApp</strong>, layaknya berbelanja seru di pasar tradisional Beringharjo!
            </p>

            {/* Step Bargain Process in Bahasa Indonesia */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              
              <div className="flex items-start gap-3 bg-primary-900/40 p-3 rounded-2xl border border-primary-800/80 shadow-inner">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-orange/10 text-accent-orange shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">1. Pilih Produk</h3>
                  <p className="text-[10px] text-primary-400">Jelajahi sepatu, sandal, atau tas sekolah.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-primary-900/40 p-3 rounded-2xl border border-primary-800/80 shadow-inner">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold/10 text-accent-gold shrink-0">
                  <Hammer className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">2. Ajukan Harga</h3>
                  <p className="text-[10px] text-primary-400">Gunakan Kalkulator Tawar untuk harga wajar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-primary-900/40 p-3 rounded-2xl border border-primary-800/80 shadow-inner">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-sage/10 text-accent-sage shrink-0">
                  <MessageSquareCode className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">3. Deal di WhatsApp</h3>
                  <p className="text-[10px] text-primary-400">Kirim tawaran Anda langsung ke ponsel kami.</p>
                </div>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-wrap gap-4 justify-start">
              <button
                onClick={() => handleCategoryClick("all")}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-orange px-8 py-4 text-xs font-bold text-white shadow-lg shadow-accent-orange/20 hover:bg-accent-orange-dark hover:scale-102 hover:shadow-accent-orange-dark/30 transition-all duration-300 cursor-pointer"
              >
                <span>Lihat Produk</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => {
                  setCurrentPage("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-8 py-4 text-xs font-bold text-primary-300 border border-primary-800 hover:bg-primary-850 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <span>Hubungi Kami</span>
              </button>
            </div>
          </div>

          {/* Hero Right Card Columns */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-4">
            <h2 className="font-serif text-sm font-bold text-primary-300 text-center lg:text-left mb-1 uppercase tracking-wider">
              Pilih Kategori untuk Mulai Belanja:
            </h2>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-primary-900 border border-primary-800 p-3 shadow-md hover:shadow-xl hover:border-accent-orange/40 hover:scale-[1.02] cursor-pointer transition-all duration-350"
                >
                  <div className="flex items-center gap-4">
                    {/* Small preview thumbnail */}
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-primary-800 bg-primary-950 shrink-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-primary-950/20 transition-opacity duration-300 group-hover:opacity-0" />
                    </div>
                    {/* Descriptions */}
                    <div className="text-left">
                      <h3 className="font-serif text-sm font-bold text-white group-hover:text-accent-gold transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-primary-400 font-semibold mt-0.5">
                        {cat.tagline}
                      </p>
                      <span className="text-[9px] text-accent-orange font-black tracking-widest uppercase mt-1.5 inline-block">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action arrow */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-950 border border-primary-800 text-primary-400 group-hover:bg-accent-orange/15 group-hover:text-accent-orange group-hover:border-accent-orange/30 transition-all duration-300 mr-2 shrink-0">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
