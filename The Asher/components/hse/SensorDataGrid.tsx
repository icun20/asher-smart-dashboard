import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { Activity } from "lucide-react";

interface SensorData {
  id: string;
  parameter: string;
  sensorType: string;
  value: number;
  unit: string;
  limit: string;
  status: StatusType;
}

const mockSensorData: SensorData[] = [
  { id: "1", parameter: "PM2.5", sensorType: "Laser Scattering", value: 12, unit: "µg/m³", limit: "50", status: "Aman" },
  { id: "2", parameter: "SO2", sensorType: "Electrochemical", value: 0.08, unit: "ppm", limit: "0.1", status: "Waspada" },
  { id: "3", parameter: "NO2", sensorType: "Electrochemical", value: 0.05, unit: "ppm", limit: "0.2", status: "Aman" },
  { id: "4", parameter: "CO", sensorType: "Electrochemical", value: 8.5, unit: "ppm", limit: "10", status: "Bahaya" },
];

export function SensorDataGrid() {
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
                <th className="px-4 py-3 hidden sm:table-cell font-semibold">Ambang Batas (Limit)</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockSensorData.map((data) => (
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
