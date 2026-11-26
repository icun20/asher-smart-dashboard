"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { DashboardFilterBar } from "@/components/ui/DashboardFilterBar";
import { HseComplianceBanner } from "@/components/hse/HseComplianceBanner";
import { EmissionMonitoring } from "@/components/hse/EmissionMonitoring";
import { TemperatureGauge } from "@/components/hse/TemperatureGauge";
import { AirQualityIndex } from "@/components/hse/AirQualityIndex";
import { EmissionHistoryChart } from "@/components/hse/EmissionHistoryChart";
import { SensorDataGrid } from "@/components/hse/SensorDataGrid";
import { IncidentLog } from "@/components/hse/IncidentLog";
import { US_EPA_OSWI_STANDARDS, evaluateStackParameter } from "@/lib/hseStandards";

export default function HSEDashboard() {
  const { activeDevice } = useDevice();
  const [selectedFilter, setSelectedFilter] = useState("All Emissions");

  const showEmissions =
    selectedFilter === "All Emissions" || selectedFilter === "Emissions & Sensors";
  const showAmbientAndLogs =
    selectedFilter === "All Emissions" || selectedFilter === "Air Quality & Incidents";

  const handleExportHseCsv = () => {
    const m = activeDevice.metrics;
    const rows = [
      ["Parameter", "Reading", "Unit", "US EPA OSWI Limit", "Status"],
      ["Stack PM", String(m.pm25), "mg/Nm3", String(US_EPA_OSWI_STANDARDS.pm.epaLimit), evaluateStackParameter("pm", m.pm25)],
      ["Stack CO", String(m.co), "ppmv", String(US_EPA_OSWI_STANDARDS.co.epaLimit), evaluateStackParameter("co", m.co)],
      ["Stack SO2", String(m.so2), "ppmv", String(US_EPA_OSWI_STANDARDS.so2.epaLimit), evaluateStackParameter("so2", m.so2)],
      ["Stack NOx", String(m.no2), "ppmv", String(US_EPA_OSWI_STANDARDS.nox.epaLimit), evaluateStackParameter("nox", m.no2)],
      ["Stack HCl", String(m.hcl), "ppmv", String(US_EPA_OSWI_STANDARDS.hcl.epaLimit), evaluateStackParameter("hcl", m.hcl)],
      ["Chamber Temperature", String(m.coreTemp), "C", "300-1100 (Alarm >= 1050)", m.coreTemp >= 1050 ? "DANGER" : "SAFE"],
      ["Perimeter Ambient AQI", String(m.aqi), "US EPA AQI", "<= 100", m.aqi > 100 ? "WARNING" : "SAFE"],
      ["Filtration Health", `${m.filtrationHealthPct}%`, "HLC + Nanogreen", ">= 70%", m.filtrationHealthPct < 70 ? "DANGER" : "SAFE"],
    ];

    const csv = rows
      .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asher-hse-epa-audit-${activeDevice.sn}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-heading">
            HSE Compliance Dashboard
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            US EPA 40 CFR 60 (OSWI) stack monitoring &amp; safety telemetry for{" "}
            <span className="font-medium text-foreground">{activeDevice.name}</span> ({activeDevice.model})
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportHseCsv}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
        >
          <Download className="mr-2 h-4 w-4 text-slate-500" />
          Export HSE Audit CSV
        </button>
      </div>

      <DashboardFilterBar
        filterLabel="Section"
        filterOptions={["All Emissions", "Emissions & Sensors", "Air Quality & Incidents"]}
        onFilterChange={setSelectedFilter}
      />

      <HseComplianceBanner />

      {showEmissions && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EmissionMonitoring />
            </div>
            <div className="lg:col-span-1">
              <TemperatureGauge />
            </div>
          </div>

          <SensorDataGrid />
          <EmissionHistoryChart />
        </>
      )}

      {showAmbientAndLogs && (
        <>
          <AirQualityIndex />
          <IncidentLog />
        </>
      )}
    </div>
  );
}
