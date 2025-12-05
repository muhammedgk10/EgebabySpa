
import React, { useEffect } from 'react';
import { X, Calendar, User, Tag } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ post, isOpen, onClose }) => {
  // SEO: Update page title and meta description when modal is open
  useEffect(() => {
    if (isOpen && post) {
      const originalTitle = document.title;
      const metaDescriptionTag = document.querySelector('meta[name="description"]');
      const originalDescription = metaDescriptionTag?.getAttribute('content') || '';

      if (post.metaTitle) document.title = post.metaTitle;
      if (post.metaDescription && metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', post.metaDescription);
      }

      return () => {
        document.title = originalTitle;
        if (metaDescriptionTag) {
          metaDescriptionTag.setAttribute('content', originalDescription);
        }
      };
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  // Fallback images consistent with Blog.tsx
  const fallbackImages = [
    'https://images.unsplash.com/photo-1596956614486-13a832f0599c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544126566-4744398f7f73?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584285437637-d2427a9202b3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522771753035-1a5b6562f3a9?q=80&w=800&auto=format&fit=crop'
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Use ID to deterministically pick a fallback
    const index = parseInt(post.id) || 0;
    const fallback = fallbackImages[index % fallbackImages.length];
    
    if (target.src !== fallback) {
        target.src = fallback;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up flex flex-col">
        
        {/* Close Button - Sticky but independent */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white z-50 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Image Header */}
        <div className="relative h-64 md:h-80 shrink-0 group">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover" 
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Large Title for Hero Area */}
          <div className="absolute bottom-6 left-6 md:left-8 right-6 transition-opacity duration-300 group-hover:opacity-90">
            <span className="inline-block px-3 py-1 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded-full mb-3 shadow-sm border border-white/20">
              {post.category}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight shadow-black drop-shadow-md">
              {post.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 pt-0 relative">
           
           {/* Sticky Header Bar */}
           <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md -mx-6 md:-mx-10 px-6 md:px-10 py-4 mb-8 border-b border-gray-100 shadow-sm flex flex-col gap-1 transition-all">
              <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{post.title}</h3>
              <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-brand" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><User size={14} className="text-brand" /> Admin</span>
                  <span className="hidden sm:inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="hidden sm:flex items-center gap-1.5 text-brand font-medium"><Tag size={14} /> {post.category}</span>
              </div>
           </div>

           <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {post.content ? (
                post.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))
              ) : (
                // Fallback content if no detailed content provided
                <>
                  <p className="font-semibold text-xl mb-6 text-gray-800">{post.excerpt}</p>
                  <p className="mb-4">
                    Bebeğinizin gelişimi için attığınız her adım çok değerlidir. Spa merkezimizde sunduğumuz hizmetler, sadece fiziksel bir rahatlama sağlamakla kalmaz, aynı zamanda duygusal ve zihinsel gelişimi de destekler.
                  </p>
                  <p className="mb-4">
                    Uzman terapistlerimiz eşliğinde gerçekleştirilen seanslarda, bebeğinizin suyla olan ilişkisi güçlenir. Suyun kaldırma kuvveti, henüz yürüyemeyen bebekler için eşsiz bir özgürlük alanı yaratır. Bu sayede kas grupları çalışır ve motor beceriler hızla gelişir.
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Neden Önemli?</h3>
                  <p className="mb-4">
                    Düzenli spa ve masaj uygulamaları, kolik ağrıları ve gaz sancıları gibi yaygın bebek sorunlarının çözümünde büyük rol oynar. Ayrıca, seans sonrası artan melatonin salgısı sayesinde bebeğiniz çok daha derin ve kaliteli bir uyku deneyimi yaşar.
                  </p>
                  <p>
                    Unutmayın, mutlu bir bebek, mutlu bir aile demektir. Sizi ve bebeğinizi Ege Baby Spa'nın ayrıcalıklı dünyasına bekliyoruz.
                  </p>
                </>
              )}
           </div>
           
           <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Kapat
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
