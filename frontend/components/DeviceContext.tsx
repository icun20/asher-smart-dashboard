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
  // Executive / Carbon (Monthly figures aligned with A400EX / A300S real capacity @ $25/tCO2e)
  carbonCreditValue: string;
  carbonCreditChange: string;
  carbonPricePerTonUsd: number;
  wasteProcessed: string;
  energyConsumed: string;
  // Numeric Analytics & HSE
  estimatedValue: number;
  wasteProcessedTon: number;
  energyConsumedKwh: number;
  gridEmissionFactor: number; // IEA kg CO2/kWh by deployment region
  // Operator / Mass Balance & Circular Ash
  operatingHoursMonth: number;
  utilizationPct: number;
  dailyThroughputKg: number;
  ashOutputTon: number; // ~4% of input waste
  massReductionPct: number;
  ashValueUsd: number; // Est. soil conditioner / brick feedstock value ($45/ton)
  latestAshBatchId: string;
  // HSE Emissions & Thermal
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
      // Net CO2e = 180*1.2 - (10800*0.585/1000 + 180*0.05) = 216 - 15.32 = 200.68 tCO2e -> @ $25 = $5,017
      carbonCreditValue: "$5,017",
      carbonCreditChange: "+12%",
      carbonPricePerTonUsd: 25,
      wasteProcessed: "180",
      energyConsumed: "10,800",
      estimatedValue: 5017,
      wasteProcessedTon: 180,
      energyConsumedKwh: 10800,
      gridEmissionFactor: 0.585,
      operatingHoursMonth: 468,
      utilizationPct: 86,
      dailyThroughputKg: 6040,
      ashOutputTon: 7.2,
      massReductionPct: 96.0,
      ashValueUsd: 324,
      latestAshBatchId: "ASH-1029-084",
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
        reason: "Usage-based consumption trend over 468 operating hours",
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
      // Net CO2e = 52*1.2 - (3120*0.386/1000 + 52*0.05) = 62.4 - 3.80 = 58.60 tCO2e -> @ $25 = $1,465
      carbonCreditValue: "$1,465",
      carbonCreditChange: "-5%",
      carbonPricePerTonUsd: 25,
      wasteProcessed: "52",
      energyConsumed: "3,120",
      estimatedValue: 1465,
      wasteProcessedTon: 52,
      energyConsumedKwh: 3120,
      gridEmissionFactor: 0.386,
      operatingHoursMonth: 174,
      utilizationPct: 32,
      dailyThroughputKg: 0,
      ashOutputTon: 2.1,
      massReductionPct: 96.0,
      ashValueUsd: 95,
      latestAshBatchId: "ASH-1030-031",
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
      // Net CO2e = 145*1.2 - (9200*0.056/1000 + 145*0.05) = 174 - 7.77 = 166.23 tCO2e -> @ $25 = $4,156
      carbonCreditValue: "$4,156",
      carbonCreditChange: "+8%",
      carbonPricePerTonUsd: 25,
      wasteProcessed: "145",
      energyConsumed: "9,200",
      estimatedValue: 4156,
      wasteProcessedTon: 145,
      energyConsumedKwh: 9200,
      gridEmissionFactor: 0.056,
      operatingHoursMonth: 392,
      utilizationPct: 74,
      dailyThroughputKg: 4820,
      ashOutputTon: 6.4,
      massReductionPct: 95.6,
      ashValueUsd: 288,
      latestAshBatchId: "ASH-1031-067",
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
