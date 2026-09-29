"use client";

import React from "react";
import { WasteVisionFeed } from "@/components/operator/WasteVisionFeed";
import { PredictiveMaintenanceList } from "@/components/operator/PredictiveMaintenanceList";
import { Filter, Calendar } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

export default function OperatorDashboard() {
  const { activeDevice } = useDevice();
  
  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight font-heading">Operator Dashboard</h2>
          <p className="text-slate-500 mt-1">Viewing operations for <span className="font-medium text-foreground">{activeDevice.name}</span></p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Filter className="mr-2 h-4 w-4 text-slate-500" />
          Filter Devices
        </button>
        
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
            <Calendar className="mr-2 h-4 w-4" />
            Feb 04, 2026 - Now
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-1">
          <WasteVisionFeed />
        </div>
        <div className="lg:col-span-1">
          <PredictiveMaintenanceList />
        </div>
      </div>
    </div>
  );
}
