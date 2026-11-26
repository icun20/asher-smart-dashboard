"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Leaf, ChevronDown, ChevronUp } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function CarbonCreditDisplay() {
  const { activeDevice } = useDevice();
  const [showDetails, setShowDetails] = useState(false);

  const isPositive = activeDevice.metrics.carbonCreditChange.startsWith("+");
  const { wasteProcessedTon, energyConsumedKwh, gridEmissionFactor } = activeDevice.metrics;

  const baselineAvoided = wasteProcessedTon * 1.2;
  const scope2Emissions = (energyConsumedKwh * gridEmissionFactor) / 1000;
  const scope1Direct = wasteProcessedTon * 0.05;
  const netCarbonSaved = Math.max(0, baselineAvoided - (scope2Emissions + scope1Direct));

  return (
    <Card className="flex flex-col overflow-hidden border border-border">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-5 md:p-8 flex flex-col justify-center">
          <div className="inline-flex items-center text-sm font-semibold text-primary mb-2">
            <Leaf className="h-4 w-4 mr-1.5" />
            Carbon Credit Generation
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-2 font-heading tracking-tight">
            Estimated Value
          </h3>
          <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
            Track the estimated financial value generated from avoiding landfill methane (CH₄)
            emissions minus verified Scope 1 &amp; Scope 2 ASHER operations.
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {showDetails ? "Hide Details" : "View Details"}
              {showDetails ? (
                <ChevronUp className="ml-2 h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-slate-900 border-t md:border-t-0 md:border-l border-border p-5 md:p-8 flex flex-col items-center justify-center md:min-w-[300px]">
          <div className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-foreground">
            <AnimatedNumber value={activeDevice.metrics.carbonCreditValue} />
          </div>
          <div className="flex items-center text-sm mt-3 text-slate-500">
            <span
              className={`flex items-center font-medium mr-2 ${
                isPositive ? "text-primary" : "text-amber-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {activeDevice.metrics.carbonCreditChange}
            </span>
            from last period
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-border bg-slate-50/70 dark:bg-slate-900/60 p-5 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 uppercase font-medium">Landfill CH₄ Baseline</div>
            <div className="text-lg font-bold text-safe mt-0.5">
              {baselineAvoided.toFixed(1)} <span className="text-xs font-normal text-slate-400">tCO₂e</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-medium">
              Scope 2 (EF: {gridEmissionFactor})
            </div>
            <div className="text-lg font-bold text-warning mt-0.5">
              -{scope2Emissions.toFixed(1)} <span className="text-xs font-normal text-slate-400">tCO₂e</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-medium">Scope 1 Direct</div>
            <div className="text-lg font-bold text-danger mt-0.5">
              -{scope1Direct.toFixed(1)} <span className="text-xs font-normal text-slate-400">tCO₂e</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-medium">Net Carbon Saved</div>
            <div className="text-lg font-bold text-foreground mt-0.5">
              {netCarbonSaved.toFixed(1)} <span className="text-xs font-normal text-slate-400">tCO₂e</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
