from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict

app = FastAPI(title="ASHER Smart IT API", version="2.0.0")

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
    methane_gwp: float = Field(default=28.0, description="IPCC AR5/AR6 GWP100 factor for CH4")
    grid_emission_factor: float = Field(
        default=0.585, description="IEA regional grid emission factor (kg CO2/kWh)"
    )
    fossil_fraction: float = Field(
        default=0.30, ge=0.0, le=1.0, description="Fossil waste fraction estimated by AI Vision"
    )


class DetectedItem(BaseModel):
    category: str
    confidence: float
    estimated_weight_kg: float


class VisionBatchRequest(BaseModel):
    device_sn: str
    detections: List[DetectedItem]


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
    return {"status": "ok", "service": "ASHER Smart IT API"}


@app.post("/api/calculate-carbon")
def calculate_carbon_credit(data: WasteData):
    # IPCC 2006 landfill methane avoidance baseline scaled by GWP
    landfill_ch4_tons = data.tonnage * 0.043 * (1 - data.fossil_fraction * 0.4)
    baseline_emissions = landfill_ch4_tons * data.methane_gwp
    asher_electricity_emissions = (data.electricity_kwh * data.grid_emission_factor) / 1000.0
    asher_direct_emissions = data.tonnage * 0.05 * (0.5 + data.fossil_fraction)
    total_asher_emissions = asher_electricity_emissions + asher_direct_emissions
    net_carbon_saved = max(0.0, baseline_emissions - total_asher_emissions)

    return {
        "status": "success",
        "input_tonnage": data.tonnage,
        "baseline_emissions_tco2e": round(baseline_emissions, 2),
        "asher_emissions_tco2e": round(total_asher_emissions, 2),
        "net_carbon_saved_tco2e": round(net_carbon_saved, 2),
        "estimated_credit_value_usd": round(net_carbon_saved * 48.50, 2),
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
