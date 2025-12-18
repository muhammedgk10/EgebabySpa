
import React, { useEffect, useRef, useState } from 'react';
import { Waves, HeartHandshake, Bath, Sparkles, ArrowRight, Star, Calendar } from 'lucide-react';
import { Service, SectionId } from '../types';

interface ServicesProps {
  onOpenBooking: () => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenBooking }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Run animation only once
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -50px 0px' // Offset slightly to ensure it feels natural
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToPackages = () => {
    const element = document.getElementById(SectionId.PACKAGES);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services: Service[] = [
    {
      id: 'hydrotherapy',
      title: 'Hidroterapi (Floating)',
      description: 'Bebeğinizin suyun kaldırma kuvvetiyle özgürce hareket etmesini sağlıyoruz. 35°C ozonlu ve klorsuz suyumuzda kas gelişimi desteklenirken, gaz sancıları doğal yolla hafifler.',
      iconName: 'Waves',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&fm=webp&fit=crop'
    },
    {
      id: 'massage',
      title: 'Terapötik Bebek Masajı',
      description: 'Sertifikalı terapistlerimiz eşliğinde, kolik ve huzursuzluk sorunlarına yönelik özel teknikler. Bebeğinizin bağışıklık sistemini güçlendirir ve derin bir uykuya hazırlar.',
      iconName: 'HeartHandshake',
      imageUrl: 'https://images.unsplash.com/photo-1544126566-4744398f7f73?q=80&w=800&fm=webp&fit=crop'
    },
    {
      id: 'daily-care',
      title: 'Organik Bakım & Hijyen',
      description: 'Hassas ciltler için %100 organik yağlarla bakım. Tırnak, burun ve kulak temizliği ile bebeğinizin günlük bakımı profesyonel ellerde.',
      iconName: 'Sparkles',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'mother-baby',
      title: 'Ebeveyn & Bebek Eğitimi',
      description: 'Sadece spa değil, eğitim de veriyoruz. Evde uygulayabileceğiniz gaz masajı ve rahatlatma tekniklerini uzmanlarımızdan uygulamalı olarak öğrenin.',
      iconName: 'Bath',
      imageUrl: 'https://images.unsplash.com/photo-1607593259882-7aa7b12d5d71?q=80&w=800&fm=webp&fit=crop'
    }
  ];

  const getIcon = (name: string) => {
    const props = { size: 24, className: "text-brand-dark" };
    switch (name) {
      case 'Waves': return <Waves {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      case 'Bath': return <Bath {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      default: return <Waves {...props} />;
    }
  };

  return (
    <section id={SectionId.SERVICES} className="py-24 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        {/* Modern Section Header */}
        <div className={`flex flex-col md:flex-row justify-between items-end mb-16 gap-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest mb-3">
                    <span className="w-8 h-[1px] bg-brand"></span>
                    Hizmetlerimiz
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                    Minik Bedenlere <br/> <span className="text-brand italic">Profesyonel Dokunuşlar</span>
                </h2>
            </div>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed mb-2">
                0-36 ay arası bebeklerin fiziksel ve duygusal ihtiyaçlarına özel olarak tasarlanmış, Şanlıurfa'nın en yüksek hijyen standartlarına sahip wellness deneyimi.
            </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
                key={service.id} 
                className={`group relative bg-white rounded-[2rem] p-4 flex flex-col h-full border border-gray-100 hover:border-brand/30 hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image Container - Soft Corners */}
              <div className="h-56 w-full rounded-[1.5rem] overflow-hidden relative mb-6">
                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm z-20">
                  {getIcon(service.iconName)}
                </div>
              </div>
              
              <div className="px-2 flex flex-col flex-1">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>
                
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between h-14 relative">
                    {/* Default State: Rating */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:translate-y-2 pointer-events-none">
                         <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                            <Star size={12} className="text-brand-gold fill-current" /> 5.0
                        </div>
                    </div>
                    
                    {/* Hover State: Learn More Button */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                         <button 
                            onClick={scrollToPackages}
                            className="text-xs font-bold text-brand hover:text-brand-dark bg-brand-light/30 px-3 py-2 rounded-lg transition-all flex items-center gap-1 hover:bg-brand-light/50"
                         >
                            İncele 
                            <ArrowRight size={14} />
                         </button>
                    </div>

                    <button 
                    onClick={onOpenBooking}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-brand hover:text-white transition-all duration-300 hover:scale-110 shadow-sm z-10"
                    title="Randevu Al"
                    >
                    <Calendar size={18} />
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
