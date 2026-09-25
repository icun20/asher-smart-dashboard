"use client";
import React, { useState, useEffect } from 'react';

export default function ExecutiveDashboard() {
  const [carbonVal, setCarbonVal] = useState(0);
  const [creditVal, setCreditVal] = useState(0);
  const [wasteVal, setWasteVal] = useState(0);
  const [btn1, setBtn1] = useState('Export Laporan');

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
    <div className="p-6 pb-20 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">ASHER Smart Dashboard</h1>
          <p className="text-gray-400">Executive Overview &mdash; PT. Industri Nusantara</p>
        </div>
        
        {/* Date Filter & Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-md px-3 py-2">
            <span className="text-sm text-gray-400 mr-2">Periode:</span>
            <select className="bg-[#1e293b] text-white text-sm font-medium outline-none cursor-pointer">
              <option>September 2026</option>
              <option>Agustus 2026</option>
            </select>
          </div>
          <button 
            onClick={() => {
              setTimeout(() => window.print(), 500);
              const csvContent = `Periode,Carbon Credit (Ton),Estimasi Nilai (USD),Sampah Diproses (Ton),ESG Score\nSeptember 2026,1294,62759,2847,82`;
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'ASHER_Executive_Summary.csv';
              a.click();
              URL.revokeObjectURL(url);
              setBtn1('Telah Diunduh');
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
            {btn1}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CARBON CREDIT TERSIMPAN</h2>
          <div className="text-4xl font-bold text-emerald-400 mb-2">{carbonVal} <span className="text-sm font-normal text-gray-400">Ton CO₂e</span></div>
          <div className="text-xs text-gray-400 flex items-center gap-1"><span className="text-emerald-500">▲ +12.4%</span> dari bulan lalu</div>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ESTIMASI NILAI KREDIT KARBON</h2>
          <div className="text-4xl font-bold text-white mb-2"><span className="text-2xl text-emerald-500">$</span>{creditVal.toLocaleString()} <span className="text-sm font-normal text-gray-400">USD</span></div>
          <div className="text-xs text-gray-400">@ $48.50 / Ton CO₂e</div>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">SAMPAH DIPROSES (BULAN INI)</h2>
          <div className="text-4xl font-bold text-white mb-2">{wasteVal.toLocaleString()} <span className="text-sm font-normal text-gray-400">Ton</span></div>
          <div className="text-xs text-gray-400 flex items-center gap-1"><span className="text-blue-400">▲ +8.1%</span> dari bulan lalu</div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">TREN BULANAN: SAMPAH VS CO₂e SAVED</h2>
          <div className="flex justify-around items-end h-40 border-b border-[#334155] pb-2 px-4">
             {/* Dual Bar Representation */}
             <div className="flex gap-4">
               <div className="flex flex-col items-center gap-2">
                 <span className="text-xs text-gray-500">2.1k T</span>
                 <div className="w-8 bg-blue-500 rounded-t h-20"></div>
                 <span className="text-[10px] text-blue-400">Sampah</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <span className="text-xs text-gray-500">950 T</span>
                 <div className="w-8 bg-emerald-500 rounded-t h-16"></div>
                 <span className="text-[10px] text-emerald-400">CO₂e</span>
               </div>
             </div>
             
             <div className="flex gap-4">
               <div className="flex flex-col items-center gap-2">
                 <span className="text-xs text-gray-500">2.6k T</span>
                 <div className="w-8 bg-blue-500 rounded-t h-24"></div>
                 <span className="text-[10px] text-blue-400">Sampah</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <span className="text-xs text-gray-500">1.1k T</span>
                 <div className="w-8 bg-emerald-500 rounded-t h-20"></div>
                 <span className="text-[10px] text-emerald-400">CO₂e</span>
               </div>
             </div>
             
             <div className="flex gap-4">
               <div className="flex flex-col items-center gap-2">
                 <span className="text-xs text-gray-500">2.8k T</span>
                 <div className="w-8 bg-blue-500 rounded-t h-32"></div>
                 <span className="text-[10px] text-blue-400">Sampah</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <span className="text-xs text-gray-500">1.2k T</span>
                 <div className="w-8 bg-emerald-500 rounded-t h-28"></div>
                 <span className="text-[10px] text-emerald-400">CO₂e</span>
               </div>
             </div>
          </div>
          <div className="flex justify-around text-xs text-gray-400 mt-2">
            <span>Juli</span>
            <span>Agustus</span>
            <span>September</span>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 flex flex-col justify-center items-center">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 text-center">SKOR ESG PERUSAHAAN</h2>
          <div className="relative w-40 h-20 overflow-hidden mb-4">
             <div className="absolute w-40 h-40 rounded-full border-8 border-[#334155] border-t-emerald-500 border-l-emerald-500 transform rotate-45"></div>
             <div className="absolute inset-0 flex items-end justify-center pb-2">
               <span className="text-4xl font-bold text-white">82</span>
               <span className="text-sm text-gray-500 ml-1">/100</span>
             </div>
          </div>
          <div className="text-sm text-emerald-400 font-bold mb-4 flex items-center gap-1">✓ Kategori: Sangat Baik</div>
          <div className="w-full text-xs text-gray-400 mt-2 border-t border-gray-700 pt-4 px-2">
            <div className="flex justify-between mb-1">
              <span>Bulan Lalu:</span>
              <span className="text-white">79/100</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Target Tahunan:</span>
              <span className="text-white">85/100</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Rata-rata Industri:</span>
              <span className="text-white">65/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
