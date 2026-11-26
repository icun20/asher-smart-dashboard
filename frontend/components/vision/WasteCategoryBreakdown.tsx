"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Layers, Leaf, Flame, Scale } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  WASTE_CATEGORY_LIST,
  summarizeDetections,
  type WasteDetectionBox,
} from "@/lib/wasteVision";

interface WasteCategoryBreakdownProps {
  detections: WasteDetectionBox[];
}

export function WasteCategoryBreakdown({ detections }: WasteCategoryBreakdownProps) {
  const summary = summarizeDetections(detections);

  const chartData = WASTE_CATEGORY_LIST.map((cat) => ({
    name: cat.shortLabel,
    pct: summary.pctByCategory[cat.id],
    color: cat.colorHex,
    weightKg: Number(summary.weights[cat.id].toFixed(1)),
  }));

  return (
    <Card className="border-border shadow-none flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-lg">Waste Category Breakdown</CardTitle>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {summary.totalWeightKg} kg est.
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-5">
        {/* Composition Bar Chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                hide
              />
              <YAxis
                type="category"
                dataKey="name"
                width={96}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 11, opacity: 0.8 }}
              />
              <Tooltip
                cursor={{ fill: "var(--border)", opacity: 0.3 }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value ?? 0}%`, "Share"]}
              />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={16}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {WASTE_CATEGORY_LIST.map((cat) => {
            const count = summary.counts[cat.id];
            const pct = summary.pctByCategory[cat.id];
            const wt = summary.weights[cat.id].toFixed(1);
            return (
              <div
                key={cat.id}
                className="p-3 rounded-lg border border-border bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.dotClass}`} />
                    <span className="text-xs font-semibold text-foreground truncate">
                      {cat.shortLabel}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground shrink-0">{pct}%</span>
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500">
                  <span>{count} items • {wt} kg</span>
                  <span className="truncate ml-1">{cat.carbonTag.split(" ")[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* IPCC Carbon & Ash Circularity Impact */}
        <div className="mt-auto pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center justify-center text-green-600 dark:text-green-400 text-[11px] font-semibold">
              <Leaf className="w-3.5 h-3.5 mr-1" />
              Biogenic
            </div>
            <div className="text-lg font-bold text-foreground mt-0.5">
              {summary.biogenicPct}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
              <Flame className="w-3.5 h-3.5 mr-1" />
              Fossil CO₂
            </div>
            <div className="text-lg font-bold text-foreground mt-0.5">
              {summary.fossilPct}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-500/10 border border-border">
            <div className="flex items-center justify-center text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
              <Scale className="w-3.5 h-3.5 mr-1" />
              Est. Ash
            </div>
            <div className="text-lg font-bold text-foreground mt-0.5">
              {summary.estimatedAshKg} kg
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
