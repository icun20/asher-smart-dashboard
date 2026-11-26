"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDevice } from "@/components/DeviceContext";
import { THERMAL_ENVELOPE } from "@/lib/hseStandards";

export function TemperatureGauge() {
  const { activeDevice } = useDevice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const temp = activeDevice.metrics.coreTemp;
  let status = "OPTIMAL";
  let statusColor = "text-safe";
  let strokeColor = "var(--safe)";

  if (temp >= THERMAL_ENVELOPE.ALARM_OVERHEAT_C) {
    status = "OVERHEATING";
    statusColor = "text-danger";
    strokeColor = "var(--danger)";
  } else if (temp < 100) {
    status = "OFFLINE";
    statusColor = "text-slate-400";
    strokeColor = "var(--border)";
  } else if (temp < THERMAL_ENVELOPE.OPTIMAL_MIN_C) {
    status = "PRE-HEATING";
    statusColor = "text-warning";
    strokeColor = "var(--warning)";
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(temp / THERMAL_ENVELOPE.GAUGE_MAX_C, 1);
  const strokeDashoffset = circumference - percentage * circumference * 0.75;

  return (
    <Card className="h-full border-border shadow-none flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider text-center">
          Thermal Chamber Temperature (Type-K)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="relative w-48 h-48 flex items-center justify-center">
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
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
            />
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
            <div className="text-3xl sm:text-4xl font-bold font-heading mb-1">
              {temp.toLocaleString("en-US")}°C
            </div>
            <div className="text-[11px] text-slate-400 mb-1.5">
              Optimal: {THERMAL_ENVELOPE.OPTIMAL_MIN_C}–{THERMAL_ENVELOPE.OPTIMAL_MAX_C}°C
            </div>
            <div className={`text-xs font-bold flex items-center ${statusColor}`}>
              {status === "OPTIMAL" && "✓ "}
              {status}
            </div>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 text-center mt-2">
          Rated Spec: {THERMAL_ENVELOPE.MIN_RATED_C}–{THERMAL_ENVELOPE.MAX_RATED_C.toLocaleString("en-US")}°C • Alarm ≥{" "}
          {THERMAL_ENVELOPE.ALARM_OVERHEAT_C.toLocaleString("en-US")}°C
        </div>
      </CardContent>
    </Card>
  );
}
