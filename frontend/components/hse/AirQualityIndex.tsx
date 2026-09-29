"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDevice } from "@/components/DeviceContext";

export function AirQualityIndex() {
  const { activeDevice } = useDevice();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  let aqi = 42;
  let status = "BAIK";
  let message = "Aman untuk operator tanpa masker";
  let color = "text-safe";
  
  if (activeDevice.id === "1031") {
    aqi = 125;
    status = "TIDAK SEHAT";
    message = "Wajib menggunakan masker N95";
    color = "text-warning";
  } else if (activeDevice.id === "1030") {
    aqi = 15;
    status = "SANGAT BAIK";
    message = "Kualitas udara sangat bersih";
    color = "text-safe";
  }

  // Calculate pointer position (0-200+)
  const percentage = Math.min((aqi / 200) * 100, 100);

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">
          Indeks Kualitas Udara (AQI) — Sekitar Mesin
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className={`text-5xl font-bold font-heading mb-2 ${color}`}>{aqi}</div>
          <div className="font-bold tracking-widest text-foreground uppercase mb-1">{status}</div>
          <div className="text-sm text-slate-500">{message}</div>
        </div>
        
        <div className="relative max-w-2xl mx-auto px-4 mt-12">
          {/* Gradient Bar */}
          <div className="h-4 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />
          
          {/* Minimalist Pointer */}
          <div 
            className="absolute top-1/2 -mt-2.5 -ml-2.5 w-5 h-5 bg-white border-2 border-slate-900 dark:border-white rounded-[4px] transform rotate-45 shadow-sm transition-all duration-1000 z-10"
            style={{ left: mounted ? `calc(${percentage}% + 1rem)` : '1rem' }}
          />
          
          {/* Labels */}
          <div className="flex justify-between mt-3 text-xs text-slate-400 font-medium">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
