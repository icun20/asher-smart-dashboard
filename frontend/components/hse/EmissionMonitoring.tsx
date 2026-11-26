"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDevice } from "@/components/DeviceContext";

type EmissionStatus = "SAFE" | "WARNING" | "DANGER";

const getStatusColor = (status: EmissionStatus) => {
  switch (status) {
    case "SAFE":
      return "text-safe dark:text-safe";
    case "WARNING":
      return "text-warning dark:text-warning";
    case "DANGER":
      return "text-danger dark:text-danger";
  }
};

const getBarColor = (status: EmissionStatus) => {
  switch (status) {
    case "SAFE":
      return "bg-safe";
    case "WARNING":
      return "bg-warning";
    case "DANGER":
      return "bg-danger";
  }
};

function evaluateStatus(value: number, warningLimit: number, dangerLimit: number): EmissionStatus {
  if (value >= dangerLimit) return "DANGER";
  if (value >= warningLimit) return "WARNING";
  return "SAFE";
}

interface ParameterProps {
  label: string;
  value: string;
  unit: string;
  status: EmissionStatus;
  percentage: number;
  mounted: boolean;
}

const ParameterRow = ({ label, value, unit, status, percentage, mounted }: ParameterProps) => (
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
    <div className="flex items-baseline space-x-1">
      <span className="text-3xl font-bold font-heading">{value}</span>
      <span className="text-sm text-slate-500">{unit}</span>
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
  const { activeDevice } = useDevice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { pm25, no2, so2, co } = activeDevice.metrics;

  const parameters: Omit<ParameterProps, "mounted">[] = [
    {
      label: "PM2.5",
      value: pm25.toFixed(1),
      unit: "µg/m³",
      status: evaluateStatus(pm25, 35, 50),
      percentage: (pm25 / 65) * 100,
    },
    {
      label: "NO₂",
      value: no2.toFixed(3),
      unit: "ppm",
      status: evaluateStatus(no2, 0.05, 0.15),
      percentage: (no2 / 0.2) * 100,
    },
    {
      label: "SO₂",
      value: so2.toFixed(3),
      unit: "ppm",
      status: evaluateStatus(so2, 0.06, 0.1),
      percentage: (so2 / 0.12) * 100,
    },
    {
      label: "CO",
      value: co.toFixed(1),
      unit: "ppm",
      status: evaluateStatus(co, 6, 10),
      percentage: (co / 14) * 100,
    },
  ];

  return (
    <Card className="h-full border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">
          Stack Emission Monitoring — Real-Time (US EPA Aligned)
        </CardTitle>
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
