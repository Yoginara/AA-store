import React, { useState, useEffect } from "react";
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCcw, Tag } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenOfferModal,
  onViewDetails
}) {
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState("default");
  const [isLoading, setIsLoading] = useState(false);

  // Simulasi pemuatan jaringan (latency buatan) demi estetika premium
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, maxPrice, sortBy]);

  // Atur ulang semua filter
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(500000);
    setSortBy("default");
  };

  // 1. Filter Kategori (dalam Bahasa Indonesia)
  let filtered = products.filter((p) => {
    if (selectedCategory === "all") return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // 2. Filter Pencarian Keyword
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // 3. Filter Harga Maksimal
  filtered = filtered.filter((p) => p.price <= maxPrice);

  // 4. Pengurutan Data
  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Format mata uang rupiah
  const formatPrice = (value) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Batas Atas Toolbar Filter */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-primary-900 pb-6 mb-8 text-left">
        
        {/* Deskripsi Kiri */}
        <div>
          <h2 className="font-serif text-2xl font-black tracking-tight text-white md:text-3xl">
            {selectedCategory === "all" ? "Koleksi Pajangan Kami" : `Kategori: ${selectedCategory}`}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-primary-400 font-semibold">
            Temukan sepatu, sandal, dan tas sekolah terbaik buatan pengrajin nusantara.
          </p>
        </div>

        {/* Kontrol Filter Kanan */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          
          {/* Slider Harga Maksimum */}
          <div className="space-y-1.5 sm:col-span-6 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-bold text-primary-200">
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-accent-orange" />
                Harga Maksimal
              </span>
              <span className="text-accent-gold font-extrabold">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="500000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-primary-900 accent-accent-orange border border-primary-850"
            />
          </div>

          {/* Urutan Dropdown */}
          <div className="space-y-1.5 sm:col-span-4 min-w-[150px]">
            <label className="text-xs font-bold text-primary-200 flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-accent-orange" />
              Urutkan
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-primary-800 bg-primary-900 px-3 py-2 text-xs font-semibold text-white focus:border-accent-orange focus:outline-none"
            >
              <option value="default">Rekomendasi</option>
              <option value="price-low">Harga: Terendah ke Tertinggi</option>
              <option value="price-high">Harga: Tertinggi ke Terendah</option>
              <option value="rating">Rating Terbaik</option>
            </select>
          </div>

          {/* Reset Filter Button */}
          <div className="sm:col-span-2">
            <button
              onClick={handleResetFilters}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary-800 bg-primary-900 hover:bg-primary-800 py-2.5 px-3 text-xs font-bold text-primary-300 transition-colors shadow-inner cursor-pointer"
              title="Atur Ulang Filter"
            >
              <RefreshCcw className="h-3.5 w-3.5 shrink-0" />
              <span className="sm:hidden lg:inline">Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* Grid Konten Utama */}
      {isLoading ? (
        
        /* 1. Loading Skeleton Premium Dark Mode */
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="flex flex-col overflow-hidden rounded-2xl bg-primary-900 border border-primary-850 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-square w-full rounded-xl bg-primary-950/60" />
              <div className="h-4 w-1/3 rounded bg-primary-950/60" />
              <div className="h-5 w-3/4 rounded bg-primary-950/60" />
              <div className="h-4 w-1/2 rounded bg-primary-950/60" />
              <div className="pt-3 border-t border-primary-850 flex gap-2">
                <div className="h-10 w-10 rounded-xl bg-primary-950/60" />
                <div className="h-10 flex-1 rounded-xl bg-primary-950/60" />
              </div>
            </div>
          ))}
        </div>

      ) : filtered.length === 0 ? (
        
        /* 2. Empty State dalam Bahasa Indonesia */
        <div className="rounded-3xl border border-dashed border-primary-800 bg-primary-900/40 p-12 text-center max-w-lg mx-auto shadow-lg my-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-orange/10 text-accent-orange mb-6 border border-accent-orange/20">
            <Filter className="h-8 w-8 text-accent-orange" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">
            Tidak Ada Produk yang Cocok
          </h3>
          <p className="mt-2.5 text-xs sm:text-sm text-primary-400 leading-relaxed font-semibold">
            Kami tidak dapat menemukan produk yang sesuai dengan kriteria pencarian Anda atau di bawah batas harga maksimum <span className="font-bold text-accent-orange">{formatPrice(maxPrice)}</span>. Sistem tawar-menawar tradisional sangat fleksibel, cobalah longgarkan filter Anda!
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-orange px-6 py-3 text-xs font-bold text-white shadow-md shadow-accent-orange/15 hover:bg-accent-orange-dark transition-all cursor-pointer animate-pulse"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Atur Ulang Semua Filter & Cari Kembali</span>
            </button>
          </div>
        </div>

      ) : (
        
        /* 3. Render Grid Produk */
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenOfferModal={onOpenOfferModal}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

      )}

    </div>
  );
}
