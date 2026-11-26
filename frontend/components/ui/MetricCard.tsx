"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export interface MetricDataPoint {
  label?: string;
  value: number;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  badge?: string;
  subtext?: string;
  data: MetricDataPoint[];
  color?: string;
}

export function MetricCard({
  title,
  value,
  badge,
  subtext,
  data,
  color = "var(--primary)",
}: MetricCardProps) {
  return (
    <Card className="flex flex-col border border-border shadow-none h-full">
      <CardContent className="p-6 pt-6 md:pt-6 flex flex-col justify-center flex-1">
        <div className="flex items-center space-x-2 mb-3">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-2xl font-bold font-heading">{value}</span>
          {subtext && <span className="text-sm text-slate-400">{subtext}</span>}
        </div>

        <div className="h-16 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-mono">
          <span>{data[0]?.label ?? "Start"}</span>
          <span>{data[Math.floor(data.length / 2)]?.label ?? "Mid"}</span>
          <span>{data[data.length - 1]?.label ?? "Now"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
