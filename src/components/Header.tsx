import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Plus, RotateCcw, Sliders, Users, HelpCircle, Gift } from 'lucide-react';
import { UNIVERSITIES, COUNTRIES } from '../data/institutional';

interface HeaderProps {
  totalPrizes: number;
  remainingPrizes: number;
  onIncrementPrize: () => void;
  onDecrementPrize: () => void;
  onAddExtraPrize: () => void;
  onResetPrizes: () => void;
  onOpenPrizeModal: () => void;
  onOpenPanelistsModal: () => void;
  onOpenQuestionBank: () => void;
  onOpenKeyboardHelp: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalPrizes,
  remainingPrizes,
  onIncrementPrize,
  onDecrementPrize,
  onAddExtraPrize,
  onResetPrizes,
  onOpenPrizeModal,
  onOpenPanelistsModal,
  onOpenQuestionBank,
  onOpenKeyboardHelp,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const deliveredPrizes = totalPrizes - remainingPrizes;

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 select-none">
      {/* Top Banner Ribbon: 7 Founding Universities & International Flags */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 py-1.5 px-3 border-b border-white/5 overflow-hidden text-[11px] sm:text-xs">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto flex-wrap">
          {/* 7 Universities marquee-like ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
            <span className="font-black text-amber-400 tracking-wider flex items-center gap-1">
              🏛️ RED ORIS IES NARIÑO:
            </span>
            {UNIVERSITIES.map((uni, idx) => (
              <span
                key={uni.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                  uni.isHost
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-400/40 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {uni.shortName}
                {idx < UNIVERSITIES.length - 1 && <span className="text-slate-600 ml-1.5">•</span>}
              </span>
            ))}
          </div>

          {/* Flags Ribbon */}
          <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <span className="text-slate-400 font-semibold mr-1">Rutas:</span>
            {COUNTRIES.map((c) => (
              <span
                key={c.code}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/60 border border-white/5 text-slate-200"
                title={c.name}
              >
                <span>{c.flag}</span>
                <span className="text-[10px] hidden md:inline text-slate-300">{c.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Institutional Subtitle */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-sky-400 p-[2px] shadow-lg shadow-sky-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-300 to-white text-base sm:text-lg">
              🎯
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-white to-amber-300 drop-shadow">
              CONECTANDO FRONTERAS – RULETA OFICIAL 2026
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center justify-center md:justify-start gap-1.5">
              <span>Semana de la Internacionalización</span>
              <span className="text-slate-500">|</span>
              <span className="text-sky-400">Red ORIS IES Nariño</span>
              <span className="text-slate-500">•</span>
              <span className="text-rose-400 font-bold">Universidad CESMAG (Anfitriona)</span>
            </p>
          </div>
        </div>

        {/* Live Prize Counter (100% Personalizable) & Controls */}
        <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3">
          {/* Live Prize Tracker Widget */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900/90 to-slate-900/60 border border-amber-500/30 px-3 py-1.5 rounded-2xl shadow-lg shadow-amber-500/5">
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80">
                  Premios Disponibles
                </div>
                <div className="font-mono text-sm sm:text-base font-black text-white tabular-nums flex items-center gap-1">
                  <span className={remainingPrizes > 0 ? 'text-amber-400' : 'text-rose-500'}>
                    {remainingPrizes}
                  </span>
                  <span className="text-slate-500 font-normal">de</span>
                  <span className="text-slate-300">{totalPrizes}</span>
                </div>
              </div>
            </div>

            {/* Visual Mini Trophy / Delivered Indicators */}
            <div className="hidden lg:flex items-center gap-0.5 ml-1 border-l border-white/10 pl-2">
              {Array.from({ length: Math.min(totalPrizes, 12) }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs transition-transform ${
                    i < deliveredPrizes ? 'opacity-30 grayscale scale-75' : 'text-amber-400 scale-100'
                  }`}
                  title={i < deliveredPrizes ? 'Entregado' : 'Disponible'}
                >
                  🏆
                </span>
              ))}
              {totalPrizes > 12 && (
                <span className="text-[10px] text-amber-300 font-mono ml-1">+{totalPrizes - 12}</span>
              )}
            </div>

            {/* Direct +/- adjuster buttons */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={onDecrementPrize}
                disabled={totalPrizes <= 1}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white font-bold flex items-center justify-center text-xs transition active:scale-95"
                title="Reducir cantidad de premios"
              >
                -
              </button>
              <button
                onClick={onIncrementPrize}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs transition active:scale-95"
                title="Aumentar cantidad de premios"
              >
                +
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1">
            {/* +1 Premio Extra */}
            <button
              onClick={onAddExtraPrize}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition active:scale-95"
              title="Añadir +1 Premio adicional en vivo"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+1 Extra</span>
            </button>

            {/* Reiniciar Contador */}
            <button
              onClick={onResetPrizes}
              className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition active:scale-95"
              title="Reiniciar contador de premios"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Modal de Configuración Rápida (P) */}
            <button
              onClick={onOpenPrizeModal}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/5 transition active:scale-95"
              title="Ajustar Premios (Tecla P)"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Ajustar</span>
              <kbd className="px-1 text-[10px] font-mono bg-black/30 rounded border border-white/10 hidden md:inline">
                P
              </kbd>
            </button>
          </div>

          {/* Utility Tools: Panelists, Question Bank, Sound, Fullscreen, Help */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            {/* Panelistas modal */}
            <button
              onClick={onOpenPanelistsModal}
              className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition active:scale-95"
              title="Ver los 10 panelistas y universidades"
            >
              <Users className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Banco de preguntas */}
            <button
              onClick={onOpenQuestionBank}
              className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition active:scale-95"
              title="Ver banco de 45 preguntas"
            >
              <span className="font-mono text-xs font-bold text-sky-400">45</span>
            </button>

            {/* Sound Mute/Unmute */}
            <button
              onClick={onToggleMute}
              className={`p-2 rounded-xl border transition active:scale-95 ${
                isMuted
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                  : 'bg-slate-800/70 border-white/5 text-sky-400 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Activar Sonido (M)' : 'Silenciar (M)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition active:scale-95 hidden sm:flex"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa para auditorio (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Keyboard Shortcuts Help */}
            <button
              onClick={onOpenKeyboardHelp}
              className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/5 transition active:scale-95"
              title="Atajos de teclado para operador"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
