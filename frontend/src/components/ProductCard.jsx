import React from "react";
import { settings } from "../config/settings";

export default function ProductCard({ product, onOpenOfferModal }) {
  // Format mata uang rupiah
  const formatPrice = (value) => {
    return `${settings.currency.symbol} ${value.toLocaleString(settings.currency.locale)}`;
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-primary-900 border border-primary-800 p-3">
      
      {/* Gambar Produk */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-primary-950">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Rincian Produk */}
      <div className="flex flex-1 flex-col pt-3 text-left">
        
        {/* Nama Produk */}
        <h3 className="font-serif text-sm font-bold text-white line-clamp-1">
          {product.name}
        </h3>

        {/* Harga */}
        <div className="mt-1 flex items-baseline">
          <span className="text-sm font-extrabold text-accent-gold">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Tombol Ajukan Penawaran */}
        <div className="mt-3">
          <button
            onClick={() => onOpenOfferModal(product)}
            className="w-full inline-flex h-9 items-center justify-center rounded-lg bg-accent-orange text-white font-bold text-xs hover:bg-accent-orange-dark cursor-pointer shadow-sm"
          >
            <span>Ajukan Penawaran</span>
          </button>
        </div>

      </div>

    </div>
  );
}

