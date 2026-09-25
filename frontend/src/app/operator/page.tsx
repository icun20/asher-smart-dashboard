"use client";
import React from 'react';

export default function OperatorDashboard() {
  return (
    <div className="p-6 pb-20 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">ASHER Operator Panel</h1>
          <p className="text-gray-400 text-sm">Predictive Maintenance & AI Vision Control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#334155] flex justify-between items-center">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI CAMERA FEED (SORTIR SAMPAH)</h2>
            <span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> LIVE ⏺
            </span>
          </div>
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '100% 4px'}}></div>
             <div className="absolute w-full h-1 bg-blue-500/50 scan-line shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
             
             {/* Bounding boxes */}
             <div className="absolute border-2 border-emerald-500 w-32 h-24 top-20 left-10 flex flex-col">
               <span className="bg-emerald-500 text-black text-[10px] font-bold px-1 self-start">Organik 98%</span>
             </div>
             <div className="absolute border-2 border-amber-500 w-24 h-24 bottom-10 right-20 flex flex-col">
               <span className="bg-amber-500 text-black text-[10px] font-bold px-1 self-start">Plastik 92%</span>
             </div>
          </div>
          <div className="p-4 grid grid-cols-4 gap-2 text-center border-t border-[#334155] bg-gray-900/50">
             <div><div className="text-xs text-gray-500">Organik</div><div className="text-sm font-bold text-emerald-400">62%</div></div>
             <div><div className="text-xs text-gray-500">Plastik</div><div className="text-sm font-bold text-amber-400">28%</div></div>
             <div><div className="text-xs text-gray-500">Kertas</div><div className="text-sm font-bold text-blue-400">8%</div></div>
             <div><div className="text-xs text-gray-500">Logam</div><div className="text-sm font-bold text-gray-400">2%</div></div>
          </div>
        </div>

        {/* Predictive Maintenance */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">PREDICTIVE MAINTENANCE AI</h2>
          
          <div className="space-y-6">
            <div className="p-4 bg-amber-900/10 border border-amber-900/30 rounded-lg">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-white flex items-center gap-2">⚠ Ganti Kipas Blower</span>
                <span className="text-sm font-bold text-amber-500">Sisa: 12 Hari</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-amber-500 h-full w-[15%]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Indikasi: Anomali getaran bearing</span>
                <span className="text-amber-400">Akurasi Prediksi AI: 94%</span>
              </div>
            </div>

            <div className="p-4 border border-[#334155] rounded-lg">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-white flex items-center gap-2">✓ Bersihkan Ruang Plasma</span>
                <span className="text-sm font-bold text-emerald-500">Sisa: 24 Hari</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-emerald-500 h-full w-[40%]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Indikasi: Tumpukan abu sensor optik</span>
                <span>Akurasi Prediksi AI: 88%</span>
              </div>
            </div>

            <div className="p-4 border border-[#334155] rounded-lg">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-white flex items-center gap-2">✓ Ganti Filter Emisi Cerobong</span>
                <span className="text-sm font-bold text-emerald-500">Sisa: 34 Hari</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-emerald-500 h-full w-[60%]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Indikasi: Tren partikulat PM2.5</span>
                <span>Akurasi Prediksi AI: 96%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
