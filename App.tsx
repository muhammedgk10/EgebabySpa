import React, { useState } from 'react';
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

type PageView = 'home' | 'login' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
      <AdminPanel onLogout={handleLogout} />
    ) : (
      // Fallback if somehow state gets out of sync
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
        <Services />
        <Packages onOpenBooking={openBooking} />
        <Benefits />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
      <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
    </div>
  );
}

export default App;