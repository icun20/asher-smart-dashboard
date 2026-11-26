"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

const standards = [
  {
    name: "IPCC 2006 (Vol. 5)",
    badge: "Active",
    desc: "Landfill methane avoidance (DOC, MCF, GWP₁₀₀ = 28) calculation methodology.",
  },
  {
    name: "GHG Protocol Corporate",
    badge: "Active",
    desc: "Scope 1 fossil CO₂, Scope 2 IEA regional grid EF, and Biogenic CO₂ memo split.",
  },
  {
    name: "GRI 305 & GRI 306",
    badge: "Audit Ready",
    desc: "Global sustainability disclosures for GHG emissions & landfill waste diversion.",
  },
  {
    name: "ISO 14064-1 & ISSB S2",
    badge: "Aligned",
    desc: "Auditable GHG inventory and climate-related financial impact reporting.",
  },
  {
    name: "Verra VCS / Gold Standard",
    badge: "MRV Ready",
    desc: "Digital telemetry & mass-balance logs structured for carbon credit verification.",
  },
];

export function ComplianceStandards() {
  return (
    <Card className="shadow-none border-border h-full">
      <CardHeader className="flex flex-row items-center space-x-2 pb-4">
        <ShieldCheck className="h-5 w-5 text-slate-400" />
        <CardTitle className="text-lg">Global ESG &amp; Registry Standards</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3.5">
          {standards.map((std) => (
            <li key={std.name} className="flex items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-safe mr-3 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{std.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    {std.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{std.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
