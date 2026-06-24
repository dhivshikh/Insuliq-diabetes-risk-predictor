import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false; // Set to true to use mock data without backend

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface PatientData {
  name?: string; // Optional patient name for the report
  gender: "Male" | "Female";
  age: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  pregnancies?: number;
}

export interface ParameterStatus {
  parameter: string;
  patientValue: number;
  unit: string;
  normalRange: string;
  status: "Low" | "Normal" | "Medium" | "High";
  recommendation: string;
}

export interface PredictionResponse {
  riskLevel: "Low" | "High";
  probability: number;
  message: string;
  parameterBreakdown: ParameterStatus[];
}

// Internal helper for the mock API to evaluate parameters
const evaluateParameter = (
  name: string, value: number, unit: string, normalRange: string, 
  statusThresholds: { low?: number, high1: number, high2: number },
  recommendationIfHigh: string, recommendationIfLow?: string
): ParameterStatus => {
  let status: "Low" | "Normal" | "Medium" | "High" = "Normal";
  let recommendation = "";

  if (statusThresholds.low !== undefined && value < statusThresholds.low) {
    status = "Low";
    recommendation = recommendationIfLow || "Value is below normal range.";
  } else if (value >= statusThresholds.high2) {
    status = "High";
    recommendation = recommendationIfHigh;
  } else if (value >= statusThresholds.high1) {
    status = "Medium";
    recommendation = "Slightly elevated. Monitor closely.";
  }

  return {
    parameter: name,
    patientValue: value,
    unit,
    normalRange,
    status,
    recommendation
  };
};

export const api = {
  predictPatient: async (data: PatientData): Promise<PredictionResponse> => {
    // 1. Sanitize payload: If Male, pregnancies must be 0
    const payload = {
      ...data,
      pregnancies: data.gender === "Male" ? 0 : (data.pregnancies || 0)
    };

    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const breakdown: ParameterStatus[] = [];
      
      breakdown.push(evaluateParameter("Glucose", payload.glucose, "mg/dL", "70-99", { low: 70, high1: 100, high2: 126 }, "High glucose indicates potential diabetes. Reduce sugar intake.", "Low glucose (Hypoglycemia). Eat regular meals."));
      breakdown.push(evaluateParameter("Blood Pressure", payload.bloodPressure, "mm Hg", "60-80", { low: 60, high1: 80, high2: 90 }, "Elevated blood pressure. Reduce sodium and exercise regularly."));
      breakdown.push(evaluateParameter("BMI", payload.bmi, "kg/m²", "18.5-24.9", { low: 18.5, high1: 25, high2: 30 }, "High BMI. Consider a balanced diet and regular physical activity."));
      breakdown.push(evaluateParameter("Insulin", payload.insulin, "mu U/ml", "16-166", { high1: 166, high2: 200 }, "Elevated insulin may indicate insulin resistance."));
      
      // Simple risk score based on mock parameters
      const highCount = breakdown.filter(b => b.status === "High").length;
      const medCount = breakdown.filter(b => b.status === "Medium").length;
      
      let probability = 0.15 + (highCount * 0.25) + (medCount * 0.1);
      probability = Math.min(Math.max(probability, 0.05), 0.95);
      
      const riskLevel = probability >= 0.5 ? "High" : "Low";
      
      let message = "Your test results are mostly within normal ranges. Continue maintaining a healthy lifestyle.";
      if (riskLevel === "High") {
        message = "Your health metrics suggest an elevated risk of diabetes. We strongly recommend consulting a healthcare provider for a professional evaluation.";
      }

      return {
        riskLevel,
        probability,
        message,
        parameterBreakdown: breakdown
      };
    }

    try {
      // Send the payload. The backend will return { riskLevel, probability, message, parameterBreakdown }
      const response = await apiClient.post<PredictionResponse>('/predict', payload);
      return response.data;
    } catch (error) {
      console.error("Prediction API error:", error);
      throw new Error("Unable to connect to the prediction service. Please try again later.", { cause: error });
    }
  }
};
