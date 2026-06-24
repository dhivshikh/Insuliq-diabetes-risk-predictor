/**
 * Calculates Body Mass Index (BMI)
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimeters
 * @returns BMI value rounded to 1 decimal place
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

/**
 * Returns the WHO category for a given BMI
 * @param bmi The calculated BMI
 * @returns Category string
 */
export const getBMICategory = (bmi: number): string => {
  if (!bmi || bmi <= 0) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Converts a list of selected family members to a baseline "Diabetes Pedigree Function"
 * The Pima dataset pedigree function typically ranges from 0.08 to 2.42.
 * This function provides a simplified heuristic mapping for patient-facing use.
 * 
 * @param familyHistory Array of selected family members (e.g., ['Parent', 'Sibling'])
 * @returns A numerical score between 0.1 and 1.2
 */
export const calculateDiabetesPedigree = (familyHistory: string[]): number => {
  if (!familyHistory || familyHistory.length === 0 || familyHistory.includes('None')) {
    return 0.15; // Baseline low risk
  }

  let score = 0.15;
  
  if (familyHistory.includes('Parent')) {
    score += 0.6;
  }
  
  if (familyHistory.includes('Sibling')) {
    score += 0.4;
  }
  
  if (familyHistory.includes('Grandparent')) {
    score += 0.2;
  }

  // Cap the heuristic score at a reasonable value for the Pima model
  return Math.min(score, 1.5);
};

/**
 * Returns a Tailwind text color class based on the status level.
 * Shared between UI and PDF logic.
 */
export const getStatusColor = (status: "Low" | "Normal" | "Medium" | "High"): string => {
  switch (status) {
    case 'Normal':
      return 'text-emerald-600';
    case 'Low':
    case 'Medium':
      return 'text-amber-500';
    case 'High':
      return 'text-red-600';
    default:
      return 'text-slate-600';
  }
};

