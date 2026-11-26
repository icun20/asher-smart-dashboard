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
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useDevice } from "@/components/DeviceContext";

const HISTORY_BY_DEVICE: Record<string, { time: string; pm: number; co: number }[]> = {
  "1029": [
    { time: "08:00", pm: 9.8, co: 12.1 },
    { time: "09:00", pm: 12.2, co: 15.4 },
    { time: "10:00", pm: 13.5, co: 17.0 },
    { time: "11:00", pm: 11.9, co: 15.2 },
    { time: "12:00", pm: 10.4, co: 13.8 },
    { time: "13:00", pm: 11.0, co: 14.2 },
    { time: "14:00", pm: 12.8, co: 16.5 },
    { time: "15:00", pm: 11.4, co: 14.8 },
  ],
  "1030": [
    { time: "08:00", pm: 3.1, co: 2.0 },
    { time: "09:00", pm: 2.4, co: 1.5 },
    { time: "10:00", pm: 1.9, co: 1.0 },
    { time: "11:00", pm: 1.8, co: 0.9 },
    { time: "12:00", pm: 1.8, co: 0.9 },
    { time: "13:00", pm: 1.8, co: 0.9 },
    { time: "14:00", pm: 1.8, co: 0.9 },
    { time: "15:00", pm: 1.8, co: 0.9 },
  ],
  "1031": [
    { time: "08:00", pm: 21.5, co: 26.4 },
    { time: "09:00", pm: 25.0, co: 31.2 },
    { time: "10:00", pm: 29.4, co: 36.8 },
    { time: "11:00", pm: 31.8, co: 39.5 },
    { time: "12:00", pm: 34.2, co: 41.9 },
    { time: "13:00", pm: 35.1, co: 43.0 },
    { time: "14:00", pm: 37.2, co: 45.4 },
    { time: "15:00", pm: 36.4, co: 44.2 },
  ],
};

export function EmissionHistoryChart() {
  const { activeDevice, thresholds } = useDevice();
  const data = HISTORY_BY_DEVICE[activeDevice.id] ?? HISTORY_BY_DEVICE["1029"];

  return (
    <Card className="col-span-full border-border shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-base sm:text-lg">
              Stack Emission Trend (Today — {activeDevice.timezoneLabel})
            </CardTitle>
          </div>
          <span className="text-xs text-slate-500">
            Active Caps: PM ≤ {thresholds.pmLimitMgNm3} mg/Nm³ • CO ≤ 40 ppmv
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
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
              <ReferenceLine
                y={thresholds.pmLimitMgNm3}
                stroke="var(--danger)"
                strokeDasharray="4 4"
                label={{
                  value: `PM Cap (${thresholds.pmLimitMgNm3})`,
                  position: "insideTopRight",
                  fill: "var(--danger)",
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="pm"
                stroke="var(--primary)"
                name="Stack PM (mg/Nm³)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="co"
                stroke="var(--warning)"
                name="Stack CO (ppmv)"
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
