import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SocioLayout() {
  const { profile, logout } = useAuth();
  const user = profile || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user ? `${(user.nome?.[0] || '').toUpperCase()}${(user.cognome?.[0] || '').toUpperCase()}` : '??';

  return (
    <div className="min-h-screen bg-umi-bg">
      {/* HEADER */}
      <header className="bg-umi-card border-b border-umi-border px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/socio')}>
          <span className="text-umi-primary font-bold text-lg">DF</span>
          <span className="small-caps font-bold text-umi-text tracking-widest text-sm">DAMASO FERNANDEZ</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-umi-primary/30 flex items-center justify-center text-xs text-umi-primary font-bold">
              {initials}
            </div>
            <span className="text-sm text-umi-text">{user?.nome} {user?.cognome}</span>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-umi-input rounded-lg transition-colors" title="Logout">
            <LogOut size={16} className="text-umi-muted" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
