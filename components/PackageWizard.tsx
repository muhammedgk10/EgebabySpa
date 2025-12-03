
import React, { useState } from 'react';
import { X, ChevronRight, Baby, Moon, Activity, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Package } from '../types';

interface PackageWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage: (pkgName: string) => void;
}

const PackageWizard: React.FC<PackageWizardProps> = ({ isOpen, onClose, onSelectPackage }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const questions = [
    {
      id: 'age',
      title: 'Bebeğiniz kaç aylık?',
      icon: <Baby size={32} />,
      options: [
        { label: '0-6 Ay (Yenidoğan)', value: 'newborn' },
        { label: '6-12 Ay (Emekleme)', value: 'crawling' },
        { label: '12-36 Ay (Yürüme)', value: 'toddler' }
      ]
    },
    {
      id: 'concern',
      title: 'Öncelikli ihtiyacınız nedir?',
      icon: <Activity size={32} />,
      options: [
        { label: 'Gaz Sancısı / Kolik', value: 'colic' },
        { label: 'Uyku Düzeni', value: 'sleep' },
        { label: 'Motor Gelişim / Hareket', value: 'motor' },
        { label: 'Sadece Keyif & Rahatlama', value: 'relax' }
      ]
    },
    {
      id: 'frequency',
      title: 'Ne sıklıkla gelmeyi düşünürsünüz?',
      icon: <Moon size={32} />,
      options: [
        { label: 'Sadece Deneme', value: 'once' },
        { label: 'Düzenli (Haftada 1)', value: 'regular' },
        { label: 'Kardeşiyle Birlikte', value: 'sibling' }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const currentQ = questions[step];
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length); // Show result
    }
  };

  const getRecommendation = () => {
    if (answers['frequency'] === 'sibling') return {
        name: 'Kardeş Paketi',
        desc: 'İki minik için çifte eğlence! Birlikte sosyalleşerek gelişim.',
        price: '₺1.350',
        match: 98
    };
    if (answers['frequency'] === 'regular' || answers['concern'] === 'colic' || answers['concern'] === 'sleep') return {
        name: 'Rahatla & Büyü Paketi (4 Seans)',
        desc: 'Düzenli hidroterapi ile kolik ve uyku sorunlarına kalıcı çözüm.',
        price: '₺2.800',
        match: 95
    };
    if (answers['concern'] === 'relax' || answers['age'] === 'toddler') return {
        name: 'VIP Spa Deneyimi',
        desc: 'Bebeğiniz için özel hazırlanmış jakuzi ve aromaterapi ortamı.',
        price: '₺1.500',
        match: 90
    };
    return {
        name: 'İlk Dokunuş Paketi',
        desc: 'Tanışma seansı için harika bir başlangıç.',
        price: '₺750',
        match: 85
    };
  };

  const recommendation = step === questions.length ? getRecommendation() : null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-fade-in-up min-h-[500px]">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-sand/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-800 transition-colors z-20">
          <X size={24} />
        </button>

        <div className="p-8 md:p-12 flex-1 flex flex-col justify-center relative z-10">
          
          {step < questions.length ? (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= step ? 'bg-brand' : 'bg-gray-100'}`}></div>
                  ))}
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-800 leading-tight">
                  {questions[step].title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="w-full text-left p-5 rounded-2xl border border-gray-100 bg-white hover:border-brand hover:bg-brand-light/30 hover:shadow-md transition-all group flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-700 group-hover:text-brand-dark text-lg">{opt.label}</span>
                    <ChevronRight className="text-gray-300 group-hover:text-brand opacity-0 group-hover:opacity-100 transition-all" size={20} />
                  </button>
                ))}
              </div>
            </>
          ) : recommendation ? (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-6 shadow-sm">
                <Sparkles size={40} />
              </div>
              <h3 className="text-sm font-bold text-brand uppercase tracking-widest mb-2">Size En Uygun Seçim</h3>
              <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">{recommendation.name}</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {recommendation.desc}
              </p>
              
              <div className="bg-brand-light/30 p-6 rounded-2xl mb-8 border border-brand/10">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-500 uppercase">Uyum Skoru</span>
                    <span className="text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle size={16} /> %{recommendation.match}
                    </span>
                 </div>
                 <div className="w-full bg-white h-3 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full animate-[shimmer_2s_infinite]" style={{ width: `${recommendation.match}%` }}></div>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                        onSelectPackage(`${recommendation.name} (${recommendation.price})`);
                        onClose();
                    }}
                    className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                  >
                    Bu Paketi Seç <ArrowRight size={20} />
                  </button>
                  <button 
                    onClick={() => setStep(0)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-medium py-2"
                  >
                    Testi Tekrarla
                  </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PackageWizard;
