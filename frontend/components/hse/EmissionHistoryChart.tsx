"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { History } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDevice } from "@/components/DeviceContext";

const HISTORY_BY_DEVICE: Record<string, { time: string; pm25: number; co: number }[]> = {
  "1029": [
    { time: "08:00", pm25: 11.2, co: 1.8 },
    { time: "09:00", pm25: 14.5, co: 2.3 },
    { time: "10:00", pm25: 16.0, co: 2.6 },
    { time: "11:00", pm25: 13.8, co: 2.2 },
    { time: "12:00", pm25: 10.9, co: 1.9 },
    { time: "13:00", pm25: 12.1, co: 2.0 },
    { time: "14:00", pm25: 15.4, co: 2.5 },
    { time: "15:00", pm25: 12.4, co: 2.1 },
  ],
  "1030": [
    { time: "08:00", pm25: 3.0, co: 0.4 },
    { time: "09:00", pm25: 2.5, co: 0.2 },
    { time: "10:00", pm25: 2.1, co: 0.1 },
    { time: "11:00", pm25: 2.0, co: 0.1 },
    { time: "12:00", pm25: 2.2, co: 0.1 },
    { time: "13:00", pm25: 2.1, co: 0.1 },
    { time: "14:00", pm25: 2.0, co: 0.1 },
    { time: "15:00", pm25: 2.1, co: 0.1 },
  ],
  "1031": [
    { time: "08:00", pm25: 28.0, co: 5.4 },
    { time: "09:00", pm25: 35.5, co: 6.8 },
    { time: "10:00", pm25: 44.2, co: 8.5 },
    { time: "11:00", pm25: 49.0, co: 9.7 },
    { time: "12:00", pm25: 52.3, co: 10.4 },
    { time: "13:00", pm25: 51.8, co: 10.1 },
    { time: "14:00", pm25: 56.1, co: 11.6 },
    { time: "15:00", pm25: 55.4, co: 11.2 },
  ],
};

export function EmissionHistoryChart() {
  const { activeDevice } = useDevice();
  const data = HISTORY_BY_DEVICE[activeDevice.id] ?? HISTORY_BY_DEVICE["1029"];

  return (
    <Card className="col-span-full border-border shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-primary" />
          <CardTitle className="text-base sm:text-lg">
            Emission Log History (Today — {activeDevice.timezoneLabel})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="var(--primary)"
                name="PM2.5 (µg/m³)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="co"
                stroke="var(--warning)"
                name="CO (ppm)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
