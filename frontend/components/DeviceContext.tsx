"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { calculateCarbonAccounting } from "@/lib/carbonEngine";

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
  // Executive / Carbon (Monthly figures aligned with official Pamarai G7/G8 specs)
  carbonCreditValue: string;
  carbonCreditChange: string;
  carbonPricePerTonUsd: number;
  wasteProcessed: string;
  energyConsumed: string;
  // Numeric Analytics & Regional Localization
  estimatedValue: number; // Monthly Carbon Credit USD (@ $25/tCO2e)
  wasteProcessedTon: number; // Realistic monthly tons (A400: 20-100kg/hr, A250: 15-60kg/hr)
  energyConsumedKwh: number; // Realistic monthly kWh (A400EX: 16-28 kW/h, A400ES: 6-14 kW/h)
  gridEmissionFactor: number; // IEA regional kg CO2/kWh
  // Operator / Mass Balance & Circular Ash
  operatingHoursMonth: number;
  utilizationPct: number;
  dailyThroughputKg: number;
  ashOutputTon: number; // ~4% of input waste (#trash2ash4%)
  massReductionPct: number;
  ashValueUsd: number; // Est. soil conditioner / sand brick feedstock ($45/ton)
  latestAshBatchId: string;
  // HSE Stack Emissions (US EPA 40 CFR 60 OSWI, dry @ 7% O2) & Perimeter AQI
  aqi: number; // Ambient US EPA AQI around loading bay
  coreTemp: number; // Chamber temp °C (Pamarai spec: 300-1,100°C)
  pm25: number; // Stack Particulate Matter (mg/Nm³, EPA limit: 30)
  no2: number; // Stack NOx (ppmv, EPA limit: 103)
  so2: number; // Stack SO2 (ppmv, EPA limit: 3.1)
  co: number; // Stack CO (ppmv, EPA limit: 40)
  hcl: number; // Stack HCl acid gas (ppmv, EPA limit: 15)
  epaCompliancePct: number; // % of monthly operating hours within US EPA limits
  filtrationHealthPct: number; // HLC Carbon + Nanogreen scrubber efficiency %
  vaporDissipationRadiusM: string; // From Pamarai official spec
  // Incoming Waste Composition (%) from AI Vision sampling
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

function buildDevice(
  base: Omit<Device, "metrics">,
  rawMetrics: Omit<DeviceMetrics, "carbonCreditValue" | "estimatedValue" | "ashValueUsd">
): Device {
  const carbon = calculateCarbonAccounting({
    wasteProcessedTon: rawMetrics.wasteProcessedTon,
    energyConsumedKwh: rawMetrics.energyConsumedKwh,
    gridEmissionFactor: rawMetrics.gridEmissionFactor,
    organicPct: rawMetrics.organic,
    paperPct: rawMetrics.paper,
    plasticPct: rawMetrics.plastic,
    carbonPriceUsdPerTon: rawMetrics.carbonPricePerTonUsd,
    ashOutputTon: rawMetrics.ashOutputTon,
  });

  return {
    ...base,
    metrics: {
      ...rawMetrics,
      carbonCreditValue: `$${carbon.monthlyCreditValueUsd.toLocaleString("en-US")}`,
      estimatedValue: carbon.monthlyCreditValueUsd,
      ashValueUsd: carbon.monthlyAshValueUsd,
    },
  };
}

export const MOCK_DEVICES: Device[] = [
  buildDevice(
    {
      id: "1029",
      sn: "1029",
      name: "ASHER Alpha",
      model: "A400EX (Gen 8)",
      location: "Kuala Lumpur, Malaysia",
      timezone: "Asia/Kuala_Lumpur",
      timezoneLabel: "MYT",
      status: "active",
      maintenanceTasks: [
        {
          id: "alpha-1",
          action: "Replace HLC 4080 / 5050 / 2080 Carbon (40 kg each)",
          countdown: "14d",
          countdownDays: 14,
          reason: "Usage-based monthly G8 filtration cycle at 53% elapsed (44.2 tons)",
          accuracy: 96,
          urgency: "low",
        },
        {
          id: "alpha-2",
          action: "Top-Up Hi-Alkaline Nanogreen Solution (~110 L/mo)",
          countdown: "6d",
          countdownDays: 6,
          reason: "Weekly scrubber dosing check due based on 520 operating hours",
          accuracy: 94,
          urgency: "low",
        },
      ],
    },
    {
      // Official A400EX (G8): 20-100 kg/hr, 16-28 kW/h, 300-1100°C, 10-25m dissipation
      carbonCreditChange: "+12%",
      carbonPricePerTonUsd: 25,
      wasteProcessed: "44.2",
      energyConsumed: "10,400",
      wasteProcessedTon: 44.2,
      energyConsumedKwh: 10400,
      gridEmissionFactor: 0.585, // IEA Malaysia
      operatingHoursMonth: 520,
      utilizationPct: 86,
      dailyThroughputKg: 1480,
      ashOutputTon: 1.77, // 4.0%
      massReductionPct: 96.0,
      latestAshBatchId: "ASH-1029-084",
      aqi: 34,
      coreTemp: 865,
      pm25: 11.4,
      no2: 38.2,
      so2: 1.15,
      co: 14.8,
      hcl: 4.2,
      epaCompliancePct: 99.6,
      filtrationHealthPct: 91,
      vaporDissipationRadiusM: "10–25m",
      organic: 50,
      plastic: 15,
      paper: 20,
      metal: 7,
      glass: 6,
      hazardous: 2,
    }
  ),
  buildDevice(
    {
      id: "1030",
      sn: "1030",
      name: "ASHER Beta",
      model: "A250EX (Gen 8)",
      location: "New York, USA",
      timezone: "America/New_York",
      timezoneLabel: "EST",
      status: "maintenance",
      maintenanceTasks: [
        {
          id: "beta-1",
          action: "Service Dual Blower & Vacuum Fan Assembly",
          countdown: "12h",
          countdownDays: 1,
          reason: "Scheduled 1,500-hour preventive maintenance lockout active",
          accuracy: 95,
          urgency: "high",
        },
        {
          id: "beta-2",
          action: "Replace Monthly HLC Carbon & Inspect Ashtray Door Seal",
          countdown: "24h",
          countdownDays: 2,
          reason: "Required under Pamarai G8 warranty compliance schedule",
          accuracy: 93,
          urgency: "medium",
        },
      ],
    },
    {
      // Official A250EX (G8): 15-60 kg/hr, 16-28 kW/h, 300-1100°C, 10-25m dissipation
      carbonCreditChange: "-5%",
      carbonPricePerTonUsd: 25,
      wasteProcessed: "11.8",
      energyConsumed: "3,780",
      wasteProcessedTon: 11.8,
      energyConsumedKwh: 3780,
      gridEmissionFactor: 0.386, // IEA USA
      operatingHoursMonth: 210,
      utilizationPct: 35,
      dailyThroughputKg: 0,
      ashOutputTon: 0.47,
      massReductionPct: 96.0,
      latestAshBatchId: "ASH-1030-031",
      aqi: 16,
      coreTemp: 28,
      pm25: 1.8,
      no2: 2.0,
      so2: 0.08,
      co: 0.9,
      hcl: 0.3,
      epaCompliancePct: 100.0,
      filtrationHealthPct: 98,
      vaporDissipationRadiusM: "10–25m",
      organic: 0,
      plastic: 0,
      paper: 0,
      metal: 0,
      glass: 0,
      hazardous: 0,
    }
  ),
  buildDevice(
    {
      id: "1031",
      sn: "1031",
      name: "ASHER Gamma",
      model: "A400ES (Gen 7)",
      location: "Paris, France",
      timezone: "Europe/Paris",
      timezoneLabel: "CET",
      status: "warning",
      maintenanceTasks: [
        {
          id: "gamma-1",
          action: "Replace Saturated HLC 4080 / 5050 / 2080 Carbon (30 kg each)",
          countdown: "4h",
          countdownDays: 1,
          reason: "Stack PM (36.4 mg/Nm³) & HCl (16.8 ppmv) exceeded US EPA OSWI caps",
          accuracy: 98,
          urgency: "high",
        },
        {
          id: "gamma-2",
          action: "Flush Nanogreen Scrubber & Inspect Chamber Thermocouple",
          countdown: "8h",
          countdownDays: 1,
          reason: "Chamber peaked at 1,068°C due to high-plastic (32%) feedstock surge",
          accuracy: 94,
          urgency: "high",
        },
      ],
    },
    {
      // Official A400ES (G7): 20-100 kg/hr, 6-14 kW/h, 300-1100°C, 25-50m dissipation
      carbonCreditChange: "+6%",
      carbonPricePerTonUsd: 25,
      wasteProcessed: "34.5",
      energyConsumed: "5,060",
      wasteProcessedTon: 34.5,
      energyConsumedKwh: 5060,
      gridEmissionFactor: 0.056, // IEA France (nuclear-heavy low-carbon grid)
      operatingHoursMonth: 460,
      utilizationPct: 76,
      dailyThroughputKg: 1150,
      ashOutputTon: 1.52,
      massReductionPct: 95.6,
      latestAshBatchId: "ASH-1031-067",
      aqi: 114,
      coreTemp: 1068,
      pm25: 36.4,
      no2: 84.5,
      so2: 2.65,
      co: 44.2,
      hcl: 16.8,
      epaCompliancePct: 94.2,
      filtrationHealthPct: 61,
      vaporDissipationRadiusM: "25–50m",
      organic: 38,
      plastic: 32,
      paper: 14,
      metal: 6,
      glass: 4,
      hazardous: 6,
    }
  ),
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
