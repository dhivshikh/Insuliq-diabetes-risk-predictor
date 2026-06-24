import { CheckSquare, Square } from 'lucide-react';

interface FamilyHistorySelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const options = ['Parent', 'Sibling', 'Grandparent'];

const FamilyHistorySelector = ({ selected, onChange }: FamilyHistorySelectorProps) => {
  
  const handleToggle = (option: string) => {
    if (option === 'None') {
      onChange(['None']);
      return;
    }

    let newSelected = selected.filter(s => s !== 'None');
    
    if (newSelected.includes(option)) {
      newSelected = newSelected.filter(s => s !== option);
    } else {
      newSelected.push(option);
    }

    if (newSelected.length === 0) {
      onChange([]);
    } else {
      onChange(newSelected);
    }
  };

  const isSelected = (opt: string) => selected.includes(opt);

  return (
    <div className="col-span-1 md:col-span-2 mb-2">
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        Does anyone in your immediate family have/had diabetes?
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleToggle(opt)}
            className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 ${
              isSelected(opt) 
                ? 'border-white/50 bg-white/30 text-slate-900' 
                : 'border-white/20 bg-white/5 text-slate-700 hover:border-white/40 hover:bg-white/10'
            }`}
          >
            {isSelected(opt) ? <CheckSquare size={18} className="text-medical-600" /> : <Square size={18} className="text-slate-400" />}
            <span className="text-sm font-medium">{opt}</span>
          </button>
        ))}
        
        <button
          type="button"
          onClick={() => handleToggle('None')}
          className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 ${
            isSelected('None') 
              ? 'border-white/50 bg-white/30 text-slate-900' 
              : 'border-white/20 bg-white/5 text-slate-700 hover:border-white/40 hover:bg-white/10'
          }`}
        >
          {isSelected('None') ? <CheckSquare size={18} className="text-emerald-600" /> : <Square size={18} className="text-slate-400" />}
          <span className="text-sm font-medium">None / Unknown</span>
        </button>
      </div>
    </div>
  );
};

export default FamilyHistorySelector;
