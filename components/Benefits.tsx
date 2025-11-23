import React from 'react';
import { Smile, Moon, Activity, Brain } from 'lucide-react';
import { SectionId } from '../types';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <Activity size={40} />,
      title: "Motor Gelişim",
      desc: "Suyun direnci ile kaslar güçlenir, motor beceriler hızla gelişir."
    },
    {
      icon: <Smile size={40} />,
      title: "Gaz ve Kolik",
      desc: "Sıcak su ve masaj, sindirim sistemini rahatlatarak gaz sancılarını azaltır."
    },
    {
      icon: <Moon size={40} />,
      title: "Düzenli Uyku",
      desc: "Gevşeyen kaslar ve harcanan enerji sayesinde bebekler daha derin uyur."
    },
    {
      icon: <Brain size={40} />,
      title: "Zihinsel Gelişim",
      desc: "Yeni uyaranlar ve hareket özgürlüğü beyin gelişimini destekler."
    }
  ];

  return (
    <section id={SectionId.BENEFITS} className="min-h-screen pt-20 pb-20 bg-brand-light/30">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Image Grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
           <img 
             src="https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
             alt="Happy Baby 1" 
             className="rounded-2xl shadow-lg mt-8 w-full h-64 object-cover"
           />
           <img 
             src="https://images.unsplash.com/photo-1522771753035-1a5b6564f3a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
             alt="Happy Baby 2" 
             className="rounded-2xl shadow-lg w-full h-64 object-cover"
           />
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Neden <span className="text-brand">Ege Baby Spa?</span>
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Bebeklerin ilk aylarında suyla olan ilişkisi, anne karnındaki güvenli ortamı hatırlatır. Bu deneyim sadece eğlenceli değil, aynı zamanda gelişimsel bir ihtiyaçtır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-brand-light hover:shadow-md transition-shadow">
                <div className="text-brand shrink-0 group-hover:animate-bounce">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
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