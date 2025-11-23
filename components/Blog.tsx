import React from 'react';
import { BlogPost, SectionId } from '../types';
import { ArrowRight, Calendar, User } from 'lucide-react';

const Blog: React.FC = () => {
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Bebeklerde Hidroterapinin Mucizevi Faydaları',
      excerpt: 'Suyun kaldırma kuvveti bebeğinizin kaslarını nasıl geliştirir? İşte bilimsel gerçekler ve uzman görüşleri.',
      date: '12 Mart 2024',
      category: 'Sağlık',
      imageUrl: 'https://images.unsplash.com/photo-1574271143515-5cddf8da160e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '2',
      title: 'Kolik Bebekler İçin Rahatlatıcı Masaj Teknikleri',
      excerpt: 'Gaz sancısı çeken bebekler için evde uygulayabileceğiniz basit ama etkili masaj hareketlerini öğrenin.',
      date: '08 Mart 2024',
      category: 'Ebeveyn Rehberi',
      imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '3',
      title: 'Bebek Spa Deneyimi: İlk Seans Öncesi Hazırlık',
      excerpt: 'İlk defa spa merkezine gelecek ebeveynler için hazırladığımız kapsamlı rehber. Çantanızda neler olmalı?',
      date: '01 Mart 2024',
      category: 'İpuçları',
      imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section id={SectionId.BLOG} className="min-h-screen pt-20 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <span className="text-brand font-bold tracking-wider text-sm uppercase">Blog & Haberler</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Bebek Sağlığı ve Gelişimi</h2>
            <p className="text-gray-600 mt-4 text-lg">
              Uzmanlarımızın kaleminden bebeğinizin gelişimi, spa kültürü ve ebeveynlik üzerine faydalı içerikler.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-brand font-bold hover:text-brand-dark transition-colors">
            Tüm Yazıları Gör <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand uppercase tracking-wide">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> Admin</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-brand transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <button className="text-brand font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform self-start">
                  Devamını Oku <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
        
        <div className="md:hidden mt-8 text-center">
             <button className="inline-flex items-center gap-2 text-brand font-bold hover:text-brand-dark transition-colors">
                Tüm Yazıları Gör <ArrowRight size={20} />
             </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;