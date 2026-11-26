/**
 * US EPA 40 CFR Part 60 Subpart EEEE (Table 1 - OSWI) Stack Exhaust Standards
 * All limits are dry basis, corrected to 7% O2.
 * Thermal Envelope aligned strictly with Pamarai Y26 G7/G8 General Spec (300 - 1,100°C).
 */

export type ComplianceLevel = "SAFE" | "WARNING" | "DANGER";

export interface StackLimitStandard {
  id: "pm" | "co" | "so2" | "nox" | "hcl";
  label: string;
  fullName: string;
  sensorType: string;
  unit: string;
  warningRatio: number; // Early warning at 75% of statutory limit
  epaLimit: number; // Statutory 40 CFR 60 Subpart EEEE Table 1 cap
  gaugeMax: number;
  referenceNote: string;
}

export interface LabTestStandard {
  id: "dioxins" | "cadmium" | "lead" | "mercury";
  label: string;
  epaMethod: string;
  epaLimit: number;
  unit: string;
}

export const US_EPA_OSWI_STANDARDS: Record<StackLimitStandard["id"], StackLimitStandard> = {
  pm: {
    id: "pm",
    label: "PM (Particulate)",
    fullName: "Total Particulate Matter (Stack)",
    sensorType: "Laser Scattering / Isokinetic",
    unit: "mg/Nm³",
    warningRatio: 0.75,
    epaLimit: 30, // 0.013 gr/dscf ≈ 29.7 mg/dscm @ 7% O2
    gaugeMax: 45,
    referenceNote: "40 CFR 60 Subpart EEEE Table 1 (~30 mg/dscm @ 7% O₂)",
  },
  co: {
    id: "co",
    label: "CO",
    fullName: "Carbon Monoxide",
    sensorType: "NDIR Infrared Gas Analyzer",
    unit: "ppmv",
    warningRatio: 0.75,
    epaLimit: 40,
    gaugeMax: 60,
    referenceNote: "40 CFR 60 Subpart EEEE Table 1 (40 ppmv @ 7% O₂)",
  },
  so2: {
    id: "so2",
    label: "SO₂",
    fullName: "Sulfur Dioxide",
    sensorType: "Electrochemical / UV Fluorescence",
    unit: "ppmv",
    warningRatio: 0.75,
    epaLimit: 3.1,
    gaugeMax: 5.0,
    referenceNote: "40 CFR 60 Subpart EEEE Table 1 (3.1 ppmv @ 7% O₂)",
  },
  nox: {
    id: "nox",
    label: "NOₓ",
    fullName: "Nitrogen Oxides",
    sensorType: "Chemiluminescence / Electrochemical",
    unit: "ppmv",
    warningRatio: 0.75,
    epaLimit: 103,
    gaugeMax: 140,
    referenceNote: "40 CFR 60 Subpart EEEE Table 1 (103 ppmv @ 7% O₂)",
  },
  hcl: {
    id: "hcl",
    label: "HCl",
    fullName: "Hydrogen Chloride (PVC Acid Gas)",
    sensorType: "Electrochemical Acid-Gas Probe",
    unit: "ppmv",
    warningRatio: 0.75,
    epaLimit: 15,
    gaugeMax: 24,
    referenceNote: "40 CFR 60 Subpart EEEE Table 1 (15 ppmv @ 7% O₂)",
  },
};

/**
 * Pollutants that CANNOT be measured by real-time inline gas analyzers and legally
 * require periodic accredited 3rd-party laboratory stack sampling (EPA Method 23 & 29).
 */
export const US_EPA_OSWI_LAB_STANDARDS: LabTestStandard[] = [
  {
    id: "dioxins",
    label: "Dioxins / Furans (Total Mass)",
    epaMethod: "US EPA Method 23",
    epaLimit: 33,
    unit: "ng/dscm",
  },
  {
    id: "cadmium",
    label: "Cadmium (Cd)",
    epaMethod: "US EPA Method 29",
    epaLimit: 18,
    unit: "µg/dscm",
  },
  {
    id: "lead",
    label: "Lead (Pb)",
    epaMethod: "US EPA Method 29",
    epaLimit: 226,
    unit: "µg/dscm",
  },
  {
    id: "mercury",
    label: "Mercury (Hg)",
    epaMethod: "US EPA Method 29",
    epaLimit: 74,
    unit: "µg/dscm",
  },
];

export const THERMAL_ENVELOPE = {
  MIN_RATED_C: 300,
  OPTIMAL_MIN_C: 650,
  OPTIMAL_MAX_C: 1000,
  DEFAULT_ALARM_OVERHEAT_C: 1050,
  MAX_RATED_C: 1100,
  GAUGE_MAX_C: 1200,
} as const;

export function evaluateStackParameter(
  id: StackLimitStandard["id"],
  value: number,
  customLimit?: number
): ComplianceLevel {
  const std = US_EPA_OSWI_STANDARDS[id];
  const limit = customLimit ?? std.epaLimit;
  const warnLimit = limit * std.warningRatio;
  if (value >= limit) return "DANGER";
  if (value >= warnLimit) return "WARNING";
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
