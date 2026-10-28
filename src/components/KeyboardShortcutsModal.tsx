import React from 'react';
import { X, Keyboard, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'Espacio', action: 'Girar la ruleta / Iniciar sorteo', context: 'Pantalla principal' },
    { key: 'R', action: '👁️ Revelar respuesta oficial', context: 'Modal de pregunta' },
    { key: 'G', action: '🏆 Ganador: Descuenta 1 premio + Confeti + Fanfarria', context: 'Modal de pregunta' },
    { key: 'B', action: '❌ Buzzer: Error / Pasar turno (sin descontar premio)', context: 'Modal de pregunta' },
    { key: 'P', action: 'Ajustar número de premios personalizados', context: 'Cualquier momento' },
    { key: 'Escape', action: 'Cerrar cualquier ventana o modal activo', context: 'Modales' },
    { key: 'M', action: 'Silenciar / Activar audio en tiempo real', context: 'Global' },
    { key: 'F', action: 'Activar / Salir de pantalla completa (Proyector)', context: 'Global' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-white flex flex-col gap-5 ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Atajos de Teclado del Operador</h3>
              <p className="text-xs text-slate-400">Controles rápidos durante la proyección en vivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-white/10 transition"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs sm:text-sm font-bold text-white">{item.action}</span>
                <span className="text-[10px] text-slate-400">{item.context}</span>
              </div>
              <kbd className="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-gradient-to-b from-slate-800 to-slate-950 border border-sky-400/40 text-sky-300 shadow-md">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 flex items-center gap-2 text-xs text-sky-200">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Diseñado para operar fluidamente desde laptop en atril mientras el auditorio mira el proyector.
          </span>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
