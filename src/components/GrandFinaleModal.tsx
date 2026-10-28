import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UNIVERSITIES } from '../data/institutional';
import type { AwardedPrize } from '../types';
import { Trophy, Sparkles, Plus, RotateCcw, X, HeartHandshake } from 'lucide-react';

interface GrandFinaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AwardedPrize[];
  totalDelivered: number;
  onAddExtraPrizes: (count: number) => void;
  onResetGame: () => void;
}

export const GrandFinaleModal: React.FC<GrandFinaleModalProps> = ({
  isOpen,
  onClose,
  history,
  totalDelivered,
  onAddExtraPrizes,
  onResetGame,
}) => {
  // Trigger spectacular celebratory confetti shower on open
  useEffect(() => {
    if (isOpen) {
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;

      const colors = ['#f59e0b', '#38bdf8', '#e11d48', '#10b981', '#a855f7'];

      (function frame() {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.6 },
          colors,
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.6 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
      <div
        className="relative w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(245,158,11,0.25)] text-white flex flex-col items-center text-center gap-6 max-h-[92vh] overflow-y-auto ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Triumphant Header Icon */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-1 shadow-2xl shadow-amber-500/40 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
            </div>
          </div>
          <Sparkles className="w-7 h-7 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
        </div>

        {/* Title */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
            ✨ GRAN CIERRE DEL CONVERSATORIO 2026
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-sky-300">
            ¡Felicitaciones a Todos los Ganadores!
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl mx-auto">
            Hemos entregado exitosamente los <strong>{totalDelivered} premios</strong> del conversatorio
            <em> "Conectando Fronteras"</em> en el Auditorio San Francisco 2 de la Universidad CESMAG.
          </p>
        </div>

        {/* The 7 Founding Universities of ORIS IES Nariño showcase */}
        <div className="w-full p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-sky-400">
            <HeartHandshake className="w-4 h-4" />
            <span>Alianza de las 7 Universidades Fundadoras de ORIS IES Nariño</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {UNIVERSITIES.map((uni) => (
              <div
                key={uni.id}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                  uni.isHost
                    ? 'bg-rose-950/50 border-rose-500/50 text-rose-200 font-bold shadow-md shadow-rose-900/20'
                    : 'bg-slate-900/60 border-white/5 text-slate-300'
                }`}
              >
                <span className="font-semibold">{uni.name}</span>
                {uni.isHost && (
                  <span className="text-[10px] text-rose-400 font-extrabold mt-0.5">
                    ★ Anfitriona 2026
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivered Prizes Summary Accordion / List if any */}
        {history.length > 0 && (
          <div className="w-full max-h-40 overflow-y-auto bg-slate-950/40 rounded-2xl p-3 border border-white/5 text-left text-xs">
            <div className="font-bold text-slate-400 mb-2 flex items-center justify-between">
              <span>Registro de Premios Entregados ({history.length}):</span>
              <span className="text-amber-400 font-mono">🏆 Total: {history.length}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {history.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/70 border border-white/5 text-slate-300"
                >
                  <span className="font-bold text-amber-300">
                    Premio #{idx + 1} (Pregunta #{item.questionId})
                  </span>
                  <span className="truncate max-w-[260px] text-slate-400 text-[11px]">
                    {item.questionText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encore: Audience asks for more rounds! */}
        <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-sky-950/50 via-slate-900 to-sky-950/50 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>🎉 ¿El auditorio pide otra ronda de preguntas?</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Agrega premios adicionales en vivo sin perder el progreso de la ruleta.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddExtraPrizes(1)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              +1 Premio
            </button>
            <button
              onClick={() => onAddExtraPrizes(3)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs shadow-md transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              +3 Premios
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between w-full gap-3 pt-2 border-t border-white/10">
          <button
            onClick={onResetGame}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-white/5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar Ruleta Completa
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Cerrar Pantalla
          </button>
        </div>
      </div>
    </div>
  );
};
