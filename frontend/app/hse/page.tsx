"use client";

import React from "react";
import { useDevice } from "@/components/DeviceContext";
import { DashboardFilterBar } from "@/components/ui/DashboardFilterBar";
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

      <DashboardFilterBar filterLabel="Filter Parameter" />

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
