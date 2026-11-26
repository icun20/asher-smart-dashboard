"use client";

import React, { useState } from "react";
import { CarbonCreditDisplay } from "@/components/executive/CarbonCreditDisplay";
import { CarbonFormulaCard } from "@/components/executive/CarbonFormulaCard";
import { ComplianceStandards } from "@/components/executive/ComplianceStandards";
import { EsgScorecard } from "@/components/executive/EsgScorecard";
import { FileDown, Download } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { DashboardFilterBar } from "@/components/ui/DashboardFilterBar";
import { calculateCarbonAccounting } from "@/lib/carbonEngine";

export default function ExecutiveDashboard() {
  const { activeDevice } = useDevice();
  const [selectedScope, setSelectedScope] = useState("All ESG Modules");

  const showScorecard =
    selectedScope === "All ESG Modules" || selectedScope === "ESG Pillar Scorecard";
  const showFormula =
    selectedScope === "All ESG Modules" || selectedScope === "Carbon Accounting (IPCC)";
  const showCompliance =
    selectedScope === "All ESG Modules" || selectedScope === "Standards & Audit";

  const handleExportPdf = () => {
    window.print();
  };

  const handleExportEsgCsv = () => {
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

    const rows = [
      ["Metric", "Value", "Unit / Standard"],
      ["Device Name", activeDevice.name, `${activeDevice.model} (SN: ${activeDevice.sn})`],
      ["Location", activeDevice.location, `IEA Grid EF: ${m.gridEmissionFactor} kg CO2/kWh`],
      ["Waste Diverted (Monthly)", String(m.wasteProcessedTon), "tons (GRI 306)"],
      ["Thermal Mass Reduction", String(m.massReductionPct), "% (#trash2ash4%)"],
      ["Circular Ash Output", String(m.ashOutputTon), `tons (Batch ${m.latestAshBatchId})`],
      ["Avoided Landfill CH4", String(carbon.avoidedCh4Tons), "tCH4 (IPCC 2006 Vol. 5)"],
      ["Baseline Avoided Emissions", String(carbon.baselineLandfillCo2e), "tCO2e (GWP100 = 28)"],
      ["Biogenic CO2 (Memo Item)", String(carbon.biogenicCo2MemoTon), "tCO2 (GHG Protocol Neutral)"],
      ["Scope 1 Fossil CO2", String(carbon.scope1FossilCo2e), "tCO2e (Plastic Fraction)"],
      ["Scope 2 Electricity CO2", String(carbon.scope2ElectricityCo2e), "tCO2e (Power Meter)"],
      ["Net Carbon Saved (Monthly)", String(carbon.netCarbonSavedCo2e), "tCO2e"],
      ["Carbon Credit Valuation (@ $25/t)", `$${carbon.monthlyCreditValueUsd}`, "USD/month"],
      ["Annualized Carbon Credit", `$${carbon.annualCreditValueUsd}`, "USD/year"],
      ["US EPA OSWI Compliance Rate", `${m.epaCompliancePct}%`, "40 CFR Part 60 Subpart EEEE"],
    ];

    const csv = rows
      .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asher-esg-carbon-report-${activeDevice.sn}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-heading">
            Executive ESG &amp; Carbon Dashboard
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            IPCC 2006 carbon accounting &amp; GRI/ISSB ESG reporting for{" "}
            <span className="font-medium text-foreground">{activeDevice.name}</span> (
            {activeDevice.location})
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportEsgCsv}
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
          >
            <Download className="mr-2 h-4 w-4 text-slate-500" />
            Export ESG CSV
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
          >
            <FileDown className="mr-2 h-4 w-4 text-slate-500" />
            Export PDF
          </button>
        </div>
      </div>

      <DashboardFilterBar
        filterLabel="Module"
        filterOptions={[
          "All ESG Modules",
          "ESG Pillar Scorecard",
          "Carbon Accounting (IPCC)",
          "Standards & Audit",
        ]}
        onFilterChange={setSelectedScope}
      />

      <div className="space-y-6">
        <CarbonCreditDisplay />

        {showScorecard && <EsgScorecard />}

        {(showFormula || showCompliance) && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showFormula && (
              <div
                className={
                  showCompliance
                    ? "md:col-span-2 lg:col-span-2"
                    : "md:col-span-2 lg:col-span-3"
                }
              >
                <CarbonFormulaCard />
              </div>
            )}
            {showCompliance && (
              <div
                className={
                  showFormula
                    ? "md:col-span-2 lg:col-span-1"
                    : "md:col-span-2 lg:col-span-3"
                }
              >
                <ComplianceStandards />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
