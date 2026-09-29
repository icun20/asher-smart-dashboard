"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Device = {
  id: string;
  name: string;
  sn: string;
  location: string;
  timezone: string;
  status: "active" | "maintenance" | "warning";
  metrics: {
    // Executive / Carbon
    carbonCreditValue: string;
    carbonCreditChange: string;
    wasteProcessed: string;
    energyConsumed: string;
    // HSE & Comparison
    estimatedValue: number;
    wasteProcessedTon: number;
    energyConsumedKwh: number;
    aqi: number;
    coreTemp: number;
    pm25: number;
    no2: number;
    co: number;
    organic: number;
    plastic: number;
    metal: number;
    hazardous: number;
  };
  maintenanceTasks: { action: string; countdown: string }[];
};

export const MOCK_DEVICES: Device[] = [
  { 
    id: "1029", sn: "1029", name: "Incinerator Alpha", location: "Kuala Lumpur, Malaysia", timezone: "Asia/Kuala_Lumpur", status: "active",
    metrics: { 
      carbonCreditValue: "$4,850", carbonCreditChange: "+12%", wasteProcessed: "2,450", energyConsumed: "12,400",
      estimatedValue: 4850, wasteProcessedTon: 2450, energyConsumedKwh: 12400,
      aqi: 42, coreTemp: 850, pm25: 12, no2: 0.04, co: 1.2, organic: 45, plastic: 30, metal: 15, hazardous: 10
    },
    maintenanceTasks: []
  },
  { 
    id: "1030", sn: "1030", name: "Incinerator Beta", location: "New York, USA", timezone: "America/New_York", status: "maintenance",
    metrics: { 
      carbonCreditValue: "$1,200", carbonCreditChange: "-5%", wasteProcessed: "850", energyConsumed: "4,200",
      estimatedValue: 1200, wasteProcessedTon: 850, energyConsumedKwh: 4200,
      aqi: 20, coreTemp: 25, pm25: 2, no2: 0.01, co: 0.1, organic: 0, plastic: 0, metal: 0, hazardous: 0
    },
    maintenanceTasks: [
      { action: "Ganti Kipas Blower", countdown: "12h" },
      { action: "Bersihkan Ruang Plasma", countdown: "24h" }
    ]
  },
  { 
    id: "1031", sn: "1031", name: "Incinerator Gamma", location: "Paris, France", timezone: "Europe/Paris", status: "warning",
    metrics: { 
      carbonCreditValue: "$3,650", carbonCreditChange: "+8%", wasteProcessed: "1,920", energyConsumed: "9,800",
      estimatedValue: 3650, wasteProcessedTon: 1920, energyConsumedKwh: 9800,
      aqi: 85, coreTemp: 940, pm25: 45, no2: 0.12, co: 3.5, organic: 40, plastic: 35, metal: 10, hazardous: 15
    },
    maintenanceTasks: [
      { action: "Ganti Filter Emisi", countdown: "4h" }
    ]
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
