"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

export function IncidentLog() {
  const { activeDevice } = useDevice();
  
  // Base incidents for alpha
  let incidents = [
    {
      id: 1,
      type: "DANGER",
      title: "Extreme Temperature Detected (940°C)",
      desc: "Today, 14:22 WIB • System automatically reduced oxygen supply",
      status: "Resolved (14:25)",
      isResolved: true
    },
    {
      id: 2,
      type: "WARNING",
      title: "SO₂ Level Approaching Limit (0.068 ppm)",
      desc: "Today, 09:15 WIB • Wet filter double activated",
      status: "Monitoring",
      isResolved: false
    }
  ];

  if (activeDevice.id === "1031") {
    incidents = [
      {
        id: 3,
        type: "DANGER",
        title: "PM2.5 Emission Exceeded Limit (55.4 µg/m³)",
        desc: "Today, 10:15 WIB • Electrostatic filter system automatically fully active",
        status: "Active",
        isResolved: false
      },
      ...incidents
    ];
  }

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xs text-slate-500 uppercase tracking-wider">
          Safety Incident Log (Sorted by Severity)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div 
              key={incident.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
                incident.type === "DANGER" && !incident.isResolved ? "bg-danger/5 border-danger/20" :
                incident.type === "DANGER" && incident.isResolved ? "bg-slate-50 dark:bg-slate-800/50 border-border" :
                "bg-warning/5 border-warning/20"
              }`}
            >
              <div className="flex items-start mb-3 sm:mb-0">
                <div className={`p-2 rounded-md mr-4 shrink-0 ${
                  incident.type === "DANGER" && !incident.isResolved ? "bg-danger/20 text-danger" :
                  incident.type === "DANGER" && incident.isResolved ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" :
                  "bg-warning/20 text-warning"
                }`}>
                  {incident.type === "DANGER" ? <XCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className={`font-semibold text-sm ${
                    incident.type === "DANGER" && !incident.isResolved ? "text-danger" :
                    incident.type === "DANGER" && incident.isResolved ? "text-foreground" :
                    "text-warning dark:text-amber-500"
                  }`}>
                    {incident.type}: {incident.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{incident.desc}</p>
                </div>
              </div>
              <div className="sm:ml-4 shrink-0">
                <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium border ${
                  incident.isResolved ? "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500" :
                  incident.status === "Active" ? "bg-danger text-white border-transparent" :
                  "border-warning/30 text-warning bg-transparent"
                }`}>
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
