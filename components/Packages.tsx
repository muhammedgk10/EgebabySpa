
import React from 'react';
import { Package, SectionId } from '../types';
import { Check, Star, Sparkles } from 'lucide-react';

interface PackagesProps {
    onOpenBooking: () => void;
}

const Packages: React.FC<PackagesProps> = ({ onOpenBooking }) => {
  const packages: Package[] = [
    {
      id: 'first-touch',
      name: 'İlk Dokunuş',
      price: '₺750',
      duration: '45 Dakika',
      recommendedAge: '0-12 Ay',
      features: [
        '20 Dk Hidroterapi (Floating)',
        '20 Dk Bebek Masajı',
        'Organik Masaj Yağları',
        'Gelişim Takibi',
        'Fotoğraf Çekimi'
      ]
    },
    {
      id: 'relax-grow',
      name: 'Rahatla & Büyü',
      price: '₺2.800',
      duration: '4 Seans',
      recommendedAge: '2-18 Ay',
      isFeatured: true,
      features: [
        '4 x Hidroterapi Seansı',
        '4 x Tüm Vücut Masajı',
        'Ebeveyn Bilgilendirme',
        'Gaz Masajı Eğitimi',
        'Kişiye Özel Havlu Seti',
        'Sürpriz Hediyeler'
      ]
    },
    {
      id: 'sibling-joy',
      name: 'Kardeş Paketi',
      price: '₺1.350',
      duration: '60 Dakika',
      recommendedAge: '0-24 Ay',
      features: [
        'İki Bebek İçin Jakuzi',
        'Eş Zamanlı Masaj',
        'Aile Katılımı',
        'Özel Oda Deneyimi',
        'İkramlar'
      ]
    },
    {
      id: 'vip-spa',
      name: 'VIP Spa Deneyimi',
      price: '₺1.500',
      duration: '90 Dakika',
      recommendedAge: 'Tüm Aylar',
      features: [
        'Tamamen Size Özel Alan',
        'Genişletilmiş Floating',
        'Aromaterapi Ortamı',
        'Anne & Bebek Rahatlama Çayı',
        'Profesyonel Fotoğraf Albümü'
      ]
    }
  ];

  return (
    <section id={SectionId.PACKAGES} className="min-h-screen pt-20 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand font-bold tracking-wider text-sm uppercase">Fiyatlandırma</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">Özel Spa Paketleri</h2>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded-full mb-6 opacity-50"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Bebeğinizin ihtiyacına ve bütçenize uygun, sevgiyle hazırladığımız paketlerimizi inceleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 pt-8">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-white rounded-3xl p-8 transition-all duration-300 flex flex-col ${
                pkg.isFeatured 
                  ? 'shadow-2xl shadow-brand/20 scale-105 md:scale-110 border-2 border-brand ring-4 ring-brand/10 z-20 hover:scale-[1.08] md:hover:scale-[1.15] hover:shadow-brand/40' 
                  : pkg.isPopular 
                    ? 'shadow-xl scale-105 border-2 border-brand z-10 hover:scale-110 hover:shadow-2xl'
                    : 'shadow-lg border border-gray-100 hover:border-brand/30 hover:shadow-xl hover:scale-105'
              }`}
            >
              {(pkg.isFeatured || pkg.isPopular) && (
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg whitespace-nowrap z-30 ${
                    pkg.isFeatured 
                      ? 'bg-gradient-to-r from-brand to-brand-dark text-white ring-4 ring-white' 
                      : 'bg-brand text-white ring-4 ring-white'
                }`}>
                  {pkg.isFeatured ? (
                     <>
                       <Sparkles size={16} className="text-yellow-300 animate-pulse" /> 
                       <span>Öne Çıkan Fırsat</span>
                     </>
                  ) : (
                     <>
                       <Star size={14} fill="white" /> 
                       <span>En Çok Tercih Edilen</span>
                     </>
                  )}
                </div>
              )}

              <div className="text-center mb-6 mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-500 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-full">
                  {pkg.recommendedAge}
                </p>
                <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                  <span className="text-3xl font-bold">{pkg.price}</span>
                  <span className="text-sm text-gray-500 font-normal">/ {pkg.duration}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${pkg.isFeatured ? 'bg-brand/20' : 'bg-green-100'}`}>
                      <Check size={14} className={pkg.isFeatured ? 'text-brand' : 'text-green-600'} />
                    </div>
                    <span className="text-gray-600 text-sm leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={onOpenBooking}
                className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                  pkg.isFeatured 
                    ? 'bg-gradient-to-r from-brand to-brand-dark text-white hover:shadow-lg hover:shadow-brand/40 transform hover:-translate-y-1' 
                    : pkg.isPopular
                      ? 'bg-brand text-white hover:bg-brand-dark shadow-lg'
                      : 'bg-brand-light text-brand-dark hover:bg-brand hover:text-white'
                }`}
              >
                Paketi Seç
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
