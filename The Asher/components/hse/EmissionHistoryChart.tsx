"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { History } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "08:00", pm25: 15, co: 4 },
  { time: "09:00", pm25: 20, co: 5 },
  { time: "10:00", pm25: 25, co: 6 },
  { time: "11:00", pm25: 30, co: 8 },
  { time: "12:00", pm25: 18, co: 4 },
  { time: "13:00", pm25: 12, co: 3 },
  { time: "14:00", pm25: 45, co: 9 }, // Peak
  { time: "15:00", pm25: 20, co: 5 },
];

export function EmissionHistoryChart() {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-primary" />
          <CardTitle>Emission Log History (Today)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="pm25" stroke="var(--primary)" name="PM2.5 (µg/m³)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="co" stroke="var(--warning)" name="CO (ppm)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
