"use client";
import React, { useState, useEffect } from 'react';

export default function OperatorDashboard() {

  return (
    <div className="p-4 pb-20">
      <div className="max-w-6xl mx-auto mb-4"><a href="/" className="text-emerald-500 text-sm hover:underline">&larr; Kembali ke Menu Utama</a></div>
      

  <!-- Header -->
  <div className="max-w-6xl mx-auto mb-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg">A</div>
          <h1 className="text-2xl font-bold">ASHER Operator Panel</h1>
        </div>
        <p className="text-[var(--muted-foreground)] text-sm ml-[52px]">Monitoring Mesin & Predictive Maintenance — Unit ASHER-POD #2</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-500 font-semibold">RUNNING</span>
        </div>
        <div className="text-xs text-[var(--muted-foreground)] text-right">
          <p>Uptime: 14h 22m</p>
          <p>Shift: Siang (07:00 - 19:00)</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Predictive Maintenance -->
  <div className="max-w-6xl mx-auto mb-6">
    <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-3">🔧 Predictive Maintenance — Kesehatan Komponen</p>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <!-- Plasma Torch -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm text-center">
        <div className="relative mx-auto w-16 h-16 mb-2">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="5"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="5"
                    strokeDasharray="176" strokeDashoffset="18" strokeLinecap="round"/>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">90%</span>
        </div>
        <p className="text-xs font-medium">Plasma Torch</p>
        <p className="text-[10px] text-emerald-500">Sisa umur ~45 hari</p>
      </div>
      <!-- Blower Fan -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm text-center">
        <div className="relative mx-auto w-16 h-16 mb-2">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="5"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#f59e0b" strokeWidth="5"
                    strokeDasharray="176" strokeDashoffset="72" strokeLinecap="round"/>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">59%</span>
        </div>
        <p className="text-xs font-medium">Kipas Blower</p>
        <p className="text-[10px] text-amber-500">⚠ Ganti dalam ~12 hari</p>
      </div>
      <!-- Filter -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm text-center">
        <div className="relative mx-auto w-16 h-16 mb-2">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="5"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="5"
                    strokeDasharray="176" strokeDashoffset="30" strokeLinecap="round"/>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">83%</span>
        </div>
        <p className="text-xs font-medium">Filter Emisi</p>
        <p className="text-[10px] text-emerald-500">Sisa umur ~34 hari</p>
      </div>
      <!-- Conveyor Belt -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm text-center">
        <div className="relative mx-auto w-16 h-16 mb-2">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="5"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="5"
                    strokeDasharray="176" strokeDashoffset="9" strokeLinecap="round"/>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">95%</span>
        </div>
        <p className="text-xs font-medium">Conveyor Belt</p>
        <p className="text-[10px] text-emerald-500">Sisa umur ~60 hari</p>
      </div>
      <!-- Power Inverter -->
      <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm text-center">
        <div className="relative mx-auto w-16 h-16 mb-2">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="5"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="5"
                    strokeDasharray="176" strokeDashoffset="21" strokeLinecap="round"/>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">88%</span>
        </div>
        <p className="text-xs font-medium">Power Inverter</p>
        <p className="text-[10px] text-emerald-500">Sisa umur ~40 hari</p>
      </div>
    </div>
  </div>

  <!-- Middle Row -->
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

    <!-- Waste Volume Analytics -->
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider">Volume Sampah Harian (7 Hari Terakhir)</p>
        <div className="flex gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span> Masuk (Ton)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-400 inline-block"></span> Abu (Kg)</span>
        </div>
      </div>
      <div className="flex items-end gap-2 h-44 mt-2">
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-36">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "70%", animationDelay: "0.1s" }}></div>
            <div className="flex-1 bg-orange-400/80 rounded-t bar-animate" style={{ height: "4%", animationDelay: "0.15s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Sen</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-36">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "85%", animationDelay: "0.2s" }}></div>
            <div className="flex-1 bg-orange-400/80 rounded-t bar-animate" style={{ height: "5%", animationDelay: "0.25s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Sel</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-36">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "65%", animationDelay: "0.3s" }}></div>
            <div className="flex-1 bg-orange-400/80 rounded-t bar-animate" style={{ height: "3.5%", animationDelay: "0.35s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Rab</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-36">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "90%", animationDelay: "0.4s" }}></div>
            <div className="flex-1 bg-orange-400/80 rounded-t bar-animate" style={{ height: "5.5%", animationDelay: "0.45s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Kam</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-36">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "78%", animationDelay: "0.5s" }}></div>
            <div className="flex-1 bg-orange-400/80 rounded-t bar-animate" style={{ height: "4.2%", animationDelay: "0.55s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Jum</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-36">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "55%", animationDelay: "0.6s" }}></div>
            <div className="flex-1 bg-orange-400/80 rounded-t bar-animate" style={{ height: "3%", animationDelay: "0.65s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Sab</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end h-36">
            <div className="flex-1 bg-blue-500/80 rounded-t bar-animate" style={{ height: "82%", animationDelay: "0.7s" }}></div>
            <div className="flex-1 bg-orange-400/80 rounded-t bar-animate" style={{ height: "4.8%", animationDelay: "0.75s" }}></div>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">Min</span>
        </div>
      </div>
      <div className="flex justify-between mt-3 text-xs">
        <span>Rata-rata masuk: <span className="font-bold">94.3 Ton/hari</span></span>
        <span>Rata-rata abu: <span className="font-bold text-orange-400">3.58 Ton/hari (3.8%)</span></span>
      </div>
    </div>

    <!-- Energy Monitor -->
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-4">⚡ Smart Energy Monitor</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">142</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">kWh Hari Ini</p>
        </div>
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">38%</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">Dari Solar Panel</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Plasma Generator</span>
            <span className="font-semibold">68 kWh (47.9%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-blue-500" style={{ width: "48%" }}></div></div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Conveyor & Motor</span>
            <span className="font-semibold">32 kWh (22.5%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-blue-400" style={{ width: "22.5%" }}></div></div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Kipas Blower & Sirkulasi</span>
            <span className="font-semibold">24 kWh (16.9%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-cyan-400" style={{ width: "16.9%" }}></div></div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Sensor, IoT & Sistem</span>
            <span className="font-semibold">18 kWh (12.7%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--border)]"><div className="h-2 rounded-full bg-purple-400" style={{ width: "12.7%" }}></div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Row -->
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

    <!-- AI Camera Feed -->
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-3">📷 AI Camera — Klasifikasi Sampah (Live)</p>
      <div className="relative bg-gray-900 rounded-lg h-40 flex items-center justify-center overflow-hidden">
        <!-- Simulated camera feed -->
        <div className="absolute inset-0 opacity-20" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }}></div>
        <div className="scan-line absolute left-0 right-0 h-0.5 bg-emerald-400/50"></div>
        <div className="text-center z-10">
          <span className="text-3xl">📹</span>
          <p className="text-xs text-gray-400 mt-1">Camera Feed — Conveyor Belt</p>
        </div>
        <!-- Detection boxes -->
        <div className="absolute top-3 left-3 border border-emerald-400 rounded px-1 text-[9px] text-emerald-400">Organik 62%</div>
        <div className="absolute top-3 right-3 border border-blue-400 rounded px-1 text-[9px] text-blue-400">Plastik 28%</div>
        <div className="absolute bottom-3 left-3 border border-amber-400 rounded px-1 text-[9px] text-amber-400">Kertas 8%</div>
        <div className="absolute bottom-3 right-3 border border-red-400 rounded px-1 text-[9px] text-red-400">Logam 2%</div>
        <!-- Live indicator -->
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 rounded px-1.5 py-0.5">
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
          <span className="text-[9px] text-white font-bold">LIVE</span>
        </div>
      </div>
      <p className="text-[10px] text-[var(--muted-foreground)] mt-2">✅ Tidak ada objek berbahaya terdeteksi</p>
    </div>

    <!-- Machine Stats Today -->
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-3">📊 Statistik Mesin Hari Ini</p>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
          <span className="text-sm">Total Sampah Masuk</span>
          <span className="font-bold">82.4 Ton</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
          <span className="text-sm">Total Abu Keluar</span>
          <span className="font-bold text-orange-400">3.13 Ton</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
          <span className="text-sm">Rasio Reduksi</span>
          <span className="font-bold text-emerald-500">96.2%</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
          <span className="text-sm">Waktu Operasi</span>
          <span className="font-bold">14h 22m</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm">Downtime</span>
          <span className="font-bold text-emerald-500">0h 6m (0.7%)</span>
        </div>
      </div>
    </div>

    <!-- Maintenance Schedule -->
    <div className="fade-in bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
      <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider mb-3">🗓️ Jadwal Maintenance Terprediksi (AI)</p>
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <span className="text-lg">🔄</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Ganti Kipas Blower</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Prediksi: 7 Oktober 2026</p>
          </div>
          <span className="text-[10px] font-bold text-amber-500">12 HARI</span>
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="text-lg">🧹</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Bersihkan Filter Emisi</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Prediksi: 29 Oktober 2026</p>
          </div>
          <span className="text-[10px] font-bold text-[var(--muted-foreground)]">34 HARI</span>
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="text-lg">⚡</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Inspeksi Power Inverter</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Prediksi: 4 November 2026</p>
          </div>
          <span className="text-[10px] font-bold text-[var(--muted-foreground)]">40 HARI</span>
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
          <span className="text-lg">🔥</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Ganti Plasma Torch</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">Prediksi: 9 November 2026</p>
          </div>
          <span className="text-[10px] font-bold text-[var(--muted-foreground)]">45 HARI</span>
        </div>
      </div>
    </div>
  </div>


    </div>
  );
}
