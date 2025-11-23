import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { SectionId } from '../types';

const Contact: React.FC = () => {
  return (
    <section id={SectionId.CONTACT} className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
            <span className="text-brand font-bold tracking-wider text-sm uppercase">İletişim</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mt-2">Bize Ulaşın</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-4">
              Sorularınız, randevu talepleriniz veya önerileriniz için dilediğiniz zaman bizimle iletişime geçebilirsiniz.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8 h-full">
            <h3 className="text-2xl font-bold text-gray-800">İletişim Bilgileri</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center text-brand shrink-0">
                   <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Adresimiz</h4>
                  <p className="text-gray-600 mt-1">Alsancak Mahallesi, Atatürk Caddesi No:123<br/>Konak, İzmir</p>
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

            <div className="pt-8 border-t border-gray-100">
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

          {/* Contact Form / Map */}
          <div className="flex flex-col gap-6">
             <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Mesaj Gönderin</h3>
                <form className="space-y-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Adınız Soyadınız</label>
                      <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" placeholder="Adınız" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">E-posta Adresiniz</label>
                      <input type="email" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" placeholder="ornek@email.com" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Mesajınız</label>
                      <textarea rows={4} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" placeholder="Mesajınızı buraya yazın..."></textarea>
                   </div>
                   <button className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-lg">
                      Gönder
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;