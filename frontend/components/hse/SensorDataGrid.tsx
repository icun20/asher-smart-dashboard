"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { Activity } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

interface SensorData {
  id: string;
  parameter: string;
  sensorType: string;
  value: number;
  unit: string;
  limit: string;
  status: StatusType;
}

function getBadgeStatus(val: number, warn: number, danger: number): StatusType {
  if (val >= danger) return "Danger";
  if (val >= warn) return "Warning";
  return "Safe";
}

export function SensorDataGrid() {
  const { activeDevice } = useDevice();
  const { pm25, so2, no2, co } = activeDevice.metrics;

  const sensorRows: SensorData[] = [
    {
      id: "1",
      parameter: "PM2.5",
      sensorType: "Laser Scattering",
      value: pm25,
      unit: "µg/m³",
      limit: "50",
      status: getBadgeStatus(pm25, 35, 50),
    },
    {
      id: "2",
      parameter: "SO₂",
      sensorType: "Electrochemical",
      value: so2,
      unit: "ppm",
      limit: "0.10",
      status: getBadgeStatus(so2, 0.06, 0.1),
    },
    {
      id: "3",
      parameter: "NO₂",
      sensorType: "Electrochemical",
      value: no2,
      unit: "ppm",
      limit: "0.15",
      status: getBadgeStatus(no2, 0.05, 0.15),
    },
    {
      id: "4",
      parameter: "CO",
      sensorType: "Electrochemical",
      value: co,
      unit: "ppm",
      limit: "10.0",
      status: getBadgeStatus(co, 6, 10),
    },
  ];

  return (
    <Card className="shadow-none border border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-slate-400" />
          <CardTitle>Detailed Sensor Log</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Parameter</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 hidden sm:table-cell font-semibold">Threshold Limit</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {sensorRows.map((data) => (
                <tr key={data.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-4 font-medium text-foreground">
                    {data.parameter}
                    <div className="text-xs text-slate-400 font-normal mt-0.5">{data.sensorType}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-lg font-bold">{data.value}</span>
                    <span className="text-slate-500 ml-1 text-xs">{data.unit}</span>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell text-slate-500">
                    {data.limit} {data.unit}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={data.status} />
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
