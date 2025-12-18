
import React, { useState } from 'react';
import { SectionId } from '../types';
import { ChevronDown, HelpCircle, ShieldCheck, Droplets, Clock, AlertCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Bebeğim kaç aylıkken spa hizmeti alabilir?",
      answer: "Bebeğinizin göbek bağı düştükten sonra (yaklaşık 14-20 gün) spa hizmetimizden faydalanmaya başlayabilir. 0-36 ay arası tüm bebekler için uygundur.",
      icon: <Clock size={20} className="text-brand" />
    },
    {
      question: "Havuz temizliği ve hijyen nasıl sağlanıyor?",
      answer: "En hassas olduğumuz konu hijyendir. Her bebekten sonra jakuzilerimiz boşaltılır, özel ozon sistemleriyle dezenfekte edilir ve yeniden doldurulur. Kimyasal madde (klor vb.) kesinlikle kullanılmaz.",
      icon: <ShieldCheck size={20} className="text-brand" />
    },
    {
      question: "Yanımızda ne getirmeliyiz?",
      answer: "Sadece bebeğinizin yedek kıyafetlerini, bezini ve mamasını getirmeniz yeterlidir. Havlu, su geçirmez mayo bez ve masaj yağları merkezimiz tarafından temin edilmektedir.",
      icon: <Droplets size={20} className="text-brand" />
    },
    {
      question: "Aşıdan hemen sonra spa yapılabilir mi?",
      answer: "Aşı sonrası bebeğinizin huzursuzluğu ve ateş ihtimaline karşı 48-72 saat (2-3 gün) beklemenizi öneriyoruz.",
      icon: <AlertCircle size={20} className="text-brand" />
    },
    {
      question: "Kolik ve gaz sancısına faydası var mı?",
      answer: "Evet, kesinlikle. Hidroterapi suyunun sıcaklığı ve basıncı bağırsak hareketlerini hızlandırır. Ardından yapılan masaj ile gaz çıkışı kolaylaşır ve bebekler derin bir rahatlama yaşar.",
      icon: <HelpCircle size={20} className="text-brand" />
    }
  ];

  return (
    <section id={SectionId.FAQ} className="py-20 bg-brand-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
           <span className="text-brand font-bold tracking-wider text-sm uppercase">Merak Edilenler</span>
           <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2">Sıkça Sorulan Sorular</h2>
           <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Ebeveynlerin aklına takılan en önemli soruları ve uzman cevaplarını sizin için derledik.
           </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index ? 'border-brand shadow-lg shadow-brand/10' : 'border-gray-100 hover:border-brand/30'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-brand text-white' : 'bg-brand-light/30 text-brand'}`}>
                      {faq.icon}
                   </div>
                   <span className={`font-bold text-lg leading-tight ${openIndex === index ? 'text-brand-dark' : 'text-gray-700'}`}>{faq.question}</span>
                </div>
                <ChevronDown size={20} className={`shrink-0 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-brand' : ''}`} />
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 pl-[4.5rem] text-gray-600 leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
