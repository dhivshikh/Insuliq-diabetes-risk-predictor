import { useState } from 'react';
import { ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { type PatientData } from '../services/api';
import HeightWeightInput from './HeightWeightInput';
import FamilyHistorySelector from './FamilyHistorySelector';
import { calculateBMI, calculateDiabetesPedigree } from '../utils/health';

interface PatientFormProps {
  gender: "Male" | "Female";
  onSubmit: (data: Omit<PatientData, 'gender'>) => void;
  onBack: () => void;
}

const PatientForm = ({ gender, onSubmit, onBack }: PatientFormProps) => {
  // Local form state for direct simple inputs
  const [formData, setFormData] = useState({
    name: '',
    age: '' as unknown as number,
    glucose: '' as unknown as number,
    bloodPressure: '' as unknown as number,
    skinThickness: '' as unknown as number,
    insulin: '' as unknown as number,
    pregnancies: '' as unknown as number,
  });

  // Local state for derived inputs
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      const numValue = value === '' ? '' : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Assemble the backend payload with calculated values
    const finalData: Omit<PatientData, 'gender'> = {
      name: formData.name || undefined,
      age: formData.age,
      glucose: formData.glucose,
      bloodPressure: formData.bloodPressure,
      skinThickness: formData.skinThickness,
      insulin: formData.insulin,
      pregnancies: formData.pregnancies,
      bmi: calculateBMI(weight === '' ? 0 : weight, height === '' ? 0 : height),
      diabetesPedigreeFunction: calculateDiabetesPedigree(familyHistory),
    };

    onSubmit(finalData);
  };

  const isFormValid = () => {
    const requiredFields = ['age', 'glucose', 'bloodPressure', 'skinThickness', 'insulin'];
    if (gender === 'Female') requiredFields.push('pregnancies');
    
    const basicFieldsValid = requiredFields.every(field => {
      const val = formData[field as keyof typeof formData];
      return (val as unknown as string) !== '' && !isNaN(val as number);
    });

    const bodyValid = height !== '' && height > 0 && weight !== '' && weight > 0;
    const familyValid = familyHistory.length > 0;

    return basicFieldsValid && bodyValid && familyValid;
  };

  const fields = [
    { name: 'age', label: 'Age', unit: 'years', type: 'number', step: '1', min: '18', max: '120', tooltip: 'Patient age in years' },
    { name: 'glucose', label: 'Glucose Level', unit: 'mg/dL', type: 'number', step: '1', min: '0', max: '300', tooltip: 'Fasting blood sugar. Normal is < 100 mg/dL.' },
    { name: 'bloodPressure', label: 'Blood Pressure', unit: 'mm Hg', type: 'number', step: '1', min: '0', max: '200', tooltip: 'Diastolic blood pressure. Normal is < 80 mm Hg.' },
    { name: 'insulin', label: 'Insulin Level', unit: 'mu U/ml', type: 'number', step: '1', min: '0', max: '900', tooltip: '2-Hour serum insulin.' },
    { name: 'skinThickness', label: 'Skin Thickness', unit: 'mm', type: 'number', step: '1', min: '0', max: '99', tooltip: 'Triceps skin fold thickness.' },
  ];

  if (gender === 'Female') {
    fields.unshift({ name: 'pregnancies', label: 'Pregnancies', unit: 'times', type: 'number', step: '1', min: '0', max: '20', tooltip: 'Number of times pregnant.' });
  }

  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-500">
      <div className="bg-white/10 border-b border-white/20 p-4 md:px-8 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-medical-500"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Patient Details</h2>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{gender} Patient</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Patient Name (Optional) */}
        <div className="mb-6 border-b border-slate-100 pb-6">
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Patient Name <span className="text-slate-400 font-normal">(Optional, for report only)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full md:w-1/2 border border-white/20 rounded-xl px-4 py-2.5 focus:border-white/50 focus:ring-4 focus:ring-white/10 outline-none transition-all duration-200 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-slate-900 font-medium shadow-inner placeholder-slate-500"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="relative">
              <label htmlFor={field.name} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                {field.label}
                {field.unit && <span className="text-slate-400 font-normal">({field.unit})</span>}
                <div className="group relative ml-auto">
                  <Info size={14} className="text-slate-400 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg text-center">
                    {field.tooltip}
                  </div>
                </div>
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={(formData[field.name as keyof typeof formData] as unknown as string) === '' ? '' : formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                step={field.step}
                min={field.min}
                max={field.max}
                required
                className="w-full border border-white/20 rounded-xl px-4 py-2.5 focus:border-white/50 focus:ring-4 focus:ring-white/10 outline-none transition-all duration-200 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-slate-900 font-medium shadow-inner placeholder-slate-500"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* New Height/Weight -> BMI component */}
          <HeightWeightInput 
            height={height}
            weight={weight}
            onChangeHeight={setHeight}
            onChangeWeight={setWeight}
          />

          {/* New Family History -> Pedigree component */}
          <FamilyHistorySelector 
            selected={familyHistory}
            onChange={setFamilyHistory}
          />
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={!isFormValid()}
            className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-medical-500/30"
          >
            <CheckCircle2 size={24} />
            Check My Risk
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
