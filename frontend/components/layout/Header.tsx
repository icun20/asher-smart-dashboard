"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, ChevronDown, Check, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PwaInstallButton } from "@/components/PwaInstallButton";
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

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredDevices.length > 0) {
      setActiveDevice(filteredDevices[0]);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-3 sm:px-6 relative z-30 gap-2">
      <div className="flex items-center min-w-0" ref={dropdownRef}>
        {pathname !== "/" ? (
          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 sm:px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-border max-w-[210px] sm:max-w-none"
            >
              <div className="flex flex-col text-left min-w-0">
                <span className="font-semibold text-foreground text-sm leading-tight truncate">
                  {activeDevice.name}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight truncate">
                  SN: {activeDevice.sn} • {activeDevice.location}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 sm:w-72 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Scan/Type SN, Name, or City..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="p-2 max-h-60 overflow-y-auto">
                  <div className="text-xs font-semibold text-slate-500 uppercase px-2 py-1 mb-1">
                    Switch Device
                  </div>
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <button
                        type="button"
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
                        <div className="min-w-0 pr-2">
                          <div
                            className={cn(
                              "font-medium truncate",
                              activeDevice.id === device.id
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-foreground"
                            )}
                          >
                            {device.name}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            SN: {device.sn} • {device.location}
                          </div>
                        </div>
                        {activeDevice.id === device.id && (
                          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-sm text-slate-500 text-center">
                      No devices found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="font-semibold text-foreground text-base sm:text-lg truncate">
            Fleet Dashboard
          </div>
        )}
      </div>

      <div className="flex items-center gap-x-2 sm:gap-x-3 shrink-0">
        <LocalTime />
        <PwaInstallButton />
        <ThemeToggle />

        <Link
          href="/settings"
          className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Account Settings"
        >
          <User className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">TerraSync Studio</span>
        </Link>
      </div>
    </header>
  );
}

function LocalTime() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const str = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }).format(new Date());
        setTimeStr(str);
      } catch {
        setTimeStr("");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!timeStr) return null;
  return (
    <div className="text-sm font-medium text-slate-500 border-r border-border pr-4 hidden md:block whitespace-nowrap">
      {timeStr} (Local)
    </div>
  );
}
