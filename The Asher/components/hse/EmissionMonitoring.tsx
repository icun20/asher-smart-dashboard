"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useDevice } from "@/components/DeviceContext";

const getStatusColor = (status: string) => {
  switch (status) {
    case "AMAN": return "text-safe dark:text-safe";
    case "WASPADA": return "text-warning dark:text-warning";
    case "BAHAYA": return "text-danger dark:text-danger";
    default: return "text-slate-500";
  }
};

const getBarColor = (status: string) => {
  switch (status) {
    case "AMAN": return "bg-safe";
    case "WASPADA": return "bg-warning";
    case "BAHAYA": return "bg-danger";
    default: return "bg-slate-200";
  }
};

interface ParameterProps {
  label: string;
  value: string;
  unit: string;
  status: "AMAN" | "WASPADA" | "BAHAYA";
  percentage: number;
}

const ParameterRow = ({ label, value, unit, status, percentage, mounted }: ParameterProps & { mounted: boolean }) => (
  <div className="flex flex-col space-y-2">
    <div className="flex justify-between items-end">
      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xs font-bold flex items-center ${getStatusColor(status)}`}>
        {status === "AMAN" && "✓ "}
        {status === "WASPADA" && "▲ "}
        {status === "BAHAYA" && "✕ "}
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
        style={{ width: mounted ? `${percentage}%` : '0%' }}
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
  
  // Mock data varying by device
  const data = activeDevice.id === "1031" ? { // Warning state
    pm25: { value: "55.4", status: "BAHAYA", percentage: 85 },
    no2: { value: "0.042", status: "WASPADA", percentage: 65 },
    so2: { value: "0.088", status: "WASPADA", percentage: 75 },
    co: { value: "12.5", status: "BAHAYA", percentage: 90 },
  } : activeDevice.id === "1030" ? { // Maintenance
    pm25: { value: "0.0", status: "AMAN", percentage: 0 },
    no2: { value: "0.000", status: "AMAN", percentage: 0 },
    so2: { value: "0.000", status: "AMAN", percentage: 0 },
    co: { value: "0.0", status: "AMAN", percentage: 0 },
  } : { // Active/Normal
    pm25: { value: "12.4", status: "AMAN", percentage: 25 },
    no2: { value: "0.018", status: "AMAN", percentage: 20 },
    so2: { value: "0.068", status: "WASPADA", percentage: 60 },
    co: { value: "2.1", status: "AMAN", percentage: 15 },
  };

  return (
    <Card className="h-full border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">
          Pemantauan Emisi Cerobong — Real-Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <ParameterRow label="PM2.5" value={data.pm25.value} unit="µg/m³" status={data.pm25.status as any} percentage={data.pm25.percentage} mounted={mounted} />
          <ParameterRow label="NO₂" value={data.no2.value} unit="ppm" status={data.no2.status as any} percentage={data.no2.percentage} mounted={mounted} />
          <ParameterRow label="SO₂" value={data.so2.value} unit="ppm" status={data.so2.status as any} percentage={data.so2.percentage} mounted={mounted} />
          <ParameterRow label="CO" value={data.co.value} unit="ppm" status={data.co.status as any} percentage={data.co.percentage} mounted={mounted} />
        </div>
      </CardContent>
    </Card>
  );
}
