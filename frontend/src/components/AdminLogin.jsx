import React, { useState } from "react";
import { Store, ShieldAlert, KeyRound, User, ArrowLeft, Loader2 } from "lucide-react";
import { settings } from "../config/settings";

export default function AdminLogin({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password) {
      setError("Username dan Kata Sandi wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      // Hubungi Express API Server untuk otentikasi login
      const response = await fetch(`${settings.apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Berhasil login via server API
        onLoginSuccess(data.token, data.admin);
      } else {
        setError(data.message || "Gagal masuk. Periksa kembali kredensial Anda.");
      }
      console.warn("⚠️  [OFFLINE DETECTED] Express Server luring atau mati.");
      setError("Koneksi ke server gagal. Harap pastikan server aktif untuk bisa masuk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-950 px-4 py-12 relative overflow-hidden">
      
      {/* Glow decorative overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-accent-orange/5 blur-[120px]" />
      
      {/* Back to Beranda Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-900 border border-primary-800 px-4 py-2.5 text-xs font-bold text-primary-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Beranda</span>
      </button>

      {/* Login Card Container */}
      <div className="relative w-full max-w-md rounded-3xl bg-primary-900 border border-primary-800 p-8 shadow-2xl space-y-6 z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-orange text-white shadow-lg shadow-accent-orange/20">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-black text-white">
              UD <span className="text-accent-gold">ABANG ADIK</span>
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary-400">
              Portal Admin Masuk
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl bg-rose-950/30 border border-rose-900 p-3 text-xs text-rose-400 font-bold leading-normal">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs font-bold">
          
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-primary-300 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-accent-orange" />
              Nama Pengguna (Username)
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username admin..."
              className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-xs text-white placeholder-primary-600 focus:border-accent-orange focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-primary-300 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-accent-orange" />
              Kata Sandi (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi..."
              className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-xs text-white placeholder-primary-600 focus:border-accent-orange focus:outline-none"
              disabled={isLoading}
            />
          </div>



          {/* Submit Action CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-orange py-3.5 text-xs font-bold text-white shadow-lg shadow-accent-orange/15 hover:bg-accent-orange-dark transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk Portal Admin</span>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}
