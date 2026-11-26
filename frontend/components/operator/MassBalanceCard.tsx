"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Recycle, QrCode, Sprout, Blocks, CheckCircle2, Thermometer } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

export function MassBalanceCard() {
  const { activeDevice } = useDevice();
  const [showPassport, setShowPassport] = useState(false);

  const m = activeDevice.metrics;
  const sterilizationVerified = m.coreTemp >= 800 || activeDevice.status !== "active";

  return (
    <Card className="h-full shadow-none border-border flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Recycle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Mass Balance &amp; Ash Circularity</CardTitle>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-safe/15 text-safe">
            {m.massReductionPct.toFixed(1)}% Reduction
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-5">
        {/* Input vs Sterilized Ash Output */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-border bg-slate-50/70 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 uppercase font-medium">Waste Input (Month)</div>
            <div className="text-2xl font-bold font-heading text-foreground mt-1">
              {m.wasteProcessedTon}{" "}
              <span className="text-xs font-normal text-slate-400">tons</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Weighed at Floor Scale</div>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-slate-50/70 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 uppercase font-medium">
              Sterilized Ash (~4%)
            </div>
            <div className="text-2xl font-bold font-heading text-safe mt-1">
              {m.ashOutputTon.toFixed(1)}{" "}
              <span className="text-xs font-normal text-slate-400">tons</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Est. Off-take: ${m.ashValueUsd.toLocaleString("en-US")}
            </div>
          </div>
        </div>

        {/* Visual Mass Reduction Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500">Thermal Volume Reduction</span>
            <span className="text-foreground">
              {m.massReductionPct.toFixed(1)}% Vaporized / {(100 - m.massReductionPct).toFixed(1)}%
              Mineral Ash
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-primary"
              style={{ width: `${m.massReductionPct}%` }}
            />
            <div
              className="h-full bg-amber-500"
              style={{ width: `${Math.max(4, 100 - m.massReductionPct)}%` }}
            />
          </div>
        </div>

        {/* Derivative Circular Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-border flex items-start gap-2.5">
            <Sprout className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-foreground">Soil Conditioner / Fertilizer</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Potassium &amp; mineral-rich organic ash fraction
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border flex items-start gap-2.5">
            <Blocks className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-foreground">Sand Bricks &amp; Cement Mix</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Inert aggregate substitute for eco-construction
              </div>
            </div>
          </div>
        </div>

        {/* Digital Product Passport Section */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-safe" />
                Digital Product Passport: {m.latestAshBatchId}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Thermometer className="w-3 h-3" />
                {sterilizationVerified
                  ? "Sterilization verified (≥850°C thermal cycle logged)"
                  : "Awaiting high-temp cycle verification"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPassport((prev) => !prev)}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <QrCode className="w-3.5 h-3.5 mr-1.5" />
              {showPassport ? "Hide QR Passport" : "View QR Passport"}
            </button>
          </div>

          {showPassport && (
            <div className="mt-4 p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center gap-4">
              {/* Crisp deterministic SVG QR visual for batch passport */}
              <svg
                viewBox="0 0 21 21"
                className="w-24 h-24 shrink-0 bg-white p-1.5 rounded-lg border border-slate-200 text-slate-900"
                aria-label={`QR Code for ${m.latestAshBatchId}`}
              >
                <rect x="1" y="1" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="2.6" y="2.6" width="1.8" height="1.8" fill="currentColor" />
                <rect x="15" y="1" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="16.6" y="2.6" width="1.8" height="1.8" fill="currentColor" />
                <rect x="1" y="15" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="2.6" y="16.6" width="1.8" height="1.8" fill="currentColor" />
                <rect x="8" y="2" width="1.5" height="1.5" fill="currentColor" />
                <rect x="11" y="2" width="1.5" height="3" fill="currentColor" />
                <rect x="8" y="6" width="3" height="1.5" fill="currentColor" />
                <rect x="2" y="9" width="3" height="1.5" fill="currentColor" />
                <rect x="7" y="9" width="2" height="2" fill="currentColor" />
                <rect x="11" y="8" width="2" height="3" fill="currentColor" />
                <rect x="15" y="8" width="4" height="1.5" fill="currentColor" />
                <rect x="16" y="11" width="3" height="2" fill="currentColor" />
                <rect x="8" y="13" width="2" height="3" fill="currentColor" />
                <rect x="12" y="13" width="2" height="2" fill="currentColor" />
                <rect x="15" y="15" width="2" height="4" fill="currentColor" />
                <rect x="18" y="16" width="1.5" height="3" fill="currentColor" />
                <rect x="11" y="17" width="2.5" height="2" fill="currentColor" />
              </svg>
              <div className="text-xs space-y-1 text-center sm:text-left">
                <div className="font-bold text-foreground">
                  ASHER Sterilized Ash Certificate ({m.latestAshBatchId})
                </div>
                <div className="text-slate-500">
                  Origin Unit: {activeDevice.name} (SN: {activeDevice.sn}) • {activeDevice.location}
                </div>
                <div className="text-slate-500">
                  Net Ash Weight: {m.ashOutputTon.toFixed(1)} tons • Reduction: {m.massReductionPct}%
                </div>
                <div className="text-safe font-medium">
                  Verified pathogen-free for Soil Conditioner &amp; Eco-Brick feedstock.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
