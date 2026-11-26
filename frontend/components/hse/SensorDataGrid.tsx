"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { Activity } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import {
  US_EPA_OSWI_STANDARDS,
  evaluateStackParameter,
  type ComplianceLevel,
} from "@/lib/hseStandards";

function toBadgeStatus(level: ComplianceLevel): StatusType {
  if (level === "DANGER") return "Danger";
  if (level === "WARNING") return "Warning";
  return "Safe";
}

export function SensorDataGrid() {
  const { activeDevice } = useDevice();
  const { pm25, so2, no2, co, hcl } = activeDevice.metrics;

  const sensorRows = [
    { std: US_EPA_OSWI_STANDARDS.pm, value: pm25.toFixed(1), level: evaluateStackParameter("pm", pm25) },
    { std: US_EPA_OSWI_STANDARDS.co, value: co.toFixed(1), level: evaluateStackParameter("co", co) },
    { std: US_EPA_OSWI_STANDARDS.so2, value: so2.toFixed(2), level: evaluateStackParameter("so2", so2) },
    { std: US_EPA_OSWI_STANDARDS.nox, value: no2.toFixed(1), level: evaluateStackParameter("nox", no2) },
    { std: US_EPA_OSWI_STANDARDS.hcl, value: hcl.toFixed(1), level: evaluateStackParameter("hcl", hcl) },
  ];

  return (
    <Card className="shadow-none border border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-base sm:text-lg">
              Detailed Stack Gas Analyzer Log (US EPA OSWI)
            </CardTitle>
          </div>
          <span className="text-xs text-slate-500">Corrected to 7% O₂, dry basis</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Parameter &amp; Sensor</th>
                <th className="px-4 py-3 font-semibold">Reading</th>
                <th className="px-4 py-3 hidden sm:table-cell font-semibold">US EPA OSWI Limit</th>
                <th className="px-4 py-3 font-semibold">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {sensorRows.map(({ std, value, level }) => (
                <tr key={std.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3.5 font-medium text-foreground">
                    {std.fullName}
                    <div className="text-xs text-slate-400 font-normal mt-0.5">
                      {std.sensorType}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-lg font-bold">{value}</span>
                    <span className="text-slate-500 ml-1 text-xs">{std.unit}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-slate-500">
                    ≤ {std.epaLimit} {std.unit}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={toBadgeStatus(level)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
