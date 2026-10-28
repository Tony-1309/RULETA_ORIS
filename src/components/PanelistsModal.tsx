import React from 'react';
import { X, Users, Compass, Globe, Award, MapPin } from 'lucide-react';
import { PANELISTAS, UNIVERSITIES, MODERATOR } from '../data/institutional';

interface PanelistsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanelistsModal: React.FC<PanelistsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const salientes = PANELISTAS.filter((p) => p.type === 'Saliente');
  const entrantes = PANELISTAS.filter((p) => p.type === 'Entrante');
  const egresado = PANELISTAS.find((p) => p.type === 'Egresado Especial');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl text-white flex flex-col gap-6 max-h-[90vh] overflow-y-auto ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Panelistas y Moderación del Conversatorio</h3>
              <p className="text-xs text-slate-300">
                10 panelistas en escenario representando las 3 dimensiones de la movilidad en Nariño
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Moderation Highlight Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 border border-amber-500/30">
            🎙️
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
              Moderadora del Conversatorio
            </div>
            <div className="text-base sm:text-lg font-black text-white">{MODERATOR.name}</div>
            <div className="text-xs text-slate-300">
              {MODERATOR.title} • <strong className="text-amber-300">{MODERATOR.institution}</strong>
            </div>
          </div>
        </div>

        {/* Section 1: 5 Estudiantes Salientes CESMAG */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-black text-rose-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>5 Estudiantes de Movilidad Saliente (Universidad CESMAG)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {salientes.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-rose-500/20 hover:border-rose-500/40 transition flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-slate-400">#{p.id}</span>
                    <span className="text-base">{p.flag}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{p.name}</div>
                  <div className="text-xs text-rose-300 font-medium">{p.program}</div>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>Destino: <strong>{p.hostInstitution}</strong> ({p.destinationOrOrigin})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: 4 Estudiantes Entrantes Internacionales */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-black text-sky-400 uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>4 Estudiantes de Movilidad Internacional Entrante (U. Mariana y UCC)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {entrantes.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-sky-500/20 hover:border-sky-500/40 transition flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-slate-400">#{p.id}</span>
                    <span className="text-lg">{p.flag}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{p.name}</div>
                  <div className="text-xs text-sky-300 font-medium">
                    {p.program} • {p.programType}
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-300 flex flex-col gap-0.5">
                  <div>Origen: <strong>{p.homeInstitution}</strong> ({p.destinationOrOrigin})</div>
                  <div>En Pasto: <strong className="text-sky-300">{p.hostInstitution}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: 1 Egresado y Profesional Invitado Especial */}
        {egresado && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-black text-amber-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>1 Egresado y Profesional en Ejercicio Invitado Especial</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-850 to-slate-900 border border-amber-500/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-black text-white">#{egresado.id} {egresado.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Egresado & Profesional
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {egresado.program}
              </p>
              <div className="text-xs text-amber-200/90 pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                <span>{egresado.destinationOrOrigin}</span>
                <span>Actual: <strong className="text-white">{egresado.hostInstitution}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: 7 Universidades Fundadoras */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex flex-col gap-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            🏛️ Las 7 IES Fundadoras de la Red ORIS Nariño
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {UNIVERSITIES.map((u) => (
              <div
                key={u.id}
                className={`p-2 rounded-xl border text-center ${
                  u.isHost
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-200 font-bold'
                    : 'bg-slate-900/50 border-white/5 text-slate-300'
                }`}
              >
                {u.name}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
