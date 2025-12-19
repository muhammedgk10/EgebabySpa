
import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Download, Loader2, Sparkles, AlertCircle, Wand2, Upload, X, Key, Grid, Check, Monitor, Smartphone, Square, RefreshCw, Palette, History, Zap } from 'lucide-react';
import { generateImage, editImage, enhancePrompt } from '../services/geminiService';

interface GeneratedImage {
    url: string;
    prompt: string;
    date: Date;
    aspect: string;
}

const ImageGenerator: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');
  const [variationCount, setVariationCount] = useState<1 | 2 | 3 | 4>(1);
  
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  
  // Style Selector
  const [selectedStyle, setSelectedStyle] = useState('none');
  
  // Edit Mode State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const styles = [
      { id: 'none', label: 'Doğal (Standart)', promptSuffix: '' },
      { id: 'cinematic', label: 'Sinematik & Dramatik', promptSuffix: ', cinematic lighting, shallow depth of field, 8k, highly detailed, photorealistic, dramatic atmosphere' },
      { id: 'studio', label: 'Stüdyo Çekimi', promptSuffix: ', professional studio lighting, clean background, high key, commercial photography' },
      { id: 'pastel', label: 'Soft Pastel (Bebek)', promptSuffix: ', soft pastel colors, dreamy atmosphere, gentle lighting, cute and cozy' },
      { id: 'watercolor', label: 'Suluboya Çizim', promptSuffix: ', watercolor painting style, artistic, gentle strokes, paper texture' },
  ];

  const checkKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const has = await aistudio.hasSelectedApiKey();
      setHasKey(has);
    } else {
      setHasKey(true);
    }
  };

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      try {
        await aistudio.openSelectKey();
        setHasKey(true);
        setError(null);
      } catch (e) {
        console.error("Key selection error:", e);
        setError("Anahtar seçimi sırasında bir hata oluştu.");
      }
    }
  };

  const handleEnhancePrompt = async () => {
      if (!prompt) return;
      setEnhancing(true);
      try {
          const enhanced = await enhancePrompt(prompt);
          setPrompt(enhanced);
      } catch (e) {
          // Silent fail
      } finally {
          setEnhancing(false);
      }
  };

  // NEW: Cinematic Enhancement Logic
  const handleCinematicEnhance = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);
    try {
        const cinematicPrompt = "Enhance this image with dramatic cinematic lighting, extremely high detail, hyper-realistic textures, 8k resolution, and a professional photography look. Make it feel more dramatic and artistic.";
        const matches = selectedImage.url.match(/^data:(.+);base64,(.+)$/);
        if (!matches) throw new Error("Görsel formatı desteklenmiyor.");
        const mimeType = matches[1];
        
        const result = await editImage(selectedImage.url, mimeType, cinematicPrompt);
        
        if (result) {
            const newImg: GeneratedImage = {
                url: result,
                prompt: `Cinematic Enhancement of: ${selectedImage.prompt}`,
                date: new Date(),
                aspect: selectedImage.aspect
            };
            setHistory(prev => [newImg, ...prev]);
            setSelectedImage(newImg);
        }
    } catch (err: any) {
        setError("Geliştirme sırasında bir hata oluştu.");
    } finally {
        setLoading(false);
    }
  };

  const handleModeChange = (newMode: 'generate' | 'edit') => {
    setMode(newMode);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("Dosya boyutu 4MB'dan küçük olmalıdır.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    if (!prompt) {
        setError('Lütfen bir açıklama (prompt) girin.');
        return;
    }
    if (mode === 'edit' && !sourceImage) {
        setError('Lütfen düzenlenecek bir görsel yükleyin.');
        return;
    }
    
    setLoading(true);
    setError(null);

    let finalPrompt = prompt;
    if (mode === 'generate' && selectedStyle !== 'none') {
        const style = styles.find(s => s.id === selectedStyle);
        if (style) finalPrompt += style.promptSuffix;
    }

    try {
      if (mode === 'generate') {
        for (let i = 0; i < variationCount; i++) {
          const result = await generateImage(finalPrompt, size, aspectRatio);
          if (result) {
              const newImg: GeneratedImage = {
                  url: result,
                  prompt: finalPrompt,
                  date: new Date(),
                  aspect: aspectRatio
              };
              setHistory(prev => [newImg, ...prev]);
              if (i === 0) setSelectedImage(newImg);
          }
        }
      } else {
        if (!sourceImage) return;
        const matches = sourceImage.match(/^data:(.+);base64,(.+)$/);
        if (!matches) throw new Error("Görsel formatı desteklenmiyor.");
        const mimeType = matches[1];
        
        const result = await editImage(sourceImage, mimeType, finalPrompt);
        
        if (result) {
            const newImg: GeneratedImage = {
                url: result,
                prompt: `Edit: ${finalPrompt}`,
                date: new Date(),
                aspect: 'original'
            };
            setHistory(prev => [newImg, ...prev]);
            setSelectedImage(newImg);
        }
      }
    } catch (err: any) {
        setError('Bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100 h-96 animate-fade-in">
        <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mb-6 text-brand animate-pulse">
          <Sparkles size={40} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Yapay Zeka Stüdyosu</h3>
        <p className="text-gray-500 text-center max-w-md mb-8 text-lg">
          Ege Baby Spa için görsel içerik üretmek üzere Google Gemini modellerini kullanın.
        </p>
        <button onClick={handleSelectKey} className="px-8 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-xl hover:shadow-2xl">
          API Anahtarı Bağla
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in-up h-[calc(100vh-140px)] min-h-[600px]">
      
      <div className="xl:col-span-4 flex flex-col gap-5 h-full overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex shrink-0">
           <button onClick={() => handleModeChange('generate')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'generate' ? 'bg-brand text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
             <Sparkles size={16} /> Oluştur
           </button>
           <button onClick={() => handleModeChange('edit')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'edit' ? 'bg-brand text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
             <Wand2 size={16} /> Düzenle
           </button>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col gap-6 relative">
          <button onClick={handleSelectKey} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-brand hover:bg-brand/10 rounded-full transition-colors"><Key size={16} /></button>

          <div>
              <div className="flex justify-between items-end mb-2">
                 <label className="text-sm font-bold text-gray-700">
                    {mode === 'generate' ? 'Ne çizelim?' : 'Nasıl değiştirelim?'}
                 </label>
                 <button 
                    onClick={handleEnhancePrompt}
                    disabled={!prompt || enhancing}
                    className="text-xs flex items-center gap-1 text-brand font-bold bg-brand/5 px-2 py-1 rounded-lg hover:bg-brand/10 disabled:opacity-50 transition-colors"
                 >
                    {enhancing ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12} />}
                    {enhancing ? 'Yazılıyor...' : 'Sihirli Prompt'}
                 </button>
              </div>
              <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === 'generate' ? "Örn: Spa havuzunda yüzen mutlu bir bebek..." : "Örn: Arka plana oyuncak ördek ekle..."}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none min-h-[110px] resize-none text-sm transition-shadow shadow-sm focus:shadow-md"
              />
          </div>

          {mode === 'edit' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Kaynak Görsel</label>
                {!sourceImage ? (
                  <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4 hover:bg-slate-100 transition-colors rounded-lg">
                    <Upload size={24} className="text-brand opacity-60" />
                    <span className="text-xs font-bold text-gray-400">Görsel Yükle</span>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden group">
                     <img src={sourceImage} alt="Source" className="w-full h-32 object-cover" />
                     <button onClick={() => setSourceImage(null)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"><X size={14} /></button>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
          )}

          {mode === 'generate' && (
            <div className="space-y-5">
                <div>
                   <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                       <Palette size={16} className="text-gray-400"/> Stil Seçimi
                   </label>
                   <div className="grid grid-cols-2 gap-2">
                       {styles.map(s => (
                           <button 
                             key={s.id}
                             onClick={() => setSelectedStyle(s.id)}
                             className={`px-3 py-2 text-xs font-bold rounded-lg border text-left transition-all ${selectedStyle === s.id ? 'bg-brand/10 border-brand text-brand-dark' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                           >
                               {s.label}
                           </button>
                       ))}
                   </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                       <Monitor size={16} className="text-gray-400"/> Boyutlar
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: '1:1', value: '1:1', icon: Square },
                            { label: '9:16', value: '9:16', icon: Smartphone },
                            { label: '16:9', value: '16:9', icon: Monitor },
                        ].map((opt) => (
                        <button key={opt.value} onClick={() => setAspectRatio(opt.value as any)}
                            className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 border transition-all ${aspectRatio === opt.value ? 'bg-brand text-white border-brand' : 'bg-white text-gray-400 border-gray-200'}`}
                        >
                            <opt.icon size={14} />
                            <span className="text-[10px] font-bold">{opt.label}</span>
                        </button>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {error && (
            <div className="mt-auto p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl border border-red-100 flex gap-2">
                <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
             <button onClick={handleAction} disabled={loading || !prompt || (mode === 'edit' && !sourceImage)} className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2">
               {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
               <span>{loading ? 'Üretiliyor...' : 'Görsel Oluştur'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="xl:col-span-8 flex flex-col gap-4 h-full">
         <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative flex flex-col overflow-hidden min-h-[400px]">
            {selectedImage ? (
                <>
                    <div className="flex justify-between items-center mb-4 z-10">
                        <div className="flex items-center gap-2">
                             <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{selectedImage.aspect}</span>
                             {/* DRAMATIC ENHANCE BUTTON */}
                             <button 
                                onClick={handleCinematicEnhance}
                                disabled={loading}
                                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-brand to-brand-dark text-white rounded-full text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50"
                             >
                                <Zap size={14} /> Sinematik Geliştir
                             </button>
                        </div>
                        <a href={selectedImage.url} download={`ege-ai-${Date.now()}.png`} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-brand rounded-lg text-sm font-bold transition-colors"><Download size={16} /> İndir</a>
                    </div>
                    <div className="flex-1 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-gray-100 relative">
                        <img src={selectedImage.url} alt="Result" className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-500" />
                    </div>
                </>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                    {loading ? (
                         <div className="text-center">
                            <Loader2 size={48} className="animate-spin text-brand mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Hayal Gücü İşleniyor...</h3>
                         </div>
                    ) : (
                        <>
                            <ImageIcon size={64} className="opacity-50 mb-4" />
                            <p className="text-lg font-medium">Önizleme alanı</p>
                        </>
                    )}
                </div>
            )}
         </div>

         <div className="h-32 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex flex-col shrink-0">
             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                 <History size={12} /> Geçmiş
             </div>
             <div className="flex-1 flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                {history.map((img, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === img ? 'border-brand' : 'border-transparent opacity-70'}`}
                    >
                        <img src={img.url} className="w-full h-full object-cover" alt="history" />
                    </button>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
