
import React from 'react';
import { Waves, HeartHandshake, Bath, Award } from 'lucide-react';
import { Service, SectionId } from '../types';

const Services: React.FC = () => {
  const services: Service[] = [
    {
      id: 'hydrotherapy',
      title: 'Hidroterapi',
      description: 'Özel olarak tasarlanmış, ozon ile temizlenen jakuzilerde, bebeklerin suyun kaldırma kuvvetiyle özgürce hareket etmesini sağlıyoruz.',
      iconName: 'Waves',
      imageUrl: 'https://images.unsplash.com/photo-1606734129528-7663e26b1c34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'massage',
      title: 'Bebek Masajı',
      description: 'Uzman terapistlerimiz eşliğinde yapılan masaj ile gaz sancılarını, kolik ağrılarını hafifletiyor ve uyku kalitesini artırıyoruz.',
      iconName: 'HeartHandshake',
      imageUrl: 'https://images.unsplash.com/photo-1544126566-475a106e5d83?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'floating',
      title: 'Floating',
      description: 'Anti-alerjik boyun simidi ile güvenli bir şekilde suyun üzerinde süzülen bebeklerde denge ve koordinasyon gelişir.',
      iconName: 'Bath',
      imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
     {
      id: 'mother-baby',
      title: 'Anne & Bebek',
      description: 'Anne ile bebeğin bağını güçlendiren, rahatlatıcı ve keyifli özel seanslarımız ile stresten uzaklaşın.',
      iconName: 'Award',
      imageUrl: 'https://images.unsplash.com/photo-1545674069-b59c77e12739?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  const getIcon = (name: string) => {
    // Icons without specific animation classes, allowing the parent wrapper to handle transforms
    const iconClass = "";
    switch (name) {
      case 'Waves': return <Waves size={28} className={iconClass} />;
      case 'HeartHandshake': return <HeartHandshake size={28} className={iconClass} />;
      case 'Bath': return <Bath size={28} className={iconClass} />;
      case 'Award': return <Award size={28} className={iconClass} />;
      default: return <Waves size={28} className={iconClass} />;
    }
  };

  return (
    <section id={SectionId.SERVICES} className="min-h-screen pt-20 pb-20 bg-white relative overflow-hidden">
       {/* Decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-0 w-64 h-64 bg-brand-light/40 rounded-full blur-3xl -translate-x-1/2"></div>
          <div className="absolute bottom-20 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl translate-x-1/2"></div>
       </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <span className="text-brand font-bold tracking-wider text-sm uppercase">Neler Yapıyoruz?</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">Hizmetlerimiz</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Bebeğinizin fiziksel ve ruhsal gelişimi için özenle hazırladığımız, hijyen standartlarının en üst seviyede tutulduğu spa deneyimi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group bg-white rounded-[2rem] shadow-lg hover:shadow-2xl hover:shadow-brand/20 transition-all duration-300 border border-gray-50 flex flex-col overflow-hidden">
              <div className="h-52 overflow-hidden relative">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col items-center text-center relative mt-[-2rem]">
                 {/* Floating Icon Container */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-110 mb-4 ring-4 ring-white">
                  {/* Wrapper for scale and rotation */}
                  <div className="transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
                    {getIcon(service.iconName)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>
                <div className="w-full pt-4 border-t border-gray-100">
                    <button className="text-brand font-bold text-sm hover:text-brand-dark transition-colors flex items-center justify-center gap-1 group-hover:gap-2">
                    Detayları İncele <span className="transition-all">&rarr;</span>
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
