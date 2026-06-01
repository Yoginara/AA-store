import React, { useState, useEffect } from "react";
import { settings } from "../config/settings";

export default function OfferModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const isSizeRequired = product.category && (
    product.category.toLowerCase().startsWith("sepatu") || 
    product.category.toLowerCase().startsWith("sandal")
  );

  // State Hooks
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [offerPrice, setOfferPrice] = useState(product.price);
  const [error, setError] = useState("");

  // Setel ulang jika produk berganti
  useEffect(() => {
    if (product) {
      setOfferPrice(product.price);
      setSize("");
      setQuantity(1);
      setError("");
    }
  }, [product]);

  // Format mata uang rupiah
  const formatPrice = (value) => {
    return `${settings.currency.symbol} ${value.toLocaleString(settings.currency.locale)}`;
  };

  // Kirim penawaran via WhatsApp
  const handleSendOffer = (e) => {
    e.preventDefault();

    // Validasi input
    if (isSizeRequired && !size) {
      setError("Silakan pilih Ukuran terlebih dahulu.");
      return;
    }
    if (quantity < 1) {
      setError("Jumlah barang minimal adalah 1.");
      return;
    }
    if (offerPrice <= 0) {
      setError("Harga tawaran harus lebih dari Rp 0.");
      return;
    }

    setError("");

    const sizeDisplay = isSizeRequired ? size : "N/A";

    const msg = `Halo Pak,

Saya tertarik dengan produk berikut:

Nama Produk : ${product.name}
Ukuran      : ${sizeDisplay}
Jumlah      : ${quantity}
Harga Tawar : ${formatPrice(offerPrice)}

Apakah masih tersedia?`;

    // Encode string agar aman untuk URL WA
    const whatsappUrl = `https://wa.me/${settings.whatsappNumberClean}?text=${encodeURIComponent(msg)}`;
    
    // Buka tautan di tab baru
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80"
      />

      {/* Konten Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-primary-900 border border-primary-800 p-6 z-10 text-left shadow-2xl">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-primary-800 pb-3 mb-4">
          <h2 className="font-serif text-base sm:text-lg font-bold text-white">Ajukan Penawaran</h2>
          <button 
            onClick={onClose}
            className="text-primary-400 hover:text-white cursor-pointer text-xs font-bold"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSendOffer} className="space-y-4 text-xs font-bold text-left">
          
          {/* Info Produk Aktif */}
          <div className="bg-primary-950 p-3 rounded-lg border border-primary-800 text-xs">
            <span className="block text-primary-400 font-bold mb-0.5">Produk:</span>
            <span className="block text-white font-extrabold text-sm">{product.name}</span>
            <span className="block text-accent-gold mt-1">Harga Resmi: {formatPrice(product.price)}</span>
          </div>

          {/* Pilihan Ukuran (Hanya untuk Sepatu / Sandal) */}
          {isSizeRequired ? (
            <div className="space-y-1">
              <label className="text-primary-350">Ukuran</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-lg border border-primary-800 bg-primary-950 px-3 py-2 text-xs font-bold text-white focus:border-accent-orange focus:outline-none"
              >
                <option value="">-- Pilih Ukuran --</option>
                {product.sizes && product.sizes.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {/* Jumlah */}
          <div className="space-y-1">
            <label className="text-primary-350">Jumlah</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full rounded-lg border border-primary-800 bg-primary-950 px-3 py-2 text-xs font-bold text-white focus:border-accent-orange focus:outline-none"
            />
          </div>

          {/* Harga Penawaran */}
          <div className="space-y-1">
            <label className="text-primary-350">Harga Tawaran (Per Barang)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 font-extrabold">
                Rp
              </span>
              <input
                type="number"
                value={offerPrice || ""}
                onChange={(e) => setOfferPrice(parseInt(e.target.value) || 0)}
                placeholder="Masukkan harga tawar Anda..."
                className="w-full rounded-lg border border-primary-800 bg-primary-950 py-2 pl-9 pr-3 text-xs font-bold text-white focus:border-accent-orange focus:outline-none"
              />
            </div>
          </div>

          {/* Pesan Kesalahan */}
          {error && (
            <div className="rounded-lg bg-rose-950/20 border border-rose-900 p-2.5 text-center text-xs font-bold text-rose-400">
              {error}
            </div>
          )}

          {/* Tombol Kirim Penawaran */}
          <button
            type="submit"
            className="w-full flex items-center justify-center rounded-lg bg-accent-orange py-3 text-xs font-bold text-white hover:bg-accent-orange-dark cursor-pointer transition-colors"
          >
            Kirim Penawaran ke WhatsApp
          </button>

        </form>
      </div>
    </div>
  );
}

