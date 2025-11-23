import React from 'react';
import { SectionId } from '../types';
import { Calendar, ChevronDown } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id={SectionId.HOME} className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-light via-white to-brand-light/20">
      
      {/* Abstract Shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[80px]"></div>

      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center relative z-10 gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left pt-8 md:pt-0">
          <div className="inline-block px-4 py-1.5 bg-brand/10 text-brand font-bold text-sm rounded-full mb-6 tracking-wide">
            ✨ İzmir'in En Kapsamlı Bebek Spası
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-[1.1] mb-6">
            Bebeğinizin <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand via-[#4DB6AC] to-brand bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                Mutluluğu
              </span>
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-accent opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span> <br />
            Bizim İçin Değerli
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
            Floating ve bebek masajı ile bebeğinizin gelişimini destekleyin, gaz sancılarına veda edin ve eşsiz bir bağ kurun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={onOpenBooking}
              className="px-8 py-4 bg-brand text-white font-bold text-lg rounded-full shadow-xl hover:bg-brand-dark hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              Hemen Randevu Al
            </button>
            <button 
              onClick={() => document.getElementById(SectionId.PACKAGES)?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-full shadow-md border border-gray-100 hover:bg-gray-50 hover:border-brand/30 transition-all duration-300"
            >
              Paketleri İncele
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
            <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
                 {/* Decorative Ring */}
                 <div className="absolute inset-0 border-2 border-brand/20 rounded-full animate-[spin_10s_linear_infinite]" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
                 
                 {/* Main Image Masked */}
                 <div className="absolute inset-2 overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02]" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}>
                    <img 
                        src="https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="Happy baby spa" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                 </div>

                 {/* Floating badge */}
                 <div className="absolute top-10 right-0 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white animate-bounce-slow">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                           <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white"></div>
                           <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white"></div>
                           <div className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">+500</div>
                        </div>
                        <div className="text-xs font-bold text-gray-700">
                           Mutlu Aile
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-brand/50">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;