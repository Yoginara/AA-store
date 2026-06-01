import React from "react";
import { Sparkles, AlertCircle, Compass, Laugh } from "lucide-react";

export default function BargainMeter({ standardPrice, offerPrice }) {
  if (!standardPrice || !offerPrice || offerPrice <= 0) return null;

  // Hitung persentase potongan harga yang diminta pembeli
  const discountPercent = ((standardPrice - offerPrice) / standardPrice) * 100;
  
  let rating = {
    status: "Penawaran Sangat Dermawan",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    barColor: "bg-emerald-500",
    width: "100%",
    icon: Sparkles,
    advice: "Anda menawarkan harga standar retail atau bahkan lebih tinggi. Penjual pasti langsung setuju dengan senyuman lebar!"
  };

  if (discountPercent > 0 && discountPercent <= 10) {
    rating = {
      status: "Penawaran Sangat Wajar",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      barColor: "bg-emerald-500",
      width: `${100 - discountPercent}%`,
      icon: Sparkles,
      advice: "Tawaran yang sangat masuk akal! Peluang besar disetujui langsung pada obrolan pertama. Keseimbangan yang pas."
    };
  } else if (discountPercent > 10 && discountPercent <= 25) {
    rating = {
      status: "Tawaran Bersahabat",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      barColor: "bg-amber-500",
      width: `${100 - discountPercent}%`,
      icon: Compass,
      advice: "Gaya tawar-menawar pasar tradisional klasik! Penjual mungkin akan menawar sedikit, tapi Anda berada di zona aman."
    };
  } else if (discountPercent > 25 && discountPercent <= 40) {
    rating = {
      status: "Tawaran Sengit!",
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      barColor: "bg-orange-500",
      width: `${100 - discountPercent}%`,
      icon: AlertCircle,
      advice: "Penawaran yang cukup berani! Penjual akan berpikir dua kali, atau meminta Anda menaikkan sedikit. Bersiaplah untuk merayu!"
    };
  } else if (discountPercent > 40) {
    rating = {
      status: "Tawaran Sadis! ⚠️",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      barColor: "bg-rose-500",
      width: `${Math.max(10, 100 - discountPercent)}%`,
      icon: Laugh,
      advice: "Wah, sadis sekali tawaran ini! Ini potongan harga yang sangat besar. Penjual mungkin akan geleng-geleng kepala. Coba naikkan sedikit agar tawaran Anda diterima!"
    };
  }

  const IconComponent = rating.icon;

  return (
    <div className="space-y-3 bg-primary-900/60 p-4 rounded-2xl border border-primary-800 shadow-inner">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-400">
          Penilaian Tawaran
        </span>
        <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-[11px] font-bold border ${rating.color}`}>
          <IconComponent className="h-3.5 w-3.5 shrink-0" />
          <span>{rating.status}</span>
        </div>
      </div>

      {/* Bar visual meter */}
      <div className="relative h-2 w-full rounded-full bg-primary-950 overflow-hidden border border-primary-850">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${rating.barColor}`} 
          style={{ width: rating.width }}
        />
      </div>

      {/* Legend label */}
      <div className="flex justify-between text-[9px] font-bold text-primary-500 px-0.5">
        <span>Sadis</span>
        <span>Sengit</span>
        <span>Wajar</span>
        <span>Retail</span>
      </div>

      {/* Catatan penjual */}
      <p className="text-[11px] font-medium text-primary-300 leading-relaxed italic bg-primary-950/80 rounded-xl p-2.5 border border-primary-800">
        💡 <strong>Catatan Penjual:</strong> "{rating.advice}"
      </p>
    </div>
  );
}
