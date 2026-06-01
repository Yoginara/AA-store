import React, { useState } from "react";
import { Search, Menu, X, Store, PhoneCall } from "lucide-react";
import { settings } from "../config/settings";

export default function Navbar({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
  setSelectedProductId
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Categories list in Bahasa Indonesia
  const categories = [
    { id: "all", name: "Semua Produk" },
    { id: "sepatu", name: "Sepatu" },
    { id: "sandal", name: "Sandal" },
    { id: "tas sekolah", name: "Tas Sekolah" }
  ];

  const handleNavClick = (pageId, catId = "all") => {
    setSelectedCategory(catId);
    setSelectedProductId(null);
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedProductId(null);
    setCurrentPage("products");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary-950/80 backdrop-blur-md border-b border-primary-800/60 shadow-lg shadow-black/30 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Brand UD ABANG ADIK */}
          <div 
            onClick={() => handleNavClick("home")}
            className="flex cursor-pointer items-center gap-2.5 transition-transform duration-300 hover:scale-105 shrink-0"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-orange text-white shadow-md shadow-accent-orange/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-serif text-lg font-black tracking-tight text-white md:text-xl">
                UD <span className="text-accent-gold">ABANG ADIK</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-primary-350 font-bold leading-none mt-0.5">
                Kualitas Bintang Lima, Harga Kaki Lima
              </span>
            </div>
          </div>

          {/* Search Bar - Bahasa Indonesia */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative flex-1 max-w-md"
          >
            <input
              type="text"
              placeholder="Cari sepatu, sandal, tas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-primary-800 bg-primary-900/50 py-2.5 pl-11 pr-4 text-xs font-semibold text-primary-50 placeholder-primary-500 shadow-inner transition-all focus:border-accent-orange focus:bg-primary-900 focus:outline-none focus:ring-1 focus:ring-accent-orange/30"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-accent-orange hover:text-accent-gold transition-colors"
              >
                BERSIHKAN
              </button>
            )}
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => handleNavClick("home")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-primary-300 hover:text-white transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick("products")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-primary-300 hover:text-white transition-colors cursor-pointer"
            >
              Produk
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-primary-300 hover:text-white transition-colors cursor-pointer"
            >
              Kontak
            </button>
          </div>

          {/* Right WhatsApp Support Action */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/${settings.whatsappNumberClean}?text=${encodeURIComponent("Halo UD Abang Adik, saya ingin bertanya tentang produk Anda.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-accent-orange/10 px-4 py-2.5 text-xs font-bold text-accent-orange hover:bg-accent-orange hover:text-white transition-all duration-300 border border-accent-orange/20 shadow-sm"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Tanya Penjual</span>
            </a>

            {/* Hamburger Toggle menu for Mobile Devices */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-primary-900 border border-primary-800 text-primary-300 hover:bg-primary-800 focus:outline-none lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Slide-out Drawer mobile menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-20 bg-primary-950/98 border-b border-primary-900 shadow-2xl transition-all duration-350 origin-top overflow-hidden z-40 ${
          isMobileMenuOpen ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Cari sepatu, sandal, tas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-primary-800 bg-primary-900 py-2.5 pl-11 pr-4 text-xs font-semibold text-primary-50 focus:border-accent-orange focus:outline-none"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
          </form>

          {/* Navigation Links in Indonesian */}
          <div className="space-y-1 pb-3 border-b border-primary-900">
            <p className="px-3 text-[9px] font-bold uppercase tracking-wider text-primary-500">Navigasi Utama</p>
            <button
              onClick={() => handleNavClick("home")}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-primary-300 hover:bg-primary-900 hover:text-white transition-all cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick("products")}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-primary-300 hover:bg-primary-900 hover:text-white transition-all cursor-pointer"
            >
              Produk
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-primary-300 hover:bg-primary-900 hover:text-white transition-all cursor-pointer"
            >
              Kontak
            </button>
          </div>

          {/* Quick Categories Filter links */}
          <div className="space-y-1">
            <p className="px-3 text-[9px] font-bold uppercase tracking-wider text-primary-500">Kategori Produk</p>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick("products", cat.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-accent-orange/15 text-accent-orange font-bold border-l-2 border-accent-orange pl-3.5"
                      : "text-primary-400 hover:bg-primary-900 hover:text-white"
                  }`}
                >
                  <span>{cat.name}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={`https://wa.me/${settings.whatsappNumberClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-orange py-3.5 text-xs font-bold text-white shadow-md shadow-accent-orange/15 hover:bg-accent-orange-dark transition-all"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Hubungi Kami di WhatsApp</span>
            </a>
            <div className="text-center text-[10px] text-primary-500 font-medium py-1">
              Jam Buka: {settings.storeDetails.hours}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
