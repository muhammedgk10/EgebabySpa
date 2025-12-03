import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Selin Yılmaz",
      comment: "Bebeğimin gaz sancıları için gitmediğimiz doktor kalmamıştı. Ege Baby Spa'daki masaj seanslarından sonra oğlum ilk defa kesintisiz 4 saat uyudu. Hijyen konusunda çok hassasım, burası beklentimin çok üzerindeydi.",
      rating: 5,
      avatar: "S"
    },
    {
      id: 2,
      name: "Merve & Can",
      comment: "Çalışanların ilgisi ve bilgisi harika. Bize evde nasıl masaj yapacağımızı da öğrettiler. Floating seansında kızımın mutluluğunu görmek paha biçilemezdi. En güvenilir bebek spa merkezi.",
      rating: 5,
      avatar: "M"
    },
    {
      id: 3,
      name: "Buse Demir",
      comment: "İlk defa geldik ve çok memnun kaldık. Ortam çok ferah ve temiz. Bebeğinizle kaliteli zaman geçirmek için en iyi aktivite. Kardeş paketi ile ikizlerimi getirdim, çok eğlendiler.",
      rating: 5,
      avatar: "B"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-brand-light/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand font-bold tracking-wider text-sm uppercase">Mutlu Ebeveynler</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Güven Dolu Yorumlar</h2>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded-full mt-4 opacity-50"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
             Bebeklerinin mutluluğuna ve gelişimine tanık olan binlerce aileden sadece birkaçı.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative group">
              <div className="absolute top-6 right-8 text-brand/10 group-hover:text-brand/20 transition-colors">
                <Quote size={40} fill="currentColor" />
              </div>
              
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 italic relative z-10">
                "{item.comment}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-light rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Onaylı Ziyaretçi</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;