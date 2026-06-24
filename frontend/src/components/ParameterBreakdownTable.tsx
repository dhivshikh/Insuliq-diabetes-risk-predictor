import { getStatusColor } from '../utils/health';
import { type ParameterStatus } from '../services/api';

interface ParameterBreakdownTableProps {
  parameters: ParameterStatus[];
}

const ParameterBreakdownTable = ({ parameters }: ParameterBreakdownTableProps) => {
  const flaggedParams = parameters.filter(p => p.status !== 'Normal');

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 text-left">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Detailed Breakdown</h3>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">Parameter</th>
              <th className="px-4 py-3 text-left">Patient Value</th>
              <th className="px-4 py-3 text-left">Normal Range</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {parameters.map((param, i) => (
              <tr key={i} className={param.status !== 'Normal' ? 'bg-amber-50/30' : ''}>
                <td className="px-4 py-3 font-medium text-slate-800">{param.parameter}</td>
                <td className="px-4 py-3 text-slate-600">{param.patientValue} {param.unit}</td>
                <td className="px-4 py-3 text-slate-500">{param.normalRange}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${getStatusColor(param.status)}`}>
                    {param.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 italic">{param.recommendation || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {parameters.map((param, i) => (
          <div key={i} className={`p-4 rounded-xl border ${param.status !== 'Normal' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-white'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-slate-800">{param.parameter}</span>
              <span className={`font-bold text-sm ${getStatusColor(param.status)}`}>{param.status}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Value:</span>
              <span className="font-medium text-slate-700">{param.patientValue} {param.unit}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Normal:</span>
              <span className="text-slate-600">{param.normalRange}</span>
            </div>
            {param.recommendation && (
              <div className="text-sm text-slate-600 italic border-t border-slate-100 pt-2 mt-2">
                {param.recommendation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Summary Paragraph */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-700">
        <strong className="text-slate-800">Areas to focus on:</strong>{' '}
        {flaggedParams.length > 0 
          ? flaggedParams.map(p => p.parameter).join(', ') + '. Please review the remarks above.'
          : 'All evaluated parameters are currently within normal ranges.'}
      </div>
    </div>
  );
};

export default ParameterBreakdownTable;
