import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Users, UserPlus, ScrollText, LogOut, CalendarDays, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: <BarChart3 size={18} />, label: 'Dashboard', end: true },
  { to: '/admin/soci', icon: <Users size={18} />, label: 'Elenco Soci' },
  { to: '/admin/nuovo-socio', icon: <UserPlus size={18} />, label: 'Nuovo Socio' },
  { to: '/admin/agenda', icon: <CalendarDays size={18} />, label: 'Agenda' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-umi-primary/20 text-umi-primary-light border border-umi-primary/30'
        : 'text-umi-muted hover:bg-umi-input hover:text-umi-text border border-transparent'
    }`;

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-umi-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-umi-primary text-lg">✦</span>
          <span className="small-caps font-bold text-umi-text tracking-widest text-sm">DAMASO FERNANDEZ</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-umi-input rounded-lg transition-colors">
          <X size={20} className="text-umi-muted" />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 pb-2 px-3">
          <p className="text-[10px] uppercase tracking-widest text-umi-dim">Strumenti Rapidi</p>
        </div>
        <NavLink to="/admin/registri" className={linkClass}>
          <ScrollText size={18} />
          <span>Registri Antichi</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-umi-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-umi-primary flex items-center justify-center text-white font-bold text-xs">AD</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-umi-text font-semibold truncate">Admin</p>
            <p className="text-xs text-umi-dim truncate">Segreteria</p>
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
          <span className="text-umi-primary text-lg">✦</span>
          <span className="small-caps font-bold text-umi-text tracking-widest text-sm">DAMASO FERNANDEZ</span>
        </div>
        <button onClick={handleLogout} className="p-2 hover:bg-umi-input rounded-lg transition-colors">
          <LogOut size={18} className="text-umi-muted" />
        </button>
      </header>

      <div className="flex">
        {/* OVERLAY */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* SIDEBAR - desktop: fixed, mobile: drawer */}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
