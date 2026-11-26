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
import { evaluateStackParameter } from "@/lib/hseStandards";

export default function ExecutiveDashboard() {
  const { activeDevice, thresholds } = useDevice();
  const [selectedScope, setSelectedScope] = useState("All ESG Modules");
  const [pricePerTon, setPricePerTon] = useState<number>(25);

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
      landfillMcf: m.landfillMcf,
      landfillOx: m.landfillOx,
      landfillGasCaptureR: m.landfillGasCaptureR,
      carbonPriceUsdPerTon: pricePerTon,
      ashOutputTon: m.ashOutputTon,
    });

    const hasStackBreach =
      evaluateStackParameter("pm", m.pm25, thresholds.pmLimitMgNm3) === "DANGER" ||
      evaluateStackParameter("co", m.co) === "DANGER" ||
      evaluateStackParameter("hcl", m.hcl) === "DANGER" ||
      m.coreTemp >= thresholds.tempAlarmC;

    const rows = [
      ["Metric", "Value", "Unit / Standard"],
      ["Device Name", activeDevice.name, `${activeDevice.model} (SN: ${activeDevice.sn})`],
      ["Location", activeDevice.location, `IEA Grid EF: ${m.gridEmissionFactor} kg CO2/kWh`],
      ["Regional Landfill Baseline", m.landfillBaselineLabel, "IPCC 2006 Vol. 5 Table 3.1/3.2"],
      ["Waste Diverted (Monthly)", String(m.wasteProcessedTon), "tons (GRI 306)"],
      ["Thermal Mass Reduction", String(m.massReductionPct), "% (#trash2ash4%)"],
      ["Circular Ash Output", String(m.ashOutputTon), `tons (Batch ${m.latestAshBatchId})`],
      ["Avoided Landfill CH4 (Ex-Ante Lifetime)", String(carbon.avoidedCh4Tons), "tCH4 (10-20 yr FOD registry issuance)"],
      ["Baseline Avoided Emissions", String(carbon.baselineLandfillCo2e), "tCO2e (IPCC AR6 GWP100 = 27.9)"],
      ["Biogenic CO2 (Memo Item)", String(carbon.biogenicCo2MemoTon), "tCO2 (GHG Protocol Neutral)"],
      ["Scope 1A Fossil Plastic CO2", String(carbon.scope1FossilPlasticCo2e), "tCO2e"],
      ["Scope 1B Non-CO2 Thermal N2O/CH4", String(carbon.scope1NonCo2TraceCo2e), "tCO2e (IPCC Vol. 5 Ch. 5)"],
      ["Scope 2 Electricity CO2", String(carbon.scope2ElectricityCo2e), "tCO2e (Smart Power Meter)"],
      ["Scope 3 Avoided Waste Hauling (Memo)", String(carbon.scope3AvoidedHaulingMemoCo2e), "tCO2e (Excluded from CH4 credits)"],
      ["Net Ex-Ante Carbon Saved (Monthly)", String(carbon.netCarbonSavedCo2e), "tCO2e"],
      [`Carbon Credit Potential (@ $${pricePerTon}/t)`, `$${carbon.monthlyCreditValueUsd}`, "USD/month (Ex-Ante)"],
      [`Annualized Carbon Credit (@ $${pricePerTon}/t)`, `$${carbon.annualCreditValueUsd}`, "USD/year (Ex-Ante)"],
      ["US EPA OSWI Compliance Status", hasStackBreach ? `EXCEPTION LOGGED (${m.epaCompliancePct}%)` : `COMPLIANT (${m.epaCompliancePct}%)`, "40 CFR Part 60 Subpart EEEE"],
      ["Method 23/29 Lab Stack Status", activeDevice.labStackTest.status, `${activeDevice.labStackTest.accreditedLab} (Next due ${activeDevice.labStackTest.nextDueDate})`],
    ];

    const csv = rows
      .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asher-esg-carbon-report-${activeDevice.sn}-${pricePerTon}usd.csv`;
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
            IPCC 2006/AR6 carbon accounting &amp; GRI/ISSB ESG reporting for{" "}
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
        <CarbonCreditDisplay pricePerTon={pricePerTon} onPriceChange={setPricePerTon} />

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
