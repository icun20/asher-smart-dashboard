from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict

app = FastAPI(title="ASHER Smart IT API", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WasteData(BaseModel):
    tonnage: float = Field(..., gt=0, description="Total waste tonnage processed")
    electricity_kwh: float = Field(..., ge=0, description="Actual electricity consumed in kWh")
    organic_pct: float = Field(default=50.0, ge=0.0, le=100.0, description="Organic waste %")
    paper_pct: float = Field(default=20.0, ge=0.0, le=100.0, description="Paper/cardboard waste %")
    plastic_pct: float = Field(default=15.0, ge=0.0, le=100.0, description="Fossil plastic waste %")
    methane_gwp: float = Field(default=28.0, description="IPCC AR5/AR6 GWP100 factor for CH4")
    grid_emission_factor: float = Field(
        default=0.585, description="IEA regional grid emission factor (kg CO2/kWh)"
    )
    carbon_price_usd: float = Field(default=25.0, gt=0, description="Carbon credit price USD/tCO2e")


class DetectedItem(BaseModel):
    category: str
    confidence: float
    estimated_weight_kg: float


class VisionBatchRequest(BaseModel):
    device_sn: str
    detections: List[DetectedItem]


US_EPA_OSWI_LIMITS = {
    "standard": "US EPA 40 CFR Part 60 Subpart EEEE (OSWI @ 7% O2 dry basis)",
    "limits": {
        "pm_mg_nm3": 30.0,
        "co_ppmv": 40.0,
        "so2_ppmv": 3.1,
        "nox_ppmv": 103.0,
        "hcl_ppmv": 15.0,
    },
    "thermal_envelope_c": {
        "rated_min": 300,
        "optimal_min": 650,
        "optimal_max": 1000,
        "alarm_overheat": 1050,
        "rated_max": 1100,
    },
}

WASTE_CATEGORIES: Dict[str, Dict[str, object]] = {
    "organic": {
        "label": "Organic / Biogenic",
        "carbon_class": "Biogenic CO2 (Neutral)",
        "combustible": True,
        "hazardous": False,
        "ash_ratio": 0.03,
    },
    "plastic": {
        "label": "Plastic / Polymer",
        "carbon_class": "Fossil CO2 (Scope 1)",
        "combustible": True,
        "hazardous": False,
        "ash_ratio": 0.02,
    },
    "paper": {
        "label": "Paper & Cardboard",
        "carbon_class": "Biogenic CO2 (Neutral)",
        "combustible": True,
        "hazardous": False,
        "ash_ratio": 0.04,
    },
    "metal": {
        "label": "Metal (Non-Combustible)",
        "carbon_class": "Inert Residue",
        "combustible": False,
        "hazardous": False,
        "ash_ratio": 0.95,
    },
    "glass": {
        "label": "Glass & Inert",
        "carbon_class": "Inert Residue",
        "combustible": False,
        "hazardous": False,
        "ash_ratio": 0.98,
    },
    "hazardous": {
        "label": "Hazardous / B3 (Reject)",
        "carbon_class": "Prohibited Input",
        "combustible": False,
        "hazardous": True,
        "ash_ratio": 0.0,
    },
}


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "ASHER Smart IT API", "version": "2.1.0"}


@app.get("/api/hse/standards")
def get_hse_standards():
    return US_EPA_OSWI_LIMITS


@app.post("/api/calculate-carbon")
def calculate_carbon_credit(data: WasteData):
    """
    IPCC 2006 Vol. 5 Methane Avoidance + GHG Protocol Biogenic vs Fossil CO2 separation.
    """
    eff_organic = data.organic_pct / 100.0
    eff_paper = data.paper_pct / 100.0
    eff_plastic = data.plastic_pct / 100.0

    # 1. IPCC 2006 Avoided Landfill Methane
    doc_fraction = (eff_organic * 0.15) + (eff_paper * 0.40)
    avoided_ch4_tons = data.tonnage * doc_fraction * 0.50 * 1.0 * 0.50 * (16.0 / 12.0)
    baseline_co2e = avoided_ch4_tons * data.methane_gwp

    # 2. GHG Protocol Biogenic CO2 (Memo Item - Carbon Neutral)
    biogenic_co2_memo = data.tonnage * ((eff_organic * 0.55) + (eff_paper * 1.25))

    # 3. Scope 1 Direct Fossil CO2 (Plastics only)
    scope1_fossil_co2e = data.tonnage * eff_plastic * 0.85 * 0.75 * 0.70 * (44.0 / 12.0)

    # 4. Scope 2 Electricity Emissions (IEA Regional Grid EF)
    scope2_electricity_co2e = (data.electricity_kwh * data.grid_emission_factor) / 1000.0

    total_asher_emissions = scope1_fossil_co2e + scope2_electricity_co2e
    net_carbon_saved = max(0.0, baseline_co2e - total_asher_emissions)

    return {
        "status": "success",
        "methodology": "IPCC 2006 Vol. 5 + GHG Protocol (Biogenic/Fossil Split)",
        "input_tonnage": data.tonnage,
        "doc_fraction": round(doc_fraction, 4),
        "avoided_ch4_tons": round(avoided_ch4_tons, 2),
        "baseline_emissions_tco2e": round(baseline_co2e, 2),
        "biogenic_co2_memo_tons": round(biogenic_co2_memo, 2),
        "scope1_fossil_tco2e": round(scope1_fossil_co2e, 2),
        "scope2_electricity_tco2e": round(scope2_electricity_co2e, 2),
        "asher_emissions_tco2e": round(total_asher_emissions, 2),
        "net_carbon_saved_tco2e": round(net_carbon_saved, 2),
        "estimated_credit_value_usd": round(net_carbon_saved * data.carbon_price_usd, 2),
        "annualized_credit_value_usd": round(net_carbon_saved * 12 * data.carbon_price_usd, 2),
    }


@app.get("/api/vision/categories")
def get_vision_categories():
    return {"categories": WASTE_CATEGORIES}


@app.post("/api/vision/analyze")
def analyze_vision_batch(payload: VisionBatchRequest):
    totals: Dict[str, float] = {k: 0.0 for k in WASTE_CATEGORIES}
    hazardous_count = 0
    total_weight = 0.0

    for item in payload.detections:
        key = item.category.lower()
        if key in totals:
            totals[key] += item.estimated_weight_kg
            total_weight += item.estimated_weight_kg
            if key == "hazardous":
                hazardous_count += 1

    biogenic_weight = totals["organic"] + totals["paper"]
    fossil_weight = totals["plastic"]
    inert_weight = totals["metal"] + totals["glass"]

    return {
        "device_sn": payload.device_sn,
        "total_items": len(payload.detections),
        "total_estimated_weight_kg": round(total_weight, 2),
        "biogenic_ratio_pct": round((biogenic_weight / total_weight) * 100, 1) if total_weight > 0 else 0.0,
        "fossil_ratio_pct": round((fossil_weight / total_weight) * 100, 1) if total_weight > 0 else 0.0,
        "inert_ratio_pct": round((inert_weight / total_weight) * 100, 1) if total_weight > 0 else 0.0,
        "hazardous_alert": hazardous_count > 0,
        "hazardous_items": hazardous_count,
    }
