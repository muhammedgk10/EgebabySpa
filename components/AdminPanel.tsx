
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut, 
  Check, 
  Clock,
  Search,
  Bell,
  Trash2,
  TrendingUp,
  CreditCard,
  Image as ImageIcon,
  Database,
  Package,
  AlertTriangle,
  Briefcase,
  Droplets,
  ArrowUp,
  ArrowDown,
  Baby,
  Star,
  Plus,
  Minus,
  BoxSelect,
  Zap,
  UserPlus,
  Waves,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3
} from 'lucide-react';
import ImageGenerator from './ImageGenerator';
import { Appointment, ContactMessage, InventoryItem, StaffMember } from '../types';
import { isFirebaseReady } from '../firebaseConfig';
import { 
  subscribeToContacts, 
  updateAdminProfile, 
  subscribeToAuth 
} from '../services/firebaseService';

interface AdminPanelProps {
  onLogout: () => void;
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: 'confirmed' | 'cancelled') => void;
  onDeleteAppointment: (id: string) => void;
  notify: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

// --- CUSTOM SVG CHARTS (PREMIUM STYLE) ---

const AreaChart = ({ data, color = "#2A9D8F" }: { data: number[], color?: string }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  if (!data || data.length < 2) {
    return <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-medium">Yetersiz Veri</div>;
  }

  const max = Math.max(...data, 1);
  const height = 100;
  const width = 300;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val / max) * height * 0.8) - 10;
    return `${x},${y}`;
  });

  const pathD = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point}`;
    const [x, y] = point.split(',').map(parseFloat);
    const [prevX, prevY] = a[i - 1].split(',').map(parseFloat);
    const cp1x = prevX + (x - prevX) / 2;
    const cp1y = prevY;
    const cp2x = prevX + (x - prevX) / 2;
    const cp2y = y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
  }, '');

  const fillPath = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="relative w-full h-full group" onMouseLeave={() => setHoverIndex(null)}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
            <linearGradient id={`gradient-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <path d={fillPath} fill={`url(#gradient-${color.replace('#','')})`} stroke="none" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" filter="url(#glow)" />
        
        {data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val / max) * height * 0.8) - 10;
            return (
            <g key={i} onMouseEnter={() => setHoverIndex(i)}>
                <rect x={x - 10} y={0} width={20} height={height} fill="transparent" className="cursor-pointer" />
                <circle 
                    cx={x} 
                    cy={y} 
                    r={hoverIndex === i ? "6" : "0"} 
                    fill="white" 
                    stroke={color} 
                    strokeWidth="3" 
                    className="transition-all duration-300 pointer-events-none" 
                    style={{ opacity: hoverIndex === i ? 1 : 0 }}
                />
                 <line 
                    x1={x} y1={y} x2={x} y2={height} 
                    stroke={color} 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                    className="transition-opacity duration-200 pointer-events-none"
                    style={{ opacity: hoverIndex === i ? 0.5 : 0 }}
                 />
            </g>
            );
        })}
        </svg>
        {hoverIndex !== null && data[hoverIndex] !== undefined && (
            <div 
                className="absolute bg-slate-900/90 backdrop-blur text-white text-[10px] font-bold px-3 py-2 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full z-20 transition-all flex flex-col items-center border border-white/10" 
                style={{ left: `${(hoverIndex / (data.length - 1)) * 100}%`, top: '-20px' }}
            >
                <span className="opacity-60 text-[8px] uppercase tracking-wider mb-0.5">Tahmini Ciro</span>
                <span className="text-sm font-serif">₺{data[hoverIndex].toLocaleString()}</span>
            </div>
        )}
    </div>
  );
};

const DonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  let cumulativePercent = 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (total === 0) return <div className="flex items-center justify-center h-full text-slate-400 text-xs">Veri Yok</div>;

  return (
    <div className="relative w-56 h-56 mx-auto">
      <div className="absolute inset-0 rounded-full border-4 border-slate-50 opacity-50"></div>
      
      <svg viewBox="-1.2 -1.2 2.4 2.4" className="transform -rotate-90 w-full h-full drop-shadow-xl">
        {data.map((slice, i) => {
          const startPercent = cumulativePercent;
          const slicePercent = slice.value / total;
          cumulativePercent += slicePercent;
          const endPercent = cumulativePercent;

          if (slicePercent === 1) return <circle key={i} cx="0" cy="0" r="0.85" fill="none" stroke={slice.color} strokeWidth="0.25" />;

          const [startX, startY] = getCoordinatesForPercent(startPercent);
          const [endX, endY] = getCoordinatesForPercent(endPercent);
          const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
          const pathData = [`M ${startX} ${startY}`, `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, `L 0 0`].join(' ');

          return (
            <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.04" className="transition-all duration-300 cursor-pointer ease-out"
                style={{ 
                    transform: hoveredIndex === i ? 'scale(1.08)' : 'scale(1)', 
                    transformOrigin: 'center', 
                    opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.3 : 1 
                }}
                onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} />
          );
        })}
        <circle cx="0" cy="0" r="0.65" fill="white" className="drop-shadow-inner" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
         {hoveredIndex !== null && data[hoveredIndex] ? (
            <div className="animate-fade-in text-center z-10">
                <span className="block text-3xl font-serif font-bold text-slate-800 leading-none" style={{color: data[hoveredIndex].color}}>{data[hoveredIndex].value}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-[90px] block mt-1 tracking-wider">{data[hoveredIndex].label.split(' ')[0]}</span>
            </div>
         ) : (
            <div className="text-center z-10">
                <span className="block text-4xl font-serif font-bold text-slate-800 leading-none">{total}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">TOPLAM</span>
            </div>
         )}
      </div>
    </div>
  );
};

// --- MOCK DATA ---
const initialInventory: InventoryItem[] = [
    { id: '1', name: 'Organik Bebek Yağı (Lavanta)', category: 'Kozmetik', quantity: 12, minThreshold: 5, unit: 'Şişe', status: 'ok' },
    { id: '2', name: 'Swimava Boyun Simidi', category: 'Ekipman', quantity: 4, minThreshold: 6, unit: 'Adet', status: 'low' },
    { id: '3', name: 'Bebek Bornozu (Pamuk)', category: 'Tekstil', quantity: 20, minThreshold: 10, unit: 'Adet', status: 'ok' },
    { id: '4', name: 'Su Geçirmez Mayo Bez (M)', category: 'Hijyen', quantity: 2, minThreshold: 10, unit: 'Paket', status: 'critical' },
    { id: '5', name: 'Aromaterapi Difüzör Yağı', category: 'Ambiyans', quantity: 8, minThreshold: 3, unit: 'Şişe', status: 'ok' },
];

const initialStaff: StaffMember[] = [
    { id: '1', name: 'Selin Yılmaz', role: 'Baş Terapist', status: 'busy', dailyAppointments: 5, performance: 98 },
    { id: '2', name: 'Ayşe Demir', role: 'Hidroterapi Uzmanı', status: 'active', dailyAppointments: 3, performance: 92 },
    { id: '3', name: 'Mehmet Öz', role: 'Müşteri İlişkileri', status: 'off', dailyAppointments: 0, performance: 88 },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, appointments, onUpdateStatus, onDeleteAppointment, notify }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [profileForm, setProfileForm] = useState({ displayName: '', email: '' });
  
  // UX States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appointmentViewMode, setAppointmentViewMode] = useState<'list' | 'calendar'>('list');

  // Interactive State for New Modules
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [inventorySearch, setInventorySearch] = useState('');

  useEffect(() => {
    const unsubContacts = subscribeToContacts((msgs) => setContactMessages(msgs));
    const unsubAuth = subscribeToAuth((user) => {
        setCurrentUser(user);
        if (user) {
            setProfileForm({ displayName: user.displayName || 'Yönetici', email: user.email || '' });
        }
    });
    return () => { unsubContacts(); unsubAuth(); };
  }, []);

  // --- LOGIC ---
  const pendingCount = (appointments || []).filter(a => a.status === 'pending').length;
  const criticalStockItems = inventory.filter(i => i.status === 'critical' || i.status === 'low');
  
  const calculateRevenue = (appList: Appointment[]) => {
    if (!Array.isArray(appList)) return 0;
    return appList.filter(a => a.status !== 'cancelled').reduce((acc, curr) => {
        const priceStr = (curr.price || '').replace(/[^\d]/g, ''); 
        return acc + (parseInt(priceStr) || 0);
      }, 0);
  };
  const totalRevenue = calculateRevenue(appointments);

  const serviceStats = useMemo(() => {
    const stats: Record<string, number> = {};
    if (!Array.isArray(appointments)) return [];
    appointments.forEach(app => {
        const simpleName = (app.service || '').split('(')[0].trim();
        if (simpleName) stats[simpleName] = (stats[simpleName] || 0) + 1;
    });
    const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    const top4 = sorted.slice(0, 4);
    const others = sorted.slice(4).reduce((acc, curr) => acc + curr[1], 0);
    // Ege Baby Spa Palette: Teal, Sand, Coral, Slate
    const colors = ['#2A9D8F', '#E9C46A', '#E76F51', '#264653', '#94A3B8'];
    const chartData = top4.map((item, index) => ({ label: item[0], value: item[1], color: colors[index] }));
    if (others > 0) chartData.push({ label: 'Diğer', value: others, color: colors[4] });
    return chartData;
  }, [appointments]);

  const revenueTrendData = [15000, 22000, 18500, 26000, 24000, Math.max(30000, totalRevenue)]; 

  const statsCards = [
    { title: 'Toplam Ciro', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, change: '%12.5 Artış', trend: 'up', icon: CreditCard, color: 'text-white', bg: 'bg-gradient-to-br from-brand to-brand-dark' },
    { title: 'Bugün Randevu', value: (appointments || []).filter(a => a.status === 'confirmed').length.toString(), change: '4 Yeni', trend: 'up', icon: Calendar, color: 'text-brand-dark', bg: 'bg-white' },
    { title: 'Stok Uyarısı', value: criticalStockItems.length.toString(), change: criticalStockItems.length > 0 ? 'Kritik' : 'Normal', trend: criticalStockItems.length > 0 ? 'down' : 'neutral', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Mutluluk Skoru', value: '4.9', change: '+0.1', trend: 'up', icon: Star, color: 'text-brand-gold', bg: 'bg-[#FFF9E5]' },
  ];

  const handleProfileUpdate = async (e: React.FormEvent) => { e.preventDefault(); try { await updateAdminProfile(profileForm); notify('success', 'Başarılı', 'Profil güncellendi.'); } catch (error: any) { notify('error', 'Hata', error.message); } };

  const handleStockUpdate = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
        if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            let status: InventoryItem['status'] = 'ok';
            if (newQty <= 5) status = 'critical';
            else if (newQty <= item.minThreshold) status = 'low';
            return { ...item, quantity: newQty, status };
        }
        return item;
    }));
  };

  const handleStaffStatusChange = (id: string, newStatus: StaffMember['status']) => {
      setStaff(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
        onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }} 
        className={`relative w-full flex items-center gap-3 px-5 py-3.5 mx-auto rounded-xl transition-all duration-300 group font-medium text-sm overflow-hidden ${activeTab === id ? 'text-white bg-white/10 shadow-lg shadow-black/5 ring-1 ring-white/10 backdrop-blur-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
    >
      {activeTab === id && (
        <>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-light shadow-[0_0_15px_#E0F2F1]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-light/10 to-transparent pointer-events-none"></div>
        </>
      )}
      <Icon size={18} className={`transition-transform duration-300 ${activeTab === id ? 'scale-110 text-brand-light' : 'group-hover:scale-110'}`} />
      <span className={activeTab === id ? 'font-semibold tracking-wide text-white' : ''}>{label}</span>
      {id === 'database' && contactMessages.length > 0 && <span className="ml-auto w-5 h-5 bg-brand text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-[0_0_10px_#2A9D8F]">{contactMessages.length}</span>}
      {id === 'inventory' && criticalStockItems.length > 0 && <span className="ml-auto w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_5px_#f43f5e]"></span>}
    </button>
  );

  // --- CALENDAR HELPERS ---
  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    
    // Adjust for Monday start (Turkey standard)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; 

    const days = [];
    for (let i = 0; i < startOffset; i++) {
        days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50/50 border border-slate-100/50 rounded-xl"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayApps = appointments.filter(a => a.date === dateStr);
        const isToday = day === today.getDate();

        days.push(
            <div key={day} className={`h-24 p-2 border rounded-xl flex flex-col gap-1 transition-all hover:shadow-md ${isToday ? 'bg-white border-brand ring-1 ring-brand/20' : 'bg-white border-slate-100 hover:border-brand/30'}`}>
                <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-brand text-white' : 'text-slate-500'}`}>{day}</span>
                    {dayApps.length > 0 && <span className="text-[10px] text-slate-400 font-medium">{dayApps.length} Randevu</span>}
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 mt-1">
                    {dayApps.map(app => (
                        <div key={app.id} className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium border ${
                             app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                             app.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                             'bg-slate-50 text-slate-500 border-slate-100'
                        }`} title={`${app.time} - ${app.parent}`}>
                            {app.time} {app.parent.split(' ')[0]}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-brand selection:text-white overflow-hidden relative">
      
      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#1D6D63] to-[#0f172a] flex flex-col shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 border-r border-white/5 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-full h-96 bg-white/5 blur-[80px] rounded-full z-0 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="p-8 pb-4 z-10 relative">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/20 backdrop-blur-sm">
                   <Droplets className="text-white" size={20} />
                </div>
                <div>
                   <h2 className="text-xl font-serif font-bold text-white tracking-wide leading-none">EgePanel</h2>
                   <span className="text-[9px] text-brand-light uppercase tracking-[0.2em] font-bold mt-1 block opacity-80">Yönetim v2.0</span>
                </div>
             </div>
             <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white/50 hover:text-white">
                <X size={24} />
             </button>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
             {isFirebaseReady ? 
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-100 border border-emerald-500/20 w-full backdrop-blur-sm shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_#34d399]"></div> Sistem Aktif
               </div> 
               : 
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-200 border border-amber-500/20 w-full backdrop-blur-sm shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div> Demo Modu
               </div>
             }
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2 z-10 overflow-y-auto scrollbar-hide">
          <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-light/60 flex items-center gap-2">
             <span className="w-2 h-[1px] bg-brand-light/40"></span> Ana Menü
          </div>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Genel Bakış" />
          <NavItem id="appointments" icon={Calendar} label="Randevular" />
          <NavItem id="staff" icon={Briefcase} label="Personel" />
          
          <div className="px-4 py-3 mt-4 text-[10px] font-bold uppercase tracking-widest text-brand-light/60 flex items-center gap-2">
             <span className="w-2 h-[1px] bg-brand-light/40"></span> Araçlar
          </div>
          <NavItem id="inventory" icon={Package} label="Stok Takibi" />
          <NavItem id="image-gen" icon={ImageIcon} label="AI Stüdyo" />
          <NavItem id="database" icon={Database} label="Mesajlar" />
          <NavItem id="settings" icon={Settings} label="Ayarlar" />
        </nav>

        <div className="p-4 m-4 mt-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md z-10 relative group hover:bg-white/10 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-brand-light flex items-center justify-center overflow-hidden">
                    <span className="text-brand-dark font-serif font-bold text-lg">{currentUser?.displayName?.charAt(0) || 'Y'}</span>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <p className="text-sm font-bold text-white truncate font-serif tracking-wide">{currentUser?.displayName || 'Yönetici'}</p>
                <p className="text-[10px] text-brand-light/70 truncate font-medium">{currentUser?.email || 'admin@egebabyspa.com'}</p>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-200 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all text-xs font-bold tracking-wider uppercase border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={14} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto h-screen relative flex flex-col scroll-smooth">
        {/* Decorative Background Blurs */}
        <div className="absolute inset-0 bg-[#F8FAFC] z-0">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        {/* Top Header */}
        <header className="sticky top-0 z-30 px-6 md:px-8 py-5 flex justify-between items-center bg-white/70 backdrop-blur-xl border-b border-white/50 transition-all duration-300 shadow-sm">
             <div className="flex items-center gap-4 animate-fade-in-left">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-2 text-slate-500 hover:text-brand bg-white rounded-lg shadow-sm border border-slate-200"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 capitalize flex items-center gap-3">
                    {activeTab === 'dashboard' ? 'Kontrol Paneli' : activeTab === 'image-gen' ? 'Yapay Zeka Stüdyosu' : 
                    activeTab === 'inventory' ? 'Stok & Envanter' :
                    activeTab === 'appointments' ? 'Randevu Takvimi' :
                    activeTab === 'staff' ? 'Personel Yönetimi' :
                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse shadow-[0_0_5px_#2A9D8F]"></span>
                        {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
             </div>
             
             <div className="flex items-center gap-4 animate-fade-in">
                <div className="hidden lg:flex items-center gap-2 bg-white/60 px-4 py-2.5 rounded-full border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group focus-within:ring-2 focus-within:ring-brand/20 w-64 xl:w-80">
                    <Search size={16} className="text-slate-400 group-focus-within:text-brand" />
                    <input type="text" placeholder="Genel arama yapın..." className="bg-transparent text-sm outline-none text-slate-600 placeholder:text-slate-400 w-full font-medium" />
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`w-11 h-11 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 hover:text-brand hover:scale-105 hover:shadow-lg hover:shadow-brand/10 transition-all ${showNotifications ? 'ring-2 ring-brand/20 text-brand' : ''}`}
                    >
                        <Bell size={20} />
                        {(pendingCount > 0 || criticalStockItems.length > 0) && <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up z-40">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                <h4 className="font-bold text-slate-800 text-sm">Bildirimler</h4>
                                <span className="text-[10px] text-brand font-bold bg-brand/10 px-2 py-0.5 rounded-full">Yeni</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {pendingCount > 0 && (
                                    <div onClick={() => {setActiveTab('appointments'); setShowNotifications(false);}} className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Calendar size={14}/></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{pendingCount} Bekleyen Randevu</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Onaylamak için tıklayın.</p>
                                        </div>
                                    </div>
                                )}
                                {criticalStockItems.map((item, i) => (
                                    <div key={i} onClick={() => {setActiveTab('inventory'); setShowNotifications(false);}} className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><AlertTriangle size={14}/></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Kritik Stok: {item.name}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.quantity} {item.unit} kaldı.</p>
                                        </div>
                                    </div>
                                ))}
                                {contactMessages.length > 0 && (
                                    <div onClick={() => {setActiveTab('database'); setShowNotifications(false);}} className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0"><Database size={14}/></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{contactMessages.length} Okunmamış Mesaj</p>
                                            <p className="text-xs text-slate-400 mt-0.5">İletişim formundan yeni mesajlar var.</p>
                                        </div>
                                    </div>
                                )}
                                {pendingCount === 0 && criticalStockItems.length === 0 && contactMessages.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 text-sm">Hiç yeni bildirim yok. 🎉</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
             </div>
        </header>

        <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full relative z-10 animate-fade-in-up">
          
          {/* --- DASHBOARD TAB --- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Alert Section */}
              {(criticalStockItems.length > 0 || pendingCount > 0) && (
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-rose-100 shadow-xl shadow-rose-100/50 flex flex-col md:flex-row gap-6 animate-shake relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Dikkat Gerekenler</h3>
                            <p className="text-sm text-gray-500">Sistemde aksiyon almanız gereken durumlar var.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-1 items-center">
                        {criticalStockItems.map(item => (
                            <div key={item.id} className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-100 rounded-xl text-xs font-bold text-rose-600 shadow-sm cursor-pointer hover:bg-rose-50 hover:border-rose-200 transition-colors" onClick={() => setActiveTab('inventory')}>
                                <Package size={14} /> {item.name}: Stok {item.quantity}
                            </div>
                        ))}
                        {pendingCount > 0 && (
                             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-100 rounded-xl text-xs font-bold text-amber-600 shadow-sm cursor-pointer hover:bg-amber-50 hover:border-amber-200 transition-colors" onClick={() => setActiveTab('appointments')}>
                                <Calendar size={14} /> {pendingCount} Bekleyen Randevu
                             </div>
                        )}
                    </div>
                </div>
              )}

               {/* Quick Actions Bar */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: 'Randevu Ekle', icon: Plus, action: () => setActiveTab('appointments'), color: 'text-brand' },
                    { title: 'Stok Girişi', icon: BoxSelect, action: () => setActiveTab('inventory'), color: 'text-blue-500' },
                    { title: 'İçerik Üret', icon: Zap, action: () => setActiveTab('image-gen'), color: 'text-purple-500' },
                    { title: 'Personel İşlemi', icon: UserPlus, action: () => setActiveTab('staff'), color: 'text-orange-500' },
                  ].map((btn, i) => (
                    <button key={i} onClick={btn.action} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 hover:border-brand/20 transition-all group flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className={`w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${btn.color} group-hover:bg-white group-hover:shadow-md`}>
                          <btn.icon size={22} />
                       </div>
                       <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 relative z-10">{btn.title}</span>
                    </button>
                  ))}
               </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, idx) => (
                  <div key={idx} className={`p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden relative ${stat.bg.includes('gradient') ? stat.bg : 'bg-white/80 backdrop-blur-md'}`}>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ${stat.bg.includes('gradient') ? 'bg-white/20 text-white' : 'bg-brand/5 text-brand'}`}>
                            <stat.icon size={26} />
                        </div>
                        {stat.trend !== 'neutral' && (
                            <div className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border ${stat.bg.includes('gradient') ? 'bg-white/20 text-white border-white/10' : (stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50/80 border-emerald-100' : 'text-rose-600 bg-rose-50/80 border-rose-100')}`}>
                                {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                {stat.change}
                            </div>
                        )}
                    </div>
                    <div className="relative z-10">
                        <h4 className={`text-4xl font-serif font-bold tracking-tight transition-colors ${stat.bg.includes('gradient') ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h4>
                        <p className={`text-xs font-bold tracking-widest uppercase mt-2 ${stat.bg.includes('gradient') ? 'text-white/70' : 'text-slate-400'}`}>{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                 <div className="lg:col-span-8 bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                            <h3 className="font-serif font-bold text-slate-800 text-2xl">Gelir Analizi</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Son 6 Ay</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12}/> +%15 Büyüme</span>
                            </div>
                        </div>
                        <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-brand hover:bg-brand/5 transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>
                    <div className="flex-1 min-h-[350px] w-full relative z-10">
                        <AreaChart data={revenueTrendData} color="#2A9D8F" />
                    </div>
                 </div>

                 <div className="lg:col-span-4 bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                         <h3 className="font-serif font-bold text-slate-800 text-xl relative z-10">Hizmet Dağılımı</h3>
                         <div className="p-2 bg-brand/5 rounded-full text-brand">
                            <Waves size={18} />
                         </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                        <DonutChart data={serviceStats} />
                    </div>
                    <div className="mt-8 space-y-4 relative z-10">
                        {serviceStats.slice(0, 3).map((stat, i) => (
                            <div key={i} className="flex items-center justify-between text-sm group cursor-default">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: stat.color }}></span>
                                    <span className="text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">{stat.label}</span>
                                </div>
                                <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded-md shadow-sm text-xs border border-slate-100">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* --- APPOINTMENTS TAB --- */}
          {activeTab === 'appointments' && (
             <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden animate-fade-in-up flex flex-col h-[calc(100vh-180px)]">
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
                    <div>
                        <h3 className="font-serif font-bold text-slate-800 text-2xl">Randevu Listesi</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Tüm rezervasyonları yönetin</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* View Toggle */}
                        <div className="bg-slate-100 p-1 rounded-xl flex shrink-0">
                            <button 
                                onClick={() => setAppointmentViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${appointmentViewMode === 'list' ? 'bg-white shadow-sm text-brand font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List size={18} />
                            </button>
                            <button 
                                onClick={() => setAppointmentViewMode('calendar')}
                                className={`p-2 rounded-lg transition-all ${appointmentViewMode === 'calendar' ? 'bg-white shadow-sm text-brand font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Grid3X3 size={18} />
                            </button>
                        </div>

                        <div className="relative w-full sm:w-64 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="İsim, hizmet veya tarih..." 
                                value={appointmentSearch}
                                onChange={(e) => setAppointmentSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all shadow-inner font-medium"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                  {appointmentViewMode === 'list' ? (
                      <table className="w-full border-separate border-spacing-y-2">
                        <thead className="sticky top-0 bg-[#F8FAFC] z-10 hidden md:table-header-group">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-8">Müşteri</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hizmet Detayı</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zaman</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Durum</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-8">İşlem</th>
                        </tr>
                        </thead>
                        <tbody className="flex flex-col gap-4 md:table-row-group">
                        {appointments
                            .filter(apt => {
                                const term = appointmentSearch.toLowerCase();
                                return (
                                    apt.parent.toLowerCase().includes(term) ||
                                    apt.service.toLowerCase().includes(term) ||
                                    (apt.date && apt.date.includes(term)) ||
                                    (apt.baby && apt.baby.toLowerCase().includes(term))
                                );
                            })
                            .map((apt) => (
                            <tr key={apt.id} className="group md:hover:-translate-y-0.5 transition-transform duration-200 flex flex-col md:table-row bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none p-4 md:p-0 border border-slate-100 md:border-none">
                            <td className="md:px-6 md:py-4 md:bg-white md:rounded-l-2xl md:border-y md:border-l border-slate-100 group-hover:border-brand/20 group-hover:shadow-lg group-hover:shadow-slate-100 md:pl-8 transition-all flex items-center gap-4 mb-3 md:mb-0">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-serif font-bold text-lg shadow-md shadow-brand/20 group-hover:scale-110 transition-transform">
                                    {apt.parent.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm group-hover:text-brand transition-colors">{apt.parent}</div>
                                    <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5"><Baby size={12}/> {apt.baby}</div>
                                </div>
                            </td>
                            <td className="md:px-6 md:py-4 md:bg-white md:border-y border-slate-100 group-hover:border-brand/20 group-hover:shadow-lg group-hover:shadow-slate-100 transition-all mb-2 md:mb-0 pl-[60px] md:pl-6">
                                <div className="text-sm font-bold text-slate-700">{apt.service}</div>
                                <div className="inline-block mt-1 px-2 py-0.5 bg-slate-50 rounded text-[10px] font-bold text-slate-500 border border-slate-100">{apt.price}</div>
                            </td>
                            <td className="md:px-6 md:py-4 md:bg-white md:border-y border-slate-100 group-hover:border-brand/20 group-hover:shadow-lg group-hover:shadow-slate-100 transition-all mb-2 md:mb-0 pl-[60px] md:pl-6">
                                <div className="flex items-center gap-2 text-sm text-slate-700 font-bold"><Calendar size={14} className="text-brand"/> {apt.date}</div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-semibold"><Clock size={12}/> {apt.time}</div>
                            </td>
                            <td className="md:px-6 md:py-4 md:bg-white md:border-y border-slate-100 group-hover:border-brand/20 group-hover:shadow-lg group-hover:shadow-slate-100 transition-all mb-4 md:mb-0 pl-[60px] md:pl-6">
                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border shadow-sm uppercase tracking-wide ${
                                    apt.status==='confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                    apt.status==='pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                    'bg-slate-50 text-slate-400 border-slate-100'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'confirmed' ? 'bg-emerald-500' : apt.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                    {apt.status === 'confirmed' ? 'Onaylandı' : apt.status === 'pending' ? 'Bekliyor' : 'İptal'}
                                </span>
                            </td>
                            <td className="md:px-6 md:py-4 md:text-right md:bg-white md:rounded-r-2xl md:border-y md:border-r border-slate-100 group-hover:border-brand/20 group-hover:shadow-lg group-hover:shadow-slate-100 md:pr-8 transition-all flex justify-end gap-2 border-t pt-3 md:border-t-0 md:pt-0">
                                <div className="flex justify-end gap-2 md:opacity-50 group-hover:opacity-100 transition-opacity">
                                    {apt.status === 'pending' && (
                                        <button 
                                            onClick={() => onUpdateStatus(apt.id, 'confirmed')} 
                                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-100 hover:border-emerald-500 rounded-xl transition-all shadow-sm hover:shadow-emerald-200"
                                            title="Onayla"
                                        >
                                            <Check size={16}/>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => onDeleteAppointment(apt.id)} 
                                        className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl transition-all shadow-sm hover:shadow-rose-100"
                                        title="Sil"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                  ) : (
                      // Calendar View
                      <div className="grid grid-cols-7 gap-2 md:gap-4 animate-fade-in-up">
                          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                              <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{day}</div>
                          ))}
                          {renderCalendar()}
                      </div>
                  )}
                </div>
             </div>
          )}

          {/* --- INVENTORY TAB --- */}
          {activeTab === 'inventory' && (
             <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden animate-fade-in-up">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                    <div>
                        <h3 className="font-serif font-bold text-slate-800 text-xl">Stok & Envanter</h3>
                        <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-wider">Depo Durumu</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Ürün ara..." 
                                value={inventorySearch}
                                onChange={(e) => setInventorySearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all shadow-inner font-medium"
                            />
                        </div>
                        <button className="px-4 py-2.5 bg-brand text-white rounded-xl text-xs font-bold hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand/30 flex items-center gap-2 whitespace-nowrap">
                            <Plus size={16} /> Ekle
                        </button>
                    </div>
                </div>
                <div className="p-2 overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-2 min-w-[800px]">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-8">Ürün Bilgisi</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stok Durumu</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seviye</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-8">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory
                              .filter(item => item.name.toLowerCase().includes(inventorySearch.toLowerCase()) || item.category.toLowerCase().includes(inventorySearch.toLowerCase()))
                              .map(item => {
                                const percent = Math.min(100, (item.quantity / 20) * 100);
                                const barColor = item.status === 'critical' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : item.status === 'low' ? 'bg-amber-500' : 'bg-emerald-500';
                                
                                return (
                                    <tr key={item.id} className="hover:-translate-y-0.5 transition-transform duration-200 group">
                                        <td className="px-6 py-5 bg-white rounded-l-2xl border-y border-l border-slate-100 group-hover:border-brand/20 group-hover:shadow-md pl-8">
                                            <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1 opacity-60">ID: #{item.id}</div>
                                        </td>
                                        <td className="px-6 py-5 bg-white border-y border-slate-100 group-hover:border-brand/20 group-hover:shadow-md">
                                            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-5 bg-white border-y border-slate-100 group-hover:border-brand/20 group-hover:shadow-md">
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono font-bold text-slate-800 w-8 text-right text-lg">{item.quantity}</span>
                                                <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner hidden md:block">
                                                    <div className={`h-full rounded-full ${barColor} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 bg-white border-y border-slate-100 group-hover:border-brand/20 group-hover:shadow-md">
                                            <span className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full w-fit uppercase tracking-wide border ${item.status === 'critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : item.status === 'low' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {item.status === 'critical' && <AlertTriangle size={12}/>}
                                                {item.status === 'critical' ? 'Kritik' : item.status === 'low' ? 'Azalıyor' : 'Yeterli'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 bg-white rounded-r-2xl border-y border-r border-slate-100 group-hover:border-brand/20 group-hover:shadow-md pr-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleStockUpdate(item.id, -1)}
                                                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleStockUpdate(item.id, 1)}
                                                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
             </div>
          )}

          {/* --- STAFF TAB --- */}
          {activeTab === 'staff' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                {staff.map(member => (
                    <div key={member.id} className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white relative group hover:-translate-y-2 transition-all duration-300">
                        {/* Status Toggle Menu */}
                        <div className="absolute top-8 right-8 z-20">
                            <div className="group/status relative">
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm cursor-pointer transition-all ${member.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' : member.status === 'busy' ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                                    {member.status === 'active' ? 'Müsait' : member.status === 'busy' ? 'Meşgul' : 'İzinde'}
                                </div>
                                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover/status:block animate-fade-in">
                                    <button onClick={() => handleStaffStatusChange(member.id, 'active')} className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50">Müsait</button>
                                    <button onClick={() => handleStaffStatusChange(member.id, 'busy')} className="w-full text-left px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50">Meşgul</button>
                                    <button onClick={() => handleStaffStatusChange(member.id, 'off')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">İzinde</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center text-center mb-8 mt-4">
                            <div className="w-28 h-28 rounded-full bg-slate-50 p-1.5 mb-5 shadow-inner">
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center text-4xl font-serif font-bold text-white shadow-lg shadow-brand/30">
                                    {member.name.charAt(0)}
                                </div>
                            </div>
                            <h4 className="font-serif font-bold text-2xl text-slate-800">{member.name}</h4>
                            <p className="text-xs font-bold text-brand uppercase tracking-widest mt-2 bg-brand/5 px-3 py-1 rounded-full">{member.role}</p>
                        </div>
                        
                        <div className="space-y-6 bg-white/50 rounded-2xl p-6 border border-white shadow-sm">
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Bugün</span>
                                <span className="font-bold text-slate-800 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">{member.dailyAppointments} Randevu</span>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Performans</span>
                                    <span className="font-bold text-emerald-600">{member.performance}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full shadow-[0_0_10px_#10b981]" style={{ width: `${member.performance}%` }}></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wide">Profil</button>
                            <button className="flex-1 py-3.5 rounded-2xl bg-brand text-white text-xs font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 uppercase tracking-wide hover:-translate-y-0.5">Mesaj</button>
                        </div>
                    </div>
                ))}
             </div>
          )}
          
          {/* Image Gen Tab */}
          {activeTab === 'image-gen' && <ImageGenerator />}

          {/* Database (Messages) Tab */}
          {activeTab === 'database' && (
             <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8 animate-fade-in-up h-[calc(100vh-180px)] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <div>
                        <h3 className="font-serif font-bold text-slate-800 text-xl">Gelen Mesajlar</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">İletişim Talepleri</p>
                    </div>
                    <button className="text-brand font-bold text-xs uppercase tracking-wider hover:underline flex items-center gap-1"><Check size={14}/> Tümünü Okundu İşaretle</button>
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                    {contactMessages.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Database size={32} className="opacity-30" />
                            </div>
                            <p className="font-medium">Henüz mesaj yok.</p>
                        </div>
                    ) : (
                        contactMessages.map(msg => (
                            <div key={msg.id} className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-brand group-hover:text-white transition-colors">
                                            {msg.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 block text-sm">{msg.name}</span>
                                            <span className="text-xs text-slate-400 font-medium">{msg.email}</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 h-fit uppercase tracking-wide">{msg.date}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed pl-14 text-pretty">{msg.message}</p>
                            </div>
                        ))
                    )}
                </div>
             </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
             <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white max-w-3xl mx-auto animate-fade-in-up">
                 <h3 className="text-2xl font-serif font-bold text-slate-800 mb-8 pb-6 border-b border-slate-100">Hesap Ayarları</h3>
                 <form onSubmit={handleProfileUpdate} className="space-y-8">
                     <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white text-4xl font-serif font-bold shadow-lg shadow-brand/20">
                            {profileForm.displayName.charAt(0) || 'Y'}
                        </div>
                        <div>
                            <button type="button" className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-brand hover:text-brand transition-colors shadow-sm mb-2">Fotoğrafı Değiştir</button>
                            <p className="text-xs text-slate-400">Önerilen boyut: 400x400px</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Görünür İsim</label>
                            <input 
                                type="text" 
                                value={profileForm.displayName} 
                                onChange={e=>setProfileForm({...profileForm, displayName:e.target.value})} 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all font-medium text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-posta Adresi</label>
                            <input 
                                type="email" 
                                value={profileForm.email} 
                                disabled
                                className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed font-medium opacity-70"
                            />
                        </div>
                     </div>
                     
                     <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 items-start">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                        <div>
                            <h5 className="text-sm font-bold text-amber-800 mb-1">Güvenlik Uyarısı</h5>
                            <p className="text-xs text-amber-700 leading-relaxed">E-posta adresi değişikliği veya şifre sıfırlama işlemleri için sistem yöneticisi ile iletişime geçmeniz gerekmektedir.</p>
                        </div>
                     </div>

                     <div className="pt-6 flex justify-end">
                         <button className="px-10 py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl hover:shadow-2xl hover:shadow-brand/20 hover:-translate-y-1 text-sm tracking-wide uppercase">Değişiklikleri Kaydet</button>
                     </div>
                 </form>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
