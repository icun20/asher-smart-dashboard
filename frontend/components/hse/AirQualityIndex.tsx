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

  const aqi = activeDevice.metrics.aqi;
  let status = "GOOD";
  let message = "Safe for operators without respiratory PPE";
  let color = "text-safe";

  if (aqi >= 150) {
    status = "HAZARDOUS";
    message = "Evacuate loading area and inspect exhaust seals";
    color = "text-danger";
  } else if (aqi >= 100) {
    status = "UNHEALTHY";
    message = "N95 respirator required near loading bay";
    color = "text-warning";
  } else if (aqi >= 51) {
    status = "MODERATE";
    message = "Acceptable air quality; monitor stack filtration";
    color = "text-warning";
  } else if (aqi <= 25) {
    status = "EXCELLENT";
    message = "Ambient air quality is exceptionally clean";
    color = "text-safe";
  }

  const percentage = Math.min(Math.max((aqi / 200) * 100, 0), 100);

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">
          Air Quality Index (AQI) — Around Machine
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className={`text-5xl font-bold font-heading mb-2 ${color}`}>{aqi}</div>
          <div className="font-bold tracking-widest text-foreground uppercase mb-1">{status}</div>
          <div className="text-sm text-slate-500">{message}</div>
        </div>

        <div className="max-w-2xl mx-auto px-2 sm:px-4 mt-10">
          {/* Bar + Accurately Positioned Pointer */}
          <div className="relative flex items-center">
            <div className="h-4 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-slate-900 dark:border-slate-200 rounded-[4px] rotate-45 shadow-sm transition-all duration-1000 z-10"
              style={{ left: mounted ? `${percentage}%` : "0%" }}
            />
          </div>

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
