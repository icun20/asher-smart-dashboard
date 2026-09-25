"use client";
import React from 'react';

export default function HSEDashboard() {
  return (
    <div className="p-6 pb-20 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">ASHER HSE Dashboard</h1>
          <p className="text-gray-400 text-sm">Health, Safety & Environment &mdash; Monitoring Panel</p>
        </div>
        <div className="bg-emerald-900/30 border border-emerald-800 text-emerald-400 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ✓ Semua Sistem Normal
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cerobong Emisi */}
        <div className="md:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">PEMANTAUAN EMISI CEROBONG &mdash; REAL-TIME</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-400 text-sm">PM2.5</span>
                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">✓ AMAN</span>
              </div>
              <div className="text-2xl font-bold text-white">12.4 <span className="text-sm font-normal text-gray-500">µg/m³</span></div>
              <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[25%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-400 text-sm">NO₂</span>
                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">✓ AMAN</span>
              </div>
              <div className="text-2xl font-bold text-white">0.018 <span className="text-sm font-normal text-gray-500">ppm</span></div>
              <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[18%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-400 text-sm">SO₂</span>
                <span className="text-amber-500 text-xs font-bold flex items-center gap-1">⚠ WASPADA</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">0.068 <span className="text-sm font-normal text-amber-500">ppm</span></div>
              <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[68%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-400 text-sm">CO</span>
                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">✓ AMAN</span>
              </div>
              <div className="text-2xl font-bold text-white">2.1 <span className="text-sm font-normal text-gray-500">ppm</span></div>
              <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[21%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Suhu Gauge */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 w-full text-left">SUHU RUANG PEMBAKARAN</h2>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 20 80 A 45 45 0 1 1 80 80" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
              <path d="M 20 80 A 45 45 0 1 1 80 80" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="40" className="gauge-ring" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <span className="text-3xl font-bold text-white">724°C</span>
              <span className="text-[10px] text-gray-400">Target: 650-900°C</span>
              <span className="text-xs text-emerald-500 font-bold mt-1 flex items-center gap-1">✓ OPTIMAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* AQI */}
      <div className="mt-6 bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">INDEKS KUALITAS UDARA (AQI) &mdash; SEKITAR MESIN</h2>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-emerald-400 mb-1">42</div>
          <div className="text-sm font-bold text-white mb-2">BAIK</div>
          <div className="text-xs text-gray-400 mb-6">Aman untuk operator tanpa masker</div>
          
          <div className="w-full max-w-3xl relative mt-4">
            {/* Marker */}
            <div className="absolute -top-4 w-3 h-3 bg-white rotate-45 transform -translate-x-1/2 z-10" style={{left: '21%'}}></div>
            <div className="absolute top-0 w-1 h-6 bg-white shadow-md z-10 transform -translate-x-1/2" style={{left: '21%'}}></div>
            
            <div className="w-full h-4 rounded-full overflow-hidden flex">
              <div className="h-full w-1/4 bg-emerald-500"></div>
              <div className="h-full w-1/4 bg-amber-400"></div>
              <div className="h-full w-1/4 bg-orange-500"></div>
              <div className="h-full w-1/4 bg-red-600"></div>
            </div>
            <div className="w-full flex justify-between text-[10px] text-gray-500 mt-2">
              <span>0</span><span>50</span><span>100</span><span>150</span><span>200+</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Safety Logs */}
      <div className="mt-6 bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">LOG INSIDEN KESELAMATAN (DIURUTKAN BERDASARKAN SEVERITY)</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-900/10 border border-red-900/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-red-500/20 text-red-500 font-bold">✖</div>
              <div>
                <div className="text-sm font-medium text-red-400">BAHAYA: Suhu Ekstrem Terdeteksi (940°C)</div>
                <div className="text-xs text-gray-500">Hari ini, 14:22 WIB &bull; Sistem otomatis mengurangi suplai oksigen</div>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-gray-800 text-gray-400 rounded border border-gray-700">✓ Resolved (14:25)</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-amber-900/10 border border-amber-900/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-amber-500/20 text-amber-500 font-bold">⚠</div>
              <div>
                <div className="text-sm font-medium text-amber-500">WASPADA: Kadar SO₂ Mendekati Batas (0.068 ppm)</div>
                <div className="text-xs text-gray-500">Hari ini, 09:15 WIB &bull; Filter basah diaktifkan ganda</div>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-amber-900/30 text-amber-500 rounded border border-amber-800 animate-pulse">Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}
