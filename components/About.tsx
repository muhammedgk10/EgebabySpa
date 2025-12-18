import React, { useEffect, useRef, useState } from 'react';
import { SectionId } from '../types';
import { ShieldCheck, Droplets, Award, Heart } from 'lucide-react';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id={SectionId.ABOUT} 
      ref={sectionRef}
      className={`py-20 bg-white overflow-hidden css-123456 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white z-10">
              <img 
                src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1000&auto=format&fit=crop" 
                alt="Hijyenik Bebek Spa Ortamı" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-10 -left-10 w-24 h-24 bg-brand-light rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            
            {/* Floating Badge */}
            <div className={`absolute bottom-8 right-8 z-20 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow hidden md:block transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                     <ShieldCheck size={24} />
                  </div>
                  <div>
                     <span className="block text-sm font-bold text-gray-800">%100 Ozonlu</span>
                     <span className="block text-xs text-gray-500">Hijyen Garantisi</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <span className="text-brand font-bold tracking-wider text-sm uppercase mb-2 block">Biz Kimiz?</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-6 leading-tight">
              Minik Bedenlere <br/>
              <span className="text-brand">Profesyonel Dokunuşlar</span>
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6 font-medium">
              "Bir anne hassasiyetiyle kurulan Ege Baby Spa, Şanlıurfa'da bebek sağlığı ve gelişimine profesyonel bir bakış açısı getirmek amacıyla yola çıktı."
            </p>
            
            <p className="text-gray-500 leading-relaxed mb-8">
               Sadece bir ticarethane değil, annelerin nefes aldığı, bebeklerin güvenle geliştiği bir yaşam merkeziyiz. Kullandığımız sudan, masaj yağlarına kadar her detayda 'kendi bebeğimiz için ne istersek onu sunuyoruz' felsefesini benimsedik.
            </p>

            <div className="space-y-6">
              <div className={`flex gap-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                 <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center text-brand shrink-0">
                    <Droplets size={24} />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Üstün Hijyen Standartları</h4>
                    <p className="text-gray-500 leading-snug">
                       Her seans öncesi ve sonrası jakuzilerimiz boşaltılır, ozon teknolojisi ile dezenfekte edilir.
                    </p>
                 </div>
              </div>

              <div className={`flex gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                 <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold shrink-0">
                    <Award size={24} />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Sertifikalı Uzman Kadro</h4>
                    <p className="text-gray-500 leading-snug">
                       Uluslararası sertifikalı kadromuzla, binlerce bebeğin ilk spa deneyimine tanıklık etmenin gururunu yaşıyoruz.
                    </p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;