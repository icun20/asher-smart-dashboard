"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ShieldAlert, ShieldCheck, ScanEye, Leaf, Flame, Box, Info } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { VisionCameraFeed } from "@/components/vision/VisionCameraFeed";
import { WasteCategoryBreakdown } from "@/components/vision/WasteCategoryBreakdown";
import { VisionDetectionLog } from "@/components/vision/VisionDetectionLog";
import {
  SIMULATION_SCENARIOS,
  summarizeDetections,
  createInitialBatchLogs,
  type WasteDetectionBox,
  type VisionBatchLogEntry,
} from "@/lib/wasteVision";

export default function WasteVisionDashboard() {
  const { activeDevice } = useDevice();
  const [detections, setDetections] = useState<WasteDetectionBox[]>(
    SIMULATION_SCENARIOS[0].detections
  );
  const [activeSource, setActiveSource] = useState<
    "Trolley Cam" | "Photo Upload" | "Live Webcam"
  >("Trolley Cam");
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.7);
  const [logs, setLogs] = useState<VisionBatchLogEntry[]>(() =>
    createInitialBatchLogs(activeDevice.sn)
  );
  const [batchCounter, setBatchCounter] = useState<number>(105);

  useEffect(() => {
    setLogs(createInitialBatchLogs(activeDevice.sn));
    setBatchCounter(105);
  }, [activeDevice.sn]);

  const handleDetectionsUpdate = useCallback(
    (boxes: WasteDetectionBox[], source: "Trolley Cam" | "Photo Upload" | "Live Webcam") => {
      setDetections(boxes);
      setActiveSource(source);
    },
    []
  );

  const visibleDetections = detections.filter((d) => d.confidence >= confidenceThreshold);
  const summary = summarizeDetections(visibleDetections);

  const handleCaptureBatch = () => {
    if (visibleDetections.length === 0) return;

    const nowStr = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

    const newEntry: VisionBatchLogEntry = {
      id: `BCH-${activeDevice.sn}-${batchCounter}`,
      timestamp: `Today, ${nowStr}`,
      deviceSn: activeDevice.sn,
      source: activeSource,
      totalItems: summary.totalItems,
      totalWeightKg: summary.totalWeightKg,
      biogenicPct: summary.biogenicPct,
      fossilPct: summary.fossilPct,
      inertPct: summary.inertPct,
      dominantCategory: summary.dominantCategory,
      hasHazardous: summary.hasHazardous,
      categoryCounts: summary.counts,
    };

    setLogs((prev) => [newEntry, ...prev]);
    setBatchCounter((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-heading">
              AI Waste Vision Dashboard
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-foreground border border-primary/30">
              <ScanEye className="w-3.5 h-3.5 mr-1 text-primary" />
              YOLOv8 Pre-Feed Sampling
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Real-time computer vision waste classification &amp; B3 screening for{" "}
            <span className="font-medium text-foreground">{activeDevice.name}</span> (SN:{" "}
            {activeDevice.sn})
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-xs text-slate-500">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>
            Methodology: Top-layer trolley statistical sampling prior to 56×76 cm manual feed.
          </span>
        </div>
      </div>

      {/* Top KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
            <span>Detected Items</span>
            <Box className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-heading mt-2">
            {summary.totalItems}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Est. batch weight: {summary.totalWeightKg} kg
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
            <span>Biogenic Share</span>
            <Leaf className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-heading text-safe mt-2">
            {summary.biogenicPct}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Organic + Paper (CO₂ Neutral)</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
            <span>Fossil Share</span>
            <Flame className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-heading text-blue-600 dark:text-blue-400 mt-2">
            {summary.fossilPct}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Plastic polymers (Scope 1 factor)</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase">
            <span>B3 Safety Gate</span>
            {summary.hasHazardous ? (
              <ShieldAlert className="w-4 h-4 text-danger" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-safe" />
            )}
          </div>
          <div
            className={`text-xl md:text-2xl font-bold font-heading mt-2 ${
              summary.hasHazardous ? "text-danger" : "text-safe"
            }`}
          >
            {summary.hasHazardous ? "HOLD FEED" : "CLEARED"}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {summary.hasHazardous
              ? `${summary.counts.hazardous} prohibited item(s) flagged`
              : "No hazardous B3 detected"}
          </div>
        </div>
      </div>

      {/* Main Split: Computer Vision Feed + Category Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <VisionCameraFeed
            deviceSn={activeDevice.sn}
            deviceName={activeDevice.name}
            detections={detections}
            confidenceThreshold={confidenceThreshold}
            onConfidenceChange={setConfidenceThreshold}
            onDetectionsUpdate={handleDetectionsUpdate}
            onCaptureBatch={handleCaptureBatch}
          />
        </div>
        <div className="xl:col-span-5">
          <WasteCategoryBreakdown detections={visibleDetections} />
        </div>
      </div>

      {/* Historical Incoming Waste Batch Log */}
      <VisionDetectionLog logs={logs} />
    </div>
  );
}
