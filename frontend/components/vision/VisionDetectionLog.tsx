"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  ClipboardList,
  Download,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  WASTE_CATEGORIES,
  WASTE_CATEGORY_LIST,
  type VisionBatchLogEntry,
} from "@/lib/wasteVision";

interface VisionDetectionLogProps {
  logs: VisionBatchLogEntry[];
}

type LogFilter = "all" | "hazardous" | "fossil" | "biogenic";

export function VisionDetectionLog({ logs }: VisionDetectionLogProps) {
  const [filter, setFilter] = useState<LogFilter>("all");

  const filteredLogs = logs.filter((entry) => {
    if (filter === "hazardous") return entry.hasHazardous;
    if (filter === "fossil") return entry.fossilPct >= 30;
    if (filter === "biogenic") return entry.biogenicPct >= 50;
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      "Batch ID",
      "Timestamp",
      "Device SN",
      "Source",
      "Total Items",
      "Est. Weight (kg)",
      "Biogenic (%)",
      "Fossil (%)",
      "Inert (%)",
      "Dominant Category",
      "Safety Status",
    ];
    const rows = filteredLogs.map((row) => [
      row.id,
      row.timestamp,
      row.deviceSn,
      row.source,
      String(row.totalItems),
      String(row.totalWeightKg),
      String(row.biogenicPct),
      String(row.fossilPct),
      String(row.inertPct),
      WASTE_CATEGORIES[row.dominantCategory].shortLabel,
      row.hasHazardous ? "HOLD - B3 DETECTED" : "CLEARED",
    ]);

    const csv = [headers, ...rows]
      .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "asher-waste-vision-log.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-lg">Incoming Waste Batch Log</CardTitle>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "all", label: "All Batches" },
                { id: "hazardous", label: "B3 Alerts" },
                { id: "fossil", label: "High Plastic" },
                { id: "biogenic", label: "Biogenic ≥50%" },
              ] as { id: LogFilter; label: string }[]
            ).map((btn) => (
              <button
                type="button"
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  filter === btn.id
                    ? "bg-slate-800 text-white border-slate-700 dark:bg-slate-200 dark:text-slate-900"
                    : "border-border bg-card text-slate-500 hover:text-foreground"
                }`}
              >
                {btn.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center px-3 py-1 rounded-md border border-border bg-card text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase border-b border-border">
              <tr>
                <th className="px-3 py-3 font-semibold">Batch &amp; Time</th>
                <th className="px-3 py-3 font-semibold">Source</th>
                <th className="px-3 py-3 font-semibold">Detected Categories</th>
                <th className="px-3 py-3 font-semibold">Est. Weight</th>
                <th className="px-3 py-3 font-semibold hidden md:table-cell">Biogenic / Fossil</th>
                <th className="px-3 py-3 font-semibold">Feed Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500 text-sm">
                    No scanned waste batches match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => (
                  <tr key={entry.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-foreground">{entry.id}</div>
                      <div className="text-xs text-slate-500">{entry.timestamp}</div>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-xs font-medium text-slate-600 dark:text-slate-300">
                      {entry.source}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {WASTE_CATEGORY_LIST.filter((c) => entry.categoryCounts[c.id] > 0).map(
                          (cat) => (
                            <span
                              key={cat.id}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${cat.badgeClass}`}
                            >
                              {cat.shortLabel} ({entry.categoryCounts[cat.id]})
                            </span>
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap font-semibold text-foreground">
                      {entry.totalWeightKg} kg
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap hidden md:table-cell text-xs">
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {entry.biogenicPct}% Bio
                      </span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {entry.fossilPct}% Fossil
                      </span>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      {entry.hasHazardous ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-danger/15 text-danger border border-danger/30">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                          Hold — B3
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-safe/15 text-safe border border-safe/30">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
