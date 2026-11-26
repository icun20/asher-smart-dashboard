"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDevice } from "@/components/DeviceContext";
import {
  US_EPA_OSWI_STANDARDS,
  evaluateStackParameter,
  type ComplianceLevel,
} from "@/lib/hseStandards";

const getStatusColor = (status: ComplianceLevel) => {
  switch (status) {
    case "SAFE":
      return "text-safe dark:text-safe";
    case "WARNING":
      return "text-warning dark:text-warning";
    case "DANGER":
      return "text-danger dark:text-danger";
  }
};

const getBarColor = (status: ComplianceLevel) => {
  switch (status) {
    case "SAFE":
      return "bg-safe";
    case "WARNING":
      return "bg-warning";
    case "DANGER":
      return "bg-danger";
  }
};

interface ParameterProps {
  label: string;
  value: string;
  unit: string;
  limitText: string;
  status: ComplianceLevel;
  percentage: number;
  mounted: boolean;
}

const ParameterRow = ({
  label,
  value,
  unit,
  limitText,
  status,
  percentage,
  mounted,
}: ParameterProps) => (
  <div className="flex flex-col space-y-2">
    <div className="flex justify-between items-end">
      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xs font-bold flex items-center ${getStatusColor(status)}`}>
        {status === "SAFE" && "✓ "}
        {status === "WARNING" && "▲ "}
        {status === "DANGER" && "✕ "}
        {status}
      </div>
    </div>
    <div className="flex items-baseline justify-between gap-2">
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-bold font-heading">{value}</span>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>
      <span className="text-[11px] text-slate-400">Cap: {limitText}</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${getBarColor(status)}`}
        style={{ width: mounted ? `${Math.min(percentage, 100)}%` : "0%" }}
      />
    </div>
  </div>
);

export function EmissionMonitoring() {
  const { activeDevice, thresholds } = useDevice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { pm25, no2, so2, co, exhaustO2Pct } = activeDevice.metrics;
  const pmCap = thresholds.pmLimitMgNm3;

  const parameters: Omit<ParameterProps, "mounted">[] = [
    {
      label: US_EPA_OSWI_STANDARDS.pm.label,
      value: pm25.toFixed(1),
      unit: US_EPA_OSWI_STANDARDS.pm.unit,
      limitText: `${pmCap} ${US_EPA_OSWI_STANDARDS.pm.unit}`,
      status: evaluateStackParameter("pm", pm25, pmCap),
      percentage: (pm25 / Math.max(pmCap * 1.5, 45)) * 100,
    },
    {
      label: US_EPA_OSWI_STANDARDS.nox.label,
      value: no2.toFixed(1),
      unit: US_EPA_OSWI_STANDARDS.nox.unit,
      limitText: `${US_EPA_OSWI_STANDARDS.nox.epaLimit} ${US_EPA_OSWI_STANDARDS.nox.unit}`,
      status: evaluateStackParameter("nox", no2),
      percentage: (no2 / US_EPA_OSWI_STANDARDS.nox.gaugeMax) * 100,
    },
    {
      label: US_EPA_OSWI_STANDARDS.so2.label,
      value: so2.toFixed(2),
      unit: US_EPA_OSWI_STANDARDS.so2.unit,
      limitText: `${US_EPA_OSWI_STANDARDS.so2.epaLimit} ${US_EPA_OSWI_STANDARDS.so2.unit}`,
      status: evaluateStackParameter("so2", so2),
      percentage: (so2 / US_EPA_OSWI_STANDARDS.so2.gaugeMax) * 100,
    },
    {
      label: US_EPA_OSWI_STANDARDS.co.label,
      value: co.toFixed(1),
      unit: US_EPA_OSWI_STANDARDS.co.unit,
      limitText: `${US_EPA_OSWI_STANDARDS.co.epaLimit} ${US_EPA_OSWI_STANDARDS.co.unit}`,
      status: evaluateStackParameter("co", co),
      percentage: (co / US_EPA_OSWI_STANDARDS.co.gaugeMax) * 100,
    },
  ];

  return (
    <Card className="h-full border-border shadow-none">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">
            Stack Exhaust Monitoring — US EPA 40 CFR 60 (OSWI)
          </CardTitle>
          <span className="text-[11px] text-slate-400">
            Measured O₂: {exhaustO2Pct}% → Corrected to 7.0% O₂ dry basis
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {parameters.map((param) => (
            <ParameterRow key={param.label} {...param} mounted={mounted} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
