import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowLeft, Save, Upload } from 'lucide-react';
import { fetchAlbo, createAlbo } from '../../supabaseStore';
import Modal from '../../components/shared/Modal';

export default function AlboDoro() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nome: '', evento: '', data: '', descrizione: '', badge: null, attestato: null,
  });
  const [items, setItems] = useState([]);
  const load = useCallback(() => { fetchAlbo().then(setItems).catch(() => {}); }, []);
  useEffect(() => { load(); }, [load]);

  const handleChange = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.nome) return;
    await createAlbo({ nome: form.nome, evento: form.evento, data: form.data || null, descrizione: form.descrizione });
    setForm({ nome: '', evento: '', data: '', descrizione: '', badge: null, attestato: null });
    setShowModal(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Albo d'Oro</h1>
          <p className="text-umi-muted text-sm">Catalogo dei premi, onorificenze e attestati dell'Università.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.history.back()} className="bg-umi-card border border-umi-border text-umi-muted px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:border-umi-primary transition-colors">
            <ArrowLeft size={16} /> Indietro
          </button>
          <button onClick={() => setShowModal(true)} className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={16} /> Nuovo Premio
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center mt-6">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-lg font-bold text-umi-text mb-2">L'ALBO È VUOTO</h3>
          <p className="text-umi-muted text-sm mb-4">Inizia ad aggiungere onorificenze e premi per gli studenti.</p>
          <button onClick={() => setShowModal(true)} className="gradient-gold text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Crea Primo Premio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {items.map(premio => (
            <div key={premio.id} className="bg-umi-card border border-umi-gold/30 rounded-xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-umi-gold/20 flex items-center justify-center text-2xl">🏆</div>
                <div>
                  <h3 className="text-sm font-bold text-umi-gold">{premio.nome}</h3>
                  {premio.evento && <p className="text-xs text-umi-muted">{premio.evento}</p>}
                </div>
              </div>
              <p className="text-xs text-umi-dim">{premio.data}</p>
              {premio.descrizione && <p className="text-xs text-umi-muted mt-2">{premio.descrizione}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Modifica Onorificenza">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Badge / Icona Simbolica</label>
            <div className="border-2 border-dashed border-umi-border rounded-lg p-4 text-center hover:border-umi-primary transition-colors cursor-pointer">
              <Upload size={20} className="mx-auto text-umi-dim mb-1" />
              <p className="text-xs text-umi-dim">Upload immagine (PNG o JPG con sfondo trasparente consigliato)</p>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Nome Premio</label>
            <input type="text" value={form.nome} onChange={handleChange('nome')} placeholder='es. "Gran Maestro di Alchimia"'
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Evento Correlato (opzionale)</label>
            <input type="text" value={form.evento} onChange={handleChange('evento')} placeholder='es. "Esami Finali 2024"'
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Data Conferimento</label>
            <input type="date" value={form.data} onChange={handleChange('data')}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Attestato / Pergamena</label>
            <div className="border-2 border-dashed border-umi-border rounded-lg p-4 text-center hover:border-umi-primary transition-colors cursor-pointer">
              <p className="text-xs text-umi-dim">Carica PDF o Immagine</p>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Descrizione / Motivazione</label>
            <textarea value={form.descrizione} onChange={handleChange('descrizione')} rows={3} placeholder="Descrizione del riconoscimento..."
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm text-umi-muted hover:bg-umi-input transition-colors">Annulla</button>
            <button onClick={handleSave} className="gradient-gold text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Save size={14} /> Salva Premio
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
