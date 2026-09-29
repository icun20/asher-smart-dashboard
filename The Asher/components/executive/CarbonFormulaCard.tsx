import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calculator } from "lucide-react";
import { useDevice } from "@/components/DeviceContext";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function CarbonFormulaCard() {
  const { activeDevice } = useDevice();
  return (
    <Card className="shadow-none border-border">
      <CardHeader className="flex flex-row items-center space-x-2 pb-4">
        <Calculator className="h-5 w-5 text-slate-400" />
        <CardTitle>Carbon Saved Calculation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto mb-4">
          <p className="text-slate-600 dark:text-slate-300">
            Carbon Saved = <br className="md:hidden" />
            <span className="text-primary font-bold">Baseline Emisi TPA</span> (Tonase × 1.2)
            <br className="md:hidden" /> - <br className="md:hidden" />
            <span className="text-danger font-bold">Emisi ASHER</span> (kWh × EF + Tonase × 0.05)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-slate-500 mb-1">Waste Processed (Tonase)</span>
            <span className="text-2xl font-bold"><AnimatedNumber value={activeDevice.metrics.wasteProcessed} /> <span className="text-base font-normal text-slate-400">tons</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-500 mb-1">Energy Consumed</span>
            <span className="text-2xl font-bold"><AnimatedNumber value={activeDevice.metrics.energyConsumed} /> <span className="text-base font-normal text-slate-400">kWh</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
