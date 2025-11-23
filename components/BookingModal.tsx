import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle, User, Phone, Mail } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    parentName: '',
    babyName: '',
    phone: '',
    email: ''
  });

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const services = [
    'İlk Dokunuş Paketi (₺750)',
    'Rahatla & Büyü Paketi (₺2.800)',
    'Kardeş Paketi (₺1.350)',
    'VIP Spa Deneyimi (₺1.500)',
    'Sadece Hidroterapi (₺500)',
    'Sadece Masaj (₺400)'
  ];

  const timeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-brand p-6 flex justify-between items-center text-white z-10">
          <div>
             <h2 className="text-2xl font-bold">Online Randevu</h2>
             <p className="text-brand-light text-sm opacity-90">Bebeğiniz için en iyi zamanı seçin</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
           <div className="flex items-center justify-between max-w-sm mx-auto">
              {[1, 2, 3].map((s) => (
                 <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                       step >= s ? 'bg-brand text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                       {step > s ? <CheckCircle size={16} /> : s}
                    </div>
                    {s < 3 && <div className={`w-16 h-1 mx-2 rounded-full ${step > s ? 'bg-brand' : 'bg-gray-200'}`}></div>}
                 </div>
              ))}
           </div>
           <div className="flex justify-between max-w-sm mx-auto text-xs text-gray-500 mt-2 font-medium">
              <span>Hizmet Seçimi</span>
              <span className="pl-4">Bilgileriniz</span>
              <span>Onay</span>
           </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
             <form onSubmit={handleNext} className="space-y-6">
                <div>
                   <label className="block text-gray-700 font-bold mb-2">Hizmet Seçiniz</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((svc) => (
                         <div 
                            key={svc}
                            onClick={() => setFormData({...formData, service: svc})}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                               formData.service === svc 
                               ? 'border-brand bg-brand-light/30 text-brand-dark' 
                               : 'border-gray-100 hover:border-brand/30'
                            }`}
                         >
                            <span className="font-medium">{svc}</span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <CalendarIcon size={18} /> Tarih
                      </label>
                      <input 
                         type="date" 
                         required
                         className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                         onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <Clock size={18} /> Saat
                      </label>
                      <select 
                         required
                         className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none bg-white"
                         onChange={(e) => setFormData({...formData, time: e.target.value})}
                      >
                         <option value="">Saat Seçiniz</option>
                         {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!formData.service || !formData.date || !formData.time}
                  className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  Devam Et
                </button>
             </form>
          )}

          {step === 2 && (
             <form onSubmit={handleNext} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <User size={18} /> Ebeveyn Adı Soyadı
                      </label>
                      <input 
                         type="text" 
                         required
                         placeholder="Örn: Ayşe Yılmaz"
                         className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                         onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <User size={18} /> Bebek Adı & Ayı
                      </label>
                      <input 
                         type="text" 
                         required
                         placeholder="Örn: Can (6 Aylık)"
                         className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                         onChange={(e) => setFormData({...formData, babyName: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <Phone size={18} /> Telefon
                      </label>
                      <input 
                         type="tel" 
                         required
                         placeholder="0555 555 55 55"
                         className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <Mail size={18} /> E-posta
                      </label>
                      <input 
                         type="email" 
                         required
                         placeholder="ornek@email.com"
                         className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     type="button" 
                     onClick={() => setStep(1)}
                     className="w-1/3 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                   >
                     Geri
                   </button>
                   <button 
                     type="submit" 
                     className="w-2/3 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg"
                   >
                     Randevuyu Oluştur
                   </button>
                </div>
             </form>
          )}

          {step === 3 && (
             <div className="text-center py-8 animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle size={48} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Randevunuz Alındı!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                   Teşekkürler Sayın <strong>{formData.parentName}</strong>. <br/>
                   <strong>{formData.service}</strong> için <strong>{formData.date}</strong> saat <strong>{formData.time}</strong>'a kaydınız oluşturulmuştur. <br/>
                   En kısa sürede onay için sizi arayacağız.
                </p>
                <button 
                  onClick={() => { onClose(); setStep(1); }}
                  className="px-8 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-md"
                >
                  Tamam
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;