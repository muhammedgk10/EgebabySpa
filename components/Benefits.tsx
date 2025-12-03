
import React from 'react';
import { Smile, Moon, Activity, ShieldCheck, CheckCircle } from 'lucide-react';
import { SectionId } from '../types';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <Smile size={32} />,
      title: "Kolik ve Gaz Sancısına Son",
      desc: "Sıcak suyun gevşetici etkisi ve özel masaj teknikleri, sindirim sistemini düzenler, gaz sancısı ve kolik ağrılarını doğal yolla hafifletir."
    },
    {
      icon: <Moon size={32} />,
      title: "Düzenli ve Kaliteli Uyku",
      desc: "Spa sonrası salgılanan rahatlama hormonları ve suda harcanan tatlı enerji, bebeğinizin daha derin uyumasına ve uyku düzeninin oturmasına yardımcı olur."
    },
    {
      icon: <Activity size={32} />,
      title: "Güçlü Motor Gelişim",
      desc: "Suyun direnci, bebeğinizin karada kullanamadığı kas gruplarını çalıştırır. Bu sayede baş tutma, dönme ve yürüme gibi motor beceriler daha hızlı gelişir."
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Güçlü Bağışıklık Sistemi",
      desc: "Dolaşım sisteminin hızlanması ve lenfatik drenaj masajı, bebeğinizin bağışıklık sistemini güçlendirerek hastalıklara karşı direncini artırır."
    }
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const fallback = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&fm=webp&fit=crop';
    if (target.src !== fallback) {
        target.src = fallback;
    }
  };

  return (
    <section id={SectionId.BENEFITS} className="min-h-screen pt-20 pb-20 bg-brand-light/30">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Single Large Image */}
        <div className="w-full lg:w-1/2 relative px-4 md:px-0 group perspective-1000">
           {/* Decorative Background Element */}
           <div className="absolute inset-0 bg-brand/10 rounded-[3rem] transform -rotate-3 scale-95 z-0 transition-all duration-700 ease-out group-hover:rotate-0 group-hover:scale-100 group-hover:bg-brand/20"></div>
           
           <img 
             src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop" 
             alt="Happy Relaxed Baby Spa" 
             className="relative z-10 rounded-[3rem] shadow-2xl w-full h-[500px] object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-brand/20 border-8 border-white"
             onError={handleImageError}
           />
           
           {/* Floating Badge */}
           <div className="absolute -bottom-6 -right-4 z-20 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow hidden md:block group-hover:animate-none group-hover:scale-110 transition-all duration-300">
              <div className="flex items-center gap-2">
                 <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center text-brand">
                    <CheckCircle size={20} />
                 </div>
                 <div>
                    <span className="block text-sm font-bold text-gray-800">Bilimsel Olarak</span>
                    <span className="block text-xs text-gray-500">Kanıtlanmış Faydalar</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2">
          <span className="text-brand font-bold tracking-wider text-sm uppercase mb-2 block">Neden Ege Baby Spa?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Bebeğinizin Sağlığı İçin <br/><span className="text-brand">Doğal ve Güvenli Çözümler</span>
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Anne karnındaki güvenli su ortamını hatırlayan bebekler, suda kendilerini huzurlu hissederler. Uzman ellerde gerçekleşen bu deneyim, bebeğinizin gelişim yolculuğunda en büyük destekçinizdir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group/item flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-brand-light/50 hover:shadow-md hover:border-brand-light transition-all duration-300 hover:-translate-y-1">
                <div className="text-brand shrink-0 group-hover/item:scale-110 transition-transform duration-300 bg-brand-light/30 p-2 rounded-lg h-fit">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600 leading-snug">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
