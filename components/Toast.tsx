
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto min-w-[320px] max-w-sm bg-white rounded-xl shadow-2xl border-l-4 overflow-hidden animate-slide-in-right flex items-start p-4 gap-3"
          style={{
            borderColor: 
              toast.type === 'success' ? '#10B981' : 
              toast.type === 'error' ? '#EF4444' : '#3B82F6'
          }}
        >
          <div className={`mt-0.5 shrink-0 ${
            toast.type === 'success' ? 'text-emerald-500' : 
            toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
          }`}>
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-sm">{toast.title}</h4>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
