"use client";

import React, { useState } from "react";
import { CarbonCreditDisplay } from "@/components/executive/CarbonCreditDisplay";
import { CarbonFormulaCard } from "@/components/executive/CarbonFormulaCard";
import { ComplianceStandards } from "@/components/executive/ComplianceStandards";
import { FileDown } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { DashboardFilterBar } from "@/components/ui/DashboardFilterBar";

export default function ExecutiveDashboard() {
  const { activeDevice } = useDevice();
  const [selectedScope, setSelectedScope] = useState("All ESG Modules");

  const showFormula =
    selectedScope === "All ESG Modules" || selectedScope === "Carbon Accounting (IPCC)";
  const showCompliance =
    selectedScope === "All ESG Modules" || selectedScope === "Standards & Audit";

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-heading">
            Executive Dashboard
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Viewing ESG &amp; carbon accounting for{" "}
            <span className="font-medium text-foreground">{activeDevice.name}</span> (
            {activeDevice.location})
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
        filterLabel="Module"
        filterOptions={["All ESG Modules", "Carbon Accounting (IPCC)", "Standards & Audit"]}
        onFilterChange={setSelectedScope}
      />

      <div className="space-y-6">
        <CarbonCreditDisplay />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {showFormula && (
            <div className={showCompliance ? "md:col-span-2 lg:col-span-2" : "md:col-span-2 lg:col-span-3"}>
              <CarbonFormulaCard />
            </div>
          )}
          {showCompliance && (
            <div className={showFormula ? "md:col-span-2 lg:col-span-1" : "md:col-span-2 lg:col-span-3"}>
              <ComplianceStandards />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
