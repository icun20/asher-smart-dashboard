"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, Wrench, ArrowRightLeft, X, Filter, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from "recharts";
import { useDevice } from "@/components/DeviceContext";

const ALL_METRICS = [
  { id: "estimatedValue", label: "Estimated Value", unit: "$", color: "#10b981", isCurrency: true },
  { id: "wasteProcessedTon", label: "Waste Processed", unit: "Ton", color: "#3b82f6" },
  { id: "energyConsumedKwh", label: "Energy Consumed", unit: "kWh", color: "#f59e0b" },
  { id: "aqi", label: "Air Quality Index (AQI)", unit: "Idx", color: "#06b6d4" },
  { id: "coreTemp", label: "Core Temperature", unit: "°C", color: "#ef4444" },
  { id: "pm25", label: "PM2.5", unit: "µg/m³", color: "#8b5cf6" },
  { id: "no2", label: "NO₂", unit: "ppm", color: "#ec4899" },
  { id: "co", label: "CO", unit: "ppm", color: "#f97316" },
  { id: "organic", label: "Organic Waste", unit: "%", color: "#84cc16" },
  { id: "plastic", label: "Plastic Waste", unit: "%", color: "#0ea5e9" },
  { id: "metal", label: "Metal Waste", unit: "%", color: "#64748b" },
  { id: "hazardous", label: "Hazardous (B3)", unit: "%", color: "#dc2626" },
];

export default function DeviceOverview() {
  const { devices: fleet } = useDevice();
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  // Selection States for Analytics
  const [selectedDevices, setSelectedDevices] = useState<string[]>(["1029", "1031"]); // Default select Alpha & Gamma
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["estimatedValue", "coreTemp"]); // Default metrics

  const toggleDevice = (id: string) => {
    setSelectedDevices(prev => 
      prev.includes(id) ? prev.filter(deviceId => deviceId !== id) : [...prev, id]
    );
  };

  const toggleMetric = (id: string) => {
    setSelectedMetrics(prev => 
      prev.includes(id) ? prev.filter(metricId => metricId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 relative pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight font-heading">
            {isCompareMode ? "Analytics & Comparison" : "Device Overview"}
          </h2>
          <p className="text-slate-500 mt-1">
            {isCompareMode 
              ? "Deep dive into technical metrics across your fleet." 
              : "Monitor all active and inactive incinerator devices across locations."}
          </p>
        </div>
        <button
          onClick={() => setIsCompareMode(!isCompareMode)}
          className={cn(
            "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors border shadow-sm",
            isCompareMode 
              ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700" 
              : "bg-card text-foreground border-border hover:bg-slate-50 dark:hover:bg-slate-900/50"
          )}
        >
          {isCompareMode ? <X className="mr-2 h-4 w-4" /> : <BarChart3 className="mr-2 h-4 w-4" />}
          {isCompareMode ? "Exit Analytics" : "Advanced Compare"}
        </button>
      </div>

      {!isCompareMode ? (
        /* STANDARD OVERVIEW MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {fleet.map((unit) => (
            <Link href="/executive" key={unit.id} className="block group/card">
              <div className="bg-card border border-border rounded-xl p-5 hover:border-slate-400 hover:shadow-md transition-all h-full flex flex-col relative">
                <div className="flex justify-between items-start mb-4 pr-8">
                  <div>
                    <h3 className="font-semibold text-lg group-hover/card:text-blue-600 transition-colors">{unit.name}</h3>
                    <div className="text-sm text-slate-500 flex items-center flex-wrap gap-1 mt-0.5">
                    <span>SN: {unit.id} • {unit.location}</span>
                    <span className="hidden sm:inline">•</span>
                    <DeviceTime timezone={unit.timezone} />
                  </div>
                  </div>
                  {unit.status === 'active' && <CheckCircle2 className="text-safe w-6 h-6 shrink-0" />}
                  {unit.status === 'warning' && <AlertTriangle className="text-warning w-6 h-6 shrink-0" />}
                  {unit.status === 'maintenance' && <Activity className="text-slate-400 w-6 h-6 shrink-0" />}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-auto pt-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500 mb-1">Core Temp</div>
                    <div className={cn("font-semibold text-lg", unit.metrics.coreTemp >= 900 ? "text-danger" : "text-safe")}>{unit.metrics.coreTemp}°C</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500 mb-1">Emissions</div>
                    <div className={cn("font-semibold text-lg", unit.status === 'warning' ? "text-warning dark:text-amber-500" : "")}>{unit.status === 'warning' ? 'High NOx' : unit.status === 'active' ? 'Normal' : 'N/A'}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-500 mb-1">Est. Value</div>
                    <div className="font-semibold text-lg text-foreground">{unit.metrics.carbonCreditValue}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 relative group/tooltip">
                    <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
                      Maintenance
                    </div>
                    <div className="font-semibold flex items-center">
                      {unit.maintenanceTasks.length === 0 ? (
                        <span className="text-safe text-sm">All Clear</span>
                      ) : (
                        <span className="text-warning text-sm flex items-center">
                          <Wrench className="w-3.5 h-3.5 mr-1" />
                          {unit.maintenanceTasks.length} Tasks
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* ADVANCED COMPARE MODE */
        <div className="flex flex-col md:flex-row gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
          
          {/* Left Sidebar Filters */}
          <div className="w-full md:w-72 flex-shrink-0 space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-border">
                <Filter className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold">Compare Filters</h3>
              </div>
              
              {/* Device Selection */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">1. Select Devices</h4>
                <div className="space-y-2">
                  {fleet.map(unit => (
                    <div 
                      key={unit.id} 
                      onClick={() => toggleDevice(unit.id)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        selectedDevices.includes(unit.id) ? "bg-primary border-primary text-primary-foreground" : "border-slate-300 dark:border-slate-600 bg-transparent group-hover:border-primary"
                      )}>
                        {selectedDevices.includes(unit.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-foreground select-none">{unit.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric Selection */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">2. Select Metrics</h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {ALL_METRICS.map(metric => (
                    <div 
                      key={metric.id} 
                      onClick={() => toggleMetric(metric.id)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0",
                        selectedMetrics.includes(metric.id) ? "bg-primary border-primary text-primary-foreground" : "border-slate-300 dark:border-slate-600 bg-transparent group-hover:border-primary"
                      )}>
                        {selectedMetrics.includes(metric.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex flex-col select-none">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-foreground leading-none">{metric.label}</span>
                        <span className="text-[10px] text-slate-400 mt-1">Unit: {metric.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Chart Area */}
          <div className="flex-1 space-y-6">
            {selectedDevices.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center h-full text-slate-500">
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                <h3 className="font-semibold text-lg text-foreground">No Devices Selected</h3>
                <p>Please select at least one device from the filter panel to begin comparison.</p>
              </div>
            ) : selectedMetrics.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center h-full text-slate-500">
                <Filter className="w-12 h-12 mb-4 opacity-20" />
                <h3 className="font-semibold text-lg text-foreground">No Metrics Selected</h3>
                <p>Please select the metrics you want to compare from the filter panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedMetrics.map(metricId => {
                  const metricDef = ALL_METRICS.find(m => m.id === metricId)!;
                  
                  // Prepare chart data for this specific metric
                  const chartData = selectedDevices.map(deviceId => {
                    const unit = fleet.find(u => u.id === deviceId)!;
                    return {
                      name: unit.name.replace("Incinerator ", ""),
                      value: (unit.metrics as any)[metricId],
                    };
                  });

                  return (
                    <div key={metricId} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col animate-in zoom-in-95 duration-300">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-semibold text-foreground flex items-center">
                          {metricDef.label}
                        </h4>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                          {metricDef.unit}
                        </span>
                      </div>
                      
                      <div className="h-64 w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.7 }} dy={5} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.7 }} width={55} />
                            <RechartsTooltip 
                              cursor={{ fill: 'var(--border)', opacity: 0.4 }}
                              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                              formatter={(value: any) => [
                                metricDef.isCurrency ? `$${value.toLocaleString()}` : `${value} ${metricDef.unit}`, 
                                metricDef.label
                              ]}
                            />
                            <Bar 
                              dataKey="value" 
                              fill={metricDef.color} 
                              radius={[4, 4, 0, 0]} 
                              maxBarSize={80}
                              animationDuration={1000}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}

function DeviceTime({ timezone }: { timezone: string }) {
  const [timeStr, setTimeStr] = useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      try {
        const str = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(new Date());
        setTimeStr(str);
      } catch (e) {
        setTimeStr("");
      }
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [timezone]);

  if (!timeStr) return null;
  return <span className="font-medium text-slate-400">({timeStr} Local)</span>;
}
