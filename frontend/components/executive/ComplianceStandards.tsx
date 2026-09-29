import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

const standards = [
  { name: "GHG Protocol", desc: "Global standard for measuring greenhouse gas emissions." },
  { name: "ISO 14064-1", desc: "International standard for GHG quantification and reporting." },
  { name: "GRI Standards", desc: "Sustainability reporting framework guidelines." }
];

export function ComplianceStandards() {
  return (
    <Card className="shadow-none border-border">
      <CardHeader className="flex flex-row items-center space-x-2 pb-4">
        <ShieldCheck className="h-5 w-5 text-slate-400" />
        <CardTitle>ESG Compliance Standards</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {standards.map((std) => (
            <li key={std.name} className="flex items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-primary mr-3 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{std.name}</h4>
                <p className="text-sm text-slate-500">{std.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
