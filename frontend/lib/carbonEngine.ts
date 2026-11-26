/**
 * IPCC 2006 (Vol. 5, Ch. 3 & Ch. 5) + GHG Protocol Carbon Accounting Engine
 * Single source of truth across Executive, Overview, and ESG reporting views.
 */

export interface CarbonCalculationInput {
  wasteProcessedTon: number;
  energyConsumedKwh: number;
  gridEmissionFactor: number; // IEA regional kg CO2 / kWh
  organicPct: number; // 0..100
  paperPct: number; // 0..100
  plasticPct: number; // 0..100
  carbonPriceUsdPerTon?: number;
  ashOutputTon?: number;
  ashPriceUsdPerTon?: number;
}

export interface CarbonCalculationResult {
  // IPCC 2006 Methane Avoidance Parameters
  docFraction: number; // Weighted Degradable Organic Carbon
  docF: number; // Fraction of DOC dissimilated (0.50 IPCC default)
  mcf: number; // Methane Correction Factor (0.80 unmanaged deep / 1.0 managed anaerobic)
  methaneFractionF: number; // Fraction of CH4 in landfill gas (0.50)
  gwp100Ch4: number; // IPCC AR5/AR6 GWP100 = 28
  avoidedCh4Tons: number;
  baselineLandfillCo2e: number;

  // GHG Protocol Scope 1, Scope 2 & Biogenic Memo
  biogenicCo2MemoTon: number; // Reported separately (carbon-neutral per GHG Protocol)
  scope1FossilCo2e: number; // Fossil carbon fraction (plastics/polymers)
  scope2ElectricityCo2e: number; // kWh * IEA Grid EF / 1000
  totalAsherEmissionsCo2e: number;

  // Net Carbon Credit & Circular Revenue
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

export const IPCC_DEFAULTS = {
  DOC_ORGANIC: 0.15, // Food / organic waste wet basis (IPCC 2006 Table 2.4)
  DOC_PAPER: 0.4, // Paper & cardboard wet basis (IPCC 2006 Table 2.4)
  DOC_F: 0.5, // Fraction of DOC that decomposes
  MCF_LANDFILL: 1.0, // Managed anaerobic landfill baseline
  F_METHANE: 0.5, // Volume fraction of CH4 in landfill gas
  CH4_C_RATIO: 16 / 12,
  CO2_C_RATIO: 44 / 12,
  GWP_100_CH4: 28, // IPCC AR5/AR6 non-fossil CH4 GWP100
  PLASTIC_DRY_MATTER: 0.85,
  PLASTIC_FOSSIL_CARBON: 0.75,
  PYROLYSIS_OXIDATION_FACTOR: 0.7, // Partial char retention in thermal pyrolysis
  BIOGENIC_CO2_PER_TON_ORGANIC: 0.55,
  BIOGENIC_CO2_PER_TON_PAPER: 1.25,
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
    carbonPriceUsdPerTon = IPCC_DEFAULTS.DEFAULT_CARBON_PRICE_USD,
    ashOutputTon = wasteProcessedTon * 0.04,
    ashPriceUsdPerTon = IPCC_DEFAULTS.DEFAULT_ASH_PRICE_USD,
  } = input;

  // Fallback to standard municipal profile if unit is currently offline (0% live vision)
  const hasLiveMix = organicPct + paperPct + plasticPct > 0;
  const effOrganic = (hasLiveMix ? organicPct : 48) / 100;
  const effPaper = (hasLiveMix ? paperPct : 18) / 100;
  const effPlastic = (hasLiveMix ? plasticPct : 16) / 100;

  // 1. IPCC 2006 Avoided Landfill Methane (CH4) Baseline
  const docFraction =
    effOrganic * IPCC_DEFAULTS.DOC_ORGANIC + effPaper * IPCC_DEFAULTS.DOC_PAPER;
  const avoidedCh4Tons =
    wasteProcessedTon *
    docFraction *
    IPCC_DEFAULTS.DOC_F *
    IPCC_DEFAULTS.MCF_LANDFILL *
    IPCC_DEFAULTS.F_METHANE *
    IPCC_DEFAULTS.CH4_C_RATIO;
  const baselineLandfillCo2e = avoidedCh4Tons * IPCC_DEFAULTS.GWP_100_CH4;

  // 2. GHG Protocol Biogenic CO2 (Memo Item — Neutral, not subtracted from credits)
  const biogenicCo2MemoTon =
    wasteProcessedTon *
    (effOrganic * IPCC_DEFAULTS.BIOGENIC_CO2_PER_TON_ORGANIC +
      effPaper * IPCC_DEFAULTS.BIOGENIC_CO2_PER_TON_PAPER);

  // 3. Scope 1 Direct Fossil CO2 (Only fossil plastic fraction counts under IPCC/GHG Protocol)
  const scope1FossilCo2e =
    wasteProcessedTon *
    effPlastic *
    IPCC_DEFAULTS.PLASTIC_DRY_MATTER *
    IPCC_DEFAULTS.PLASTIC_FOSSIL_CARBON *
    IPCC_DEFAULTS.PYROLYSIS_OXIDATION_FACTOR *
    IPCC_DEFAULTS.CO2_C_RATIO;

  // 4. Scope 2 Indirect Electricity Emissions (Smart Power Meter kWh * IEA Regional EF)
  const scope2ElectricityCo2e = (energyConsumedKwh * gridEmissionFactor) / 1000;

  const totalAsherEmissionsCo2e = scope1FossilCo2e + scope2ElectricityCo2e;
  const netCarbonSavedCo2e = Math.max(0, baselineLandfillCo2e - totalAsherEmissionsCo2e);
  const annualizedCarbonSavedCo2e = netCarbonSavedCo2e * 12;

  const monthlyCreditValueUsd = Math.round(netCarbonSavedCo2e * carbonPriceUsdPerTon);
  const annualCreditValueUsd = Math.round(annualizedCarbonSavedCo2e * carbonPriceUsdPerTon);
  const monthlyAshValueUsd = Math.round(ashOutputTon * ashPriceUsdPerTon);
  const annualAshValueUsd = monthlyAshValueUsd * 12;

  return {
    docFraction: Number(docFraction.toFixed(4)),
    docF: IPCC_DEFAULTS.DOC_F,
    mcf: IPCC_DEFAULTS.MCF_LANDFILL,
    methaneFractionF: IPCC_DEFAULTS.F_METHANE,
    gwp100Ch4: IPCC_DEFAULTS.GWP_100_CH4,
    avoidedCh4Tons: Number(avoidedCh4Tons.toFixed(2)),
    baselineLandfillCo2e: Number(baselineLandfillCo2e.toFixed(2)),
    biogenicCo2MemoTon: Number(biogenicCo2MemoTon.toFixed(2)),
    scope1FossilCo2e: Number(scope1FossilCo2e.toFixed(2)),
    scope2ElectricityCo2e: Number(scope2ElectricityCo2e.toFixed(2)),
    totalAsherEmissionsCo2e: Number(totalAsherEmissionsCo2e.toFixed(2)),
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
