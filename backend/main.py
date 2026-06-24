from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import os
import pandas as pd
import uvicorn
from contextlib import asynccontextmanager

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")

model = None
metrics_data = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, metrics_data
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"Loaded model from {MODEL_PATH}")
    else:
        print(f"Warning: {MODEL_PATH} not found.")

    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            metrics_data = json.load(f)
        print(f"Loaded metrics from {METRICS_PATH}")
    else:
        print(f"Warning: {METRICS_PATH} not found.")
    yield
    # Clean up can be placed here if needed

app = FastAPI(title="Diabetes Prediction API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Diabetes Prediction API is running"}

class PredictionData(BaseModel):
    pregnancies: float
    glucose: float
    bloodPressure: float
    skinThickness: float
    insulin: float
    bmi: float
    diabetesPedigreeFunction: float
    age: float

@app.get("/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=404, detail="Metrics not available")
    return metrics_data

def evaluate_parameter(name, value, unit, normal_range, status_thresholds, rec_high, rec_low=""):
    status = "Normal"
    recommendation = ""
    
    if "low" in status_thresholds and value < status_thresholds["low"]:
        status = "Low"
        recommendation = rec_low if rec_low else "Value is below normal range."
    elif value >= status_thresholds["high2"]:
        status = "High"
        recommendation = rec_high
    elif value >= status_thresholds["high1"]:
        status = "Medium"
        recommendation = "Slightly elevated. Monitor closely."
        
    return {
        "parameter": name,
        "patientValue": value,
        "unit": unit,
        "normalRange": normal_range,
        "status": status,
        "recommendation": recommendation
    }

@app.post("/predict")
def predict(data: PredictionData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded")
    
    # Format input as a DataFrame for the pipeline
    input_df = pd.DataFrame([{
        'Pregnancies': data.pregnancies,
        'Glucose': data.glucose,
        'BloodPressure': data.bloodPressure,
        'SkinThickness': data.skinThickness,
        'Insulin': data.insulin,
        'BMI': data.bmi,
        'DiabetesPedigreeFunction': data.diabetesPedigreeFunction,
        'Age': data.age
    }])
    
    try:
        # Get probability of the positive class (Diabetes)
        probability = float(model.predict_proba(input_df)[0][1])
        
        # Determine risk verdict
        riskLevel = "High" if probability >= 0.5 else "Low"
        
        # Generate parameter breakdown
        breakdown = []
        breakdown.append(evaluate_parameter("Glucose", data.glucose, "mg/dL", "70-99", {"low": 70, "high1": 100, "high2": 126}, "High glucose indicates potential diabetes. Reduce sugar intake.", "Low glucose (Hypoglycemia). Eat regular meals."))
        breakdown.append(evaluate_parameter("Blood Pressure", data.bloodPressure, "mm Hg", "60-80", {"low": 60, "high1": 80, "high2": 90}, "Elevated blood pressure. Reduce sodium and exercise regularly."))
        breakdown.append(evaluate_parameter("BMI", data.bmi, "kg/m²", "18.5-24.9", {"low": 18.5, "high1": 25, "high2": 30}, "High BMI. Consider a balanced diet and regular physical activity."))
        breakdown.append(evaluate_parameter("Insulin", data.insulin, "mu U/ml", "16-166", {"low": 16, "high1": 166, "high2": 200}, "Elevated insulin may indicate insulin resistance.", "Low insulin level. Consult a healthcare provider."))
        
        message = "Your test results are mostly within normal ranges. Continue maintaining a healthy lifestyle."
        if riskLevel == "High":
            message = "Your health metrics suggest an elevated risk of diabetes. We strongly recommend consulting a healthcare provider for a professional evaluation."
        
        return {
            "riskLevel": riskLevel,
            "probability": probability,
            "message": message,
            "parameterBreakdown": breakdown
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import threading
    import subprocess
    import webbrowser
    import time

    def start_frontend():
        frontend_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend")
        subprocess.Popen("cmd.exe /c npm run dev", cwd=frontend_dir, shell=True)

    def open_browser():
        time.sleep(3) # Wait for Vite to start
        webbrowser.open("http://localhost:5173")

    threading.Thread(target=start_frontend, daemon=True).start()
    threading.Thread(target=open_browser, daemon=True).start()

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
