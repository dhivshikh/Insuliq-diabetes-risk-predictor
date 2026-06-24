# InsuliQ

**AI-Powered Diabetes Risk Insights**

InsuliQ is a machine learning–powered web application that estimates a person's diabetes risk using key health indicators. It is built on the Pima Indians Diabetes Dataset and is designed to feel like a real clinical screening tool rather than a data-science demo — patients answer simple, guided questions and receive an instant risk result along with a detailed, parameter-by-parameter breakdown and a downloadable, hospital-style PDF report.

> ⚠️ **Disclaimer:** InsuliQ provides a preliminary, AI-generated risk estimate for informational and educational purposes only. It is **not** a medical diagnosis. Always consult a certified healthcare professional for clinical evaluation.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo / Screenshots](#demo--screenshots)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Dataset](#dataset)
- [Model Performance Approach](#model-performance-approach)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Overview

InsuliQ simplifies diabetes risk screening into a guided, three-step experience:

1. **Select biological sex** — tailors the form (e.g., pregnancy history only applies to female patients)
2. **Enter basic health details** — age, glucose, blood pressure, skin thickness, insulin level, height & weight (BMI is auto-calculated), and family history of diabetes
3. **Get an instant result** — an overall risk verdict, a parameter-by-parameter breakdown showing exactly which readings are normal vs. flagged, and a downloadable medical-style PDF report

Instead of overwhelming users with ML jargon, model comparisons, or raw statistical inputs, InsuliQ translates everything into language a patient can actually understand — while a trained ML model does the analysis behind the scenes.

---

## Features

- **Gender-aware intake form** — automatically hides irrelevant fields (e.g., pregnancies for male patients)
- **Automatic BMI calculation** — users enter height and weight; BMI and its category (Underweight/Normal/Overweight/Obese) are calculated automatically
- **Simplified family history input** — replaces the raw "Diabetes Pedigree Function" with an intuitive Parent/Sibling/Grandparent/None selector, internally converted to the model's expected numeric input
- **Single, confident result** — the backend trains and evaluates multiple ML algorithms and automatically selects the best-performing model; the frontend only ever shows one clear, final result
- **Parameter-level breakdown** — shows each health metric's value, normal reference range, and status (Low / Normal / Medium / High), with targeted recommendations for any flagged readings
- **Hospital-style PDF report generation** — a printable, doctor-shareable diagnostic-style report with a colored header band, patient info panel, structured results table, and clinical recommendations section
- **Fully responsive design** — mobile-first layout suitable for use on a phone during a real checkup
- **No technical jargon, no emojis** — calm, professional healthcare aesthetic throughout

---

## Demo / Screenshots

> Add screenshots of your running app here. Suggested shots:

| Landing Page | Patient Form | Result & Breakdown | PDF Report |
|---|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ | _screenshot_ |

```
![InsuliQ Landing Page](./assets/screenshots/landing.png)
![InsuliQ Patient Form](./assets/screenshots/form.png)
![InsuliQ Result Breakdown](./assets/screenshots/result.png)
![InsuliQ PDF Report](./assets/screenshots/pdf-report.png)
```

---

## Tech Stack

**Frontend**
- React (Vite) + TypeScript
- Tailwind CSS
- Axios (API communication)
- Recharts (risk probability gauge)
- jsPDF + jspdf-autotable (PDF report generation)

**Backend**
- Python
- FastAPI
- scikit-learn (model training — Logistic Regression, Random Forest, SVM, KNN, etc.)
- Pandas / NumPy
- Joblib

**Dataset**
- Pima Indians Diabetes Dataset (UCI Machine Learning Repository / Kaggle)

---

## How It Works

```
┌─────────────────┐      ┌──────────────────┐      ┌────────────────────┐
│  Patient enters  │ ───> │   Frontend calls  │ ───> │   Backend runs the  │
│  health details   │      │   POST /predict   │      │   best-performing   │
│  (simplified UI)  │      │                    │      │   trained ML model  │
└─────────────────┘      └──────────────────┘      └────────────────────┘
                                                              │
                                                              ▼
                                              ┌───────────────────────────────┐
                                              │ Returns risk level, probability,│
                                              │ and per-parameter breakdown     │
                                              └───────────────────────────────┘
                                                              │
                                                              ▼
                                        ┌─────────────────────────────────────┐
                                        │ Frontend renders result + breakdown   │
                                        │ and generates a downloadable PDF      │
                                        └─────────────────────────────────────┘
```

**Behind the scenes**, the backend:
1. Trains multiple ML classifiers on the Pima Indians Diabetes Dataset
2. Evaluates each using cross-validation (accuracy, precision, recall, F1-score, ROC-AUC)
3. Automatically selects the best-performing model
4. Serves predictions through a single, simple `/predict` endpoint — the frontend never needs to know which algorithm is running

**On the frontend**, raw user inputs (height/weight, family history) are converted into the exact numeric features the model expects (BMI, Diabetes Pedigree Function) before being sent to the API — so the user never has to understand or enter those values directly.

---

## Project Structure

```
insuliq/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GenderSelector.tsx
│   │   │   ├── PatientForm.tsx
│   │   │   ├── HeightWeightInput.tsx
│   │   │   ├── FamilyHistorySelector.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── ParameterBreakdownTable.tsx
│   │   │   ├── ProbabilityGauge.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── utils/
│   │   │   ├── health.ts          # BMI, pedigree calc, status colors
│   │   │   └── pdfGenerator.ts    # Hospital-style PDF report builder
│   │   ├── services/
│   │   │   └── api.ts            # predictPatient() API call
│   │   └── App.tsx
│   └── package.json
│
├── backend/
│   ├── train_models.py           # Trains & compares multiple ML models
│   ├── best_model.joblib         # Saved best-performing model
│   ├── main.py                   # API entrypoint (/predict endpoint)
│   ├── requirements.txt
│   └── pima.csv                  # Dataset
│
├── start.bat                     # Quick start script
└── README.md                     # You are here!
```

---

## Getting Started

### Prerequisites
- Node.js (v18+) and npm
- Python 3.9+
- pip

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/insuliq.git
cd insuliq
```

### 2. Run the full stack easily (Windows)

Simply double-click the `start.bat` file in the root directory. It will open two command prompts and start both the Python backend and the React frontend automatically.

Alternatively, you can run them manually:

**Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python train_models.py        # trains and saves the best model
python main.py                # starts the FastAPI server
```
The backend API runs on `http://localhost:8000`.

**Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## API Reference

### `POST /predict`

**Request body:**

```json
{
  "gender": "Male",
  "age": 45,
  "glucose": 148,
  "bloodPressure": 72,
  "skinThickness": 35,
  "insulin": 0,
  "bmi": 33.6,
  "diabetesPedigreeFunction": 0.627,
  "pregnancies": 0
}
```

**Response:**

```json
{
  "riskLevel": "High",
  "probability": 0.82,
  "message": "Your glucose and BMI levels suggest a higher risk. We recommend consulting a doctor for further evaluation.",
  "parameterBreakdown": [
    {
      "parameter": "Glucose",
      "patientValue": 148,
      "unit": "mg/dL",
      "normalRange": "70-99 mg/dL",
      "status": "High",
      "recommendation": "Reduce sugar intake and refined carbohydrates; consult a doctor for further testing."
    }
  ]
}
```

---

## Dataset

This project uses the **Pima Indians Diabetes Dataset**, originally from the National Institute of Diabetes and Digestive and Kidney Diseases, commonly distributed via the UCI Machine Learning Repository and Kaggle.

**Features used:** Pregnancies, Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Diabetes Pedigree Function, Age
**Target:** Outcome (0 = non-diabetic, 1 = diabetic)

---

## Model Performance Approach

Rather than exposing model comparison details to end users, InsuliQ's backend:

- Trains several classifiers (e.g., Logistic Regression, Random Forest)
- Evaluates them using cross-validated metrics, with attention to **F1-score / ROC-AUC** rather than raw accuracy alone, since the dataset has class imbalance.
- Automatically selects and serves the best-performing model via the `/predict` endpoint

**Best model currently running:** Random Forest Classifier — **ROC-AUC:** ~0.82

---

## Roadmap

- [ ] User accounts to track risk history over time
- [ ] Multi-language support for the report and UI
- [ ] Doctor/clinician dashboard view
- [ ] Integration with wearable device data (e.g., continuous glucose monitors)
- [ ] Expanded dataset / retraining with more diverse populations

---

## Disclaimer

InsuliQ is an academic/portfolio project built for educational purposes. It is **not** a certified medical device and should **not** be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the guidance of a qualified healthcare provider with any questions regarding a medical condition.

---

## License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and build upon it with attribution.

---

<p align="center">Built with care for accessible, understandable health screening.</p>
