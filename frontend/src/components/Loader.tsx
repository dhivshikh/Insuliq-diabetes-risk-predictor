import { Activity } from 'lucide-react';

interface LoaderProps {
  message: string;
}

const Loader = ({ message }: LoaderProps) => {
  return (
    <div className="p-16 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-medical-200 rounded-full animate-ping opacity-20"></div>
        <div className="relative bg-medical-100 text-medical-600 p-6 rounded-full shadow-inner">
          <Activity size={48} className="animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-700 animate-pulse">{message}</h3>
      <p className="text-slate-400 mt-2 text-sm">Please wait a moment.</p>
    </div>
  );
};

export default Loader;
