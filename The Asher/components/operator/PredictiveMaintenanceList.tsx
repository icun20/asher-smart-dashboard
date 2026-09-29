import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Wrench, Clock, ActivitySquare } from "lucide-react";

const tasks = [
  {
    id: 1,
    action: "Ganti Kipas Blower",
    countdown: 12,
    reason: "Anomali getaran bearing",
    accuracy: 94,
    urgency: "high"
  },
  {
    id: 2,
    action: "Bersihkan Ruang Plasma",
    countdown: 24,
    reason: "Tumpukan abu sensor optik",
    accuracy: 88,
    urgency: "medium"
  },
  {
    id: 3,
    action: "Ganti Filter Emisi",
    countdown: 34,
    reason: "Tren partikulat PM2.5 meningkat",
    accuracy: 96,
    urgency: "low"
  }
];

export function PredictiveMaintenanceList() {
  return (
    <Card className="h-full shadow-none border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Wrench className="h-5 w-5 text-slate-400" />
          <CardTitle>AI Predictive Maintenance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/30 flex flex-col space-y-3 relative overflow-hidden">
              {/* Urgency accent border */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                task.urgency === 'high' ? 'bg-danger' : task.urgency === 'medium' ? 'bg-warning' : 'bg-primary'
              }`} />
              
              <div className="flex justify-between items-start pl-2">
                <div>
                  <h4 className="font-bold text-foreground">{task.action}</h4>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <ActivitySquare className="h-3.5 w-3.5 mr-1" />
                    {task.reason}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-lg font-extrabold text-foreground">
                    <Clock className="h-4 w-4 mr-1.5 text-primary" />
                    {task.countdown} Hari
                  </div>
                  <div className="text-xs font-semibold text-primary mt-0.5">
                    Akurasi AI: {task.accuracy}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
