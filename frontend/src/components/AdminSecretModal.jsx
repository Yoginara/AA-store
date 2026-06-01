import React, { useState } from "react";
import { Lock, X, KeyRound, AlertCircle } from "lucide-react";

export default function AdminSecretModal({ isOpen, onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mengambil kode dari Environment Variable (.env) agar tidak terlihat di GitHub
    const correctCode = import.meta.env.VITE_ADMIN_SECRET_CODE;
    
    if (code === correctCode) {
      setError("");
      setCode("");
      onSuccess();
    } else {
      setError("Kode akses salah. Silakan coba lagi.");
      setCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />
      <div className="relative w-full max-w-sm rounded-3xl bg-primary-900 border border-primary-800 p-6 z-10 shadow-2xl text-left overflow-hidden">
        
        {/* Dekorasi Glow */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent-orange/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-950 border border-primary-800 text-accent-orange shadow-inner">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-black text-white leading-none">Keamanan Ganda</h2>
              <p className="text-[10px] font-bold text-primary-400 mt-1 uppercase tracking-wider">Otentikasi Rahasia</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-primary-950 border border-primary-800 text-primary-400 hover:text-white hover:bg-rose-950/30 hover:border-rose-900/40 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-950/20 border border-rose-900/50 p-3 text-[11px] font-bold text-rose-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary-300 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-accent-orange" />
              Masukkan Kode Akses
            </label>
            <input
              type="password"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••"
              autoFocus
              className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-sm font-bold text-white placeholder-primary-600 focus:border-accent-orange focus:outline-none focus:ring-1 focus:ring-accent-orange/50 transition-all text-center tracking-[0.5em]"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent-orange py-3 text-xs font-bold text-white shadow-lg shadow-accent-orange/15 hover:bg-accent-orange-dark transition-all cursor-pointer"
          >
            <span>Buka Kunci Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
}
