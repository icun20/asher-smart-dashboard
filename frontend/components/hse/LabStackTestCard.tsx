"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FlaskConical, CheckCircle2, Clock, Info } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { US_EPA_OSWI_LAB_STANDARDS } from "@/lib/hseStandards";

export function LabStackTestCard() {
  const { activeDevice } = useDevice();
  const lab = activeDevice.labStackTest;

  const readings: Record<(typeof US_EPA_OSWI_LAB_STANDARDS)[number]["id"], number> = {
    dioxins: lab.dioxinsNgDscm,
    cadmium: lab.cadmiumUgDscm,
    lead: lab.leadUgDscm,
    mercury: lab.mercuryUgDscm,
  };

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-slate-400 shrink-0" />
            <CardTitle className="text-base sm:text-lg">
              Periodic 3rd-Party Lab Stack Tests (US EPA Method 23 &amp; 29)
            </CardTitle>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
              lab.status === "Certified"
                ? "bg-safe/15 text-safe"
                : "bg-warning/15 text-warning"
            }`}
          >
            {lab.status === "Certified" ? (
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            ) : (
              <Clock className="w-3.5 h-3.5 mr-1" />
            )}
            {lab.status}
          </span>
        </div>
        <p className="text-xs text-slate-500 flex items-start gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
          <span>
            Dioxins/furans and heavy metals cannot be measured by real-time inline gas analyzers;
            compliance is verified via accredited semi-annual stack sampling (dry basis @ 7% O₂).
          </span>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {US_EPA_OSWI_LAB_STANDARDS.map((item) => {
            const val = readings[item.id];
            const pass = val < item.epaLimit;
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-border bg-slate-50/70 dark:bg-slate-800/40"
              >
                <div className="text-xs font-semibold text-foreground">{item.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{item.epaMethod}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-xl font-bold font-heading ${pass ? "text-safe" : "text-danger"}`}>
                    {val}
                  </span>
                  <span className="text-xs text-slate-500">{item.unit}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  EPA Cap: ≤ {item.epaLimit} {item.unit}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-border">
          <span>Accredited Lab: <strong className="text-foreground">{lab.accreditedLab}</strong></span>
          <span>
            Last Sampled: <strong className="text-foreground">{lab.lastTestDate}</strong> • Next Due:{" "}
            <strong className="text-foreground">{lab.nextDueDate}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
