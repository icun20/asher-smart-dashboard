"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheck, ShieldAlert, Clock } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { evaluateStackParameter } from "@/lib/hseStandards";

type BadgeTone = "pass" | "warn" | "fail";

export function ComplianceStandards() {
  const { activeDevice, thresholds } = useDevice();
  const m = activeDevice.metrics;

  const hasStackExceedance =
    evaluateStackParameter("pm", m.pm25, thresholds.pmLimitMgNm3) === "DANGER" ||
    evaluateStackParameter("co", m.co) === "DANGER" ||
    evaluateStackParameter("so2", m.so2) === "DANGER" ||
    evaluateStackParameter("nox", m.no2) === "DANGER" ||
    evaluateStackParameter("hcl", m.hcl) === "DANGER" ||
    m.coreTemp >= thresholds.tempAlarmC;

  const labPending = activeDevice.labStackTest.status !== "Certified";
  const isMaintenance = activeDevice.status === "maintenance";

  const standards: { name: string; badge: string; tone: BadgeTone; desc: string }[] = [
    {
      name: "IPCC 2006 / AR6 (Vol. 5)",
      badge: "Active",
      tone: "pass",
      desc: `Regional MCF (${m.landfillMcf}), OX (${m.landfillOx}), LFG R (${Math.round(
        m.landfillGasCaptureR * 100
      )}%), GWP₁₀₀ = 27.9.`,
    },
    {
      name: "GHG Protocol Corporate",
      badge: "Active",
      tone: "pass",
      desc: "Separates Scope 1 fossil/N₂O, Scope 2 IEA grid EF, Biogenic CO₂ & Scope 3 hauling memos.",
    },
    {
      name: "GRI 305 & GRI 306",
      badge: hasStackExceedance ? "Exception Logged" : isMaintenance ? "Service Lock" : "Audit Ready",
      tone: hasStackExceedance ? "fail" : isMaintenance ? "warn" : "pass",
      desc: hasStackExceedance
        ? "Active US EPA stack/thermal exceedance logged; remediation required prior to sign-off."
        : "Emissions & 96% landfill diversion telemetry structured for GRI disclosure.",
    },
    {
      name: "ISO 14064-1 & ISSB S2",
      badge: hasStackExceedance || labPending ? "Review Required" : "Aligned",
      tone: hasStackExceedance || labPending ? "warn" : "pass",
      desc:
        hasStackExceedance || labPending
          ? "Pending stack remediation or scheduled semi-annual Method 23/29 lab retest."
          : "Auditable GHG inventory and climate-related financial impact disclosures.",
    },
    {
      name: "Verra VCS / CDM ACM0022",
      badge: hasStackExceedance ? "MRV Hold" : "Ex-Ante MRV Ready",
      tone: hasStackExceedance ? "warn" : "pass",
      desc: hasStackExceedance
        ? "MRV crediting paused during active HSE sensor breach until filter replacement."
        : "Digital MRV logs structured for 3rd-party VVB audit (credits issue via 10–20 yr FOD).",
    },
  ];

  return (
    <Card className="shadow-none border-border h-full">
      <CardHeader className="flex flex-row items-center space-x-2 pb-4">
        <ShieldCheck className="h-5 w-5 text-slate-400" />
        <CardTitle className="text-lg">Global ESG &amp; Registry Readiness</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3.5">
          {standards.map((std) => (
            <li key={std.name} className="flex items-start">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mr-3 mt-0.5 ${
                  std.tone === "fail"
                    ? "bg-danger/15 text-danger"
                    : std.tone === "warn"
                    ? "bg-warning/15 text-warning"
                    : "bg-green-500/15 text-safe"
                }`}
              >
                {std.tone === "fail" ? (
                  <ShieldAlert className="h-3.5 w-3.5" />
                ) : std.tone === "warn" ? (
                  <Clock className="h-3.5 w-3.5" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{std.name}</h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      std.tone === "fail"
                        ? "bg-danger/15 text-danger"
                        : std.tone === "warn"
                        ? "bg-warning/15 text-warning"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
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
