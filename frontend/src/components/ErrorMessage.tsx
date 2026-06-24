import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
      <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <h3 className="text-sm font-bold text-red-800">Error</h3>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
      <button 
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 hover:bg-red-100 p-1 rounded-lg transition-colors focus:outline-none"
        aria-label="Dismiss error"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ErrorMessage;
