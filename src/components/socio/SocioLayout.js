import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { LogOut, Menu, X, Home, ShoppingBag, BookOpen, Film, User, Trophy, CreditCard, Image, CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { to: '/socio', icon: <Home size={18} />, label: 'Dashboard', end: true },
  { to: '/socio/shop', icon: <ShoppingBag size={18} />, label: 'Shop UMI' },
  { to: '/socio/biblioteca', icon: <BookOpen size={18} />, label: 'Biblioteca' },
  { to: '/socio/videoteca', icon: <Film size={18} />, label: 'Videoteca' },
  { to: '/socio/profilo', icon: <User size={18} />, label: 'Profilo' },
  { to: '/socio/corsi', icon: <BookOpen size={18} />, label: 'I Miei Corsi' },
  { to: '/socio/albo', icon: <Trophy size={18} />, label: "Albo d'Oro" },
  { to: '/socio/pagamenti', icon: <CreditCard size={18} />, label: 'Pagamenti' },
  { to: '/socio/media', icon: <Image size={18} />, label: 'Media' },
  { to: '/socio/agenda', icon: <CalendarDays size={18} />, label: 'Agenda' },
];

export default function SocioLayout() {
  const { profile, logout } = useAuth();
  const user = profile || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user ? `${(user.nome?.[0] || '').toUpperCase()}${(user.cognome?.[0] || '').toUpperCase()}` : '??';

  return (
    <div className="min-h-screen bg-umi-bg">
      {/* HEADER */}
      <header className="bg-umi-card border-b border-umi-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-umi-input rounded-lg transition-colors sm:hidden">
            {menuOpen ? <X size={20} className="text-umi-muted" /> : <Menu size={20} className="text-umi-muted" />}
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/socio')}>
            <span className="text-umi-primary font-bold text-lg">DF</span>
            <span className="small-caps font-bold text-umi-text tracking-widest text-sm hidden xs:inline">DAMASO FERNANDEZ</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-umi-primary/30 flex items-center justify-center text-xs text-umi-primary font-bold">
              {initials}
            </div>
            <span className="text-sm text-umi-text hidden sm:inline">{user?.nome} {user?.cognome}</span>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-umi-input rounded-lg transition-colors" title="Logout">
            <LogOut size={16} className="text-umi-muted" />
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 sm:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* MOBILE SLIDE-DOWN MENU */}
      <div className={`
        sm:hidden fixed left-0 right-0 bg-umi-card border-b border-umi-border z-30 overflow-hidden
        transition-all duration-300 ease-in-out
        ${menuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}
      `} style={{ top: '57px' }}>
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(80vh-20px)]">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-umi-primary/20 text-umi-primary-light border border-umi-primary/30'
                    : 'text-umi-muted hover:bg-umi-input hover:text-umi-text border border-transparent'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="border-t border-umi-border mt-2 pt-2">
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors">
              <LogOut size={18} />
              <span>Esci</span>
            </button>
          </div>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
