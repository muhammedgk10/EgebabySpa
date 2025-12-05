import React from 'react';
import { SectionId } from '../types';
import { Calendar, PlayCircle, Star, ShieldCheck, ChevronDown, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenWizard: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenWizard }) => {
  return (
    <section id={SectionId.HOME} className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Modern Gradient Overlay: Better text readability without killing the video vibe */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-gray-50/90 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover scale-105"
          poster="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1920&auto=format&fit=crop"
        >
          <source src="https://videos.pexels.com/video-files/3245785/3245785-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto px-4 relative z-20 flex flex-col items-center text-center mt-10">
        
        {/* Trust Badge - Top (Updated for Social Proof) */}
        <div className="animate-fade-in-up flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold uppercase tracking-widest mb-8 hover:bg-white/20 transition-colors cursor-default">
           <ShieldCheck size={14} className="text-emerald-400" />
           <span>Şanlıurfa'nın Sertifikalı & Güvenilir Merkezi</span>
        </div>

        {/* Main Title - SEO Optimized H1 (Local Keywords) */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6 drop-shadow-lg animate-fade-in-up max-w-5xl" style={{ animationDelay: '0.1s' }}>
          Şanlıurfa'nın En Kapsamlı <br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-white to-brand-light">
             Bebek Spa & Masaj Merkezi
          </span>
        </h1>

        {/* Value Proposition */}
        <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Bebeğinizin gaz sancılarına doğal çözüm, deliksiz bir uyku için <strong>hidroterapi (floating)</strong> ve uzman dokunuşlar. 
          <span className="block mt-2 text-brand-light font-medium flex items-center justify-center gap-1">
             <MapPin size={16} /> Haliliye, Şanlıurfa
          </span>
        </p>

        {/* Modern Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button 
            onClick={onOpenBooking}
            className="flex-1 px-8 py-5 bg-brand hover:bg-brand-dark text-white rounded-2xl font-sans font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(42,157,143,0.5)] hover:shadow-[0_0_60px_-15px_rgba(42,157,143,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Calendar size={20} />
            Hemen Randevu Al
          </button>
          
          <button 
            onClick={onOpenWizard}
            className="flex-1 px-8 py-5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-brand-dark text-white rounded-2xl font-sans font-bold text-lg transition-all flex items-center justify-center gap-3"
          >
            <PlayCircle size={20} />
            Size Uygun Paket?
          </button>
        </div>

        {/* Social Proof - Bottom */}
        <div className="mt-12 flex items-center gap-4 animate-fade-in-up opacity-80" style={{ animationDelay: '0.5s' }}>
            <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Happy Mom" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
            <div className="text-left text-white">
                <div className="flex text-yellow-400 gap-0.5">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                </div>
                <div className="text-xs font-bold mt-1">
                    4.9/5.0 <span className="font-normal opacity-70">(250+ Mutlu Aile)</span>
                </div>
            </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block opacity-50 hover:opacity-100 transition-opacity">
            <ChevronDown size={32} className="text-white" />
        </div>

      </div>
    </section>
  );
};

export default Hero;