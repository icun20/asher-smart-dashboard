"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Activity, Wrench, Leaf, Settings, PanelLeftClose, PanelLeftOpen, ChevronDown, MonitorStop, Menu } from "lucide-react";

const navigationGroups = [
  {
    title: "Home",
    items: [
      { name: "Device Overview", href: "/", icon: MonitorStop },
    ]
  },
  {
    title: "Device Dashboards",
    items: [
      { name: "Executive", href: "/executive", icon: BarChart3 },
      { name: "HSE", href: "/hse", icon: Activity },
      { name: "Operator", href: "/operator", icon: Wrench },
    ]
  },
  {
    title: "Manage",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      <div
        className={cn(
          "flex h-full flex-col bg-background border-r border-border transition-all duration-300 ease-in-out z-50",
          isMobile ? "fixed inset-y-0 left-0" : "relative",
          isCollapsed && isMobile ? "-translate-x-full" : "translate-x-0",
          isCollapsed && !isMobile ? "w-[72px]" : "w-64"
        )}
      >
      <div className={cn("flex h-16 shrink-0 items-center", isCollapsed ? "justify-center px-0" : "justify-between px-6")}>
        {!isCollapsed && (
          <div className="flex items-center">
            <Leaf className="w-6 h-6 text-foreground mr-2" />
            <span className="text-lg font-bold tracking-tight text-foreground font-heading whitespace-nowrap">
              The Asher
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
            isCollapsed && "mx-auto"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col px-3 py-6 space-y-6 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 whitespace-nowrap">
                {group.title}
              </h3>
            )}
            <div className={cn("space-y-1", isCollapsed && "space-y-2")}>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={cn(
                      "group flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200",
                      isCollapsed ? "justify-center px-0" : "px-3",
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-foreground"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        !isCollapsed && "mr-3",
                        isActive ? "text-foreground" : "text-slate-400 group-hover:text-slate-500"
                      )}
                      aria-hidden="true"
                    />
                    {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
      
      {/* Mobile Floating Toggle */}
      {isCollapsed && isMobile && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="md:hidden fixed bottom-6 right-6 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-transform active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
