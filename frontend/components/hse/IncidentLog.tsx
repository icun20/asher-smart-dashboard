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

  let incidents: SafetyIncident[] = [];

  if (activeDevice.id === "1031") {
    incidents = [
      {
        id: 1,
        type: "DANGER",
        title: `PM2.5 Emission Exceeded EPA Limit (${activeDevice.metrics.pm25} µg/m³)`,
        desc: `Today, 10:15 ${tz} • HLC Carbon filtration saturation alert triggered`,
        status: "Active",
        isResolved: false,
      },
      {
        id: 2,
        type: "DANGER",
        title: `Chamber Temperature Above Optimal Range (${activeDevice.metrics.coreTemp}°C)`,
        desc: `Today, 14:22 ${tz} • Automated air intake throttling engaged`,
        status: "Active",
        isResolved: false,
      },
      {
        id: 3,
        type: "WARNING",
        title: `SO₂ Level Approaching Limit (${activeDevice.metrics.so2} ppm)`,
        desc: `Today, 09:15 ${tz} • Nanogreen scrubber circulation increased`,
        status: "Monitoring",
        isResolved: false,
      },
    ];
  } else if (activeDevice.id === "1030") {
    incidents = [
      {
        id: 4,
        type: "INFO",
        title: "Scheduled Maintenance Lockout Active",
        desc: `Today, 07:30 ${tz} • Unit powered down safely at 25°C for blower & chamber service`,
        status: "In Maintenance",
        isResolved: true,
      },
    ];
  } else {
    incidents = [
      {
        id: 5,
        type: "WARNING",
        title: `SO₂ Level Approaching Advisory Threshold (${activeDevice.metrics.so2} ppm)`,
        desc: `Today, 09:15 ${tz} • Nanogreen filtration tank operating at peak efficiency`,
        status: "Monitoring",
        isResolved: false,
      },
      {
        id: 6,
        type: "DANGER",
        title: "Transient Thermal Spike Detected (912°C)",
        desc: `Today, 08:05 ${tz} • System automatically balanced airflow within 3 minutes`,
        status: "Resolved (08:08)",
        isResolved: true,
      },
    ];
  }

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">
          Safety Incident Log — {activeDevice.name} (Sorted by Severity)
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
                      : incident.type === "DANGER" && incident.isResolved
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
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
