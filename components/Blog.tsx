
import React, { useState } from 'react';
import { BlogPost, SectionId } from '../types';
import { ArrowRight, Calendar, User, ChevronDown } from 'lucide-react';
import BlogModal from './BlogModal';

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Distinct fallback images to use if main images fail
  const fallbackImages = [
    'https://images.unsplash.com/photo-1596956614486-13a832f0599c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544126566-4744398f7f73?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584285437637-d2427a9202b3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522771753035-1a5b6562f3a9?q=80&w=800&auto=format&fit=crop'
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => {
    const target = e.target as HTMLImageElement;
    // Use ID to deterministically pick a fallback so it stays consistent but distinct per post
    const index = parseInt(id) || 0;
    const fallback = fallbackImages[index % fallbackImages.length];
    
    if (target.src !== fallback) {
        target.src = fallback;
    }
  };

  const initialPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Bebeklerde Hidroterapinin Mucizevi Faydaları',
      metaTitle: 'Bebeklerde Hidroterapi Faydaları | Şanlıurfa Ege Baby Spa',
      metaDescription: 'Şanlıurfa\'da bebek hidroterapisinin (floating) gaz sancısı ve kas gelişimine faydalarını keşfedin. Haliliye\'deki merkezimizde uzman destekli spa hizmeti.',
      excerpt: 'Suyun kaldırma kuvveti bebeğinizin kaslarını nasıl geliştirir? İşte bilimsel gerçekler ve uzman görüşleri.',
      date: '12 Mart 2024',
      category: 'Sağlık',
      // Water / Splash focus
      imageUrl: 'https://images.unsplash.com/photo-1574315042628-636c84323b9d?q=80&w=600&auto=format&fit=crop',
      content: `Hidroterapi, bebeklerin fiziksel ve zihinsel gelişimi için en doğal ve etkili yöntemlerden biridir. Suyun kaldırma kuvveti, yerçekiminin etkisini azaltarak bebeğinizin karada yapamadığı hareketleri özgürce yapabilmesine olanak tanır.

Bu özgürlük hissi, bebeğinizin özgüvenini artırırken aynı zamanda kas ve iskelet sistemini güçlendirir. İşte hidroterapinin kanıtlanmış başlıca faydaları:

1. Kas Gelişimi: Su direnci, bebeğinizin tüm vücut kaslarını çalıştırır. Özellikle boyun, sırt ve karın kaslarının güçlenmesi, baş kontrolü ve oturma gibi motor becerilerin daha erken kazanılmasını sağlar.

2. Akciğer Kapasitesi: Suda yapılan hareketler, göğüs kafesine uygulanan hafif basınç sayesinde solunum sistemini güçlendirir ve akciğer kapasitesini artırır.

3. Sindirim Sistemi: Suyun yarattığı hidrostatik basınç ve hareketlilik, bağırsak hareketlerini düzenleyerek gaz sancısı ve kolik problemlerinin azalmasına yardımcı olur.

4. Zihinsel Gelişim: Su içindeki yeni duyusal deneyimler, beyindeki nöron bağlantılarını artırır. Bu da öğrenme kapasitesini ve problem çözme becerilerini destekler.

Ege Baby Spa olarak, ozonla temizlenen hijyenik jakuzilerimizde, uzman terapistlerimiz eşliğinde bebeğinize en güvenli hidroterapi deneyimini sunuyoruz.`
    },
    {
      id: '2',
      title: 'Kolik Bebekler İçin Rahatlatıcı Masaj Teknikleri',
      metaTitle: 'Kolik Bebek Masajı Nasıl Yapılır? | Ege Baby Spa Şanlıurfa',
      metaDescription: 'Şanlıurfa\'da gaz sancısı çeken kolik bebekler için evde uygulanabilecek etkili masaj teknikleri. Uzman terapistlerimizden ipuçları.',
      excerpt: 'Gaz sancısı çeken bebekler için evde uygulayabileceğiniz basit ama etkili masaj hareketlerini öğrenin.',
      date: '08 Mart 2024',
      category: 'Ebeveyn Rehberi',
      // Massage/Touch focus
      imageUrl: 'https://images.unsplash.com/photo-1632053009579-22a47293a96f?q=80&w=600&auto=format&fit=crop',
      content: `Kolik, yeni doğan bebeklerde sıkça görülen ve hem bebeği hem de ebeveynleri zorlayan bir durumdur. Ancak doğru masaj teknikleriyle bebeğinizi rahatlatmak ve sancılarını hafifletmek mümkündür.

İşte evde uygulayabileceğiniz etkili masaj teknikleri:

1. I Love You (ILU) Masajı:
Bebeğinizin karnına saat yönünde, ters 'I', 'L' ve 'U' harflerini çizerek yapılan bu masaj, bağırsak hareketlerini hızlandırır ve gaz çıkışını kolaylaştırır.

2. Bisiklet Hareketi:
Bebeğinizi sırtüstü yatırın ve bacaklarını nazikçe karnına doğru itip çekerek bisiklet sürer gibi hareket ettirin. Bu hareket, sıkışan gazın serbest kalmasına yardımcı olur.

3. Parmak Yürüyüşü:
Parmak uçlarınızla bebeğinizin göbeğinin etrafında saat yönünde küçük daireler çizerek ilerleyin. Bu nazik baskı, sindirim sistemini uyarır.

Dikkat Edilmesi Gerekenler:
- Masajı beslenmeden en az 30-45 dakika sonra yapın.
- Bebeğinizin cildine uygun doğal yağlar kullanın.
- Ortamın sıcak ve sakin olmasına özen gösterin.

Merkezimizde sunduğumuz profesyonel bebek masajı seansları ile hem bu teknikleri uygulamalı olarak öğrenebilir hem de bebeğinizin derin bir rahatlama yaşamasını sağlayabilirsiniz.`
    },
    {
      id: '3',
      title: 'Bebek Spa Deneyimi: İlk Seans Öncesi Hazırlık',
      metaTitle: 'İlk Bebek Spa Deneyimi Hazırlık Rehberi | Şanlıurfa Baby Spa',
      metaDescription: 'Ege Baby Spa\'ya gelmeden önce bilmeniz gerekenler. Bebek spa çantası hazırlığı ve seans öncesi dikkat edilecekler.',
      excerpt: 'İlk defa spa merkezine gelecek ebeveynler için hazırladığımız kapsamlı rehber. Çantanızda neler olmalı?',
      date: '01 Mart 2024',
      category: 'İpuçları',
      // Prep/Clothing focus
      imageUrl: 'https://images.unsplash.com/photo-1606757366336-394998018247?q=80&w=600&auto=format&fit=crop',
      content: `Bebeğinizle ilk spa deneyiminizi yaşamaya hazırlanıyorsunuz! Bu heyecanlı günün kusursuz geçmesi için size küçük bir hazırlık listesi hazırladık.

Nelere Dikkat Etmelisiniz?

1. Zamanlama:
Randevunuzu bebeğinizin uyku ve beslenme saatlerine göre planlamaya çalışın. Bebeğinizin ne çok aç ne de çok tok olması önerilir. İdeal olan, beslenmeden yaklaşık 45 dakika sonrasıdır.

2. Çantanızda Neler Olmalı?
- Yedek bez (en az 2 adet)
- Yedek kıyafet (hem bebek hem de gerekirse sizin için)
- Bebeğinizin sevdiği bir oyuncak veya emzik
- Beslenme gereçleri (biberon, mama vb.)
- Merkezimizde havlu, mayo bez ve masaj yağları tarafımızdan temin edilmektedir.

3. Sağlık Durumu:
Aşıdan sonraki ilk 48-72 saat içinde spa önerilmemektedir. Ayrıca bebeğinizin ateşi varsa veya kendini iyi hissetmiyorsa randevunuzu ertelemeniz en doğrusu olacaktır.

Ege Baby Spa'da sizi ve bebeğinizi ağırlamaktan mutluluk duyacağız. Geldiğinizde size özel asistanımız sizi karşılayacak ve tüm süreç boyunca size rehberlik edecektir.`
    }
  ];

  const morePosts: BlogPost[] = [
    {
      id: '4',
      title: 'Bebeklerde Uyku Düzeni Nasıl Oluşturulur?',
      metaTitle: 'Bebeklerde Uyku Düzeni Eğitimi | Ege Baby Spa',
      metaDescription: 'Şanlıurfa bebek spa merkezimizde uygulanan masaj ve hidroterapinin bebek uyku düzenine olumlu etkileri.',
      excerpt: 'Kaliteli bir uyku, bebeğinizin gelişimi için beslenme kadar önemlidir. İşte uzmanlardan altın değerinde tavsiyeler.',
      date: '25 Şubat 2024',
      category: 'Ebeveyn Rehberi',
      // Sleeping baby
      imageUrl: 'https://images.unsplash.com/photo-1522771753035-1a5b6562f3a9?q=80&w=600&auto=format&fit=crop',
      content: `Bebeklerin büyüme hormonu en çok uyku sırasında salgılanır. Bu nedenle düzenli ve kaliteli uyku, fiziksel gelişim için kritiktir. Spa seanslarımız, bebeklerin enerjilerini sağlıklı bir şekilde atmalarını sağlayarak uyku kalitesini artırır.`
    },
    {
      id: '5',
      title: 'Anne Sütü ve Bebek Bağışıklığı',
      metaTitle: 'Anne Sütü ve Bağışıklık Sistemi | Bebek Gelişimi',
      metaDescription: 'Anne sütünün bebek bağışıklığı üzerindeki etkileri ve sağlıklı gelişim ipuçları.',
      excerpt: 'Anne sütünün mucizevi içeriği ve bebeğinizin bağışıklık sistemini nasıl güçlendirdiği hakkında bilmeniz gerekenler.',
      date: '20 Şubat 2024',
      category: 'Sağlık',
      // Mother and baby connection
      imageUrl: 'https://images.unsplash.com/photo-1607593259882-7aa7b12d5d71?q=80&w=600&auto=format&fit=crop',
      content: `Anne sütü, bebeğinizin ilk aşısıdır. İçerdiği antikorlar sayesinde bebeğinizi enfeksiyonlara karşı korur. Emzirme süreci aynı zamanda anne ile bebek arasındaki duygusal bağı güçlendirir.`
    },
    {
      id: '6',
      title: 'Bebeklerde Motor Gelişim Evreleri',
      metaTitle: 'Bebek Motor Gelişimi ve Spa | Ege Baby Spa',
      metaDescription: '0-12 ay bebek motor gelişim evreleri. Hidroterapinin kas gelişimine ve yürümeye etkisi.',
      excerpt: 'Baş tutmadan yürümeye kadar bebeğinizin gelişim yolculuğunda sizi neler bekliyor?',
      date: '15 Şubat 2024',
      category: 'Gelişim',
      // Playful baby
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-25f4682ae2c5?q=80&w=600&auto=format&fit=crop',
      content: `Her bebeğin gelişim hızı farklıdır ancak belirli kilometre taşları vardır. 3. ayda baş kontrolü, 6. ayda desteksiz oturma gibi. Hidroterapi, bu kas gruplarını destekleyerek gelişim evrelerini daha konforlu geçirmesine yardımcı olur.`
    }
  ];

  const displayedPosts = showAllPosts ? [...initialPosts, ...morePosts] : initialPosts;

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
          <button 
            onClick={() => setShowAllPosts(!showAllPosts)}
            className="hidden md:flex items-center gap-2 text-brand font-bold hover:text-brand-dark transition-colors"
          >
            {showAllPosts ? 'Daha Az Göster' : 'Tüm Yazıları Gör'} 
            {showAllPosts ? <ChevronDown size={20} className="rotate-180" /> : <ArrowRight size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <article key={post.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300 animate-fade-in-up">
              <div className="h-56 overflow-hidden relative cursor-pointer" onClick={() => setSelectedPost(post)}>
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => handleImageError(e, post.id)}
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
                <h3 
                  className="text-xl font-bold text-gray-800 mb-3 group-hover:text-brand transition-colors line-clamp-2 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <button 
                  onClick={() => setSelectedPost(post)}
                  className="text-brand font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform self-start"
                >
                  Devamını Oku <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
        
        <div className="md:hidden mt-8 text-center">
             <button 
                onClick={() => setShowAllPosts(!showAllPosts)}
                className="inline-flex items-center gap-2 text-brand font-bold hover:text-brand-dark transition-colors"
             >
                {showAllPosts ? 'Daha Az Göster' : 'Tüm Yazıları Gör'} 
                {showAllPosts ? <ChevronDown size={20} className="rotate-180" /> : <ArrowRight size={20} />}
             </button>
        </div>
      </div>

      <BlogModal 
        post={selectedPost} 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    </section>
  );
};

export default Blog;