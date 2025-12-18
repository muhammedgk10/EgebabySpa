import React from 'react';
import { Phone, Calendar } from 'lucide-react';

interface MobileActionProps {
  onOpenBooking: () => void;
}

const MobileAction: React.FC<MobileActionProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-40 md:hidden flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe-area">
      <a 
        href="tel:+905555555555"
        className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-3.5 rounded-2xl font-bold text-sm border border-green-100 active:scale-95 transition-transform"
      >
        <Phone size={18} />
        Hemen Ara
      </a>
      <button 
        onClick={onOpenBooking}
        className="flex-1 flex items-center justify-center gap-2 bg-brand text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-brand/20 active:scale-95 transition-transform"
      >
        <Calendar size={18} />
        Randevu Al
      </button>
    </div>
  );
};

export default MobileAction;