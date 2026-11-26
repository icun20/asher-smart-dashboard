"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Leaf, ShieldCheck, FileCheck } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { calculateCarbonAccounting } from "@/lib/carbonEngine";

export function EsgScorecard() {
  const { activeDevice } = useDevice();
  const m = activeDevice.metrics;
  const carbon = calculateCarbonAccounting({
    wasteProcessedTon: m.wasteProcessedTon,
    energyConsumedKwh: m.energyConsumedKwh,
    gridEmissionFactor: m.gridEmissionFactor,
    organicPct: m.organic,
    paperPct: m.paper,
    plasticPct: m.plastic,
    carbonPriceUsdPerTon: m.carbonPricePerTonUsd,
    ashOutputTon: m.ashOutputTon,
  });

  const pillars = [
    {
      code: "E",
      title: "Environmental (GRI 305 & 306)",
      icon: Leaf,
      accent: "text-safe bg-safe/15",
      items: [
        { label: "Landfill Waste Diverted", value: `${m.wasteProcessedTon} tons/mo` },
        { label: "Thermal Mass Reduction", value: `${m.massReductionPct.toFixed(1)}%` },
        { label: "Net Carbon Saved", value: `${carbon.netCarbonSavedCo2e} tCO₂e` },
        { label: "Circular Ash Recovered", value: `${m.ashOutputTon.toFixed(2)} tons` },
      ],
    },
    {
      code: "S",
      title: "Social & HSE Safety",
      icon: ShieldCheck,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/15",
      items: [
        { label: "US EPA OSWI Compliance", value: `${m.epaCompliancePct.toFixed(1)}% hrs` },
        { label: "Perimeter Air Quality", value: `AQI ${m.aqi}` },
        { label: "Filtration Efficiency", value: `${m.filtrationHealthPct}%` },
        { label: "Vapor Dissipation Spec", value: m.vaporDissipationRadiusM },
      ],
    },
    {
      code: "G",
      title: "Governance & Digital MRV",
      icon: FileCheck,
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/15",
      items: [
        { label: "Regional IEA Grid EF", value: `${m.gridEmissionFactor} kg/kWh` },
        { label: "Ash Batch Passport", value: m.latestAshBatchId },
        { label: "Data Telemetry Uptime", value: activeDevice.status === "maintenance" ? "Service Lock" : "99.8%" },
        { label: "Audit Trail Format", value: "GRI / ISO 14064" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;
        return (
          <Card key={pillar.code} className="shadow-none border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold ${pillar.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    ESG Pillar {pillar.code}
                  </div>
                  <CardTitle className="text-base">{pillar.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-2">
              {pillar.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-border last:border-0"
                >
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
