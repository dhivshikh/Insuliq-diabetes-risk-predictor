import { Info } from 'lucide-react';
import { calculateBMI, getBMICategory } from '../utils/health';
import { cn } from '../utils/cn';

interface HeightWeightInputProps {
  height: number | '';
  weight: number | '';
  onChangeHeight: (val: number | '') => void;
  onChangeWeight: (val: number | '') => void;
}

const HeightWeightInput = ({ height, weight, onChangeHeight, onChangeWeight }: HeightWeightInputProps) => {
  const bmi = calculateBMI(weight === '' ? 0 : weight, height === '' ? 0 : height);
  const category = getBMICategory(bmi);

  return (
    <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/20 backdrop-blur-md rounded-xl p-5 mb-2">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-4">
        Body Measurements
        <div className="group relative ml-auto">
          <Info size={14} className="text-slate-400 cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-56 bg-slate-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg text-center">
            Your BMI will be calculated automatically from your height and weight.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="height" className="block text-xs font-medium text-slate-500 mb-1">
            Height (cm)
          </label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={(e) => onChangeHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
            min="50"
            max="250"
            step="1"
            required
            className="w-full border border-white/20 rounded-xl px-4 py-2 focus:border-white/50 focus:ring-4 focus:ring-white/10 outline-none transition-all duration-200 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-slate-900 font-medium shadow-inner placeholder-slate-500"
            placeholder="e.g. 175"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-xs font-medium text-slate-500 mb-1">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => onChangeWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
            min="2"
            max="300"
            step="0.1"
            required
            className="w-full border border-white/20 rounded-xl px-4 py-2 focus:border-white/50 focus:ring-4 focus:ring-white/10 outline-none transition-all duration-200 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-slate-900 font-medium shadow-inner placeholder-slate-500"
            placeholder="e.g. 70"
          />
        </div>
      </div>

      {/* Read-only BMI Badge */}
      <div className="mt-4 flex items-center justify-center">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300",
          bmi > 0 
            ? "bg-white/20 border-white/30 text-slate-900" 
            : "bg-white/5 border-white/10 text-slate-500"
        )}>
          <span>Calculated BMI:</span>
          {bmi > 0 ? (
            <span className="flex items-center gap-1">
              <span className="text-sm font-bold">{bmi}</span>
              <span className="opacity-75">({category})</span>
            </span>
          ) : (
            <span>--</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeightWeightInput;
