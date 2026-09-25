from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title='ASHER Smart IT API')

class WasteData(BaseModel):
    tonnage: float
    electricity_kwh: float
    methane_factor: float = 25.0
    grid_emission_factor: float = 0.8

@app.post('/api/calculate-carbon')
def calculate_carbon_credit(data: WasteData):
    baseline_emissions = data.tonnage * 1.2
    asher_electricity_emissions = (data.electricity_kwh * data.grid_emission_factor) / 1000
    asher_direct_emissions = data.tonnage * 0.05
    total_asher_emissions = asher_electricity_emissions + asher_direct_emissions
    net_carbon_saved = baseline_emissions - total_asher_emissions
    return {
        'status': 'success',
        'input_tonnage': data.tonnage,
        'baseline_emissions_tco2e': round(baseline_emissions, 2),
        'asher_emissions_tco2e': round(total_asher_emissions, 2),
        'net_carbon_saved_tco2e': round(net_carbon_saved, 2),
        'estimated_credit_value_usd': round(net_carbon_saved * 48.50, 2)
    }