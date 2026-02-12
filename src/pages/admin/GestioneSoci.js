import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfiles } from '../../supabaseStore';
import StatCard from '../../components/shared/StatCard';

export default function GestioneSoci() {
  const navigate = useNavigate();
  const [soci, setSoci] = useState([]);
  useEffect(() => { fetchProfiles().then(setSoci).catch(() => {}); }, []);
  const totale = soci.length;
  const attivi = soci.filter(s => s.stato === 'Attivo').length;
  const scaduti = soci.filter(s => s.stato === 'Scaduto').length;
  const onorari = soci.filter(s => s.stato === 'Onorario' || s.ruolo === 'Socio Onorario UMI').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Statistiche Soci</h1>
        </div>
        <button onClick={() => navigate('/admin/soci')} className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Vai all'Elenco Completo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Totale Soci" value={totale} color="umi-primary" />
        <StatCard icon="✓" label="Soci Attivi" value={attivi} color="umi-red" />
        <StatCard icon="⏰" label="Scaduti" value={scaduti} color="umi-orange" />
        <StatCard icon="⭐" label="Onorari" value={onorari} color="umi-primary-light" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-umi-card border border-umi-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4">Stato Iscrizioni</h3>
          <div className="h-48 bg-umi-primary/5 rounded-lg flex items-center justify-center border border-umi-primary/20">
            <p className="text-umi-dim text-sm">Area grafico (dati insufficienti)</p>
          </div>
        </div>
        <div className="bg-umi-card border border-umi-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4">Composizione Accademica</h3>
          <div className="h-48 bg-umi-primary/5 rounded-lg flex items-center justify-center border border-umi-primary/20">
            <p className="text-umi-dim text-sm">Area grafico (dati insufficienti)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
