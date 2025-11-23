import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Bell
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock Data
  const stats = [
    { title: 'Bugünkü Randevular', value: '12', icon: <Calendar size={24} />, color: 'bg-blue-500' },
    { title: 'Bekleyen Onay', value: '5', icon: <Clock size={24} />, color: 'bg-orange-500' },
    { title: 'Toplam Müşteri', value: '1,240', icon: <Users size={24} />, color: 'bg-green-500' },
    { title: 'Aylık Gelir', value: '₺145.000', icon: <CheckCircle size={24} />, color: 'bg-brand' },
  ];

  const appointments = [
    { id: 1, parent: 'Ayşe Yılmaz', baby: 'Can (6 Ay)', service: 'Rahatla & Büyü Paketi', date: '14 Mart 2024', time: '10:30', status: 'pending' },
    { id: 2, parent: 'Mehmet Demir', baby: 'Elif (4 Ay)', service: 'İlk Dokunuş', date: '14 Mart 2024', time: '12:00', status: 'confirmed' },
    { id: 3, parent: 'Zeynep Kaya', baby: 'Atlas (12 Ay)', service: 'VIP Spa Deneyimi', date: '14 Mart 2024', time: '14:30', status: 'confirmed' },
    { id: 4, parent: 'Burak Şahin', baby: 'Deniz (8 Ay)', service: 'Sadece Hidroterapi', date: '15 Mart 2024', time: '09:00', status: 'cancelled' },
    { id: 5, parent: 'Selin Yıldız', baby: 'Maya (3 Ay)', service: 'Kardeş Paketi', date: '15 Mart 2024', time: '16:00', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white flex-shrink-0 hidden md:flex flex-col shadow-xl z-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">Ege Baby<span className="text-brand-light">Panel</span></h2>
          <p className="text-xs text-brand-light/60 mt-1">Yönetici Paneli v1.0</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-medium shadow-inner' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Genel Bakış
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'appointments' ? 'bg-white/10 text-white font-medium shadow-inner' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
          >
            <Calendar size={20} /> Randevular
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'customers' ? 'bg-white/10 text-white font-medium shadow-inner' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={20} /> Müşteriler
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'settings' ? 'bg-white/10 text-white font-medium shadow-inner' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
          >
            <Settings size={20} /> Ayarlar
          </button>
        </nav>
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-dark font-bold">A</div>
            <div>
               <p className="text-sm font-medium text-white">Admin</p>
               <p className="text-xs text-brand-light/60">Yönetici</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden sticky top-0 z-20">
            <span className="font-bold text-gray-800 text-lg">Ege Baby Panel</span>
            <button onClick={onLogout}><LogOut size={20} className="text-gray-600"/></button>
        </header>

        {/* Top Bar Desktop */}
        <header className="hidden md:flex bg-white py-4 px-8 justify-between items-center sticky top-0 z-20 border-b border-gray-100">
             <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab === 'dashboard' ? 'Genel Bakış' : activeTab}</h2>
             <div className="flex items-center gap-4">
                <div className="relative">
                   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input type="text" placeholder="Ara..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-brand focus:outline-none w-64 transition-all" />
                </div>
                <button className="p-2 relative text-gray-500 hover:text-brand transition-colors">
                   <Bell size={20} />
                   <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
             </div>
        </header>

        <div className="p-6 md:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                      <h4 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Appointments Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Clock size={18} className="text-brand"/> Son Randevu Talepleri</h3>
                  <button className="text-brand font-bold text-sm hover:underline hover:text-brand-dark transition-colors">Tümünü Gör</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-gray-500 font-semibold text-xs uppercase tracking-wider">Müşteri</th>
                        <th className="px-6 py-4 text-gray-500 font-semibold text-xs uppercase tracking-wider">Hizmet</th>
                        <th className="px-6 py-4 text-gray-500 font-semibold text-xs uppercase tracking-wider">Tarih & Saat</th>
                        <th className="px-6 py-4 text-gray-500 font-semibold text-xs uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-4 text-gray-500 font-semibold text-xs uppercase tracking-wider">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">{apt.parent.charAt(0)}</div>
                               <div>
                                  <div className="font-bold text-gray-800">{apt.parent}</div>
                                  <div className="text-xs text-gray-500">{apt.baby}</div>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{apt.service}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            <div className="flex flex-col">
                               <span className="font-medium text-gray-700">{apt.date}</span>
                               <span className="text-xs text-gray-400">{apt.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                              ${apt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 
                                apt.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                'bg-red-50 text-red-600 border-red-100'}`}>
                               <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'confirmed' ? 'bg-green-500' : apt.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                              {apt.status === 'confirmed' ? 'Onaylandı' : apt.status === 'pending' ? 'Bekliyor' : 'İptal'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors" title="Onayla">
                                <CheckCircle size={18} />
                              </button>
                              <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors" title="Reddet">
                                <XCircle size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm p-12">
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                 <Settings size={40} className="text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">Bu modül hazırlanıyor</h3>
               <p className="max-w-md text-center">"{activeTab}" sayfası şu anda geliştirme aşamasındadır. Yakında hizmete girecektir.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;