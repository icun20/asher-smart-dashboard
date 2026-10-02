"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Check, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { useDevice } from "@/components/DeviceContext";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { activeDevice, setActiveDevice, devices } = useDevice();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.sn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredDevices.length > 0) {
      setActiveDevice(filteredDevices[0]);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6 relative z-30">
      <div className="flex items-center" ref={dropdownRef}>
        {pathname !== "/" ? (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-border"
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-foreground text-sm leading-tight">{activeDevice.name}</span>
                <span className="text-[11px] text-slate-500 leading-tight">SN: {activeDevice.sn} • {activeDevice.location}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Scan/Type SN or Name..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="p-2 max-h-60 overflow-y-auto">
                  <div className="text-xs font-semibold text-slate-500 uppercase px-2 py-1 mb-1">Switch Device</div>
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <button
                        key={device.id}
                        onClick={() => {
                          setActiveDevice(device);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-2 text-sm text-left rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                          activeDevice.id === device.id ? "bg-slate-50 dark:bg-slate-800/50" : ""
                        )}
                      >
                        <div>
                          <div className={cn("font-medium", activeDevice.id === device.id ? "text-blue-600 dark:text-blue-400" : "text-foreground")}>{device.name}</div>
                          <div className="text-xs text-slate-500">SN: {device.sn}</div>
                        </div>
                        {activeDevice.id === device.id && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-sm text-slate-500 text-center">No devices found.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="font-semibold text-foreground text-lg">Dashboard</div>
        )}
      </div>

      <div className="flex items-center gap-x-4">
        <LocalTime />
        <ThemeToggle />
        
        <div className="flex items-center text-sm font-medium text-slate-600 hover:text-foreground cursor-pointer transition-colors">
          <User className="h-4 w-4 mr-2" />
          TerraSync Studio
        </div>
      </div>
    </header>
  );
}

function LocalTime() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const str = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short'
        }).format(new Date());
        setTimeStr(str);
      } catch (e) {
        setTimeStr("");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!timeStr) return null;
  return <div className="text-sm font-medium text-slate-500 mr-2 border-r border-border pr-4 hidden sm:block">{timeStr} (Your Local)</div>;
}
