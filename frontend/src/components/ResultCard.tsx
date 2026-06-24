import { ShieldCheck, AlertTriangle, RefreshCcw, Download } from 'lucide-react';
import { type PredictionResponse, type PatientData } from '../services/api';
import ProbabilityGauge from './ProbabilityGauge';
import ParameterBreakdownTable from './ParameterBreakdownTable';
import { generatePDFReport } from '../utils/pdfGenerator';
import { cn } from '../utils/cn';

interface ResultCardProps {
  result: PredictionResponse;
  patientData: PatientData;
  onReset: () => void;
}

const ResultCard = ({ result, patientData, onReset }: ResultCardProps) => {
  const isHighRisk = result.riskLevel === 'High';

  const handleDownloadPDF = () => {
    generatePDFReport(patientData, result);
  };

  return (
    <div className="p-6 md:p-10 animate-in slide-in-from-bottom-8 fade-in duration-700">
      
      {/* 1. OVERALL SUMMARY */}
      <div className="text-center mb-8">
        <div className={cn(
          "inline-flex items-center justify-center w-20 h-20 rounded-full mb-6",
          isHighRisk ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
        )}>
          {isHighRisk ? <AlertTriangle size={40} /> : <ShieldCheck size={40} />}
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {isHighRisk ? "Elevated Risk Detected" : "Low Risk Detected"}
        </h2>
        <div className="flex justify-center my-6">
          <ProbabilityGauge probability={result.probability} />
        </div>
        <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
          {result.message}
        </p>
      </div>

      {/* 2. PARAMETER BREAKDOWN */}
      {result.parameterBreakdown && result.parameterBreakdown.length > 0 && (
        <ParameterBreakdownTable parameters={result.parameterBreakdown} />
      )}

      {/* 3. MEDICAL DISCLAIMER */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-start gap-4 my-8">
        <div className="text-medical-500 shrink-0 mt-0.5">
          <ShieldCheck size={24} />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>Medical Disclaimer:</strong> This tool provides a preliminary risk estimate based on historical health data models and is not a substitute for professional medical diagnosis. Please consult a healthcare provider for a thorough evaluation and confirmation.
        </p>
      </div>

      {/* 4. ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-medical-600 hover:bg-medical-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-medical-500/30"
        >
          <Download size={18} />
          Download Medical Report
        </button>

        <button
          onClick={onReset}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          <RefreshCcw size={18} />
          Check Another Patient
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
