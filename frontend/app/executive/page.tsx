"use client";

import React from "react";
import { CarbonCreditDisplay } from "@/components/executive/CarbonCreditDisplay";
import { CarbonFormulaCard } from "@/components/executive/CarbonFormulaCard";
import { ComplianceStandards } from "@/components/executive/ComplianceStandards";
import { FileDown } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { DashboardFilterBar } from "@/components/ui/DashboardFilterBar";

export default function ExecutiveDashboard() {
  const { activeDevice } = useDevice();

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-heading">
            Executive Dashboard
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Viewing ESG & carbon accounting for{" "}
            <span className="font-medium text-foreground">{activeDevice.name}</span> ({activeDevice.location})
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportPdf}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 focus-visible:outline-none"
        >
          <FileDown className="mr-2 h-4 w-4 text-slate-500" />
          Export PDF
        </button>
      </div>

      <DashboardFilterBar
        filterLabel="Scope"
        filterOptions={["All Scopes (1 & 2)", "Avoided Methane (CH₄)", "Scope 2 Electricity"]}
      />

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
