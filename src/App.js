import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RecoveryPage from './pages/RecoveryPage';
import RegistrationPage from './pages/RegistrationPage';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ElencoSoci from './pages/admin/ElencoSoci';
import NuovoSocio from './pages/admin/NuovoSocio';
import UmiShop from './pages/admin/UmiShop';
import Biblioteca from './pages/admin/Biblioteca';
import Videoteca from './pages/admin/Videoteca';
import GestioneSoci from './pages/admin/GestioneSoci';
import CatalogoAttivita from './pages/admin/CatalogoAttivita';
import AlboDoro from './pages/admin/AlboDoro';
import Contabilita from './pages/admin/Contabilita';
import MediaCenter from './pages/admin/MediaCenter';
import CentroNotifiche from './pages/admin/CentroNotifiche';
import RegistriAntichi from './pages/admin/RegistriAntichi';

import SocioLayout from './components/socio/SocioLayout';
import SocioDashboard from './pages/socio/SocioDashboard';
import SocioProfilo from './pages/socio/SocioProfilo';
import SocioShop from './pages/socio/SocioShop';
import SocioBiblioteca from './pages/socio/SocioBiblioteca';
import SocioVideoteca from './pages/socio/SocioVideoteca';
import SocioCorsi from './pages/socio/SocioCorsi';
import SocioAlbo from './pages/socio/SocioAlbo';
import SocioPagamenti from './pages/socio/SocioPagamenti';
import SocioMedia from './pages/socio/SocioMedia';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-umi-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-umi-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-xl font-bold">UM</span>
        </div>
        <p className="text-umi-muted text-sm">Caricamento portale...</p>
      </div>
    </div>
  );
}

function ProtectedAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  return children;
}

function ProtectedSocio({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user || isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/recupero" element={<RecoveryPage />} />
      <Route path="/registrazione" element={<RegistrationPage />} />

      <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
        <Route index element={<AdminDashboard />} />
        <Route path="soci" element={<ElencoSoci />} />
        <Route path="nuovo-socio" element={<NuovoSocio />} />
        <Route path="shop" element={<UmiShop />} />
        <Route path="biblioteca" element={<Biblioteca />} />
        <Route path="videoteca" element={<Videoteca />} />
        <Route path="gestione-soci" element={<GestioneSoci />} />
        <Route path="catalogo" element={<CatalogoAttivita />} />
        <Route path="albo" element={<AlboDoro />} />
        <Route path="contabilita" element={<Contabilita />} />
        <Route path="media" element={<MediaCenter />} />
        <Route path="notifiche" element={<CentroNotifiche />} />
        <Route path="registri" element={<RegistriAntichi />} />
      </Route>

      <Route path="/socio" element={<ProtectedSocio><SocioLayout /></ProtectedSocio>}>
        <Route index element={<SocioDashboard />} />
        <Route path="profilo" element={<SocioProfilo />} />
        <Route path="shop" element={<SocioShop />} />
        <Route path="biblioteca" element={<SocioBiblioteca />} />
        <Route path="videoteca" element={<SocioVideoteca />} />
        <Route path="corsi" element={<SocioCorsi />} />
        <Route path="albo" element={<SocioAlbo />} />
        <Route path="pagamenti" element={<SocioPagamenti />} />
        <Route path="media" element={<SocioMedia />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
