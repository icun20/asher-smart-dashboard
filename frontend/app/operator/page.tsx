"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OperatorKpiGrid } from "@/components/operator/OperatorKpiGrid";
import { MassBalanceCard } from "@/components/operator/MassBalanceCard";
import { PredictiveMaintenanceList } from "@/components/operator/PredictiveMaintenanceList";
import { DashboardFilterBar } from "@/components/ui/DashboardFilterBar";
import { ScanEye, ArrowRight } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

export default function OperatorDashboard() {
  const { activeDevice } = useDevice();
  const [selectedView, setSelectedView] = useState("All Operations");

  const showMassBalance =
    selectedView === "All Operations" || selectedView === "Mass Balance & Ash";
  const showMaintenance =
    selectedView === "All Operations" || selectedView === "Consumables & Service";

  return (
    <div className="space-y-6 pb-8">
      {/* Title & Vision Studio CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-heading">
            Operator Dashboard
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Machine utilization, mass balance &amp; consumables for{" "}
            <span className="font-medium text-foreground">{activeDevice.name}</span> (
            {activeDevice.model})
          </p>
        </div>
        <Link
          href="/vision"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-primary/90"
        >
          <ScanEye className="mr-2 h-4 w-4" />
          Open AI Waste Vision
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <DashboardFilterBar
        filterLabel="View"
        filterOptions={["All Operations", "Mass Balance & Ash", "Consumables & Service"]}
        onFilterChange={setSelectedView}
      />

      {/* Live Operational Telemetry KPIs */}
      <OperatorKpiGrid />

      {/* Mass Balance (Ash Circularity) & Usage-Based Predictive Maintenance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {showMassBalance && (
          <div className={showMaintenance ? "lg:col-span-1" : "lg:col-span-2"}>
            <MassBalanceCard />
          </div>
        )}
        {showMaintenance && (
          <div className={showMassBalance ? "lg:col-span-1" : "lg:col-span-2"}>
            <PredictiveMaintenanceList />
          </div>
        )}
      </div>
    </div>
  );
}
