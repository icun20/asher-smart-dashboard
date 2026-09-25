"use client";
import React, { useState, useEffect } from 'react';

export default function HSEDashboard() {

  return (
    <div className="p-4 pb-20">
      <div className="max-w-6xl mx-auto mb-4"><a href="/" className="text-emerald-500 text-sm hover:underline">&larr; Kembali ke Menu Utama</a></div>
      

  <!-- Header -->
  <div className="max-w-6xl mx-auto mb-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">A</div>
          <h1 className="text-2xl font-bold">ASHER HSE Dashboard</h1>
        </div>
        <p className="text-[var(--muted-foreground)] text-sm ml-[52px]">Health, Safety & Environment — Monitoring Panel</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Semua Sistem Normal</span>
      </div>
    </div>
  </div>

  <!-- Emission Compliance Cards -->
  <div className="max-w-6xl mx-auto mb-6">
    <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-3">Pemantauan Emisi Cerobong — Real-Time</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- PM2.5 -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">PM2.5</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold">AMAN</span>
        </div>
        <div className="text-2xl font-bold">12.4 <span className="text-sm font-normal text-[var(--muted-foreground)]">µg/m³</span></div>
        <div className="mt-2 w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: "25%" }}></div></div>
        <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Batas: 50 µg/m³ (PP No. 22/2021)</p>
      </div>
      <!-- NO2 -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">NO₂</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold">AMAN</span>
        </div>
        <div className="text-2xl font-bold">0.018 <span className="text-sm font-normal text-[var(--muted-foreground)]">ppm</span></div>
        <div className="mt-2 w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: "18%" }}></div></div>
        <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Batas: 0.1 ppm (WHO)</p>
      </div>
      <!-- SO2 -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">SO₂</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-semibold">WASPADA</span>
        </div>
        <div className="text-2xl font-bold">0.068 <span className="text-sm font-normal text-[var(--muted-foreground)]">ppm</span></div>
        <div className="mt-2 w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-amber-500 transition-all duration-1000" style={{ width: "68%" }}></div></div>
        <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Batas: 0.1 ppm (WHO)</p>
      </div>
      <!-- CO -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">CO</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold">AMAN</span>
        </div>
        <div className="text-2xl font-bold">2.1 <span className="text-sm font-normal text-[var(--muted-foreground)]">ppm</span></div>
        <div className="mt-2 w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: "21%" }}></div></div>
        <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Batas: 10 ppm (OSHA PEL)</p>
      </div>
    </div>
  </div>

  <!-- Middle Row -->
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

    <!-- Machine Temperature -->
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-4">Suhu Ruang Pembakaran</p>
      <div className="flex items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="65" fill="none" stroke="var(--border)" strokeWidth="10"/>
          <circle cx="80" cy="80" r="65" fill="none" stroke="#f59e0b" strokeWidth="10"
                  strokeDasharray="408" strokeDashoffset="122" strokeLinecap="round"
                  transform="rotate(-90 80 80)" style={{ transition: "strokeDashoffset 1.5s ease" }}/>
          <text x="80" y="72" textAnchor="middle" fill="var(--foreground)" fontSize="28" fontWeight="bold">724°C</text>
          <text x="80" y="92" textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">Target: 350-900°C</text>
          <text x="80" y="108" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="600">● OPTIMAL</text>
        </svg>
      </div>
    </div>

    <!-- Air Quality Index -->
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-4">Indeks Kualitas Udara (AQI) — Sekitar Mesin</p>
      <div className="text-center mb-4">
        <span className="text-5xl font-bold text-emerald-500">42</span>
        <p className="text-sm text-emerald-500 font-semibold mt-1">BAIK</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">Aman untuk operator tanpa masker</p>
      </div>
      <div className="flex items-center gap-1 rounded-lg overflow-hidden h-4">
        <div className="h-full bg-emerald-500 flex-[42]"></div>
        <div className="h-full bg-yellow-400 flex-[8]"></div>
        <div className="h-full bg-orange-400 flex-[15]"></div>
        <div className="h-full bg-red-500 flex-[15]"></div>
        <div className="h-full bg-purple-600 flex-[10]"></div>
        <div className="h-full bg-rose-900 flex-[10]"></div>
      </div>
      <div className="flex justify-between text-[9px] text-[var(--muted-foreground)] mt-1">
        <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span><span>300</span><span>500</span>
      </div>
    </div>

    <!-- Operator Safety Status -->
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-4">Status Keselamatan Operator</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-lg">🔥</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Risiko Kebakaran</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Terakhir inspeksi: 2 jam lalu</p>
          </div>
          <span className="text-xs font-bold text-emerald-500">RENDAH</span>
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-lg">⚡</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Kelistrikan</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Isolasi dan grounding OK</p>
          </div>
          <span className="text-xs font-bold text-emerald-500">AMAN</span>
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <span className="text-lg">🫁</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Paparan Gas</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">SO₂ mendekati ambang waspada</p>
          </div>
          <span className="text-xs font-bold text-amber-500">WASPADA</span>
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-lg">🔊</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Kebisingan</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">72 dB — di bawah batas 85 dB</p>
          </div>
          <span className="text-xs font-bold text-emerald-500">AMAN</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Safety Alerts Log -->
  <div className="max-w-6xl mx-auto">
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider">Log Peringatan Keselamatan — 30 Hari Terakhir</p>
        <span className="text-xs text-[var(--muted-foreground)]">3 insiden ditemukan</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <div className="flex-1">
            <p className="text-sm"><span className="font-semibold text-amber-500">[WASPADA]</span> Kadar SO₂ cerobong mencapai 0.082 ppm — mendekati ambang batas</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">25 Sep 2026, 14:32 WIB • Mesin ASHER-POD Unit #2 • Auto-resolved dalam 18 menit</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500">Resolved</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <div className="flex-1">
            <p className="text-sm"><span className="font-semibold text-red-500">[BAHAYA]</span> AI Camera mendeteksi tabung aerosol di jalur masuk — mesin dihentikan otomatis</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">18 Sep 2026, 09:15 WIB • Mesin ASHER Unit #1 • Durasi downtime: 6 menit</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500">Resolved</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <div className="flex-1">
            <p className="text-sm"><span className="font-semibold text-amber-500">[WASPADA]</span> Suhu ruang pembakaran mencapai 872°C — penyesuaian suplai oksigen otomatis</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">12 Sep 2026, 16:48 WIB • Mesin ASHER-POD Unit #2 • Auto-resolved dalam 3 menit</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500">Resolved</span>
        </div>
      </div>
    </div>
  </div>


    </div>
  );
}
