
import React from 'react';
import { Waves, HeartHandshake, Bath, Award, ArrowRight } from 'lucide-react';
import { Service, SectionId } from '../types';

interface ServicesProps {
  onOpenBooking: () => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenBooking }) => {
  const services: Service[] = [
    {
      id: 'hydrotherapy',
      title: 'Hidroterapi',
      description: 'Özel olarak tasarlanmış, ozon ile temizlenen jakuzilerde, bebeklerin suyun kaldırma kuvvetiyle özgürce hareket etmesini sağlıyoruz.',
      iconName: 'Waves',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&fm=webp&fit=crop'
    },
    {
      id: 'massage',
      title: 'Bebek Masajı',
      description: 'Uzman terapistlerimiz eşliğinde yapılan masaj ile gaz sancılarını, kolik ağrılarını hafifletiyor ve uyku kalitesini artırıyoruz.',
      iconName: 'HeartHandshake',
      imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&fm=webp&fit=crop'
    },
    {
      id: 'floating',
      title: 'Floating',
      description: 'Anti-alerjik boyun simidi ile güvenli bir şekilde suyun üzerinde süzülen bebeklerde denge ve koordinasyon gelişir.',
      iconName: 'Bath',
      imageUrl: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?q=80&w=800&fm=webp&fit=crop'
    },
    {
      id: 'mother-baby',
      title: 'Anne & Bebek',
      description: 'Anne ile bebeğin bağını güçlendiren, rahatlatıcı ve keyifli özel seanslarımız ile stresten uzaklaşın.',
      iconName: 'Award',
      imageUrl: 'https://images.unsplash.com/photo-1627930869687-0b4458514d02?q=80&w=800&fm=webp&fit=crop'
    }
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Waves': return <Waves size={32} />;
      case 'HeartHandshake': return <HeartHandshake size={32} />;
      case 'Bath': return <Bath size={32} />;
      case 'Award': return <Award size={32} />;
      default: return <Waves size={32} />;
    }
  };

  return (
    <section id={SectionId.SERVICES} className="min-h-screen pt-20 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand font-bold tracking-wider text-sm uppercase">Hizmetlerimiz</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">Neler Sunuyoruz?</h2>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded-full mb-6 opacity-50"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Bebeğinizin fiziksel ve zihinsel gelişimini destekleyen, hijyenik ve güvenli spa hizmetlerimiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-brand/20 group-hover:bg-brand/10 transition-colors z-10"></div>
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&fm=webp&fit=crop';
                  }}
                />
                <div className="absolute top-4 right-4 bg-white p-3 rounded-full text-brand shadow-lg z-20 group-hover:rotate-12 transition-transform">
                  {getIcon(service.iconName)}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-brand transition-colors">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>
                
                <button 
                  onClick={onOpenBooking}
                  className="flex items-center gap-2 text-brand font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all"
                >
                  Detaylı Bilgi <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
