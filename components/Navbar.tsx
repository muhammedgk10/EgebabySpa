
import React, { useState, useEffect } from 'react';
import { Menu, X, Droplets, Calendar, Lock } from 'lucide-react';
import { SectionId } from '../types';

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminClick = () => {
    setIsOpen(false);
    window.location.hash = 'akkayasoft';
  };

  const navLinks = [
    { id: SectionId.HOME, label: 'Ana Sayfa' },
    { id: SectionId.ABOUT, label: 'Hakkımızda' },
    { id: SectionId.SERVICES, label: 'Hizmetler' },
    { id: SectionId.PACKAGES, label: 'Paketler' },
    { id: SectionId.GALLERY, label: 'Galeri' },
    { id: SectionId.BENEFITS, label: 'Faydaları' },
    { id: SectionId.FAQ, label: 'SSS' },
    { id: SectionId.BLOG, label: 'Blog' },
    { id: SectionId.CONTACT, label: 'İletişim' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      
      <div className="container mx-auto px-4 flex justify-between items-center relative">
        {/* Logo */}
        <div onClick={() => scrollToSection(SectionId.HOME)} className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center text-brand shadow-sm">
            <Droplets size={24} />
          </div>
          <span className={`font-bold text-2xl tracking-tight ${isScrolled ? 'text-brand-dark' : 'text-gray-800'}`}>
            Ege<span className="text-brand">BabySpa</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`font-medium text-sm tracking-wide transition-colors ${
                isScrolled ? 'text-gray-600 hover:text-brand' : 'text-gray-700 hover:text-brand'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <button 
                onClick={handleAdminClick}
                className="p-2 text-gray-400 hover:text-brand hover:bg-brand-light/20 rounded-full transition-all"
                title="Yönetici Girişi"
            >
                <Lock size={18} />
            </button>
            <button 
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-dark transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                <Calendar size={16} />
                Randevu Al
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 p-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t border-gray-100 py-6 flex flex-col items-center space-y-4 animate-fade-in-down h-screen overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="font-medium text-lg w-full text-center py-3 text-gray-700 hover:bg-brand-light hover:text-brand transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => { setIsOpen(false); onOpenBooking(); }}
            className="mt-4 px-8 py-3 bg-brand text-white font-bold rounded-full shadow-md w-[80%]"
          >
            Randevu Al
          </button>
          
          <button 
            onClick={handleAdminClick}
            className="mt-8 text-gray-400 hover:text-brand flex items-center gap-2 text-sm font-medium"
          >
            <Lock size={16} /> Yönetici Girişi
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
