
import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, Loader2, Sparkles, ShieldCheck, CheckCircle2, Eye, EyeOff, Droplets } from 'lucide-react';
import { loginUser } from '../services/firebaseService';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
  notify?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, notify }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(email, password);
      onLogin(); 
    } catch (err: any) {
      const msg = (err.code === 'auth/invalid-email' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') 
        ? 'Hatalı e-posta veya şifre.' 
        : 'Giriş yapılırken bir hata oluştu.';
      
      setError(msg);
      if(notify) notify('error', 'Giriş Başarısız', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-brand selection:text-white overflow-hidden">
      
      {/* Sol Taraf - Görsel ve Marka Alanı (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-dark overflow-hidden">
        {/* Arka Plan Görseli - Yavaş Zoom Efekti ile */}
        <div className="absolute inset-0 z-0">
             {/* New Abstract Spa/Water Image */}
             <img 
                src="https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?q=80&w=1600&auto=format&fit=crop" 
                alt="Spa Luxury Interior" 
                className="w-full h-full object-cover transition-transform duration-[20s] ease-linear hover:scale-110 scale-100"
                style={{ animation: 'subtle-bounce 20s infinite alternate linear' }} 
             />
             <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/50 to-brand-dark/30 mix-blend-multiply"></div>
        </div>

        {/* İçerik */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
            <div className="flex items-center gap-3 animate-fade-in-down">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                    <Droplets size={24} className="text-white" />
                </div>
                <div>
                   <span className="block text-white font-bold tracking-widest text-sm uppercase opacity-90">Ege Baby Spa</span>
                   <span className="block text-brand-light text-[10px] tracking-wider uppercase">Yönetici Paneli</span>
                </div>
            </div>

            <div className="space-y-8 mb-12 animate-fade-in-up delay-100">
                <h1 className="text-5xl xl:text-6xl font-serif font-bold text-white leading-[1.1]">
                    Profesyonel <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-white">Dokunuşlar.</span>
                </h1>
                
                <p className="text-lg text-white/80 font-light max-w-md leading-relaxed">
                   Randevuları organize edin, hizmet kalitesini artırın ve bebeğinizin güvenliğini tek bir merkezden yönetin.
                </p>

                <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
                       <ShieldCheck size={14} className="text-brand-light" /> 256-bit SSL Güvenli
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
                       <Sparkles size={14} className="text-brand-light" /> AI Destekli
                    </div>
                </div>
            </div>
            
            <div className="text-[10px] text-white/30 uppercase tracking-widest">
                &copy; {new Date().getFullYear()} Ege Baby Spa & Wellness
            </div>
        </div>
      </div>

      {/* Sağ Taraf - Giriş Formu */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative bg-white">
        
        {/* Siteye Dön Butonu */}
        <button 
            onClick={onBack} 
            className="absolute top-8 left-8 lg:left-auto lg:right-12 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-slate-400 hover:text-brand hover:bg-brand/5 transition-all group z-20"
        >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Siteye Dön</span>
        </button>

        <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-brand to-brand-light rounded-2xl shadow-lg shadow-brand/30 text-white mb-4 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                    <Lock size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800">Hoş Geldiniz</h2>
                <p className="text-slate-500 font-medium">Hesabınıza güvenle giriş yapın</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-shake">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="font-bold text-sm">!</span>
                        </div>
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">E-posta Adresi</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={20} className="text-slate-300 group-focus-within:text-brand transition-colors" />
                            </div>
                            <input
                                type="email"
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                placeholder="isim@sirket.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="flex justify-between items-center mb-1.5 ml-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Şifre</label>
                            <a href="#" className="text-xs font-bold text-brand hover:text-brand-dark transition-colors hover:underline">Şifremi Unuttum?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={20} className="text-slate-300 group-focus-within:text-brand transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                   <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remember"
                          type="checkbox"
                          className="w-5 h-5 border-2 border-slate-300 rounded text-brand focus:ring-brand/20 focus:ring-offset-0 cursor-pointer transition-colors"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="remember" className="font-medium text-slate-600 cursor-pointer select-none">Beni hatırla</label>
                      </div>
                   </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-brand hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Doğrulanıyor...</span>
                        </>
                    ) : (
                        <>
                            <span>Giriş Yap</span>
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <CheckCircle2 size={14} className="text-white" />
                            </div>
                        </>
                    )}
                </button>
            </form>

            <div className="pt-8 text-center">
                <p className="text-xs text-slate-400 font-medium">
                    Gizlilik Politikası ve Kullanım Şartları dahildir. <br/>
                    Yetkisiz girişler kayıt altına alınmaktadır.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;