import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Camera, Box } from "lucide-react";

const classifications = [
  { type: "Plastik", count: 42, color: "bg-blue-500" },
  { type: "Organik", count: 128, color: "bg-green-500" },
  { type: "Logam", count: 15, color: "bg-slate-500" },
  { type: "B3", count: 2, color: "bg-danger" },
];

export function WasteVisionFeed() {
  return (
    <Card className="h-full flex flex-col shadow-none border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-slate-400" />
          <CardTitle>AI Vision (YOLOv8) Feed</CardTitle>
          <span className="ml-auto flex h-2 w-2 rounded-full bg-danger animate-pulse"></span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-border">
          {/* Mock Camera Feed Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          {/* Scanner Animation */}
          <div 
            className="absolute left-0 w-full h-16 bg-gradient-to-b from-transparent to-primary/20 border-b-2 border-primary/80 z-20"
            style={{ animation: 'scan 2.5s ease-in-out infinite' }}
          />
          
          {/* Mock bounding boxes */}
          <div className="absolute top-[30%] left-[20%] w-[120px] h-[80px] border-2 border-green-500 rounded flex items-start p-1">
            <span className="bg-green-500 text-white text-[10px] px-1 font-bold">Organik 92%</span>
          </div>
          <div className="absolute top-[50%] left-[60%] w-[90px] h-[110px] border-2 border-blue-500 rounded flex items-start p-1">
            <span className="bg-blue-500 text-white text-[10px] px-1 font-bold">Plastik 88%</span>
          </div>

          <span className="text-slate-500 font-mono text-sm z-10">CAMERA_FEED_ACTIVE</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          {classifications.map((item) => (
            <div key={item.type} className="flex items-center p-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/50">
              <div className={`w-3 h-3 rounded-full mr-3 ${item.color}`} />
              <div className="flex-1">
                <div className="text-xs text-slate-500 uppercase font-medium">{item.type}</div>
                <div className="text-lg font-bold text-foreground">{item.count} <span className="text-xs font-normal text-slate-400">items/hr</span></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
