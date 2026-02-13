import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import AnimatedPage from '../shared/AnimatedPage';
import { LogOut, Menu, X, Home, ShoppingBag, BookOpen, Film, User, Trophy, CreditCard, Image, CalendarDays, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo-umi.jpg';

const menuItems = [
  { to: '/socio', icon: <Home size={18} />, label: 'Dashboard', end: true },
  { to: '/socio/shop', icon: <ShoppingBag size={18} />, label: 'Shop UMI' },
  { to: '/socio/corsi', icon: <GraduationCap size={18} />, label: 'I Miei Corsi' },
  { to: '/socio/biblioteca', icon: <BookOpen size={18} />, label: 'Biblioteca' },
  { to: '/socio/videoteca', icon: <Film size={18} />, label: 'Videoteca' },
  { to: '/socio/albo', icon: <Trophy size={18} />, label: "Albo d'Oro" },
  { to: '/socio/media', icon: <Image size={18} />, label: 'Media' },
  { to: '/socio/agenda', icon: <CalendarDays size={18} />, label: 'Agenda' },
  { to: '/socio/pagamenti', icon: <CreditCard size={18} />, label: 'Pagamenti' },
  { to: '/socio/profilo', icon: <User size={18} />, label: 'Il Mio Profilo' },
];

export default function SocioLayout() {
  const { profile, logout } = useAuth();
  const user = profile || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = `${(user.nome?.[0] || '').toUpperCase()}${(user.cognome?.[0] || '').toUpperCase()}` || '??';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-umi-primary/20 text-umi-primary-light border border-umi-primary/30'
        : 'text-umi-muted hover:bg-umi-input hover:text-umi-text border border-transparent'
    }`;

  const sidebarContent = (
    <>
      {/* SIDEBAR HEADER */}
      <div className="p-5 border-b border-umi-border flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/socio')}>
          <img src={logoImg} alt="UMI" className="w-9 h-9 rounded-full object-cover ring-1 ring-umi-gold/40" draggable={false} />
          <span className="small-caps font-bold text-umi-text tracking-widest text-sm">DAMASO FERNANDEZ</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-umi-input rounded-lg transition-colors">
          <X size={20} className="text-umi-muted" />
        </button>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* USER FOOTER */}
      <div className="p-4 border-t border-umi-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-umi-primary/30 flex items-center justify-center text-xs text-umi-primary font-bold">{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-umi-text font-semibold truncate">{user?.nome} {user?.cognome}</p>
            <p className="text-xs text-umi-dim truncate">{user?.ruolo || 'Socio'}</p>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-umi-input rounded-lg transition-colors" title="Logout">
            <LogOut size={16} className="text-umi-muted" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-umi-bg">
      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-umi-sidebar border-b border-umi-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-umi-input rounded-lg transition-colors">
          <Menu size={22} className="text-umi-muted" />
        </button>
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="UMI" className="w-8 h-8 rounded-full object-cover ring-1 ring-umi-gold/40" draggable={false} />
          <span className="small-caps font-bold text-umi-text tracking-widest text-sm">DAMASO FERNANDEZ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-umi-primary/30 flex items-center justify-center text-[10px] text-umi-primary font-bold">{initials}</div>
        </div>
      </header>

      <div className="flex">
        {/* OVERLAY - mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* SIDEBAR: desktop fixed, mobile drawer */}
        <aside className={`
          fixed top-0 left-0 h-full w-64 bg-umi-sidebar border-r border-umi-border flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-auto
        `}>
          {sidebarContent}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 overflow-y-auto min-h-screen">
          <AnimatedPage />
        </main>
      </div>
    </div>
  );
}
