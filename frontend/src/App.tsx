import { useState } from 'react';
import GenderSelector from './components/GenderSelector';
import PatientForm from './components/PatientForm';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { api, type PatientData, type PredictionResponse } from './services/api';

type AppStep = 'GENDER_SELECT' | 'FORM' | 'LOADING' | 'RESULT';

function App() {
  const [step, setStep] = useState<AppStep>('GENDER_SELECT');
  const [gender, setGender] = useState<"Male" | "Female" | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenderSelect = (selectedGender: "Male" | "Female") => {
    setGender(selectedGender);
    setStep('FORM');
  };

  const handleFormSubmit = async (formData: Omit<PatientData, 'gender'>) => {
    if (!gender) return;
    
    setStep('LOADING');
    setError(null);
    
    try {
      const fullData: PatientData = { ...formData, gender };
      setPatientData(fullData);
      const response = await api.predictPatient(fullData);
      setResult(response);
      setStep('RESULT');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      // Stay on the form so they can try again, just show the error message inside the form or handle it.
      // Actually, let's keep step as FORM but show error.
      setStep('FORM');
    }
  };

  const handleReset = () => {
    setGender(null);
    setPatientData(null);
    setResult(null);
    setError(null);
    setStep('GENDER_SELECT');
  };

  const handleBack = () => {
    if (step === 'FORM') setStep('GENDER_SELECT');
  };

  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-fixed bg-no-repeat flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <header className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">InsuliQ</h1>
          <p className="text-lg md:text-xl text-slate-700 font-medium">AI-Powered Diabetes Risk Insights</p>
          <p className="mt-3 text-sm font-medium text-slate-600 max-w-lg mx-auto">We'll ask a few quick questions about your glucose, blood pressure, weight, and family history to estimate your risk.</p>
        </header>

        {/* Error Notification */}
        {error && step === 'FORM' && (
          <div className="mb-6 animate-in fade-in zoom-in duration-300">
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 text-slate-900 w-full">
          {step === 'GENDER_SELECT' && (
            <GenderSelector onSelect={handleGenderSelect} />
          )}
          
          {step === 'FORM' && gender && (
            <PatientForm 
              gender={gender} 
              onSubmit={handleFormSubmit} 
              onBack={handleBack} 
            />
          )}

          {step === 'LOADING' && (
            <Loader message="Analyzing your health data..." />
          )}

          {step === 'RESULT' && result && patientData && (
            <ResultCard result={result} patientData={patientData} onReset={handleReset} />
          )}
        </main>

        {/* Footer Disclaimer */}
        <footer className="mt-12 text-center max-w-lg mx-auto animate-in fade-in duration-1000 delay-300">
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            This tool provides a preliminary diabetes risk estimate and is not a substitute for professional medical diagnosis. Please consult a healthcare provider for confirmation.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
