"use client";
import React, { useState, useEffect } from 'react';

export default function ExecutiveDashboard() {

  const [carbonVal, setCarbonVal] = useState(0);
  const [creditVal, setCreditVal] = useState(0);
  const [wasteVal, setWasteVal] = useState(0);

  useEffect(() => {
    const animate = (target: number, setter: Function, duration: number) => {
      let start = 0;
      const startTime = performance.now();
      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setter(Math.round(start + (target - start) * eased));
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };
    setTimeout(() => animate(1294, setCarbonVal, 2000), 300);
    setTimeout(() => animate(62759, setCreditVal, 2000), 500);
    setTimeout(() => animate(2847, setWasteVal, 2000), 400);
  }, []);

  return (
    <div className="p-4 pb-20">
      <div className="max-w-6xl mx-auto mb-4"><a href="/" className="text-emerald-500 text-sm hover:underline">&larr; Kembali ke Menu Utama</a></div>
      

  {/* Header */}
  <div className="max-w-6xl mx-auto mb-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">A</div>
          <h1 className="text-2xl font-bold">ASHER Smart Dashboard</h1>
        </div>
        <p className="text-[var(--muted-foreground)] text-sm ml-[52px]">Executive Overview — PT. Industri Nusantara</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Live</span>
        <span className="ml-2">25 Sep 2026, 18:50 WIB</span>
      </div>
    </div>
  </div>

  {/* KPI Cards Row */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

    {/* Carbon Credit Saved */}
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-1">Carbon Credit Tersimpan</p>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-emerald-500" >{carbonVal}</span>
        <span className="text-sm text-[var(--muted-foreground)] mb-1">Ton CO₂e</span>
      </div>
      <p className="text-xs text-emerald-500 mt-2">▲ +12.4% dari bulan lalu</p>
    </div>

    {/* Carbon Credit Value */}
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-1">Estimasi Nilai Kredit Karbon</p>
      <div className="flex items-end gap-1">
        <span className="text-sm text-[var(--muted-foreground)] mb-1">$</span>
        <span className="text-3xl font-bold" >{creditVal.toLocaleString()}</span>
        <span className="text-sm text-[var(--muted-foreground)] mb-1">USD</span>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] mt-2">@ $48.50 / Ton CO₂e</p>
    </div>

    {/* Waste Processed */}
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-1">Sampah Diproses (Bulan Ini)</p>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold" >{wasteVal.toLocaleString()}</span>
        <span className="text-sm text-[var(--muted-foreground)] mb-1">Ton</span>
      </div>
      <p className="text-xs text-blue-400 mt-2">▲ +8.1% dari bulan lalu</p>
    </div>

    {/* Waste Reduction */}
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-1">Reduksi Volume Sampah</p>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-emerald-500">96.2</span>
        <span className="text-sm text-[var(--muted-foreground)] mb-1">%</span>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] mt-2">Hanya 3.8% tersisa sebagai abu</p>
    </div>
  </div>

  {/* Main Content Row */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

    {/* ESG Gauge */}
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm flex flex-col items-center">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-4 self-start">Skor ESG Perusahaan</p>
      <svg width="180" height="110" viewBox="0 0 180 110">
        {/* Background arc */}
        <path d="M 20 100 A 70 70 0 0 1 160 100" fill="none" stroke="var(--border)" strokeWidth="14" strokeLinecap="round"/>
        {/* Score arc */}
        <path d="M 20 100 A 70 70 0 0 1 160 100" fill="none" stroke="#10b981" strokeWidth="14" strokeLinecap="round"
              strokeDasharray="220" strokeDashoffset="44" className="gauge-ring" id="esgArc"/>
        {/* Score text */}
        <text x="90" y="85" textAnchor="middle" fill="var(--foreground)" fontSize="32" fontWeight="bold">82</text>
        <text x="90" y="103" textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">/100</text>
      </svg>
      <div className="grid grid-cols-3 gap-3 w-full mt-4 text-center">
        <div>
          <p className="text-lg font-bold text-emerald-500">A</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">Environment</p>
        </div>
        <div>
          <p className="text-lg font-bold text-blue-400">B+</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">Social</p>
        </div>
        <div>
          <p className="text-lg font-bold text-amber-400">B</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">Governance</p>
        </div>
      </div>
    </div>

    {/* Monthly Trend Chart */}
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm col-span-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider">Tren Bulanan — Sampah Diproses vs Carbon Credit</p>
        <div className="flex gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span> Sampah (Ton)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> CO₂e Saved</span>
        </div>
      </div>
      <div className="flex items-end gap-2 h-48">
        {/* Chart bars */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-40">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "55%", animationDelay: "0.1s" }}></div>
            <div className="flex-1 bg-emerald-500/80 rounded-t bar-animate" style={{ height: "40%", animationDelay: "0.15s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Apr</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-40">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "60%", animationDelay: "0.2s" }}></div>
            <div className="flex-1 bg-emerald-500/80 rounded-t bar-animate" style={{ height: "45%", animationDelay: "0.25s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Mei</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-40">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "65%", animationDelay: "0.3s" }}></div>
            <div className="flex-1 bg-emerald-500/80 rounded-t bar-animate" style={{ height: "50%", animationDelay: "0.35s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Jun</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-40">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "58%", animationDelay: "0.4s" }}></div>
            <div className="flex-1 bg-emerald-500/80 rounded-t bar-animate" style={{ height: "48%", animationDelay: "0.45s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Jul</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-40">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "75%", animationDelay: "0.5s" }}></div>
            <div className="flex-1 bg-emerald-500/80 rounded-t bar-animate" style={{ height: "60%", animationDelay: "0.55s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Agu</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-40">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "82%", animationDelay: "0.6s" }}></div>
            <div className="flex-1 bg-emerald-500/80 rounded-t bar-animate" style={{ height: "68%", animationDelay: "0.65s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Sep</span>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom Row */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Carbon Breakdown */}
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-4">Rincian Penghematan Karbon (September)</p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Emisi Metana TPA yang Dihindari</span>
            <span className="font-semibold text-emerald-500">842 tCO₂e</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-emerald-500" style={{ width: "65%" }}></div></div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Emisi Transportasi Truk yang Dihindari</span>
            <span className="font-semibold text-blue-400">284 tCO₂e</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-blue-400" style={{ width: "22%" }}></div></div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Energi Terbarukan (Solar Panel)</span>
            <span className="font-semibold text-amber-400">168 tCO₂e</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-amber-400" style={{ width: "13%" }}></div></div>
        </div>
        <div className="border-t border-[var(--border)] pt-2 mt-3 flex justify-between font-semibold">
          <span>Total Penghematan</span>
          <span className="text-emerald-500">1,294 tCO₂e</span>
        </div>
      </div>
    </div>

    {/* Eksum Generator */}
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-4">Generator Ringkasan Eksekutif (Eksum)</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="text-2xl">📄</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Laporan Eksum — September 2026</p>
            <p className="text-xs text-[var(--muted-foreground)]">Auto-generated • 1 halaman • PDF</p>
          </div>
          <button  className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors">Unduh</button>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="text-2xl">📊</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Laporan ESG Triwulan — Q3 2026</p>
            <p className="text-xs text-[var(--muted-foreground)]">Auto-generated • 12 halaman • PDF</p>
          </div>
          <button  className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors">Unduh</button>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="text-2xl">🌿</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Sertifikat Carbon Credit — Sep 2026</p>
            <p className="text-xs text-[var(--muted-foreground)]">Verified by Verra VCS • PDF</p>
          </div>
          <button  className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors">Unduh</button>
        </div>
      </div>
    </div>
  </div>

  

    </div>
  );
}
