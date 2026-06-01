import React from "react";
import { Store, Phone, Mail, Clock, MapPin, Heart, MessageSquare } from "lucide-react";
import { settings } from "../config/settings";

export default function Footer({ setSelectedCategory, setCurrentPage, setSelectedProductId }) {
  
  const handleNavClick = (pageId, catId = "all") => {
    setSelectedCategory(catId);
    setSelectedProductId(null);
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary-950 text-primary-350 border-t-2 border-accent-orange mt-auto shadow-2xl">
      
      {/* Banner Atas: Tombol Chat Cepat */}
      <div className="bg-primary-900/40 border-b border-primary-900/60 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-orange text-white shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-white">Ada pertanyaan atau permintaan khusus?</h3>
              <p className="text-xs text-primary-400">Silakan kirim pesan ke WhatsApp kami untuk berkonsultasi mengenai produk, ukuran, atau harga.</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${settings.whatsappNumberClean}?text=${encodeURIComponent("Halo UD Abang Adik, saya ingin bertanya hal umum tentang produk toko Anda.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-accent-orange px-5 py-2.5 text-xs font-bold text-white hover:bg-accent-orange-dark shadow-md shadow-accent-orange/15 transition-all shrink-0"
          >
            Tanya Hal Umum
          </a>
        </div>
      </div>

      {/* Konten Footer Utama */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          
          {/* Kolom 1: Profil Toko Tradisional (6/12) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-orange text-white">
                <Store className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-black text-white tracking-tight">
                UD <span className="text-accent-gold">ABANG ADIK</span>
              </span>
            </div>
            <p className="text-xs text-primary-400 leading-relaxed font-semibold">
              Menyediakan sepatu kulit lokal Cibaduyut, sandal selop nyaman khas Solo, dan ransel sekolah berkualitas kuat di Pasar Beringharjo sejak tahun {settings.storeDetails.established}. Menjaga warisan budaya tawar-menawar pasar tradisional Indonesia secara online.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[9px] uppercase tracking-widest text-accent-gold font-bold">
                ✓ 100% Bahan Asli & Garansi Jahitan
              </span>
            </div>
          </div>

          {/* Kolom 2: Informasi Kontak (6/12) */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-accent-orange pl-2.5">
              Alamat & Kontak Toko
            </h3>
            <ul className="space-y-3 text-xs text-primary-400 font-semibold">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent-orange shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings.storeDetails.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent-orange shrink-0" />
                <span>WhatsApp: {settings.storeDetails.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-accent-orange shrink-0" />
                <span>Jam Buka: {settings.storeDetails.hours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent-orange shrink-0" />
                <span>Surel: {settings.storeDetails.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Garis Bawah Hak Cipta */}
        <div className="mt-12 pt-8 border-t border-primary-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-primary-500 font-bold">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} UD ABANG ADIK. Semua Hak Dilindungi.</span>
            <button
              onClick={() => {
                const code = window.prompt("Masukkan kode akses rahasia:");
                if (code === "123456") {
                  handleNavClick("admin-login");
                } else if (code !== null) {
                  alert("Akses Ditolak! Kode salah.");
                }
              }}
              className="text-primary-800 hover:text-accent-orange transition-colors cursor-pointer text-xs"
              title="Portal Admin"
            >
              🔒
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            Dibuat penuh <Heart className="h-3 w-3 text-accent-orange fill-accent-orange" /> untuk kemajuan pengrajin pasar tradisional.
          </div>
        </div>

      </div>
    </footer>
  );
}
