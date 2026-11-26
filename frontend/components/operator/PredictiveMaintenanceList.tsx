"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Wrench, Clock, Activity, CheckCircle2 } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";

export function PredictiveMaintenanceList() {
  const { activeDevice } = useDevice();
  const tasks = activeDevice.maintenanceTasks;

  const getTriggerBasis = (urgency: "high" | "medium" | "low") => {
    if (urgency === "high") return "Sensor / Lockout Trigger";
    if (urgency === "medium") return "Warranty Interval";
    return "Usage Counter (Spec)";
  };

  return (
    <Card className="h-full shadow-none border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-lg">Filtration Consumables &amp; Service Schedule</CardTitle>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Usage-based tracking</span>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-safe mb-3" />
            <h4 className="font-semibold text-foreground">All Systems Nominal</h4>
            <p className="text-sm mt-1">
              No immediate consumable replacements or service tasks required for {activeDevice.name}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/30 flex flex-col space-y-3 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${
                    task.urgency === "high"
                      ? "bg-danger"
                      : task.urgency === "medium"
                      ? "bg-warning"
                      : "bg-primary"
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 pl-2">
                  <div>
                    <h4 className="font-bold text-foreground">{task.action}</h4>
                    <div className="flex items-start text-xs sm:text-sm text-slate-500 mt-1">
                      <Activity className="h-3.5 w-3.5 mr-1.5 mt-0.5 shrink-0" />
                      <span>{task.reason}</span>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="flex items-center sm:justify-end text-base sm:text-lg font-extrabold text-foreground">
                      <Clock className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                      {task.countdown}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {getTriggerBasis(task.urgency)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
