import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Check, 
  X, 
  Clock,
  Search,
  Bell,
  MoreVertical,
  Filter,
  TrendingUp,
  CreditCard
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock Data
  const stats = [
    { title: 'Bugünkü Randevular', value: '12', change: '+2', icon: <Calendar size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Bekleyen Onay', value: '5', change: '-1', icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Toplam Müşteri', value: '1,240', change: '+18', icon: <Users size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Aylık Gelir', value: '₺145.000', change: '+12%', icon: <CreditCard size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const appointments = [
    { id: 1, parent: 'Ayşe Yılmaz', baby: 'Can (6 Ay)', service: 'Rahatla & Büyü Paketi', date: '14 Mart 2024', time: '10:30', status: 'pending', price: '₺2.800' },
    { id: 2, parent: 'Mehmet Demir', baby: 'Elif (4 Ay)', service: 'İlk Dokunuş', date: '14 Mart 2024', time: '12:00', status: 'confirmed', price: '₺750' },
    { id: 3, parent: 'Zeynep Kaya', baby: 'Atlas (12 Ay)', service: 'VIP Spa Deneyimi', date: '14 Mart 2024', time: '14:30', status: 'confirmed', price: '₺1.500' },
    { id: 4, parent: 'Burak Şahin', baby: 'Deniz (8 Ay)', service: 'Sadece Hidroterapi', date: '15 Mart 2024', time: '09:00', status: 'cancelled', price: '₺500' },
    { id: 5, parent: 'Selin Yıldız', baby: 'Maya (3 Ay)', service: 'Kardeş Paketi', date: '15 Mart 2024', time: '16:00', status: 'pending', price: '₺1.350' },
  ];

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 mx-auto rounded-xl transition-all duration-300 group font-medium text-sm
      ${activeTab === id 
        ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg shadow-brand/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={20} className={`transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-admin text-slate-800">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] flex-shrink-0 hidden md:flex flex-col shadow-2xl z-20 relative overflow-hidden">
        {/* Abstract bg element */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="p-8 pb-4 z-10">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-brand to-brand-light rounded-lg flex items-center justify-center text-brand-dark shadow-lg shadow-brand/20">
               <TrendingUp size={18} />
            </span>
            EgePanel
          </h2>
          <p className="text-xs text-slate-500 mt-2 pl-1">Yönetim ve Takip Sistemi</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6 z-10">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Genel Bakış" />
          <NavItem id="appointments" icon={Calendar} label="Randevular" />
          <NavItem id="customers" icon={Users} label="Müşteriler" />
          <NavItem id="settings" icon={Settings} label="Ayarlar" />
        </nav>

        <div className="p-4 m-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-light to-brand flex items-center justify-center text-brand-dark font-bold border-2 border-slate-700">A</div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold text-white truncate">Admin Hesabı</p>
               <p className="text-xs text-slate-400 truncate">admin@egebabyspa.com</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-300 hover:text-white hover:bg-red-500/20 bg-red-500/10 rounded-lg transition-all text-xs font-semibold tracking-wide uppercase"
          >
            <LogOut size={14} /> Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center md:hidden sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
                  <TrendingUp size={18} />
                </span>
                <span className="font-bold text-slate-800 text-lg">EgePanel</span>
            </div>
            <button onClick={onLogout}><LogOut size={20} className="text-slate-500"/></button>
        </header>

        {/* Top Bar Desktop */}
        <header className="hidden md:flex bg-white/80 backdrop-blur-md py-4 px-8 justify-between items-center sticky top-0 z-30 border-b border-slate-200/60">
             <div>
                <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">{activeTab === 'dashboard' ? 'Genel Bakış' : activeTab}</h2>
                <p className="text-sm text-slate-500">Bugün, {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="relative group">
                   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" />
                   <input 
                      type="text" 
                      placeholder="Randevu veya müşteri ara..." 
                      className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand focus:outline-none w-72 transition-all hover:bg-white" 
                   />
                </div>
                <div className="h-8 w-[1px] bg-slate-200"></div>
                <button className="p-2.5 relative text-slate-500 hover:text-brand hover:bg-brand-light/30 rounded-full transition-colors">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
             </div>
        </header>

        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                            {stat.icon}
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                            {stat.change}
                        </span>
                    </div>
                    <div>
                      <h4 className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</h4>
                      <p className="text-slate-500 text-sm font-medium mt-1">{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Appointments Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                      <h3 className="font-bold text-slate-800 text-lg">Son Randevular</h3>
                      <p className="text-slate-500 text-sm">Gelen son randevu taleplerini yönetin</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-white hover:border-brand/50 transition-colors">
                        <Filter size={16} /> Filtrele
                     </button>
                     <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark shadow-lg shadow-brand/20 transition-all">
                        Tümünü Gör
                     </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Müşteri Detayı</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hizmet Paketi</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarih & Fiyat</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                                   {apt.parent.charAt(0)}
                               </div>
                               <div>
                                  <div className="font-bold text-slate-800 text-sm">{apt.parent}</div>
                                  <div className="text-xs text-slate-500">{apt.baby}</div>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-sm">
                                {apt.service}
                             </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                               <span className="font-semibold text-slate-700 text-sm">{apt.date} <span className="text-slate-400 font-normal">| {apt.time}</span></span>
                               <span className="text-xs font-medium text-brand">{apt.price}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
                              ${apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                apt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                'bg-rose-50 text-rose-700 border-rose-100'}`}>
                               <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'confirmed' ? 'bg-emerald-500' : apt.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                              {apt.status === 'confirmed' ? 'Onaylandı' : apt.status === 'pending' ? 'Bekliyor' : 'İptal'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                                {apt.status === 'pending' && (
                                    <>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors border border-emerald-100" title="Onayla">
                                            <Check size={16} />
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors border border-rose-100" title="Reddet">
                                            <X size={16} />
                                        </button>
                                    </>
                                )}
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination (Mock) */}
                <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center text-xs text-slate-500">
                    <span>Toplam 5 kayıt gösteriliyor</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Önceki</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">Sonraki</button>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm p-12 animate-fade-in-up">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
                 <Settings size={40} className="text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Bu modül geliştiriliyor</h3>
               <p className="max-w-md text-center text-slate-500">"{activeTab}" sayfası şu anda tasarım aşamasındadır. Daha iyi bir deneyim için çalışıyoruz.</p>
               <button onClick={() => setActiveTab('dashboard')} className="mt-8 px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium">
                  Genel Bakışa Dön
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;