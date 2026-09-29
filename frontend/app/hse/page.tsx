"use client";

import React from "react";
import { Filter, Calendar } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { EmissionMonitoring } from "@/components/hse/EmissionMonitoring";
import { TemperatureGauge } from "@/components/hse/TemperatureGauge";
import { AirQualityIndex } from "@/components/hse/AirQualityIndex";
import { IncidentLog } from "@/components/hse/IncidentLog";

export default function HSEDashboard() {
  const { activeDevice } = useDevice();

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight font-heading">HSE Dashboard</h2>
          <p className="text-slate-500 mt-1">Viewing safety data for <span className="font-medium text-foreground">{activeDevice.name}</span></p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Filter className="mr-2 h-4 w-4 text-slate-500" />
          Filter Parameter
        </button>
        
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
            Compare: <span className="text-foreground ml-1">Previous period</span>
          </button>
          <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
            <Calendar className="mr-2 h-4 w-4" />
            Feb 04, 2026 - Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmissionMonitoring />
        </div>
        <div className="lg:col-span-1">
          <TemperatureGauge />
        </div>
      </div>

      <AirQualityIndex />
      
      <IncidentLog />
    </div>
  );
}
