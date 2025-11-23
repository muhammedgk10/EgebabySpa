import React, { useState } from 'react';
import { Lock, User, Info, Droplets } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (email === 'admin@egebabyspa.com' && password === 'admin123') {
      onLogin();
    } else {
      setError('Hatalı e-posta veya şifre.');
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
          {/* Demo Credentials Hint */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">Demo Giriş Bilgileri:</p>
              <p>E-posta: <span className="font-mono select-all">admin@egebabyspa.com</span></p>
              <p>Şifre: <span className="font-mono select-all">admin123</span></p>
            </div>
          </div>

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
            className="w-full bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Giriş Yap
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