/**
 * US EPA 40 CFR Part 60 Subpart EEEE (OSWI - Other Solid Waste Incineration)
 * Stack Exhaust Standards (corrected to 7% O2, dry basis) & Pamarai G7/G8 Thermal Envelope.
 */

export type ComplianceLevel = "SAFE" | "WARNING" | "DANGER";

export interface StackLimitStandard {
  id: "pm" | "co" | "so2" | "nox" | "hcl";
  label: string;
  fullName: string;
  sensorType: string;
  unit: string;
  warningLimit: number; // 75% of EPA limit (early operator warning)
  epaLimit: number; // US EPA 40 CFR 60 Subpart EEEE OSWI cap
  gaugeMax: number;
  referenceNote: string;
}

export const US_EPA_OSWI_STANDARDS: Record<StackLimitStandard["id"], StackLimitStandard> = {
  pm: {
    id: "pm",
    label: "PM (Particulate)",
    fullName: "Total Particulate Matter (Stack)",
    sensorType: "Laser Scattering / Isokinetic",
    unit: "mg/Nm³",
    warningLimit: 22,
    epaLimit: 30,
    gaugeMax: 45,
    referenceNote: "US EPA OSWI (~30 mg/dscm @ 7% O₂)",
  },
  co: {
    id: "co",
    label: "CO",
    fullName: "Carbon Monoxide",
    sensorType: "NDIR Infrared Gas Analyzer",
    unit: "ppmv",
    warningLimit: 30,
    epaLimit: 40,
    gaugeMax: 60,
    referenceNote: "US EPA OSWI (40 ppmv @ 7% O₂)",
  },
  so2: {
    id: "so2",
    label: "SO₂",
    fullName: "Sulfur Dioxide",
    sensorType: "Electrochemical / UV Fluorescence",
    unit: "ppmv",
    warningLimit: 2.3,
    epaLimit: 3.1,
    gaugeMax: 5.0,
    referenceNote: "US EPA OSWI (3.1 ppmv @ 7% O₂)",
  },
  nox: {
    id: "nox",
    label: "NOₓ",
    fullName: "Nitrogen Oxides",
    sensorType: "Chemiluminescence / Electrochemical",
    unit: "ppmv",
    warningLimit: 78,
    epaLimit: 103,
    gaugeMax: 140,
    referenceNote: "US EPA OSWI (103 ppmv @ 7% O₂)",
  },
  hcl: {
    id: "hcl",
    label: "HCl",
    fullName: "Hydrogen Chloride (PVC Acid Gas)",
    sensorType: "Electrochemical Acid-Gas Probe",
    unit: "ppmv",
    warningLimit: 11,
    epaLimit: 15,
    gaugeMax: 24,
    referenceNote: "US EPA OSWI (15 ppmv @ 7% O₂)",
  },
};

export const THERMAL_ENVELOPE = {
  MIN_RATED_C: 300,
  OPTIMAL_MIN_C: 650,
  OPTIMAL_MAX_C: 1000,
  ALARM_OVERHEAT_C: 1050,
  MAX_RATED_C: 1100,
  GAUGE_MAX_C: 1200,
} as const;

export function evaluateStackParameter(
  id: StackLimitStandard["id"],
  value: number
): ComplianceLevel {
  const std = US_EPA_OSWI_STANDARDS[id];
  if (value >= std.epaLimit) return "DANGER";
  if (value >= std.warningLimit) return "WARNING";
  return "SAFE";
}

export function evaluateAmbientAqi(aqi: number): {
  status: string;
  message: string;
  colorClass: string;
} {
  if (aqi >= 151) {
    return {
      status: "UNHEALTHY",
      message: "Stop manual loading, inspect exhaust seals & wear P100 respirator",
      colorClass: "text-danger",
    };
  }
  if (aqi >= 101) {
    return {
      status: "SENSITIVE ALERT",
      message: "N95 respirator required near loading bay; verify HLC Carbon filtration",
      colorClass: "text-warning",
    };
  }
  if (aqi >= 51) {
    return {
      status: "MODERATE",
      message: "Acceptable perimeter air; monitor stack vapor dissipation",
      colorClass: "text-warning",
    };
  }
  if (aqi <= 25) {
    return {
      status: "EXCELLENT",
      message: "Perimeter ambient air quality is exceptionally clean",
      colorClass: "text-safe",
    };
  }
  return {
    status: "GOOD",
    message: "Safe for operators; vapor dissipates cleanly within spec radius",
    colorClass: "text-safe",
  };
}
