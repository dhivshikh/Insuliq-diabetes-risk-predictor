import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProbabilityGaugeProps {
  probability: number;
}

const ProbabilityGauge = ({ probability }: ProbabilityGaugeProps) => {
  const data = [
    { name: 'Risk', value: probability },
    { name: 'Safe', value: 1 - probability },
  ];

  // Determine color based on probability
  let color = '#10b981'; // emerald-500 (Low)
  if (probability >= 0.5) {
    color = '#f59e0b'; // amber-500 (Medium/High)
  }
  if (probability >= 0.75) {
    color = '#ef4444'; // red-500 (Very High)
  }

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e2e8f0" /> {/* slate-200 for the remainder */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-3xl font-bold text-slate-800" style={{ color }}>
          {Math.round(probability * 100)}%
        </span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
          Likelihood
        </span>
      </div>
    </div>
  );
};

export default ProbabilityGauge;
