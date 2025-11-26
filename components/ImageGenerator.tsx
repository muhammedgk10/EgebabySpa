
import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Download, Loader2, Sparkles, AlertCircle, Wand2, Upload, X } from 'lucide-react';
import { generateImage, editImage } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  
  // Edit Mode State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const has = await aistudio.hasSelectedApiKey();
      setHasKey(has);
    } else {
      // Fallback for environments without aistudio
      setHasKey(true);
    }
  };

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      const has = await aistudio.hasSelectedApiKey();
      setHasKey(has);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit check
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

  const clearSourceImage = () => {
    setSourceImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAction = async () => {
    if (!prompt) return;
    if (mode === 'edit' && !sourceImage) return;
    
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      let result: string | null = null;

      if (mode === 'generate') {
        result = await generateImage(prompt, size);
      } else {
        if (!sourceImage) return;
        // Extract mime type from base64 string
        const matches = sourceImage.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
           setError("Görsel formatı desteklenmiyor.");
           setLoading(false);
           return;
        }
        const mimeType = matches[1];
        result = await editImage(sourceImage, mimeType, prompt);
      }

      if (result) {
        setImage(result);
      } else {
        setError('İşlem başarısız oldu. Lütfen tekrar deneyin.');
      }
    } catch (err: any) {
        if (err.message?.includes('Requested entity was not found')) {
            setHasKey(false);
            setError('API anahtarı hatası veya süresi dolmuş. Lütfen anahtarı tekrar seçin.');
        } else {
            setError('Bir hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
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
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Yapay Zeka Görsel Stüdyosu</h3>
        <p className="text-gray-500 text-center max-w-md mb-8 text-lg">
          Nano Banana Pro ve Flash Image modelleri ile çalışmak için API anahtarınızı seçin.
        </p>
        <button 
          onClick={handleSelectKey}
          className="px-8 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
        >
          API Anahtarı Seç
        </button>
        <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="mt-6 text-sm text-gray-400 hover:text-brand underline"
        >
            Fiyatlandırma hakkında bilgi alın
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up h-[calc(100vh-140px)]">
      {/* Controls */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        
        {/* Mode Selector */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex">
           <button 
             onClick={() => { setMode('generate'); setError(null); }}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
               mode === 'generate' 
                 ? 'bg-brand text-white shadow-md' 
                 : 'text-gray-500 hover:bg-gray-50'
             }`}
           >
             <Sparkles size={16} /> Yeni Oluştur
           </button>
           <button 
             onClick={() => { setMode('edit'); setError(null); }}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
               mode === 'edit' 
                 ? 'bg-brand text-white shadow-md' 
                 : 'text-gray-500 hover:bg-gray-50'
             }`}
           >
             <Wand2 size={16} /> Düzenle
           </button>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            {mode === 'generate' ? <Sparkles size={20} className="text-brand" /> : <Wand2 size={20} className="text-brand" />}
            {mode === 'generate' ? 'Oluşturma Ayarları' : 'Düzenleme Ayarları'}
          </h3>
          
          <div className="space-y-6 flex-1">
            
            {/* Edit Mode: Image Upload */}
            {mode === 'edit' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kaynak Görsel</label>
                
                {!sourceImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand hover:bg-brand-light/10 transition-colors h-40"
                  >
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">Görsel Yükle</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 4MB)</span>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                     <img src={sourceImage} alt="Source" className="w-full h-40 object-cover" />
                     <button 
                       onClick={clearSourceImage}
                       className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X size={16} />
                     </button>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            )}

            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {mode === 'generate' ? 'Görsel Tanımı (Prompt)' : 'Düzenleme İsteği'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'generate' 
                  ? "Örn: Bebek spa merkezinde yüzen mutlu bir bebek, su damlacıkları, soft aydınlatma, pastel tonlar..." 
                  : "Örn: Arka plana vintage filtre ekle, sağ tarafa bir oyuncak ekle, ışığı yumuşat..."}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none min-h-[120px] resize-none text-sm leading-relaxed"
              />
            </div>

            {/* Generate Mode: Size Selector */}
            {mode === 'generate' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Çözünürlük</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                        size === s 
                          ? 'bg-brand text-white border-brand shadow-md' 
                          : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2 animate-shake">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
             <button
              onClick={handleAction}
              disabled={loading || !prompt || (mode === 'edit' && !sourceImage)}
              className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={22} className="animate-spin" /> : (mode === 'generate' ? <Sparkles size={22} /> : <Wand2 size={22} />)}
              {loading ? 'İşleniyor...' : (mode === 'generate' ? 'Görsel Oluştur' : 'Görseli Düzenle')}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:col-span-2 h-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-full p-6 flex flex-col relative overflow-hidden">
           <div className="flex justify-between items-center mb-6 z-10">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <ImageIcon size={20} className="text-gray-400" />
                {image ? 'Sonuç' : 'Önizleme'}
              </h3>
              {image && (
                  <a 
                    href={image} 
                    download={`ege-baby-ai-${mode}-${Date.now()}.png`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-brand hover:text-white text-gray-700 rounded-lg text-sm font-bold transition-colors"
                  >
                      <Download size={16} /> İndir
                  </a>
              )}
           </div>
           
           <div className="flex-1 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center relative border-2 border-dashed border-slate-200 group">
              {loading ? (
                 <div className="text-center z-10">
                    <div className="w-20 h-20 border-4 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-gray-800 font-bold text-lg animate-pulse">Sihir yapılıyor...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {mode === 'generate' ? 'Nano Banana Pro görselinizi hazırlıyor' : 'Flash Image görselinizi düzenliyor'}
                    </p>
                 </div>
              ) : image ? (
                 <img src={image} alt="Generated AI" className="w-full h-full object-contain shadow-2xl" />
              ) : (
                 <div className="text-center text-gray-400 z-10">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <ImageIcon size={40} className="opacity-30" />
                    </div>
                    <p className="font-medium text-lg">
                      {mode === 'generate' ? 'Henüz bir görsel oluşturulmadı' : 'Henüz bir görsel düzenlenmedi'}
                    </p>
                    <p className="text-sm mt-1">
                      {mode === 'generate' 
                        ? "Ayarları yapın ve 'Görsel Oluştur' butonuna tıklayın"
                        : "Bir görsel yükleyin, isteğinizi yazın ve 'Görseli Düzenle'ye tıklayın"}
                    </p>
                 </div>
              )}
              
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#26A69A 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
