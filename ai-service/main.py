from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os

app = FastAPI(
    title="IntelliStay AI Service",
    description="Machine Learning Microservice for Dynamic Pricing and Recommendations",
    version="1.0.0"
)

# Enable CORS so the Node.js backend can call it easily
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained ML model on startup
MODEL_PATH = "pricing_model.pkl"
model = None

@app.on_event("startup")
async def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Successfully loaded ML model from {MODEL_PATH}")
    else:
        print(f"WARNING: Model file {MODEL_PATH} not found. Ensure train.py has been run.")

# Define the expected input schema
class PricingInput(BaseModel):
    occupancy_rate: float = Field(..., ge=0.0, le=1.0, description="Percentage of occupied beds (0.0 to 1.0)")
    total_beds: int = Field(..., ge=1, description="Total beds in the room")
    base_price: float = Field(..., ge=0, description="The base monthly price set by owner")
    month: int = Field(..., ge=1, le=12, description="Month of the year (1-12)")
    amenity_score: int = Field(..., ge=0, le=10, description="Number of amenities provided (0-10)")
    city_tier: int = Field(..., ge=1, le=3, description="1=Major, 2=Medium, 3=Small city")

@app.post("/predict-price", summary="Predict optimal dynamic price for a room")
async def predict_price(data: PricingInput):
    if model is None:
        raise HTTPException(status_code=503, detail="ML Model is not loaded into memory")
        
    try:
        # Format features exactly as the model was trained
        # ['occupancy_rate', 'total_beds', 'base_price', 'month', 'amenity_score', 'city_tier']
        features = np.array([[
            data.occupancy_rate,
            data.total_beds,
            data.base_price,
            data.month,
            data.amenity_score,
            data.city_tier
        ]])
        
        # Make Prediction
        predicted_price = model.predict(features)[0]
        
        # Round to nearest 100 Rs for cleaner pricing
        suggested_price = round(float(predicted_price) / 100) * 100
        
        # Calculate percentage difference
        diff_percent = ((suggested_price - data.base_price) / max(data.base_price, 1)) * 100
        
        # Generate human-readable reasoning
        reason = "Base price."
        if diff_percent > 10:
            reason = "High demand surcharge (High occupancy / Peak season)."
        elif diff_percent < -10:
            reason = "Discount suggested to attract bookings (Low occupancy / Off-peak season)."
        elif diff_percent > 0:
            reason = "Slight premium recommended."
        elif diff_percent < 0:
            reason = "Slight discount recommended."
            
        return {
            "suggested_price": suggested_price,
            "base_price": data.base_price,
            "price_change_percent": round(diff_percent, 1),
            "reasoning": reason
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health", summary="Health Check")
def health():
    return {
        "status": "online", 
        "model_loaded": model is not None,
        "service": "IntelliStay AI API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
