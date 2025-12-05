
import React, { useState, useMemo } from 'react';
import { SectionId } from '../types';
import { ZoomIn, X, Camera, ChevronLeft, ChevronRight, Heart, Eye } from 'lucide-react';

type Category = 'all' | 'hydrotherapy' | 'massage' | 'happy';

interface GalleryImage {
  url: string;
  title: string;
  category: Category;
  size: 'small' | 'large' | 'tall' | 'wide';
}

const Gallery: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [likedIndices, setLikedIndices] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop',
      title: 'Hidroterapi Keyfi',
      category: 'hydrotherapy',
      size: 'wide' 
    },
    {
      url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop',
      title: 'Mutlu Bebekler',
      category: 'happy',
      size: 'small'
    },
    {
      url: 'https://images.unsplash.com/photo-1544126566-4744398f7f73?q=80&w=800&auto=format&fit=crop',
      title: 'Rahatlatıcı Masaj',
      category: 'massage',
      size: 'tall'
    },
    {
      url: 'https://images.unsplash.com/photo-1596956614486-13a832f0599c?q=80&w=800&auto=format&fit=crop',
      title: 'Floating Seansı',
      category: 'hydrotherapy',
      size: 'small'
    },
    {
      url: 'https://images.unsplash.com/photo-1606757366336-394998018247?q=80&w=1200&auto=format&fit=crop',
      title: 'İlk Spa Deneyimi',
      category: 'happy',
      size: 'large'
    },
    {
      url: 'https://images.unsplash.com/photo-1515488042361-25f4682ae2c5?q=80&w=800&auto=format&fit=crop',
      title: 'Oyun Zamanı',
      category: 'happy',
      size: 'small'
    },
    {
      url: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop',
      title: 'Ebeveyn Katılımı',
      category: 'happy',
      size: 'tall'
    },
    {
      url: 'https://images.unsplash.com/photo-1616327827282-e22a83279c93?q=80&w=1200&auto=format&fit=crop',
      title: 'Ozonlu Havuz',
      category: 'hydrotherapy',
      size: 'wide'
    }
  ];

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'hydrotherapy', label: 'Hidroterapi' },
    { id: 'massage', label: 'Masaj' },
    { id: 'happy', label: 'Mutlu Anlar' },
  ];

  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return images;
    return images.filter(img => img.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: Category) => {
    if (activeCategory === categoryId) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(categoryId);
      setIsTransitioning(false);
    }, 300);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
    }
  };

  const toggleLike = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setLikedIndices(prev => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
    });
  };

  return (
    <section id={SectionId.GALLERY} className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sand/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
            <span className="text-brand font-bold tracking-wider text-sm uppercase flex items-center justify-center gap-2 animate-fade-in">
               <Camera size={16} /> Fotoğraf Galerisi
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mt-2">Mutluluk Kareleri</h2>
            <div className="w-24 h-1.5 bg-brand mx-auto rounded-full mt-4 opacity-50"></div>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
               Minik misafirlerimizin spa deneyimlerinden en özel anlar.
            </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
                ? images.length 
                : images.filter(img => img.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`group px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20 scale-105'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-brand/50 hover:text-brand hover:bg-brand-light/10'
                }`}
              >
                {cat.label}
                <span className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                   activeCategory === cat.id
                     ? 'bg-white/20 text-white'
                     : 'bg-gray-100 text-gray-400 group-hover:bg-brand/10 group-hover:text-brand'
                }`}>
                   {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Masonry Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px] transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          {filteredImages.map((img, idx) => (
            <div 
              key={`${img.url}-${activeCategory}-${idx}`}
              onClick={() => setSelectedImageIndex(idx)}
              className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-brand/20 transition-all duration-500 ${
                img.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                img.size === 'wide' ? 'md:col-span-2 row-span-1' :
                img.size === 'tall' ? 'row-span-2 col-span-1' :
                'col-span-1 row-span-1'
              }`}
            >
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Dark Gradient Overlay (Hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Glassmorphism Info Card */}
              <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                 <div className="bg-white/10 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="inline-block text-brand-sand text-[10px] font-bold uppercase tracking-wider mb-1">
                                {categories.find(c => c.id === img.category)?.label}
                            </span>
                            <h3 className="text-white font-bold text-lg leading-tight">{img.title}</h3>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                            <ZoomIn size={20} />
                        </div>
                    </div>
                 </div>
              </div>

              {/* Like Button */}
              <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                 <button 
                    onClick={(e) => toggleLike(e, idx)}
                    className={`p-2.5 rounded-full transition-all duration-300 shadow-md ${
                        likedIndices.has(idx) 
                        ? 'bg-red-500 text-white shadow-red-500/30' 
                        : 'bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500'
                    }`}
                 >
                    <Heart size={18} fill={likedIndices.has(idx) ? "currentColor" : "none"} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in" onClick={() => setSelectedImageIndex(null)}>
           <button onClick={() => setSelectedImageIndex(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50">
             <X size={24} />
           </button>
           <button onClick={handlePrev} className="absolute left-4 md:left-8 p-4 bg-white/5 hover:bg-white/20 rounded-full text-white transition-all z-50 hover:scale-110">
             <ChevronLeft size={32} />
           </button>
           <button onClick={handleNext} className="absolute right-4 md:right-8 p-4 bg-white/5 hover:bg-white/20 rounded-full text-white transition-all z-50 hover:scale-110">
             <ChevronRight size={32} />
           </button>
           <div className="relative max-w-6xl max-h-[90vh] w-full p-4 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
               <img src={filteredImages[selectedImageIndex].url} alt="Full View" className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl animate-zoom-in" />
               <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{filteredImages[selectedImageIndex].title}</h3>
                  <div className="flex items-center justify-center gap-3">
                     <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                        {categories.find(c => c.id === filteredImages[selectedImageIndex].category)?.label}
                     </span>
                  </div>
               </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
