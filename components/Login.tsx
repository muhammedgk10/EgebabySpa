
import React, { useState } from 'react';
import { Lock, User, Droplets, Loader2 } from 'lucide-react';
import { loginUser } from '../services/firebaseService';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
  notify?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, notify }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(email, password);
      onLogin(); 
      // Toast notification is handled in App.tsx via auth listener
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-brand p-8 text-center relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brand shadow-lg">
              <Droplets size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Yönetici Girişi</h2>
          <p className="text-brand-light mt-2 opacity-90">Ege Baby Spa Yönetim Paneli</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 flex items-center justify-center animate-shake">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">E-posta</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                placeholder="admin@egebabyspa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Şifre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Giriş Yap'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-center block text-gray-500 text-sm hover:text-brand font-medium transition-colors pt-2"
          >
            &larr; Ana Sayfaya Dön
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
