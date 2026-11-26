"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, Wind, Filter, Flame } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { evaluateStackParameter } from "@/lib/hseStandards";

export function HseComplianceBanner() {
  const { activeDevice } = useDevice();
  const m = activeDevice.metrics;

  const hasDanger =
    evaluateStackParameter("pm", m.pm25) === "DANGER" ||
    evaluateStackParameter("co", m.co) === "DANGER" ||
    evaluateStackParameter("so2", m.so2) === "DANGER" ||
    evaluateStackParameter("nox", m.no2) === "DANGER" ||
    evaluateStackParameter("hcl", m.hcl) === "DANGER";

  const isMaintenance = activeDevice.status === "maintenance";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* US EPA OSWI Compliance */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
          <span>US EPA 40 CFR 60</span>
          {hasDanger ? (
            <ShieldAlert className="w-4 h-4 text-danger" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-safe" />
          )}
        </div>
        <div
          className={`text-xl font-bold font-heading mt-2 ${
            isMaintenance
              ? "text-slate-400"
              : hasDanger
              ? "text-danger"
              : "text-safe"
          }`}
        >
          {isMaintenance ? "LOCKOUT" : hasDanger ? "EXCEEDANCE" : "COMPLIANT"}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {m.epaCompliancePct.toFixed(1)}% operating hrs within OSWI caps
        </div>
      </div>

      {/* Filtration Health Index */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
          <span>Filtration Health</span>
          <Filter className="w-4 h-4 text-slate-400" />
        </div>
        <div
          className={`text-2xl font-bold font-heading mt-2 ${
            m.filtrationHealthPct < 70
              ? "text-danger"
              : m.filtrationHealthPct < 85
              ? "text-warning"
              : "text-safe"
          }`}
        >
          {m.filtrationHealthPct}%
        </div>
        <div className="text-xs text-slate-500 mt-1">
          HLC Carbon + Hi-Alkaline Nanogreen
        </div>
      </div>

      {/* HCl Acid Gas Guard */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
          <span>HCl Acid Gas</span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div
          className={`text-2xl font-bold font-heading mt-2 ${
            m.hcl >= 15 ? "text-danger" : m.hcl >= 11 ? "text-warning" : "text-foreground"
          }`}
        >
          {m.hcl.toFixed(1)}{" "}
          <span className="text-xs font-normal text-slate-400">ppmv</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          EPA limit: 15 ppmv @ 7% O₂ (PVC monitor)
        </div>
      </div>

      {/* Plume / Vapor Dissipation Spec */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
          <span>Vapor Dissipation</span>
          <Wind className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-2xl font-bold font-heading text-foreground mt-2">
          {m.vaporDissipationRadiusM}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {activeDevice.model} rated plume radius
        </div>
      </div>
    </div>
  );
}
