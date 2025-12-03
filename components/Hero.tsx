import React from 'react';
import { SectionId } from '../types';
import { Calendar, ChevronDown, PlayCircle, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenWizard: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenWizard }) => {
  return (
    <section id={SectionId.HOME} className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-brand-dark/20 z-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop"
        >
          {/* Relaxing water video stock */}
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38af1e1e9016d9e60&profile_id=165&oauth2_token_id=57447761" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto px-4 flex flex-col items-center relative z-20 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full text-white text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-8 animate-fade-in-up">
           <Sparkles size={14} className="text-brand-gold" /> Şanlıurfa'nın En Kapsamlı Bebek Spası
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white leading-[1.1] mb-6 drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Minik Bedenler İçin <br />
          <span className="italic relative inline-block text-brand-sand">
             Büyük Huzur
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto font-light animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Şanlıurfa'da bebeğinizin duyusal gelişimini, uzman destekli hidroterapi ve masajın iyileştirici gücüyle keşfedin.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button 
            onClick={onOpenBooking}
            className="px-10 py-5 bg-brand text-white font-serif font-bold text-xl rounded-full shadow-2xl hover:bg-brand-dark hover:shadow-brand/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 min-w-[240px]"
          >
            <Calendar size={22} />
            Hemen Randevu Al
          </button>
          
          <button 
            onClick={onOpenWizard}
            className="px-10 py-5 bg-white/20 backdrop-blur-md border border-white/50 text-white font-serif font-bold text-xl rounded-full shadow-lg hover:bg-white hover:text-brand-dark hover:border-white transition-all duration-300 flex items-center justify-center gap-3 min-w-[240px]"
          >
            <PlayCircle size={22} />
            Paket Sihirbazı
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-brand-dark cursor-pointer z-20" onClick={() => document.getElementById(SectionId.SERVICES)?.scrollIntoView({behavior: 'smooth'})}>
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;