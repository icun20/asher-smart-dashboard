"use client";

import React from "react";
import Link from "next/link";
import { Gauge, Zap, Scale, ScanEye, ArrowUpRight, AlertTriangle } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

export function OperatorKpiGrid() {
  const { activeDevice } = useDevice();
  const m = activeDevice.metrics;
  const kwhPerTon =
    m.wasteProcessedTon > 0 ? Math.round(m.energyConsumedKwh / m.wasteProcessedTon) : 0;
  const isOffline = activeDevice.status === "maintenance";
  const hasElevatedB3 = m.hazardous >= 5;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Chamber Utilization */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
          <span>Unit Utilization</span>
          <Gauge className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2">
          <div className="text-2xl md:text-3xl font-bold font-heading text-foreground">
            {m.utilizationPct}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {m.operatingHoursMonth} hrs logged this month
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full rounded-full ${
              isOffline ? "bg-slate-400" : "bg-primary"
            }`}
            style={{ width: `${m.utilizationPct}%` }}
          />
        </div>
      </div>

      {/* Floor Scale Daily Input */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
          <span>Floor Scale (Today)</span>
          <Scale className="w-4 h-4 text-blue-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl md:text-3xl font-bold font-heading text-foreground">
            {m.dailyThroughputKg.toLocaleString("en-US")}{" "}
            <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isOffline ? "Loading bay locked (maintenance)" : "Manual trolley batches weighed"}
          </div>
        </div>
      </div>

      {/* Energy Efficiency Index */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
          <span>Energy Efficiency</span>
          <Zap className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl md:text-3xl font-bold font-heading text-foreground">
            {kwhPerTon}{" "}
            <span className="text-sm font-normal text-slate-400">kWh/ton</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Zero-fuel thermal plasma • 3-Phase 415V
          </div>
        </div>
      </div>

      {/* Pre-Feed Vision Gate Link */}
      <Link
        href="/vision"
        className="bg-card border border-border hover:border-primary/60 rounded-xl p-4 flex flex-col justify-between transition-colors group"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
          <span>AI Vision Gate</span>
          <ScanEye className="w-4 h-4 text-primary" />
        </div>
        <div className="mt-2">
          <div
            className={`text-xl md:text-2xl font-bold font-heading flex items-center gap-1.5 ${
              isOffline
                ? "text-slate-400"
                : hasElevatedB3
                ? "text-danger"
                : "text-safe"
            }`}
          >
            {hasElevatedB3 && !isOffline && <AlertTriangle className="w-5 h-5 shrink-0" />}
            {isOffline ? "STANDBY" : hasElevatedB3 ? "B3 ALERT" : "ACTIVE"}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 inline-flex items-center group-hover:underline">
            Open Live Waste Scanner
            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </Link>
    </div>
  );
}
