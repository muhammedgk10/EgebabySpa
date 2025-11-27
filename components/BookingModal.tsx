
import React, { useState, useRef } from 'react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle, User, Phone, Mail, Sparkles, Sun, CloudSun, ChevronRight } from 'lucide-react';
import { Appointment } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit }) => {
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
  
  const dateInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      // Final submission
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    // Extract price and clean service name
    const priceMatch = formData.service.match(/\((₺[\d\.]+)\)/);
    const price = priceMatch ? priceMatch[1] : '';
    const serviceName = formData.service.replace(/\s*\(₺[\d\.]+\)/, '').trim();

    onSubmit({
      parent: formData.parentName,
      baby: formData.babyName,
      service: serviceName,
      date: formData.date,
      time: formData.time,
      price: price,
      phone: formData.phone,
      email: formData.email
    });
    
    setStep(3);
  };

  // Helper to format date for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Tarih Seçiniz';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleDateCardClick = () => {
    if (dateInputRef.current) {
        try {
            if ('showPicker' in dateInputRef.current) {
                (dateInputRef.current as any).showPicker();
            } else {
                dateInputRef.current.focus();
                dateInputRef.current.click();
            }
        } catch (e) {
            // Fallback
            dateInputRef.current.click();
        }
    }
  };

  const serviceOptions = [
    { name: 'İlk Dokunuş Paketi', price: '₺750', duration: '45 Dk' },
    { name: 'Rahatla & Büyü Paketi', price: '₺2.800', duration: '4 Seans', isPopular: true },
    { name: 'Kardeş Paketi', price: '₺1.350', duration: '60 Dk' },
    { name: 'VIP Spa Deneyimi', price: '₺1.500', duration: '90 Dk' },
    { name: 'Sadece Hidroterapi', price: '₺500', duration: '30 Dk' },
    { name: 'Sadece Bebek Masajı', price: '₺400', duration: '30 Dk' }
  ];

  const morningSlots = ['09:00', '10:30', '12:00'];
  const afternoonSlots = ['13:30', '15:00', '16:30', '18:00'];
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-brand p-6 flex justify-between items-center text-white z-10 shadow-md">
          <div>
             <h2 className="text-2xl font-bold">Online Randevu</h2>
             <p className="text-brand-light text-sm opacity-90">Bebeğiniz için en iyi zamanı seçin</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 shrink-0">
           <div className="flex items-center justify-between max-w-sm mx-auto">
              {[1, 2, 3].map((s) => (
                 <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                       step >= s ? 'bg-brand text-white scale-110' : 'bg-gray-200 text-gray-500'
                    }`}>
                       {step > s ? <CheckCircle size={16} /> : s}
                    </div>
                    {s < 3 && <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-brand' : 'bg-gray-200'}`}></div>}
                 </div>
              ))}
           </div>
           <div className="flex justify-between max-w-sm mx-auto text-xs text-gray-500 mt-2 font-medium">
              <span>Hizmet & Zaman</span>
              <span className="pl-4">Bilgileriniz</span>
              <span>Onay</span>
           </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {step === 1 && (
             <form onSubmit={handleNext} className="space-y-8">
                {/* Service Selection */}
                <div>
                   <label className="block text-gray-800 font-bold mb-4 flex items-center gap-2 text-lg">
                      <Sparkles size={20} className="text-brand" /> Hizmet Seçimi
                   </label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {serviceOptions.map((opt) => {
                         const valueString = `${opt.name} (${opt.price})`;
                         const isSelected = formData.service === valueString;
                         return (
                            <div 
                                key={opt.name}
                                onClick={() => setFormData({...formData, service: valueString})}
                                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[100px] ${
                                   isSelected
                                   ? 'border-brand bg-brand/5 shadow-md scale-[1.02]' 
                                   : 'border-gray-100 hover:border-brand/30 hover:bg-gray-50 hover:shadow-sm'
                                }`}
                            >
                                {opt.isPopular && !isSelected && (
                                   <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm z-10">
                                      <Sparkles size={10} /> Favori
                                   </div>
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-bold text-sm leading-tight ${isSelected ? 'text-brand-dark' : 'text-gray-700'}`}>
                                        {opt.name}
                                    </span>
                                    {isSelected && <CheckCircle size={20} className="text-brand shrink-0 ml-1" />}
                                </div>
                                <div className="flex justify-between items-end mt-auto">
                                    <span className="text-[10px] bg-white/80 px-2 py-1 rounded-md text-gray-500 font-medium border border-gray-100">
                                        {opt.duration}
                                    </span>
                                    <span className={`font-bold text-lg ${isSelected ? 'text-brand' : 'text-gray-800'}`}>
                                        {opt.price}
                                    </span>
                                </div>
                            </div>
                         );
                      })}
                   </div>
                </div>

                {/* Date & Time Selection */}
                <div className="space-y-6">
                   <label className="block text-gray-800 font-bold flex items-center gap-2 text-lg">
                      <CalendarIcon size={20} className="text-brand" /> Tarih ve Saat
                   </label>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      {/* Date Picker Card */}
                      <div className="lg:col-span-2">
                         <div 
                            className={`relative h-full min-h-[200px] rounded-2xl border-2 transition-all overflow-hidden cursor-pointer group ${formData.date ? 'border-brand bg-brand/5' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                            onClick={handleDateCardClick}
                         >
                            <input 
                               ref={dateInputRef}
                               type="date" 
                               required
                               min={today}
                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                               onChange={(e) => setFormData({...formData, date: e.target.value})}
                               value={formData.date}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
                               <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${formData.date ? 'bg-brand text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                                  <CalendarIcon size={24} />
                               </div>
                               <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Seçilen Tarih</span>
                               <span className={`text-lg font-bold leading-tight ${formData.date ? 'text-brand-dark' : 'text-gray-700'}`}>
                                  {formatDateDisplay(formData.date)}
                               </span>
                               {!formData.date && <span className="text-xs text-brand mt-2 font-medium animate-pulse">Seçmek için tıklayın</span>}
                            </div>
                         </div>
                      </div>

                      {/* Time Slots */}
                      <div className="lg:col-span-3 space-y-4">
                         {/* Morning Section */}
                         <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                               <Sun size={14} /> Sabah
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {morningSlots.map((t) => (
                                 <button
                                   key={t}
                                   type="button"
                                   onClick={() => setFormData({...formData, time: t})}
                                   className={`py-2.5 px-1 rounded-xl text-sm font-bold border transition-all duration-200 ${
                                     formData.time === t
                                       ? 'bg-brand text-white border-brand shadow-md transform scale-105 ring-2 ring-brand/20'
                                       : 'bg-white text-gray-600 border-gray-200 hover:border-brand/50 hover:text-brand hover:bg-gray-50'
                                   }`}
                                 >
                                   {t}
                                 </button>
                              ))}
                            </div>
                         </div>

                         {/* Afternoon Section */}
                         <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                               <CloudSun size={14} /> Öğleden Sonra
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {afternoonSlots.map((t) => (
                                 <button
                                   key={t}
                                   type="button"
                                   onClick={() => setFormData({...formData, time: t})}
                                   className={`py-2.5 px-1 rounded-xl text-sm font-bold border transition-all duration-200 ${
                                     formData.time === t
                                       ? 'bg-brand text-white border-brand shadow-md transform scale-105 ring-2 ring-brand/20'
                                       : 'bg-white text-gray-600 border-gray-200 hover:border-brand/50 hover:text-brand hover:bg-gray-50'
                                   }`}
                                 >
                                   {t}
                                 </button>
                              ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!formData.service || !formData.date || !formData.time}
                  className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 group"
                >
                  Devam Et <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </form>
          )}

          {step === 2 && (
             <form onSubmit={handleNext} className="space-y-6">
                <div className="bg-brand/5 p-4 rounded-xl border border-brand/10 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                   <div className="text-center sm:text-left">
                      <p className="text-xs text-gray-500 font-bold uppercase">Seçilen Hizmet</p>
                      <p className="font-bold text-brand-dark">{formData.service.split('(')[0]}</p>
                   </div>
                   <div className="text-center sm:text-right">
                      <p className="text-xs text-gray-500 font-bold uppercase">Tarih & Saat</p>
                      <p className="font-bold text-gray-800">{formatDateDisplay(formData.date)} - {formData.time}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <User size={18} className="text-brand" /> Ebeveyn Adı Soyadı
                      </label>
                      <input 
                         type="text" 
                         required
                         placeholder="Örn: Ayşe Yılmaz"
                         className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                         onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                         value={formData.parentName}
                      />
                   </div>
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <User size={18} className="text-brand" /> Bebek Adı & Ayı
                      </label>
                      <input 
                         type="text" 
                         required
                         placeholder="Örn: Can (6 Aylık)"
                         className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                         onChange={(e) => setFormData({...formData, babyName: e.target.value})}
                         value={formData.babyName}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <Phone size={18} className="text-brand" /> Telefon
                      </label>
                      <input 
                         type="tel" 
                         required
                         placeholder="0555 555 55 55"
                         className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         value={formData.phone}
                      />
                   </div>
                   <div>
                      <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                         <Mail size={18} className="text-brand" /> E-posta
                      </label>
                      <input 
                         type="email" 
                         required
                         placeholder="ornek@email.com"
                         className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         value={formData.email}
                      />
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                     type="button" 
                     onClick={() => setStep(1)}
                     className="w-1/3 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                   >
                     Geri
                   </button>
                   <button 
                     type="submit" 
                     className="w-2/3 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg flex items-center justify-center gap-2"
                   >
                     Randevuyu Tamamla <CheckCircle size={20} />
                   </button>
                </div>
             </form>
          )}

          {step === 3 && (
             <div className="text-center py-8 animate-fade-in flex flex-col items-center justify-center h-full">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm animate-bounce-slow">
                   <CheckCircle size={48} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Randevunuz Alındı!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                   Teşekkürler Sayın <strong>{formData.parentName}</strong>. <br/>
                   <strong>{formData.service.split('(')[0]}</strong> için <br/>
                   <span className="text-brand font-bold">{formatDateDisplay(formData.date)}</span> saat <span className="text-brand font-bold">{formData.time}</span>'a kaydınız oluşturulmuştur. <br/>
                   <span className="text-sm mt-2 block text-gray-400">En kısa sürede onay için sizi arayacağız.</span>
                </p>
                <button 
                  onClick={() => { 
                    setStep(1); 
                    setFormData({
                        service: '',
                        date: '',
                        time: '',
                        parentName: '',
                        babyName: '',
                        phone: '',
                        email: ''
                    });
                    onClose(); 
                  }}
                  className="px-10 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
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
