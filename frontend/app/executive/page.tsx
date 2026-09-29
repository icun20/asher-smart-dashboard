"use client";

import React from "react";
import { CarbonCreditDisplay } from "@/components/executive/CarbonCreditDisplay";
import { CarbonFormulaCard } from "@/components/executive/CarbonFormulaCard";
import { ComplianceStandards } from "@/components/executive/ComplianceStandards";
import { FileDown, Filter, Calendar } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

export default function ExecutiveDashboard() {
  const { activeDevice } = useDevice();
  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight font-heading">Executive Dashboard</h2>
          <p className="text-slate-500 mt-1">Viewing data for <span className="font-medium text-foreground">{activeDevice.name}</span></p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none disabled:opacity-50">
          <FileDown className="mr-2 h-4 w-4 text-slate-500" />
          Export PDF
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Filter className="mr-2 h-4 w-4 text-slate-500" />
          Filter
        </button>
        
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
            Compare: <span className="text-foreground ml-1">Previous period</span>
          </button>
          <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
            <Calendar className="mr-2 h-4 w-4" />
            Feb 04, 2026 - Now
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <CarbonCreditDisplay />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-2">
            <CarbonFormulaCard />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <ComplianceStandards />
          </div>
        </div>
      </div>
    </div>
  );
}
