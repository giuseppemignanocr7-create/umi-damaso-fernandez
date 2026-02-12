import React, { useState, useEffect, useCallback } from 'react';
import { fetchAttivita } from '../../supabaseStore';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Users } from 'lucide-react';

const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const DAYS = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

export default function Agenda() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [attivita, setAttivita] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try { const d = await fetchAttivita(); setAttivita(d); } catch {}
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

  const upcomingEvents = attivita
    .filter(a => a.data && new Date(a.data) >= today)
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase flex items-center gap-2">
          <Calendar size={24} className="text-umi-primary" /> Agenda & Calendario
        </h1>
        <p className="text-umi-muted text-sm">Panoramica completa di eventi, corsi e attività.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CALENDAR */}
        <div className="lg:col-span-2 bg-umi-card border border-umi-border rounded-xl p-6">
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
                <button
                  key={day}
                  onClick={() => setSelected(isSelected ? null : day)}
                  className={`relative aspect-square rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center
                    ${isToday ? 'bg-umi-primary text-white font-bold ring-2 ring-umi-primary/50' : ''}
                    ${isSelected && !isToday ? 'bg-purple-500/30 text-purple-200 ring-1 ring-purple-500' : ''}
                    ${!isToday && !isSelected ? 'text-umi-text hover:bg-umi-input' : ''}
                  `}
                >
                  {day}
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-0.5">
                      {hasEvents.slice(0, 3).map((_, j) => (
                        <span key={j} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-umi-primary'}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* SELECTED DAY EVENTS */}
          {selected && eventsMap[selected] && (
            <div className="mt-4 pt-4 border-t border-umi-border space-y-2">
              <p className="text-xs text-umi-muted uppercase font-bold">{selected} {MONTHS[month]}</p>
              {eventsMap[selected].map(ev => (
                <div key={ev.id} className="bg-umi-input rounded-lg p-3 flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full bg-umi-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-umi-text">{ev.titolo}</p>
                    <p className="text-[10px] text-umi-muted flex items-center gap-2">
                      <span className="flex items-center gap-0.5"><Clock size={10} /> {ev.durata}</span>
                      {ev.luogo && <span className="flex items-center gap-0.5"><MapPin size={10} /> {ev.luogo}</span>}
                    </p>
                  </div>
                  <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{ev.tipologia}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UPCOMING EVENTS SIDEBAR */}
        <div className="space-y-4">
          <div className="bg-umi-card border border-umi-border rounded-xl p-5">
            <h3 className="text-xs font-bold text-umi-text tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-umi-green rounded-full animate-pulse" /> Prossimi Eventi
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-umi-dim">Nessun evento in programma.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(ev => {
                  const evDate = new Date(ev.data);
                  const diffDays = Math.ceil((evDate - today) / 86400000);
                  return (
                    <div key={ev.id} className="border-l-2 border-umi-primary pl-3">
                      <p className="text-sm font-bold text-umi-text">{ev.titolo}</p>
                      <p className="text-[10px] text-umi-muted">{evDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}</p>
                      <span className={`text-[10px] font-bold ${diffDays <= 7 ? 'text-umi-orange' : 'text-umi-green'}`}>
                        {diffDays === 0 ? 'OGGI!' : diffDays === 1 ? 'DOMANI' : `Tra ${diffDays} giorni`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* STATS */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-5">
            <h3 className="text-xs font-bold text-umi-text tracking-wider uppercase mb-3">Riepilogo Attività</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-umi-muted">Totale Attività</span>
                <span className="text-sm font-bold text-umi-text">{attivita.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-umi-muted">Pubblicate</span>
                <span className="text-sm font-bold text-umi-green">{attivita.filter(a => a.pubblicata).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-umi-muted">Con Costo</span>
                <span className="text-sm font-bold text-umi-gold">{attivita.filter(a => a.costo > 0).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-umi-muted flex items-center gap-1"><Users size={12} /> In Presenza</span>
                <span className="text-sm font-bold text-umi-primary-light">{attivita.filter(a => a.modalita === 'In Presenza').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
