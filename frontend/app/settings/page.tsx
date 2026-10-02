"use client";

import React, { useState } from "react";
import { User, Server, Bell, Palette, Shield, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "devices", name: "Fleet Management", icon: Server },
  { id: "alerts", name: "Alerts & Thresholds", icon: Bell },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "security", name: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight font-heading">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account settings and Asher EcoDash preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-slate-100 dark:bg-slate-800 text-foreground" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-foreground" : "text-slate-400"}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-border shadow-none">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account's profile information and email address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                    <input type="text" defaultValue="John Doe" className="w-full px-3 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                    <input type="email" defaultValue="johndoe@theasher.com" className="w-full px-3 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                    <input type="text" disabled defaultValue="HSE Executive" className="w-full px-3 py-2 border border-border rounded-md bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed" />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border px-6 py-4">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-border shadow-none">
                <CardHeader>
                  <CardTitle>Alert Thresholds</CardTitle>
                  <CardDescription>Configure when the system should trigger warning and danger alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Core Temperature Threshold (°C)</label>
                      <span className="text-sm text-danger font-bold">900°C</span>
                    </div>
                    <input type="range" min="500" max="1200" defaultValue="900" className="w-full accent-danger" />
                    <p className="text-xs text-slate-500">Temperatures above this value will trigger an automatic cooling sequence.</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">PM2.5 Danger Limit (µg/m³)</label>
                      <span className="text-sm text-danger font-bold">50 µg/m³</span>
                    </div>
                    <input type="range" min="10" max="150" defaultValue="50" className="w-full accent-danger" />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border px-6 py-4">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Save Thresholds
                  </button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {/* Mock states for other tabs */}
          {["devices", "appearance", "security"].includes(activeTab) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-border shadow-none">
                <CardHeader>
                  <CardTitle className="capitalize">
                    {tabs.find(t => t.id === activeTab)?.name} Settings
                  </CardTitle>
                  <CardDescription>This section is currently under construction for demo purposes.</CardDescription>
                </CardHeader>
                <CardContent className="py-24 flex flex-col items-center justify-center text-slate-400">
                  <Server className="w-12 h-12 mb-4 opacity-20" />
                  <p>Configuration options will appear here.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
