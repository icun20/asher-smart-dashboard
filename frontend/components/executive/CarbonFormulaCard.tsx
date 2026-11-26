"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calculator } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function CarbonFormulaCard() {
  const { activeDevice } = useDevice();
  const { wasteProcessedTon, energyConsumedKwh, gridEmissionFactor } = activeDevice.metrics;
  const netSavedTon = Math.max(
    0,
    wasteProcessedTon * 1.2 - ((energyConsumedKwh * gridEmissionFactor) / 1000 + wasteProcessedTon * 0.05)
  );

  return (
    <Card className="shadow-none border-border h-full">
      <CardHeader className="flex flex-row items-center space-x-2 pb-4">
        <Calculator className="h-5 w-5 text-slate-400" />
        <CardTitle>Carbon Saved Calculation (IPCC 2006)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-border font-mono text-xs sm:text-sm overflow-x-auto mb-5">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Net CO₂e Saved = <br className="md:hidden" />
            <span className="text-safe font-bold">Landfill CH₄ Baseline</span> (Tonnage × 1.2)
            <br className="md:hidden" /> − <br className="md:hidden" />
            <span className="text-danger font-bold">ASHER Emissions</span> ((kWh × Grid EF ÷ 1,000) + Tonnage × 0.05)
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-slate-500 mb-1">Waste Processed (Tonnage)</span>
            <span className="text-xl md:text-2xl font-bold">
              <AnimatedNumber value={activeDevice.metrics.wasteProcessed} />{" "}
              <span className="text-xs sm:text-sm font-normal text-slate-400">tons</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-slate-500 mb-1">Energy Consumed</span>
            <span className="text-xl md:text-2xl font-bold">
              <AnimatedNumber value={activeDevice.metrics.energyConsumed} />{" "}
              <span className="text-xs sm:text-sm font-normal text-slate-400">kWh</span>
            </span>
          </div>
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-xs sm:text-sm text-slate-500 mb-1">
              Net Carbon Saved (EF: {gridEmissionFactor})
            </span>
            <span className="text-xl md:text-2xl font-bold text-safe">
              {netSavedTon.toLocaleString("en-US", { maximumFractionDigits: 1 })}{" "}
              <span className="text-xs sm:text-sm font-normal text-slate-400">tCO₂e</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
