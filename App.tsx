
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Packages from './components/Packages';
import Benefits from './components/Benefits';
import Blog from './components/Blog';
import ChatWidget from './components/ChatWidget';
import Contact from './components/Contact';
import BookingModal from './components/BookingModal';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import ToastContainer, { ToastMessage } from './components/Toast';
import PackageWizard from './components/PackageWizard'; // New
import GiftCards from './components/GiftCards'; // New
import Gallery from './components/Gallery'; // New Gallery Component
import { Appointment } from './types';
import { 
  subscribeToAppointments, 
  addAppointmentToFirebase, 
  updateAppointmentStatusInFirebase, 
  deleteAppointmentFromFirebase,
  subscribeToAuth,
  logoutUser
} from './services/firebaseService';

type PageView = 'home' | 'login' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false); // New
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [preSelectedService, setPreSelectedService] = useState(''); // New State for Wizard flow
  
  // Use ref to track currentView inside callbacks without triggering re-renders
  const currentViewRef = useRef<PageView>(currentView);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync ref
  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  useEffect(() => {
    const checkAdminRoute = () => {
      const isHashRoute = window.location.hash === '#akkayasoft' || window.location.hash === '#/akkayasoft';
      const isPathRoute = window.location.pathname === '/akkayasoft';
      if (isHashRoute || isPathRoute) setCurrentView('login');
    };
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        const isHashRoute = window.location.hash === '#akkayasoft' || window.location.hash === '#/akkayasoft';
        const isPathRoute = window.location.pathname === '/akkayasoft';
        
        // Use ref to check current state to avoid dependency loop
        const view = currentViewRef.current;
        const shouldRedirect = (view === 'login' || isHashRoute || isPathRoute) && view !== 'admin';
        
        if (shouldRedirect) {
            setCurrentView('admin');
            addToast('success', 'Hoş Geldiniz', `Tekrar merhaba, ${user.displayName || 'Yönetici'}`);
        }
      }
    });
    return () => unsubscribe();
  }, []); // Removed currentView from dependency array to prevent infinite loop

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((data) => {
      setAppointments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openBooking = (serviceName?: string) => {
      if(serviceName) setPreSelectedService(serviceName);
      setIsBookingOpen(true);
  };
  
  const closeBooking = () => {
      setIsBookingOpen(false);
      setPreSelectedService(''); // Reset after close
  };
  
  const openWizard = () => setIsWizardOpen(true);
  const closeWizard = () => setIsWizardOpen(false);

  const handleLoginSuccess = () => setCurrentView('admin');

  const handleLogout = async () => {
    await logoutUser();
    setCurrentView('home');
    if (window.location.hash === '#akkayasoft') window.history.replaceState({}, '', window.location.pathname);
    if (window.location.pathname === '/akkayasoft') window.history.replaceState({}, '', '/');
    window.scrollTo(0, 0);
    addToast('info', 'Oturum Kapandı', 'Başarıyla çıkış yaptınız.');
  };

  const navigateToHome = () => {
    setCurrentView('home');
    if (window.location.hash === '#akkayasoft') window.history.replaceState({}, '', window.location.pathname);
    window.scrollTo(0, 0);
  };

  const handleNewAppointment = async (newApp: Omit<Appointment, 'id' | 'status'>) => {
    try {
      await addAppointmentToFirebase(newApp);
      addToast('success', 'Randevu Oluşturuldu', 'Talebiniz başarıyla alındı. Sizinle iletişime geçeceğiz.');
    } catch (error) {
      addToast('error', 'Hata', 'Randevu oluşturulurken bir hata oluştu.');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateAppointmentStatusInFirebase(id, status);
      addToast('success', 'Durum Güncellendi', `Randevu durumu: ${status === 'confirmed' ? 'Onaylandı' : 'İptal Edildi'}`);
    } catch (error) {
      addToast('error', 'Hata', 'Durum güncellenemedi.');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Bu randevuyu kalıcı olarak silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAppointmentFromFirebase(id);
        addToast('info', 'Silindi', 'Randevu kaydı silindi.');
      } catch (error) {
        addToast('error', 'Hata', 'Silme işlemi başarısız.');
      }
    }
  };

  // Pre-select service from Wizard
  const handleWizardSelect = (pkgName: string) => {
     openBooking(pkgName);
     addToast('info', 'Paket Seçildi', `${pkgName} için randevu oluşturabilirsiniz.`);
  };

  if (currentView === 'login') {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <Login onLogin={handleLoginSuccess} onBack={navigateToHome} notify={addToast} />
      </>
    );
  }

  if (currentView === 'admin') {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        {isAuthenticated ? (
          <AdminPanel 
            onLogout={handleLogout} 
            appointments={appointments}
            onUpdateStatus={handleUpdateStatus}
            onDeleteAppointment={handleDeleteAppointment}
            notify={addToast}
          />
        ) : (
          <Login onLogin={handleLoginSuccess} onBack={navigateToHome} notify={addToast} />
        )}
      </>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans selection:bg-brand selection:text-white flex flex-col">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar onOpenBooking={() => openBooking()} />
      <main className="flex-grow">
        <Hero onOpenBooking={() => openBooking()} onOpenWizard={openWizard} />
        <Services onOpenBooking={() => openBooking()} />
        <Packages onOpenBooking={() => openBooking()} />
        <Gallery />
        <Benefits />
        <GiftCards /> 
        <Testimonials />
        <Blog />
        <Contact notify={addToast} />
      </main>
      <Footer />
      <ChatWidget notify={addToast} onOpenBooking={openBooking} />
      <BookingModal isOpen={isBookingOpen} onClose={closeBooking} onSubmit={handleNewAppointment} initialService={preSelectedService} />
      <PackageWizard isOpen={isWizardOpen} onClose={closeWizard} onSelectPackage={handleWizardSelect} /> 
    </div>
  );
}

export default App;
