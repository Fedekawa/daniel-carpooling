import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-4 left-4 sm:left-auto sm:max-w-sm z-50 animate-bounceIn">
      <div className={`p-4 rounded-2xl shadow-wedding-lg border flex items-start gap-3 bg-white ${
        toast.type === 'success' 
          ? 'border-green-300 ring-1 ring-green-400/20'
          : toast.type === 'error'
          ? 'border-red-300 ring-1 ring-red-400/20'
          : 'border-wedding-gold ring-1 ring-wedding-gold/20'
      }`}>
        <div className="shrink-0 mt-0.5">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-wedding-gold" />}
        </div>

        <div className="flex-1 pr-2">
          <h4 className="text-xs font-bold text-wedding-coffee">{toast.title}</h4>
          {toast.message && (
            <p className="text-[11px] text-wedding-coffee/80 mt-0.5">{toast.message}</p>
          )}
        </div>

        <button 
          onClick={onClose}
          className="text-wedding-coffee/40 hover:text-wedding-coffee p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
