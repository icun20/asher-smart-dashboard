"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDevice } from "@/components/DeviceContext";

export function TemperatureGauge() {
  const { activeDevice } = useDevice();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  let temp = 724;
  let status = "OPTIMAL";
  let statusColor = "text-safe";
  let strokeColor = "var(--safe)"; // Will map to #22c55e usually
  
  if (activeDevice.id === "1031") {
    temp = 940;
    status = "OVERHEATING";
    statusColor = "text-danger";
    strokeColor = "var(--danger)";
  } else if (activeDevice.id === "1030") {
    temp = 25;
    status = "OFFLINE";
    statusColor = "text-slate-400";
    strokeColor = "var(--border)";
  }

  // Calculate SVG arc for gauge
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Let's say max temp is 1200
  const percentage = Math.min(temp / 1200, 1);
  const strokeDashoffset = circumference - (percentage * circumference * 0.75); // 0.75 because it's a 270 degree arc

  return (
    <Card className="h-full border-border shadow-none flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider text-center">
          Suhu Ruang Pembakaran
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Background Arc */}
          <svg className="absolute w-full h-full transform -rotate-135" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25} // 25% gap
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? strokeDashoffset : circumference}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-bold font-heading mb-1">{temp}°C</div>
            <div className="text-xs text-slate-400 mb-2">Target: 650-900°C</div>
            <div className={`text-xs font-bold flex items-center ${statusColor}`}>
              {status === "OPTIMAL" && "✓ "}
              {status}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
