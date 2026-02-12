import React, { useState, useEffect, useCallback } from 'react';
import { fetchAttivita } from '../../supabaseStore';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';

const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const DAYS = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];
function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

export default function SocioAgenda() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [attivita, setAttivita] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try { const d = await fetchAttivita(); setAttivita(d.filter(a => a.pubblicata)); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const eventsMap = {};
  attivita.forEach(a => {
    if (!a.data) return;
    const d = new Date(a.data);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventsMap[day]) eventsMap[day] = [];
      eventsMap[day].push(a);
    }
  });

  const upcoming = attivita.filter(a => a.data && new Date(a.data) >= today).sort((a, b) => new Date(a.data) - new Date(b.data)).slice(0, 4);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase flex items-center gap-2">
          <Calendar size={24} className="text-umi-primary" /> La Mia Agenda
        </h1>
        <p className="text-umi-muted text-sm">I prossimi eventi e attività del tuo percorso magico.</p>
      </div>

      {/* UPCOMING CARDS */}
      {upcoming.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {upcoming.map(ev => {
            const evDate = new Date(ev.data);
            const diffDays = Math.ceil((evDate - today) / 86400000);
            return (
              <div key={ev.id} className="bg-umi-card border border-umi-border rounded-xl p-4 card-hover relative overflow-hidden">
                {diffDays <= 3 && <div className="absolute top-0 right-0 bg-umi-orange text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg">IMMINENTE</div>}
                <div className="text-2xl mb-2">{ev.tipologia === 'Masterclass' ? '🎓' : ev.tipologia === 'Congresso UMI' ? '🏛️' : ev.tipologia === 'Viaggio Studi' ? '✈️' : '📋'}</div>
                <h3 className="text-xs font-bold text-umi-text mb-1 line-clamp-2">{ev.titolo}</h3>
                <p className="text-[10px] text-umi-muted flex items-center gap-1"><Clock size={10} /> {evDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</p>
                {ev.luogo && <p className="text-[10px] text-umi-dim flex items-center gap-1"><MapPin size={10} /> {ev.luogo}</p>}
                <div className="mt-2">
                  <span className={`text-[10px] font-bold ${ev.costo > 0 ? 'text-umi-gold' : 'text-umi-green'}`}>
                    {ev.costo > 0 ? `€${ev.costo}` : 'GRATUITO'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CALENDAR */}
      <div className="bg-umi-card border border-umi-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prev} className="p-2 hover:bg-umi-input rounded-lg transition-colors"><ChevronLeft size={20} className="text-umi-muted" /></button>
          <h2 className="text-lg font-bold text-umi-text tracking-wider">{MONTHS[month]} {year}</h2>
          <button onClick={next} className="p-2 hover:bg-umi-input rounded-lg transition-colors"><ChevronRight size={20} className="text-umi-muted" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-[10px] text-umi-dim uppercase font-bold py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasEvents = eventsMap[day];
            const isSelected = selected === day;
            return (
              <button key={day} onClick={() => setSelected(isSelected ? null : day)}
                className={`relative aspect-square rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center
                  ${isToday ? 'bg-umi-primary text-white font-bold ring-2 ring-umi-primary/50' : ''}
                  ${isSelected && !isToday ? 'bg-purple-500/30 text-purple-200 ring-1 ring-purple-500' : ''}
                  ${!isToday && !isSelected ? 'text-umi-text hover:bg-umi-input' : ''}`}>
                {day}
                {hasEvents && <div className="flex gap-0.5 mt-0.5">{hasEvents.slice(0, 3).map((_, j) => <span key={j} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-umi-primary'}`} />)}</div>}
              </button>
            );
          })}
        </div>
        {selected && eventsMap[selected] && (
          <div className="mt-4 pt-4 border-t border-umi-border space-y-2">
            <p className="text-xs text-umi-muted uppercase font-bold">{selected} {MONTHS[month]}</p>
            {eventsMap[selected].map(ev => (
              <div key={ev.id} className="bg-umi-input rounded-lg p-3 flex items-center gap-3">
                <div className="w-2 h-8 rounded-full bg-umi-primary" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-umi-text">{ev.titolo}</p>
                  <p className="text-[10px] text-umi-muted">{ev.tipologia} · {ev.durata}</p>
                </div>
                {ev.costo > 0 && <span className="text-xs font-bold text-umi-gold">€{ev.costo}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
