"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertTriangle, XCircle, CheckCircle, Info } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

interface SafetyIncident {
  id: number;
  type: "DANGER" | "WARNING" | "INFO";
  title: string;
  desc: string;
  status: string;
  isResolved: boolean;
}

export function IncidentLog() {
  const { activeDevice } = useDevice();
  const tz = activeDevice.timezoneLabel;
  const m = activeDevice.metrics;

  let incidents: SafetyIncident[] = [];

  if (activeDevice.id === "1031") {
    incidents = [
      {
        id: 1,
        type: "DANGER",
        title: `Stack PM (${m.pm25} mg/Nm³) & CO (${m.co} ppmv) Exceeded US EPA OSWI Caps`,
        desc: `Today, 12:15 ${tz} • HLC Carbon bed saturation detected; immediate filter change queued`,
        status: "Active",
        isResolved: false,
      },
      {
        id: 2,
        type: "DANGER",
        title: `Chamber Temperature Exceeded 1,050°C Alarm (${m.coreTemp.toLocaleString("en-US")}°C)`,
        desc: `Today, 14:22 ${tz} • High-plastic (32%) feed spike; automated blower throttling engaged`,
        status: "Active",
        isResolved: false,
      },
      {
        id: 3,
        type: "DANGER",
        title: `HCl Acid Gas Exceeded 15 ppmv Limit (${m.hcl} ppmv)`,
        desc: `Today, 13:40 ${tz} • Elevated chlorinated plastic feed; Nanogreen alkaline dosing boosted`,
        status: "Active",
        isResolved: false,
      },
    ];
  } else if (activeDevice.id === "1030") {
    incidents = [
      {
        id: 4,
        type: "INFO",
        title: "Scheduled Maintenance Lockout Active",
        desc: `Today, 07:30 ${tz} • Unit powered down safely at ${m.coreTemp}°C for dual blower & HLC service`,
        status: "In Maintenance",
        isResolved: true,
      },
    ];
  } else {
    incidents = [
      {
        id: 5,
        type: "INFO",
        title: "Continuous US EPA OSWI Compliance Verified (99.6%)",
        desc: `Today, 15:00 ${tz} • Stack PM (${m.pm25} mg/Nm³), CO (${m.co} ppmv), and HCl (${m.hcl} ppmv) well below EPA limits`,
        status: "Verified",
        isResolved: true,
      },
      {
        id: 6,
        type: "WARNING",
        title: "Transient Chamber Spike (1,022°C)",
        desc: `Today, 09:15 ${tz} • Within 1,100°C refractory rating; airflow stabilized to 865°C in 4 minutes`,
        status: "Resolved (09:19)",
        isResolved: true,
      },
    ];
  }

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">
          Safety &amp; EPA Incident Log — {activeDevice.name} (Sorted by Severity)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
                incident.type === "DANGER" && !incident.isResolved
                  ? "bg-danger/5 border-danger/20"
                  : incident.type === "WARNING"
                  ? "bg-warning/5 border-warning/20"
                  : "bg-slate-50 dark:bg-slate-800/50 border-border"
              }`}
            >
              <div className="flex items-start mb-3 sm:mb-0">
                <div
                  className={`p-2 rounded-md mr-4 shrink-0 ${
                    incident.type === "DANGER" && !incident.isResolved
                      ? "bg-danger/20 text-danger"
                      : incident.type === "WARNING"
                      ? "bg-warning/20 text-warning"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {incident.type === "DANGER" ? (
                    <XCircle className="h-5 w-5" />
                  ) : incident.type === "WARNING" ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <Info className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4
                    className={`font-semibold text-sm ${
                      incident.type === "DANGER" && !incident.isResolved
                        ? "text-danger"
                        : incident.type === "WARNING"
                        ? "text-warning dark:text-amber-500"
                        : "text-foreground"
                    }`}
                  >
                    {incident.type}: {incident.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{incident.desc}</p>
                </div>
              </div>
              <div className="sm:ml-4 shrink-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium border ${
                    incident.isResolved
                      ? "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500"
                      : incident.status === "Active"
                      ? "bg-danger text-white border-transparent"
                      : "border-warning/30 text-warning bg-transparent"
                  }`}
                >
                  {incident.isResolved && <CheckCircle className="w-3 h-3 mr-1" />}
                  {incident.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
