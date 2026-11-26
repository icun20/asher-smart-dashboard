"use client";

import React, { useState, useEffect } from "react";
import { User, Server, Bell, Palette, Shield, Save, Check, Sun, Moon, Monitor, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { useDevice } from "@/components/DeviceContext";

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "devices", name: "Fleet Management", icon: Server },
  { id: "alerts", name: "Alerts & Thresholds", icon: Bell },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "security", name: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { devices, activeDevice, setActiveDevice, thresholds, updateThresholds, resetThresholds } =
    useDevice();
  const { theme, setTheme } = useTheme();

  // Profile state
  const [profileName, setProfileName] = useState("John Doe");
  const [profileEmail, setProfileEmail] = useState("johndoe@theasher.com");
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Draft threshold state synced with shared DeviceContext
  const [tempThreshold, setTempThreshold] = useState(thresholds.tempAlarmC);
  const [pmLimit, setPmLimit] = useState(thresholds.pmLimitMgNm3);
  const [b3AutoAlert, setB3AutoAlert] = useState(thresholds.b3AutoAlert);

  useEffect(() => {
    setTempThreshold(thresholds.tempAlarmC);
    setPmLimit(thresholds.pmLimitMgNm3);
    setB3AutoAlert(thresholds.b3AutoAlert);
  }, [thresholds]);

  const showSaved = (message: string) => {
    setSavedNotice(message);
    setTimeout(() => setSavedNotice(null), 2800);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight font-heading">
          Settings
        </h2>
        <p className="text-sm md:text-base text-slate-500 mt-1">
          Manage your account, live HSE alert thresholds, and Asher EcoDash preferences.
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-lg border border-safe/30 bg-safe/10 px-4 py-2.5 text-sm font-medium text-safe">
          <Check className="w-4 h-4 shrink-0" />
          {savedNotice}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-foreground"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-foreground" : "text-slate-400"
                  }`}
                />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information and email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value="HSE & ESG Executive"
                    className="w-full px-3 py-2 border border-border rounded-md bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border px-6 py-4">
                <button
                  type="button"
                  onClick={() => showSaved("Profile changes saved.")}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "devices" && (
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle>Connected ASHER Fleet</CardTitle>
                <CardDescription>
                  Select the active unit for telemetry, ESG reporting, and Computer Vision feeds.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {devices.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div>
                      <div className="font-semibold text-foreground">
                        {unit.name}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          ({unit.model})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        SN: {unit.sn} • {unit.location} • Grid EF: {unit.metrics.gridEmissionFactor} kg CO₂/kWh
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Baseline: {unit.metrics.landfillBaselineLabel}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDevice(unit);
                        showSaved(`Active unit switched to ${unit.name}.`);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
                        activeDevice.id === unit.id
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {activeDevice.id === unit.id ? "Active Unit" : "Set Active"}
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "alerts" && (
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle>Live HSE &amp; Vision Alert Thresholds</CardTitle>
                <CardDescription>
                  Changes applied here immediately update alarm states across HSE, Overview, and ESG compliance monitors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Chamber Overheat Alarm (°C — Rated Max 1,100°C)
                    </label>
                    <span className="text-sm text-danger font-bold">
                      {tempThreshold.toLocaleString("en-US")}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min={850}
                    max={1100}
                    step={10}
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(Number(e.target.value))}
                    className="w-full accent-danger"
                  />
                  <p className="text-xs text-slate-500">
                    Temperatures above this threshold trigger an overheating alarm on HSE &amp; ESG monitors.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Stack PM Compliance Cap (mg/Nm³ @ 7% O₂ — Statutory US EPA OSWI: 30)
                    </label>
                    <span className="text-sm text-danger font-bold">{pmLimit} mg/Nm³</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={45}
                    step={1}
                    value={pmLimit}
                    onChange={(e) => setPmLimit(Number(e.target.value))}
                    className="w-full accent-danger"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      AI Vision Hazardous (B3) Pre-Load Alarm
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Flag operators if batteries, pressurized cans, or e-waste are detected on the loading trolley.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={b3AutoAlert}
                    onChange={(e) => setB3AutoAlert(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border px-6 py-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateThresholds({
                      tempAlarmC: tempThreshold,
                      pmLimitMgNm3: pmLimit,
                      b3AutoAlert,
                    });
                    showSaved("Live HSE alert thresholds updated across all dashboards.");
                  }}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Apply Live Thresholds
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetThresholds();
                    showSaved("Thresholds reset to US EPA OSWI & Pamarai defaults.");
                  }}
                  className="border border-border bg-card px-3.5 py-2 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center text-slate-600 dark:text-slate-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Defaults
                </button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Choose the display theme for your Asher EcoDash workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Monitor },
                  ].map((item) => {
                    const Icon = item.icon;
                    const selected = theme === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setTheme(item.id)}
                        className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border transition-colors ${
                          selected
                            ? "border-primary bg-primary/10 text-foreground font-semibold"
                            : "border-border bg-card text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle>Security &amp; API Access</CardTitle>
                <CardDescription>
                  Gateway authentication and telemetry encryption status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      TLS 1.3 Edge-to-Cloud Encryption
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      All IoT gateway payloads and camera snapshots are encrypted in transit.
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-safe/15 text-safe">
                    Active
                  </span>
                </div>
                <div className="p-4 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Environment-Managed Credentials
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      API keys and registry secrets are injected strictly via server environment variables.
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-safe/15 text-safe">
                    Enforced
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
