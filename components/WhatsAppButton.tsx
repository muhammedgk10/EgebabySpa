
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  return (
    <a 
      href="https://wa.me/905555555555" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1 hover:shadow-xl group"
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle size={24} fill="white" className="text-white" />
      <span className="font-bold hidden md:block">WhatsApp</span>
      
      {/* Tooltip for mobile */}
      <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none md:hidden">
         WhatsApp'tan Yaz
      </span>
    </a>
  );
};

export default WhatsAppButton;
