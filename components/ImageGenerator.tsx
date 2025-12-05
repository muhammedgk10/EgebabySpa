
import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Download, Loader2, Sparkles, AlertCircle, Wand2, Upload, X, Key, Grid, Check, Monitor, Smartphone, Square, RefreshCw, Palette, History } from 'lucide-react';
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
      { id: 'cinematic', label: 'Sinematik & Dramatik', promptSuffix: ', cinematic lighting, shallow depth of field, 8k, highly detailed, photorealistic' },
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
          // Silent fail or simple toast
      } finally {
          setEnhancing(false);
      }
  };

  const handleModeChange = (newMode: 'generate' | 'edit') => {
    setMode(newMode);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
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

    // Append style suffix if in generate mode
    let finalPrompt = prompt;
    if (mode === 'generate' && selectedStyle !== 'none') {
        const style = styles.find(s => s.id === selectedStyle);
        if (style) finalPrompt += style.promptSuffix;
    }

    try {
      if (mode === 'generate') {
        // Generate images sequentially to simulate multi-gen if API limits allow, 
        // usually 1 is safer to prevent timeouts, but let's try loop.
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
        // EDIT MODE
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
        } else {
          throw new Error("Düzenleme başarısız oldu.");
        }
      }
    } catch (err: any) {
        const msg = err.message || '';
        if (msg.includes('Requested entity was not found') || msg.includes('403') || msg.includes('401')) {
            setHasKey(false);
            setError('API anahtarı geçersiz veya süresi dolmuş. Lütfen tekrar seçim yapın.');
        } else {
            setError('Bir hata oluştu: ' + (msg || 'Bilinmeyen hata'));
        }
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
          Ege Baby Spa için görsel içerik üretmek üzere Google Gemini modellerini kullanın. Devam etmek için API anahtarı gereklidir.
        </p>
        <button onClick={handleSelectKey} className="px-8 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg">
          API Anahtarı Bağla
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in-up h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* LEFT COLUMN: CONTROLS (4/12) */}
      <div className="xl:col-span-4 flex flex-col gap-5 h-full overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Mode Toggle */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex shrink-0">
           <button onClick={() => handleModeChange('generate')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'generate' ? 'bg-brand text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
             <Sparkles size={16} /> Oluştur
           </button>
           <button onClick={() => handleModeChange('edit')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'edit' ? 'bg-brand text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
             <Wand2 size={16} /> Düzenle
           </button>
        </div>

        {/* Main Control Panel */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col gap-6 relative">
          <button onClick={handleSelectKey} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-brand hover:bg-brand/10 rounded-full transition-colors" title="API Anahtarını Değiştir"><Key size={16} /></button>

          {/* Prompt Input */}
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
              <div className="relative group">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={mode === 'generate' ? "Örn: Spa havuzunda yüzen mutlu bir bebek..." : "Örn: Arka plana oyuncak ördek ekle..."}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none min-h-[110px] resize-none text-sm transition-shadow shadow-sm focus:shadow-md"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium bg-white/80 px-1 rounded pointer-events-none">
                    {prompt.length} / 1000
                </div>
              </div>
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
                {/* Styles */}
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

                {/* Aspect Ratio */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                       <Monitor size={16} className="text-gray-400"/> Boyutlar
                    </label>
                    <div className="grid grid-cols-5 gap-2">
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
                        
                        <div className="col-span-2 flex items-center bg-gray-50 rounded-lg border border-gray-200 px-1">
                             <span className="text-[10px] text-gray-400 px-2 font-bold">Kalite:</span>
                             <select value={size} onChange={(e) => setSize(e.target.value as any)} className="bg-transparent text-xs font-bold text-gray-700 outline-none w-full cursor-pointer">
                                 <option value="1K">1K (Hızlı)</option>
                                 <option value="2K">2K (Net)</option>
                                 <option value="4K">4K (Ultra)</option>
                             </select>
                        </div>
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
             <button onClick={handleAction} disabled={loading || !prompt || (mode === 'edit' && !sourceImage)} className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 relative overflow-hidden group">
               <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
               {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
               <span className="relative z-10">{loading ? 'Üretiliyor...' : 'Oluştur'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: PREVIEW & HISTORY (8/12) */}
      <div className="xl:col-span-8 flex flex-col gap-4 h-full">
         
         {/* Main Canvas */}
         <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative flex flex-col overflow-hidden min-h-[400px]">
            {selectedImage ? (
                <>
                    <div className="flex justify-between items-center mb-4 z-10">
                        <div className="flex items-center gap-3">
                             <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{selectedImage.aspect}</span>
                             <span className="text-gray-400 text-xs flex items-center gap-1"><History size={12}/> {selectedImage.date.toLocaleTimeString()}</span>
                        </div>
                        <a href={selectedImage.url} download={`ege-ai-${Date.now()}.png`} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-brand rounded-lg text-sm font-bold transition-colors shadow-lg"><Download size={16} /> İndir</a>
                    </div>
                    <div className="flex-1 rounded-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-100 flex items-center justify-center border border-gray-100 relative group">
                        <img src={selectedImage.url} alt="Result" className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-500" />
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500 font-medium truncate">
                        <span className="font-bold text-gray-700 mr-2">Prompt:</span> {selectedImage.prompt}
                    </div>
                </>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                    {loading ? (
                         <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                                <Sparkles className="absolute inset-0 m-auto text-brand animate-pulse" size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Sihir Yapılıyor...</h3>
                            <p className="text-gray-500 text-sm">Gemini hayal gücünüzü gerçeğe dönüştürüyor.</p>
                         </div>
                    ) : (
                        <>
                            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-float">
                                <ImageIcon size={64} className="opacity-50" />
                            </div>
                            <p className="text-lg font-medium">Önizleme alanı</p>
                            <p className="text-sm">Oluşturulan görseller burada görünecek.</p>
                        </>
                    )}
                </div>
            )}
         </div>

         {/* History Strip */}
         <div className="h-32 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex flex-col shrink-0">
             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                 <History size={12} /> Oturum Geçmişi
             </div>
             <div className="flex-1 flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                {history.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-xs text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                        Henüz görsel yok
                    </div>
                )}
                {history.map((img, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all group ${selectedImage === img ? 'border-brand ring-2 ring-brand/20' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-200'}`}
                    >
                        <img src={img.url} className="w-full h-full object-cover" alt="history" />
                        {selectedImage === img && <div className="absolute inset-0 bg-brand/10 flex items-center justify-center"><Check size={20} className="text-white drop-shadow-md" /></div>}
                    </button>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
