"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Leaf, ChevronDown, ChevronUp } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { calculateCarbonAccounting } from "@/lib/carbonEngine";

const MARKET_PRICE_TIERS = [
  { label: "$15", price: 15, desc: "Conservative Voluntary" },
  { label: "$25", price: 25, desc: "Verra VCS / Gold Std" },
  { label: "$40", price: 40, desc: "Premium Removal / EU" },
  { label: "$50", price: 50, desc: "Compliance Market" },
];

export function CarbonCreditDisplay() {
  const { activeDevice } = useDevice();
  const [showDetails, setShowDetails] = useState(false);
  const [pricePerTon, setPricePerTon] = useState<number>(25);

  const m = activeDevice.metrics;
  const isPositive = m.carbonCreditChange.startsWith("+");

  const carbon = calculateCarbonAccounting({
    wasteProcessedTon: m.wasteProcessedTon,
    energyConsumedKwh: m.energyConsumedKwh,
    gridEmissionFactor: m.gridEmissionFactor,
    organicPct: m.organic,
    paperPct: m.paper,
    plasticPct: m.plastic,
    carbonPriceUsdPerTon: pricePerTon,
    ashOutputTon: m.ashOutputTon,
  });

  const formattedMonthly = `$${carbon.monthlyCreditValueUsd.toLocaleString("en-US")}`;

  return (
    <Card className="flex flex-col overflow-hidden border border-border">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-5 md:p-8 flex flex-col justify-center">
          <div className="inline-flex items-center text-sm font-semibold text-primary mb-2">
            <Leaf className="h-4 w-4 mr-1.5" />
            IPCC 2006 Avoided Methane (CH₄) Carbon Credit
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-2 font-heading tracking-tight">
            Estimated Carbon Credit Value
          </h3>
          <p className="text-slate-500 text-sm max-w-lg mb-5 leading-relaxed">
            Calculated from avoided landfill methane (GWP₁₀₀ = 28) minus Scope 1 fossil plastic
            emissions and Scope 2 regional electricity (IEA EF: {m.gridEmissionFactor} kg CO₂/kWh).
            Biogenic CO₂ ({carbon.biogenicCo2MemoTon} t) is reported separately as carbon-neutral.
          </p>

          {/* Interactive Market Price Selector */}
          <div className="mb-5">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Carbon Market Price Scenario (USD / tCO₂e)
            </div>
            <div className="flex flex-wrap gap-2">
              {MARKET_PRICE_TIERS.map((tier) => (
                <button
                  type="button"
                  key={tier.price}
                  onClick={() => setPricePerTon(tier.price)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    pricePerTon === tier.price
                      ? "bg-primary/15 border-primary text-foreground font-semibold"
                      : "border-border bg-card text-slate-500 hover:text-foreground"
                  }`}
                  title={tier.desc}
                >
                  {tier.label}/t <span className="hidden sm:inline text-slate-400">• {tier.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {showDetails ? "Hide IPCC Breakdown" : "View IPCC Breakdown"}
              {showDetails ? (
                <ChevronUp className="ml-2 h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
              )}
            </button>
            <span className="text-xs text-slate-500">
              + ${carbon.monthlyAshValueUsd.toLocaleString("en-US")}/mo circular ash off-take (
              {m.ashOutputTon.toFixed(2)} t)
            </span>
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-slate-900 border-t md:border-t-0 md:border-l border-border p-5 md:p-8 flex flex-col items-center justify-center md:min-w-[310px] text-center">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Monthly Credit Value (@ ${pricePerTon}/t)
          </div>
          <div className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-foreground">
            <AnimatedNumber value={formattedMonthly} />
          </div>
          <div className="flex items-center text-sm mt-2.5 text-slate-500">
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
              {m.carbonCreditChange}
            </span>
            vs. previous month
          </div>

          <div className="mt-4 pt-4 border-t border-border w-full grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-slate-500">Annualized (12 Mo)</div>
              <div className="text-base font-bold text-safe mt-0.5">
                ${carbon.annualCreditValueUsd.toLocaleString("en-US")}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Annual + Ash Value</div>
              <div className="text-base font-bold text-foreground mt-0.5">
                ${carbon.totalAnnualEcoValueUsd.toLocaleString("en-US")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-border bg-slate-50/70 dark:bg-slate-900/60 p-5 md:px-8 grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 uppercase font-medium">
              Avoided CH₄ Baseline
            </div>
            <div className="text-lg font-bold text-safe mt-0.5">
              +{carbon.baselineLandfillCo2e.toFixed(1)}{" "}
              <span className="text-xs font-normal text-slate-400">tCO₂e</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {carbon.avoidedCh4Tons} tCH₄ × GWP 28
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-medium">
              Scope 1 Fossil CO₂
            </div>
            <div className="text-lg font-bold text-danger mt-0.5">
              -{carbon.scope1FossilCo2e.toFixed(1)}{" "}
              <span className="text-xs font-normal text-slate-400">tCO₂e</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Plastic fraction ({m.plastic > 0 ? `${m.plastic}%` : "16% std"})
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-medium">
              Scope 2 Electricity
            </div>
            <div className="text-lg font-bold text-warning mt-0.5">
              -{carbon.scope2ElectricityCo2e.toFixed(2)}{" "}
              <span className="text-xs font-normal text-slate-400">tCO₂e</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {m.energyConsumed} kWh × {m.gridEmissionFactor}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-medium">
              Biogenic CO₂ (Memo)
            </div>
            <div className="text-lg font-bold text-slate-600 dark:text-slate-300 mt-0.5">
              {carbon.biogenicCo2MemoTon.toFixed(1)}{" "}
              <span className="text-xs font-normal text-slate-400">tCO₂</span>
            </div>
            <div className="text-[11px] text-slate-400">Carbon-neutral (0 penalty)</div>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <div className="text-xs text-slate-500 uppercase font-medium">
              Net Verified Saved
            </div>
            <div className="text-lg font-bold text-foreground mt-0.5">
              {carbon.netCarbonSavedCo2e.toFixed(1)}{" "}
              <span className="text-xs font-normal text-slate-400">tCO₂e/mo</span>
            </div>
            <div className="text-[11px] text-safe font-medium">
              ~{carbon.annualizedCarbonSavedCo2e.toLocaleString("en-US")} tCO₂e/yr
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
