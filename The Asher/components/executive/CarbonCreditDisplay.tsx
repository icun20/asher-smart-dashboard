import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Leaf } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function CarbonCreditDisplay() {
  const { activeDevice } = useDevice();
  const isPositive = activeDevice.metrics.carbonCreditChange.startsWith("+");
  return (
    <Card className="flex flex-col md:flex-row overflow-hidden border border-border">
      <div className="flex-1 p-8 flex flex-col justify-center">
        <div className="inline-flex items-center text-sm font-semibold text-primary mb-2">
          <Leaf className="h-4 w-4 mr-1.5" />
          Carbon Credit Generation
        </div>
        <h3 className="text-2xl font-semibold mb-2 font-heading tracking-tight">Estimated Value</h3>
        <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
          Track the estimated financial value generated from reducing carbon emissions based on the difference between baseline landfill emissions and the Asher's operations.
        </p>
        
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50">
            View Details
          </button>
        </div>
      </div>
      
      <div className="bg-slate-50/50 dark:bg-slate-900 border-t md:border-t-0 md:border-l border-border p-8 flex flex-col items-center justify-center min-w-[300px]">
        <div className="text-5xl font-bold font-heading tracking-tight text-foreground"><AnimatedNumber value={activeDevice.metrics.carbonCreditValue} /></div>
        <div className="flex items-center text-sm mt-3 text-slate-500">
          <span className={`flex items-center font-medium mr-2 ${isPositive ? "text-primary" : "text-amber-500"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {activeDevice.metrics.carbonCreditChange}
          </span>
          from last period
        </div>
      </div>
    </Card>
  );
}
