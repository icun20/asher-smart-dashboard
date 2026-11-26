"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type MaintenanceTask = {
  id: string;
  action: string;
  countdown: string;
  countdownDays: number;
  reason: string;
  accuracy: number;
  urgency: "high" | "medium" | "low";
};

export type DeviceMetrics = {
  // Executive / Carbon
  carbonCreditValue: string;
  carbonCreditChange: string;
  wasteProcessed: string;
  energyConsumed: string;
  // Numeric Analytics & HSE
  estimatedValue: number;
  wasteProcessedTon: number;
  energyConsumedKwh: number;
  gridEmissionFactor: number; // IEA kg CO2/kWh by deployment region
  aqi: number;
  coreTemp: number;
  pm25: number;
  no2: number;
  so2: number;
  co: number;
  // Incoming Waste Composition (%)
  organic: number;
  plastic: number;
  paper: number;
  metal: number;
  glass: number;
  hazardous: number;
};

export type Device = {
  id: string;
  name: string;
  model: string;
  sn: string;
  location: string;
  timezone: string;
  timezoneLabel: string;
  status: "active" | "maintenance" | "warning";
  metrics: DeviceMetrics;
  maintenanceTasks: MaintenanceTask[];
};

export const MOCK_DEVICES: Device[] = [
  {
    id: "1029",
    sn: "1029",
    name: "ASHER Alpha",
    model: "A400EX (Gen 8)",
    location: "Kuala Lumpur, Malaysia",
    timezone: "Asia/Kuala_Lumpur",
    timezoneLabel: "MYT",
    status: "active",
    metrics: {
      carbonCreditValue: "$4,850",
      carbonCreditChange: "+12%",
      wasteProcessed: "2,450",
      energyConsumed: "12,400",
      estimatedValue: 4850,
      wasteProcessedTon: 2450,
      energyConsumedKwh: 12400,
      gridEmissionFactor: 0.585,
      aqi: 42,
      coreTemp: 850,
      pm25: 12.4,
      no2: 0.018,
      so2: 0.068,
      co: 2.1,
      organic: 44,
      plastic: 24,
      paper: 16,
      metal: 8,
      glass: 6,
      hazardous: 2,
    },
    maintenanceTasks: [
      {
        id: "alpha-1",
        action: "Replace HLC 4080 Carbon Filter",
        countdown: "18d",
        countdownDays: 18,
        reason: "Cumulative throughput at 82% of rated lifecycle",
        accuracy: 96,
        urgency: "low",
      },
      {
        id: "alpha-2",
        action: "Refill Nanogreen Filtration Solution",
        countdown: "26d",
        countdownDays: 26,
        reason: "Usage-based consumption trend over 320 operating hours",
        accuracy: 94,
        urgency: "low",
      },
    ],
  },
  {
    id: "1030",
    sn: "1030",
    name: "ASHER Beta",
    model: "A300S (Gen 8)",
    location: "New York, USA",
    timezone: "America/New_York",
    timezoneLabel: "EST",
    status: "maintenance",
    metrics: {
      carbonCreditValue: "$1,200",
      carbonCreditChange: "-5%",
      wasteProcessed: "850",
      energyConsumed: "4,200",
      estimatedValue: 1200,
      wasteProcessedTon: 850,
      energyConsumedKwh: 4200,
      gridEmissionFactor: 0.386,
      aqi: 18,
      coreTemp: 25,
      pm25: 2.1,
      no2: 0.005,
      so2: 0.004,
      co: 0.1,
      organic: 0,
      plastic: 0,
      paper: 0,
      metal: 0,
      glass: 0,
      hazardous: 0,
    },
    maintenanceTasks: [
      {
        id: "beta-1",
        action: "Replace Blower Fan Assembly",
        countdown: "12h",
        countdownDays: 1,
        reason: "Scheduled 1,500-hour blower service interval reached",
        accuracy: 95,
        urgency: "high",
      },
      {
        id: "beta-2",
        action: "Clean Thermal Chamber & Ashtray Seal",
        countdown: "24h",
        countdownDays: 2,
        reason: "Post-cycle ash buildup inspection required before restart",
        accuracy: 92,
        urgency: "medium",
      },
    ],
  },
  {
    id: "1031",
    sn: "1031",
    name: "ASHER Gamma",
    model: "A400EX (Gen 7)",
    location: "Paris, France",
    timezone: "Europe/Paris",
    timezoneLabel: "CET",
    status: "warning",
    metrics: {
      carbonCreditValue: "$3,650",
      carbonCreditChange: "+8%",
      wasteProcessed: "1,920",
      energyConsumed: "9,800",
      estimatedValue: 3650,
      wasteProcessedTon: 1920,
      energyConsumedKwh: 9800,
      gridEmissionFactor: 0.056,
      aqi: 118,
      coreTemp: 940,
      pm25: 55.4,
      no2: 0.12,
      so2: 0.088,
      co: 11.2,
      organic: 36,
      plastic: 34,
      paper: 12,
      metal: 7,
      glass: 5,
      hazardous: 6,
    },
    maintenanceTasks: [
      {
        id: "gamma-1",
        action: "Replace HLC Emission Filter Immediately",
        countdown: "4h",
        countdownDays: 1,
        reason: "Stack PM2.5 exceeded 50 µg/m³ EPA threshold",
        accuracy: 97,
        urgency: "high",
      },
      {
        id: "gamma-2",
        action: "Inspect Thermocouple & Air Intake",
        countdown: "18h",
        countdownDays: 1,
        reason: "Chamber temperature sustained above 900°C target",
        accuracy: 91,
        urgency: "medium",
      },
    ],
  },
];

type DeviceContextType = {
  activeDevice: Device;
  setActiveDevice: (device: Device) => void;
  devices: Device[];
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [activeDevice, setActiveDevice] = useState<Device>(MOCK_DEVICES[0]);

  return (
    <DeviceContext.Provider value={{ activeDevice, setActiveDevice, devices: MOCK_DEVICES }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
}
