
import React, { useEffect, useRef, useState } from 'react';
import { SectionId } from '../types';
import { Linkedin, Instagram } from 'lucide-react';

const Team: React.FC = () => {
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

  const team = [
    {
      name: "Selin Yılmaz",
      title: "Baş Terapist & Kurucu",
      desc: "Fizyoterapi mezunu, bebek masajı ve hidroterapi alanında 8 yıl deneyimli. Uluslararası IAIM sertifikalı eğitmen.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Ayşe Demir",
      title: "Hidroterapi Uzmanı",
      desc: "Bebek gelişimi bölümü mezunu. Suda motor gelişim ve duyusal bütünleme konularında uzmanlaşmış terapist.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Zeynep Kaya",
      title: "Bebek Masaj Terapisti",
      desc: "Kolik ve gaz sorunlarına yönelik özel masaj teknikleri konusunda uzman. Ebeveyn eğitimi danışmanı.",
      image: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f8e?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Elif Şahin",
      title: "Müşteri İlişkileri",
      desc: "Sizi ve bebeğinizi merkezimizde karşılayan, randevu süreçlerini yöneten güler yüzlü asistanımız.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <section id={SectionId.TEAM} className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-brand font-bold tracking-wider text-sm uppercase">Uzman Kadromuz</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2">Bebeğiniz Emin Ellerde</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
             Bebeklerinizi kendi bebeğimiz gibi seviyor, gelişimlerini profesyonel bilgi birikimimizle destekliyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-[2rem] p-4 text-center group hover:shadow-xl transition-all duration-700 border border-gray-100 hover:-translate-y-2 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-32 h-32 mx-auto rounded-full p-1 border-2 border-brand-light mb-6 relative overflow-hidden">
                 <img 
                   src={member.image} 
                   alt={member.name} 
                   className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                 />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
              <p className="text-brand text-xs font-bold uppercase tracking-wider mt-1 mb-4">{member.title}</p>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {member.desc}
              </p>

              <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-brand hover:text-white transition-colors">
                    <Instagram size={16} />
                 </button>
                 <button className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-brand hover:text-white transition-colors">
                    <Linkedin size={16} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
