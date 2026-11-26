"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Camera, ArrowUpRight, AlertTriangle } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

export function WasteVisionFeed() {
  const { activeDevice } = useDevice();
  const isOffline = activeDevice.status === "maintenance";
  const m = activeDevice.metrics;

  const classifications = [
    { type: "Organic", pct: m.organic, color: "bg-green-500" },
    { type: "Plastic", pct: m.plastic, color: "bg-blue-500" },
    { type: "Paper", pct: m.paper, color: "bg-amber-500" },
    { type: "Metal", pct: m.metal, color: "bg-slate-500" },
    { type: "Glass", pct: m.glass, color: "bg-purple-500" },
    { type: "Hazardous (B3)", pct: m.hazardous, color: "bg-danger" },
  ];

  return (
    <Card className="h-full flex flex-col shadow-none border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-lg">AI Vision (YOLOv8) Preview</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-2.5 w-2.5 rounded-full ${
                isOffline ? "bg-slate-400" : "bg-danger animate-pulse"
              }`}
              title={isOffline ? "Camera standby" : "Live inference"}
            />
            <Link
              href="/vision"
              className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Full Vision
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-border">
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {!isOffline ? (
            <>
              <div
                className="absolute left-0 w-full h-16 bg-gradient-to-b from-transparent to-primary/20 border-b-2 border-primary/80 z-20"
                style={{ animation: "scan 2.5s ease-in-out infinite" }}
              />
              <div className="absolute top-[22%] left-[14%] w-[36%] h-[38%] border-2 border-green-500 rounded flex items-start p-1">
                <span className="bg-green-500 text-white text-[10px] px-1 font-bold">
                  Organic 94%
                </span>
              </div>
              <div className="absolute top-[46%] left-[56%] w-[30%] h-[40%] border-2 border-blue-500 rounded flex items-start p-1">
                <span className="bg-blue-500 text-white text-[10px] px-1 font-bold">
                  Plastic 89%
                </span>
              </div>
              {m.hazardous >= 5 && (
                <div className="absolute top-[14%] right-[8%] border-2 border-danger bg-danger/20 rounded px-2 py-0.5 flex items-center gap-1 text-[10px] font-bold text-white z-30">
                  <AlertTriangle className="w-3 h-3 text-danger" />
                  B3 ALERT
                </div>
              )}
              <span className="text-slate-400 font-mono text-xs z-10 bg-slate-950/70 px-2 py-1 rounded">
                LOADING_BAY_CAM • SN:{activeDevice.sn}
              </span>
            </>
          ) : (
            <span className="text-slate-400 font-mono text-xs z-10">
              CAMERA_STANDBY (UNIT IN MAINTENANCE)
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-auto">
          {classifications.map((item) => (
            <div
              key={item.type}
              className="flex items-center p-2.5 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/50"
            >
              <div className={`w-2.5 h-2.5 rounded-full mr-2.5 shrink-0 ${item.color}`} />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-slate-500 uppercase font-medium truncate">
                  {item.type}
                </div>
                <div className="text-base font-bold text-foreground">
                  {item.pct}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
