import React, { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Send, Loader2, CheckCircle } from 'lucide-react';
import { SectionId } from '../types';
import { addContactMessage } from '../services/firebaseService';

interface ContactProps {
    notify?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const Contact: React.FC<ContactProps> = ({ notify }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');

    try {
      await addContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      if (notify) {
          notify('success', 'Mesaj Gönderildi', 'En kısa sürede size dönüş yapacağız.');
      }
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      if (notify) {
          notify('error', 'Hata', 'Mesaj gönderilirken bir sorun oluştu.');
      }
      setStatus('idle');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id={SectionId.CONTACT} className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
            <span className="text-brand font-bold tracking-wider text-sm uppercase">İletişim</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mt-2">Şanlıurfa Merkez Şube</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-4">
              Sorularınız, randevu talepleriniz veya önerileriniz için dilediğiniz zaman bizimle iletişime geçebilirsiniz.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800">İletişim Bilgileri</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center text-brand shrink-0">
                   <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Adresimiz</h4>
                  <p className="text-gray-600 mt-1">Bahçelievler Mah. Atatürk Bulvarı<br/>Haliliye, Şanlıurfa</p>
                  <p className="text-xs text-gray-400 mt-1">(Novada AVM yakını)</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center text-brand shrink-0">
                   <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Telefon</h4>
                  <p className="text-gray-600 mt-1">+90 (555) 555 55 55</p>
                  <p className="text-sm text-gray-400 mt-1">Haftanın her günü 09:00 - 19:00</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center text-brand shrink-0">
                   <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">E-posta</h4>
                  <p className="text-gray-600 mt-1">info@egebabyspa.com</p>
                </div>
              </div>
            </div>

            {/* Map Iframe */}
            <div className="flex-1 rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[200px]">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101408.23297771701!2d38.7955!3d37.1674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1534710173266a4f%3A0x6e2610705a666576!2zxZearW5sSXVyZmEsIFNhbmxpdXJmYSBNZXJrZXovxZearW5sSXVyZmE!5e0!3m2!1sen!2str!4v1710000000000!5m2!1sen!2str" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ege Baby Spa Şanlıurfa Konumu"
                ></iframe>
            </div>

            <div className="pt-4 border-t border-gray-100">
               <h4 className="font-bold text-gray-800 mb-4">Sosyal Medya</h4>
               <div className="flex gap-4">
                 <a href="#" className="w-12 h-12 bg-gray-100 hover:bg-brand hover:text-white transition-all rounded-full flex items-center justify-center text-gray-600">
                   <Instagram size={24} />
                 </a>
                 <a href="#" className="w-12 h-12 bg-gray-100 hover:bg-brand hover:text-white transition-all rounded-full flex items-center justify-center text-gray-600">
                   <Facebook size={24} />
                 </a>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col gap-6">
             <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 flex-1 relative overflow-hidden">
                {status === 'success' ? (
                  <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Mesajınız Gönderildi!</h3>
                    <p className="text-gray-600">En kısa sürede size dönüş yapacağız. Teşekkür ederiz.</p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="mt-8 text-brand font-bold hover:underline"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Mesaj Gönderin</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Adınız Soyadınız</label>
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all" 
                            placeholder="Adınız" 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">E-posta Adresiniz</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all" 
                            placeholder="ornek@email.com" 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Mesajınız</label>
                          <textarea 
                            rows={4} 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all resize-none" 
                            placeholder="Mesajınızı buraya yazın..."
                          ></textarea>
                      </div>
                      <button 
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center justify-center gap-2"
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 size={20} className="animate-spin" /> Gönderiliyor...
                          </>
                        ) : (
                          <>
                            Gönder <Send size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;