"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calculator } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { calculateCarbonAccounting } from "@/lib/carbonEngine";

export function CarbonFormulaCard() {
  const { activeDevice } = useDevice();
  const m = activeDevice.metrics;

  const carbon = calculateCarbonAccounting({
    wasteProcessedTon: m.wasteProcessedTon,
    energyConsumedKwh: m.energyConsumedKwh,
    gridEmissionFactor: m.gridEmissionFactor,
    organicPct: m.organic,
    paperPct: m.paper,
    plasticPct: m.plastic,
    landfillMcf: m.landfillMcf,
    landfillOx: m.landfillOx,
    landfillGasCaptureR: m.landfillGasCaptureR,
    carbonPriceUsdPerTon: m.carbonPricePerTonUsd,
    ashOutputTon: m.ashOutputTon,
  });

  return (
    <Card className="shadow-none border-border h-full">
      <CardHeader className="flex flex-row items-center space-x-2 pb-4">
        <Calculator className="h-5 w-5 text-slate-400" />
        <CardTitle className="text-lg">
          Carbon Accounting Engine (IPCC 2006 / AR6 &amp; GHG Protocol)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-lg border border-border font-mono text-xs overflow-x-auto space-y-2">
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
            <span className="text-safe font-bold">1. Regional Landfill Baseline (Ex-Ante CH₄):</span>{" "}
            W ({m.wasteProcessedTon}t) × DOC ({carbon.docFraction}) × DOCf (0.5) × MCF ({carbon.mcf}) × F (0.5) × (16/12) × (1 − R {carbon.landfillGasCaptureR}) × (1 − OX {carbon.oxidationFactorOx}) × AR6 GWP₁₀₀ (27.9)
            = <span className="font-bold">{carbon.baselineLandfillCo2e} tCO₂e</span>
          </p>
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
            <span className="text-danger font-bold">2. ASHER Actual (Scope 1A+1B + Scope 2):</span>{" "}
            Fossil Plastic ({carbon.scope1FossilPlasticCo2e}t) + Thermal N₂O/CH₄ ({carbon.scope1NonCo2TraceCo2e}t) + Grid ({m.energyConsumed} kWh ×{" "}
            {m.gridEmissionFactor} ÷ 1,000 = {carbon.scope2ElectricityCo2e}t) ={" "}
            <span className="font-bold">{carbon.totalAsherEmissionsCo2e} tCO₂e</span>
          </p>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-semibold">3. Separate Memo Disclosures:</span>{" "}
            Biogenic CO₂ ({carbon.biogenicCo2MemoTon} tCO₂, neutral per GHG Protocol) • Scope 3 Avoided Refuse Hauling ({carbon.scope3AvoidedHaulingMemoCo2e} tCO₂e, excluded from CH₄ credits).
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Waste Input (Month)</span>
            <span className="text-xl font-bold text-foreground">
              {m.wasteProcessedTon}{" "}
              <span className="text-xs font-normal text-slate-400">tons</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Avoided CH₄ (Lifetime)</span>
            <span className="text-xl font-bold text-safe">
              {carbon.avoidedCh4Tons}{" "}
              <span className="text-xs font-normal text-slate-400">tCH₄</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Grid Energy (EF {m.gridEmissionFactor})</span>
            <span className="text-xl font-bold text-foreground">
              {m.energyConsumed}{" "}
              <span className="text-xs font-normal text-slate-400">kWh</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Net Ex-Ante Saved</span>
            <span className="text-xl font-bold text-safe">
              {carbon.netCarbonSavedCo2e}{" "}
              <span className="text-xs font-normal text-slate-400">tCO₂e</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
