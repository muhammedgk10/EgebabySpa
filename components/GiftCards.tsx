
import React from 'react';
import { Gift, Check, CreditCard } from 'lucide-react';
import { SectionId } from '../types';

const GiftCards: React.FC = () => {
  const cards = [
    { value: 500, price: 500, color: 'bg-[#98D8D8]' },
    { value: 1000, price: 900, color: 'bg-[#E8D5B5]', discount: '%10 İndirim' },
    { value: 2500, price: 2000, color: 'bg-[#E8A87C]', discount: '%20 İndirim' },
  ];

  return (
    <section id={SectionId.GIFTCARDS} className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            
            <div className="w-full md:w-1/2">
                <span className="text-brand-dark font-bold tracking-widest text-sm uppercase mb-2 block">Sevdiklerinizi Mutlu Edin</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-800 mb-6 leading-tight">
                    En Anlamlı <br />
                    <span className="text-brand">Hoşgeldin Hediyesi</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Yeni anne-baba olmuş sevdiklerinize, bebeklerinin rahatlaması ve gelişimi için harika bir spa deneyimi hediye edin. Dijital hediye kartınız anında e-posta ile iletilir.
                </p>
                <ul className="space-y-4 mb-8">
                    {[
                        '1 Yıl Geçerlilik Süresi',
                        'Tüm Hizmetlerde Kullanım',
                        'Kişiselleştirilebilir Not Ekleme',
                        'Anında Teslimat'
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                            <div className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-brand-dark">
                                <Check size={14} />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="w-full md:w-1/2 grid gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                        <div className={`absolute top-0 bottom-0 left-0 w-3 ${card.color}`}></div>
                        <div className="p-6 pl-8 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-1">₺{card.value} Kartı</h3>
                                <p className="text-gray-500 text-sm">Ege Baby Spa Bakiyesi</p>
                            </div>
                            <div className="text-right">
                                {card.discount && (
                                    <span className="block text-xs font-bold text-brand-accent mb-1">{card.discount}</span>
                                )}
                                <span className="text-xl font-bold text-gray-800 block">₺{card.price}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-100 group-hover:bg-brand-light/20 transition-colors">
                             <span className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                <Gift size={14} /> Hediye Et
                             </span>
                             <button className="text-brand-dark font-bold text-sm flex items-center gap-1">
                                Satın Al <CreditCard size={16} />
                             </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
      </div>
    </section>
  );
};

export default GiftCards;
