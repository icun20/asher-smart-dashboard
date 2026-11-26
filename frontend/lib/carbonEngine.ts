/**
 * IPCC 2006 (Vol. 5, Ch. 2, 3 & 5) + IPCC AR6 + GHG Protocol Carbon Accounting Engine.
 * Computes Ex-Ante Lifetime Committed CH4 Avoidance with regional landfill baselines
 * (MCF, soil cover oxidation OX, and regional landfill gas recovery R).
 */

export interface CarbonCalculationInput {
  wasteProcessedTon: number;
  energyConsumedKwh: number;
  gridEmissionFactor: number; // IEA regional kg CO2 / kWh
  organicPct: number; // 0..100
  paperPct: number; // 0..100
  plasticPct: number; // 0..100
  landfillMcf?: number; // IPCC 2006 Table 3.1 (0.8 unmanaged deep, 1.0 managed anaerobic)
  landfillOx?: number; // IPCC 2006 Table 3.2 (0.0 unmanaged, 0.1 managed cover)
  landfillGasCaptureR?: number; // Regional LFG capture rate (0..1)
  carbonPriceUsdPerTon?: number;
  ashOutputTon?: number;
  ashPriceUsdPerTon?: number;
}

export interface CarbonCalculationResult {
  // IPCC 2006 / AR6 Parameters
  docFraction: number;
  docF: number;
  mcf: number;
  oxidationFactorOx: number;
  landfillGasCaptureR: number;
  methaneFractionF: number;
  gwp100Ch4Ar6: number;
  avoidedCh4Tons: number;
  baselineLandfillCo2e: number;

  // GHG Protocol Scope 1, Scope 2, Biogenic Memo & Scope 3 Transport Memo
  biogenicCo2MemoTon: number; // Neutral memo item (excluded from Scope 1 penalty)
  scope1FossilPlasticCo2e: number; // Fossil plastic oxidation
  scope1NonCo2TraceCo2e: number; // IPCC Vol. 5 Ch. 5 thermal N2O + trace CH4
  scope1TotalCo2e: number;
  scope2ElectricityCo2e: number; // kWh * IEA Grid EF / 1000
  totalAsherEmissionsCo2e: number;
  scope3AvoidedHaulingMemoCo2e: number; // Treatment-at-source diesel haulage avoided (memo only)

  // Ex-Ante Net Carbon Saved & Valuation
  netCarbonSavedCo2e: number;
  annualizedCarbonSavedCo2e: number;
  carbonPriceUsdPerTon: number;
  monthlyCreditValueUsd: number;
  annualCreditValueUsd: number;
  monthlyAshValueUsd: number;
  annualAshValueUsd: number;
  totalMonthlyEcoValueUsd: number;
  totalAnnualEcoValueUsd: number;
}

export const IPCC_CONSTANTS = {
  DOC_ORGANIC: 0.15, // Food / organic waste wet basis (IPCC 2006 Vol. 5 Table 2.4)
  DOC_PAPER: 0.4, // Paper & cardboard wet basis (IPCC 2006 Vol. 5 Table 2.4)
  DOC_F: 0.5, // Fraction of DOC dissimilated (IPCC 2006 default)
  F_METHANE: 0.5, // Fraction of CH4 in landfill gas
  CH4_C_RATIO: 16 / 12,
  CO2_C_RATIO: 44 / 12,
  GWP_100_CH4_AR6: 27.9, // Official IPCC AR6 WG1 Table 7.15 non-fossil CH4 GWP100
  PLASTIC_DRY_MATTER: 0.85,
  PLASTIC_FOSSIL_CARBON: 0.75,
  PYROLYSIS_OXIDATION_FACTOR: 0.7, // Partial carbon retention in inert char/ash
  NON_CO2_COMBUSTION_FACTOR: 0.015, // IPCC Vol. 5 Ch. 5 trace N2O (~50g/t * 273) + trace CH4
  BIOGENIC_CO2_PER_TON_ORGANIC: 0.55,
  BIOGENIC_CO2_PER_TON_PAPER: 1.25,
  AVOIDED_HAULING_CO2E_PER_TON: 0.003, // 25km diesel refuse truck round-trip @ 0.12 kg/t-km
  DEFAULT_CARBON_PRICE_USD: 25,
  DEFAULT_ASH_PRICE_USD: 45,
} as const;

export function calculateCarbonAccounting(
  input: CarbonCalculationInput
): CarbonCalculationResult {
  const {
    wasteProcessedTon,
    energyConsumedKwh,
    gridEmissionFactor,
    organicPct,
    paperPct,
    plasticPct,
    landfillMcf = 0.8,
    landfillOx = 0.0,
    landfillGasCaptureR = 0.0,
    carbonPriceUsdPerTon = IPCC_CONSTANTS.DEFAULT_CARBON_PRICE_USD,
    ashOutputTon = wasteProcessedTon * 0.04,
    ashPriceUsdPerTon = IPCC_CONSTANTS.DEFAULT_ASH_PRICE_USD,
  } = input;

  // Fallback to standard municipal profile if unit is currently in maintenance (0% live vision)
  const hasLiveMix = organicPct + paperPct + plasticPct > 0;
  const effOrganic = (hasLiveMix ? organicPct : 48) / 100;
  const effPaper = (hasLiveMix ? paperPct : 18) / 100;
  const effPlastic = (hasLiveMix ? plasticPct : 16) / 100;

  // 1. IPCC 2006 Avoided Landfill Methane (Ex-Ante Lifetime Committed Avoidance)
  const docFraction =
    effOrganic * IPCC_CONSTANTS.DOC_ORGANIC + effPaper * IPCC_CONSTANTS.DOC_PAPER;
  const avoidedCh4Tons =
    wasteProcessedTon *
    docFraction *
    IPCC_CONSTANTS.DOC_F *
    landfillMcf *
    IPCC_CONSTANTS.F_METHANE *
    IPCC_CONSTANTS.CH4_C_RATIO *
    (1 - landfillGasCaptureR) *
    (1 - landfillOx);
  const baselineLandfillCo2e = avoidedCh4Tons * IPCC_CONSTANTS.GWP_100_CH4_AR6;

  // 2. GHG Protocol Biogenic CO2 (Memo Item — Carbon-Neutral)
  const biogenicCo2MemoTon =
    wasteProcessedTon *
    (effOrganic * IPCC_CONSTANTS.BIOGENIC_CO2_PER_TON_ORGANIC +
      effPaper * IPCC_CONSTANTS.BIOGENIC_CO2_PER_TON_PAPER);

  // 3. Scope 1 Direct Emissions (Fossil Plastic CO2 + Trace Thermal N2O/CH4)
  const scope1FossilPlasticCo2e =
    wasteProcessedTon *
    effPlastic *
    IPCC_CONSTANTS.PLASTIC_DRY_MATTER *
    IPCC_CONSTANTS.PLASTIC_FOSSIL_CARBON *
    IPCC_CONSTANTS.PYROLYSIS_OXIDATION_FACTOR *
    IPCC_CONSTANTS.CO2_C_RATIO;
  const scope1NonCo2TraceCo2e =
    wasteProcessedTon * IPCC_CONSTANTS.NON_CO2_COMBUSTION_FACTOR;
  const scope1TotalCo2e = scope1FossilPlasticCo2e + scope1NonCo2TraceCo2e;

  // 4. Scope 2 Indirect Electricity Emissions (Power Meter kWh * IEA Regional EF)
  const scope2ElectricityCo2e = (energyConsumedKwh * gridEmissionFactor) / 1000;

  // 5. Scope 3 Avoided Waste Hauling (Memo Item — Not added to carbon credit payout)
  const scope3AvoidedHaulingMemoCo2e =
    wasteProcessedTon * IPCC_CONSTANTS.AVOIDED_HAULING_CO2E_PER_TON;

  const totalAsherEmissionsCo2e = scope1TotalCo2e + scope2ElectricityCo2e;
  const netCarbonSavedCo2e = Math.max(0, baselineLandfillCo2e - totalAsherEmissionsCo2e);
  const annualizedCarbonSavedCo2e = netCarbonSavedCo2e * 12;

  const monthlyCreditValueUsd = Math.round(netCarbonSavedCo2e * carbonPriceUsdPerTon);
  const annualCreditValueUsd = Math.round(annualizedCarbonSavedCo2e * carbonPriceUsdPerTon);
  const monthlyAshValueUsd = Math.round(ashOutputTon * ashPriceUsdPerTon);
  const annualAshValueUsd = monthlyAshValueUsd * 12;

  return {
    docFraction: Number(docFraction.toFixed(4)),
    docF: IPCC_CONSTANTS.DOC_F,
    mcf: landfillMcf,
    oxidationFactorOx: landfillOx,
    landfillGasCaptureR,
    methaneFractionF: IPCC_CONSTANTS.F_METHANE,
    gwp100Ch4Ar6: IPCC_CONSTANTS.GWP_100_CH4_AR6,
    avoidedCh4Tons: Number(avoidedCh4Tons.toFixed(2)),
    baselineLandfillCo2e: Number(baselineLandfillCo2e.toFixed(2)),
    biogenicCo2MemoTon: Number(biogenicCo2MemoTon.toFixed(2)),
    scope1FossilPlasticCo2e: Number(scope1FossilPlasticCo2e.toFixed(2)),
    scope1NonCo2TraceCo2e: Number(scope1NonCo2TraceCo2e.toFixed(2)),
    scope1TotalCo2e: Number(scope1TotalCo2e.toFixed(2)),
    scope2ElectricityCo2e: Number(scope2ElectricityCo2e.toFixed(2)),
    totalAsherEmissionsCo2e: Number(totalAsherEmissionsCo2e.toFixed(2)),
    scope3AvoidedHaulingMemoCo2e: Number(scope3AvoidedHaulingMemoCo2e.toFixed(2)),
    netCarbonSavedCo2e: Number(netCarbonSavedCo2e.toFixed(2)),
    annualizedCarbonSavedCo2e: Number(annualizedCarbonSavedCo2e.toFixed(1)),
    carbonPriceUsdPerTon,
    monthlyCreditValueUsd,
    annualCreditValueUsd,
    monthlyAshValueUsd,
    annualAshValueUsd,
    totalMonthlyEcoValueUsd: monthlyCreditValueUsd + monthlyAshValueUsd,
    totalAnnualEcoValueUsd: annualCreditValueUsd + annualAshValueUsd,
  };
}
