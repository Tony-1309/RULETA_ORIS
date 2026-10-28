import React, { useState } from 'react';
import { X, Gift, Plus, Minus, Check } from 'lucide-react';

interface PrizeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrizes: number;
  remainingPrizes: number;
  onSaveTotalPrizes: (newTotal: number, resetCounter: boolean) => void;
}

export const PrizeConfigModal: React.FC<PrizeConfigModalProps> = ({
  isOpen,
  onClose,
  totalPrizes,
  remainingPrizes,
  onSaveTotalPrizes,
}) => {
  const [inputValue, setInputValue] = useState<number>(totalPrizes);
  const [resetRemaining, setResetRemaining] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleIncrement = () => setInputValue((v) => Math.min(v + 1, 45));
  const handleDecrement = () => setInputValue((v) => Math.max(v - 1, 1));

  const handleSave = () => {
    onSaveTotalPrizes(inputValue, resetRemaining);
    onClose();
  };

  const PRESETS = [5, 7, 10, 12, 15, 20];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-white flex flex-col gap-5 ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Configurar Premios en Vivo</h3>
              <p className="text-xs text-slate-400">Personaliza la cantidad total para el evento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current status overview */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/40 border border-white/5 text-center">
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400">Disponibles Ahora</div>
            <div className="font-mono text-2xl font-black text-amber-400">{remainingPrizes}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-400">Total Configurado</div>
            <div className="font-mono text-2xl font-black text-sky-400">{totalPrizes}</div>
          </div>
        </div>

        {/* Numeric selector with direct +/- controls */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300">Nuevo Total de Premios a Entregar:</label>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleDecrement}
              disabled={inputValue <= 1}
              className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold text-xl flex items-center justify-center transition active:scale-95 border border-white/10"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              type="number"
              min={1}
              max={45}
              value={inputValue}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setInputValue(Math.max(1, Math.min(val, 45)));
                }
              }}
              className="w-28 h-12 rounded-2xl bg-slate-950 border-2 border-sky-500/50 text-center font-mono text-2xl font-black text-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
            />
            <button
              onClick={handleIncrement}
              disabled={inputValue >= 45}
              className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold text-xl flex items-center justify-center transition active:scale-95 border border-white/10"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-slate-400 font-semibold">Valores sugeridos:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((num) => (
              <button
                key={num}
                onClick={() => setInputValue(num)}
                className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition border ${
                  inputValue === num
                    ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border-white/10'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Reset options checkbox */}
        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-850 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition">
          <input
            type="checkbox"
            checked={resetRemaining}
            onChange={(e) => setResetRemaining(e.target.checked)}
            className="w-4 h-4 rounded text-sky-500 focus:ring-0 bg-slate-900 border-slate-700"
          />
          <span className="text-xs text-slate-300">
            Reiniciar premios disponibles al nuevo valor total ({inputValue})
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Aplicar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
