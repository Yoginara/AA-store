import React, { useState } from "react";
import { ArrowLeft, Star, MessageSquareCode, ShieldCheck, Truck, Sparkles, Check, Info } from "lucide-react";
import { settings } from "../config/settings";

export default function ProductDetail({ product, onBack, onOpenOfferModal }) {
  if (!product) return null;

  // State gambar aktif
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const isSizeRequired = product.category === "sepatu" || product.category === "sandal";

  // Format mata uang rupiah
  const formatPrice = (value) => {
    return `${settings.currency.symbol} ${value.toLocaleString(settings.currency.locale)}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left">
      
      {/* Tombol Kembali */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-900 border border-primary-800 py-2.5 px-4 text-xs font-bold text-primary-300 shadow-md hover:bg-primary-850 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Koleksi</span>
        </button>
      </div>

      {/* Grid Rincian Produk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-primary-900 border border-primary-800 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-xl">
        
        {/* Kolom Kiri: Galeri Gambar (6/12) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Gambar Besar Preview */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-primary-800 bg-primary-950">
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-300"
              loading="eager"
            />
            {product.isBestSeller && (
              <span className="absolute left-4 top-4 rounded-lg bg-accent-gold px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-md">
                🔥 Paling Laris
              </span>
            )}
          </div>

          {/* Switcher Thumbnail */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, idx) => {
              const isActive = img === activeImage;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square h-16 w-16 overflow-hidden rounded-xl border shrink-0 transition-all ${
                    isActive
                      ? "border-accent-orange ring-2 ring-accent-orange/20 scale-102"
                      : "border-primary-800 hover:border-primary-750"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} galeri ${idx + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              );
            })}
          </div>

        </div>

        {/* Kolom Kanan: Rincian & Aksi (6/12) */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Tag Kategori & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary-800 pb-3">
              <span className="rounded-lg bg-black/60 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary-300 border border-primary-850">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 rounded-lg bg-accent-gold/10 px-3 py-1 text-xs font-bold text-accent-gold border border-accent-gold/20">
                <Star className="h-3.5 w-3.5 fill-accent-gold text-accent-gold" />
                <span>{product.rating}</span>
                <span className="text-primary-400 font-semibold text-[10px]">
                  ({product.reviewsCount} Ulasan)
                </span>
              </div>
            </div>

            {/* Nama Produk */}
            <div>
              <span className="text-[10px] font-extrabold text-accent-orange uppercase tracking-widest">
                Kerajinan Nusantara • Asal {product.specs.origin.split(",")[0]}
              </span>
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug mt-1">
                {product.name}
              </h1>
            </div>

            {/* Harga Produk */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-accent-gold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-primary-450 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>



            {/* Ukuran (Khusus Sepatu & Sandal) */}
            {isSizeRequired && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-primary-200 uppercase tracking-wider">
                  Ukuran Kaki Tersedia:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((sz) => (
                    <span
                      key={sz}
                      className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-primary-950 border border-primary-800 px-2 text-xs font-bold text-white shadow-inner"
                    >
                      {sz}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-primary-400 flex items-center gap-1 font-semibold">
                  <Info className="h-3 w-3 shrink-0 text-accent-orange" />
                  Anda dapat memilih spesifik ukuran saat mengisi form penawaran tawar harga.
                </p>
              </div>
            )}

            {/* Tabel Spesifikasi dalam Bahasa Indonesia */}
            <div className="rounded-2xl border border-primary-800 bg-primary-950/40 p-4 space-y-2 text-xs text-primary-300">
              <h3 className="font-bold text-white uppercase tracking-wider mb-2">
                Spesifikasi Detail Produk
              </h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="font-bold text-primary-500">Bahan Material:</div>
                <div className="font-semibold text-white">{product.specs.material}</div>
                
                {product.category === "tas sekolah" ? (
                  <>
                    <div className="font-bold text-primary-500">Kapasitas Tas:</div>
                    <div className="font-semibold text-white">{product.specs.capacity}</div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-primary-500">Sol Luar (Outsole):</div>
                    <div className="font-semibold text-white">{product.specs.sole}</div>
                  </>
                )}
                
                <div className="font-bold text-primary-500">Berat Bersih:</div>
                <div className="font-semibold text-white">{product.specs.weight}</div>
                
                <div className="font-bold text-primary-500">Daerah Asal:</div>
                <div className="font-semibold text-white">{product.specs.origin}</div>
              </div>
            </div>

          </div>

          {/* Widget Aksi Penawaran Tawar Harga */}
          <div className="rounded-3xl border border-accent-orange/20 bg-accent-orange/5 p-4 sm:p-5 space-y-4">
            
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-orange text-white shrink-0 shadow-md shadow-accent-orange/15">
                <MessageSquareCode className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-serif text-sm font-bold text-white">
                  Siap Menawar Produk Ini?
                </h3>
                <p className="text-[11px] text-primary-300 leading-normal font-semibold">
                  Tawar harga langsung sesuai budget belanja Anda! Kami melayani tawar-menawar santai demi mencapai kesepakatan harga terbaik melalui WhatsApp.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenOfferModal(product)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-orange py-3.5 text-xs font-bold text-white shadow-lg shadow-accent-orange/15 hover:bg-accent-orange-dark hover:scale-101 transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 animate-pulse text-accent-gold" />
              <span>Ajukan Penawaran</span>
            </button>

            {/* Jaminan Layanan */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 border-t border-primary-850 text-[10px] font-bold text-primary-400">
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-accent-sage" /> Jaminan Bahan Asli
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-accent-sage" /> Respon Cepat WA
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-accent-sage" /> Kirim Seluruh Indonesia
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
