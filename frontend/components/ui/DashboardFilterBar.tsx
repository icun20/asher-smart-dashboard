"use client";

import React, { useState } from "react";
import { Filter, Calendar as CalendarIcon, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, startOfYear } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export function DashboardFilterBar({ 
  filterLabel = "Filter" 
}: { 
  filterLabel?: string 
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2026, 1, 4), // Feb 04, 2026
    to: new Date(),
  });
  
  const [compareMode, setCompareMode] = useState("Previous period");
  const [compareOpen, setCompareOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const compareOptions = [
    "Previous period",
    "Previous year",
    "No comparison"
  ];

  const quickDates = [
    { label: "Today", getRange: () => ({ from: new Date(), to: new Date() }) },
    { label: "Last 7 Days", getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "Last 30 Days", getRange: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: "Year to Date", getRange: () => ({ from: startOfYear(new Date()), to: new Date() }) },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 z-20 relative">
      <button className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors shadow-sm">
        <Filter className="mr-2 h-4 w-4 text-slate-500" />
        {filterLabel}
      </button>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Compare Dropdown */}
        <Popover open={compareOpen} onOpenChange={setCompareOpen}>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center justify-center sm:justify-start rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors shadow-sm text-slate-600 dark:text-slate-400">
              Compare: <span className="text-foreground ml-1">{compareMode}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 z-50 bg-card" align="end">
            <div className="space-y-1">
              {compareOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setCompareMode(option);
                    setCompareOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-2 text-sm rounded-md transition-colors",
                    compareMode === option 
                      ? "bg-slate-100 dark:bg-slate-800 text-foreground font-medium" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-foreground"
                  )}
                >
                  {option}
                  {compareMode === option && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Range Picker */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center justify-center sm:justify-start rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors shadow-sm text-slate-600 dark:text-slate-400 min-w-[240px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM dd, yyyy")} -{" "}
                    {format(date.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 flex flex-col md:flex-row z-50 bg-card" align="end">
            <div className="border-b md:border-b-0 md:border-r border-border p-4 w-full md:w-48 space-y-2 flex flex-col">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Dates</span>
              {quickDates.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setDate(preset.getRange());
                    setDateOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={typeof window !== 'undefined' && window.innerWidth > 768 ? 2 : 1}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
