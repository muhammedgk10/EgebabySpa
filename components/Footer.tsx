import React from 'react';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import { SectionId } from '../types';

const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              Ege<span className="text-brand">BabySpa</span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Şanlıurfa'nın kalbinde, bebekleriniz için en hijyenik ve konforlu spa deneyimini sunuyoruz. Bebeğinizin sağlığı ve mutluluğu önceliğimizdir.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-6">
                <span>Hizmet Bölgelerimiz:</span>
                <span className="text-gray-400">Haliliye • Karaköprü • Eyyübiye • Şanlıurfa Merkez</span>
            </div>
            <div className="flex gap-4">
              <a href="javascript:void(0)" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand transition-colors" title="Instagram">
                <Instagram size={20} />
              </a>
              <a href="javascript:void(0)" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand transition-colors" title="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li><button onClick={() => scrollTo(SectionId.HOME)} className="text-gray-400 hover:text-brand transition-colors">Ana Sayfa</button></li>
              <li><button onClick={() => scrollTo(SectionId.SERVICES)} className="text-gray-400 hover:text-brand transition-colors">Hizmetler</button></li>
              <li><button onClick={() => scrollTo(SectionId.PACKAGES)} className="text-gray-400 hover:text-brand transition-colors">Paketler</button></li>
              <li><button onClick={() => scrollTo(SectionId.BENEFITS)} className="text-gray-400 hover:text-brand transition-colors">Faydaları</button></li>
              <li><button onClick={() => scrollTo(SectionId.BLOG)} className="text-gray-400 hover:text-brand transition-colors">Blog</button></li>
              <li><button onClick={() => scrollTo(SectionId.CONTACT)} className="text-gray-400 hover:text-brand transition-colors">İletişim</button></li>
            </ul>
          </div>

          {/* Contact Small */}
          <div>
             <h3 className="text-lg font-bold mb-4 text-white">Bize Ulaşın</h3>
             <div className="space-y-3 text-sm text-gray-400">
               <div className="flex items-start gap-3">
                 <MapPin size={16} className="text-brand mt-1 shrink-0" />
                 <span>Bahçelievler Mah. Atatürk Bulv.<br/>Haliliye / Şanlıurfa</span>
               </div>
               <div className="flex items-center gap-3">
                 <Phone size={16} className="text-brand" />
                 <span>0555 555 55 55</span>
               </div>
               <div className="flex items-center gap-3">
                 <Mail size={16} className="text-brand" />
                 <span>info@egebabyspa.com</span>
               </div>
             </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
          <p>&copy; {new Date().getFullYear()} Ege Baby Spa Şanlıurfa. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="javascript:void(0)" className="hover:text-white cursor-pointer">Gizlilik Politikası</a>
            <a href="javascript:void(0)" className="hover:text-white cursor-pointer">Kullanım Şartları</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;