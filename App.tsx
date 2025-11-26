
import React, { useState, useEffect } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Authentication State
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        // If user is logged in and was trying to login, show admin
        if (currentView === 'login') setCurrentView('admin');
      }
    });
    return () => unsubscribe();
  }, [currentView]);

  // Subscribe to Appointments Data (Real-time)
  useEffect(() => {
    const unsubscribe = subscribeToAppointments((data) => {
      setAppointments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  const handleLoginSuccess = () => {
    // Auth state listener will handle the view change
    setCurrentView('admin');
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentView('home');
  };

  const navigateToLogin = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
    } else {
      setCurrentView('login');
    }
  };

  const navigateToHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  // Add new appointment (to Firebase)
  const handleNewAppointment = async (newApp: Omit<Appointment, 'id' | 'status'>) => {
    try {
      await addAppointmentToFirebase(newApp);
      // No need to set state manually, listener updates it
    } catch (error) {
      alert("Randevu oluşturulurken bir hata oluştu.");
    }
  };

  // Update appointment status (in Firebase)
  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateAppointmentStatusInFirebase(id, status);
    } catch (error) {
      alert("Durum güncellenemedi.");
    }
  };

  // Delete appointment (from Firebase)
  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Bu randevuyu kalıcı olarak silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAppointmentFromFirebase(id);
      } catch (error) {
        alert("Silme işlemi başarısız.");
      }
    }
  };

  // Render Logic
  if (currentView === 'login') {
    return (
      <Login 
        onLogin={handleLoginSuccess} 
        onBack={navigateToHome} 
      />
    );
  }

  if (currentView === 'admin') {
    return isAuthenticated ? (
      <AdminPanel 
        onLogout={handleLogout} 
        appointments={appointments}
        onUpdateStatus={handleUpdateStatus}
        onDeleteAppointment={handleDeleteAppointment}
      />
    ) : (
      <Login onLogin={handleLoginSuccess} onBack={navigateToHome} />
    );
  }

  // Default: Home View
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-brand selection:text-white flex flex-col">
      <Navbar 
        onOpenBooking={openBooking} 
        onAdminClick={navigateToLogin}
      />
      <main className="flex-grow">
        <Hero onOpenBooking={openBooking} />
        <Services onOpenBooking={openBooking} />
        <Packages onOpenBooking={openBooking} />
        <Benefits />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={closeBooking} 
        onSubmit={handleNewAppointment}
      />
    </div>
  );
}

export default App;
