import React, { useState } from 'react';
import { X, Search, CheckCircle2, Circle, Play } from 'lucide-react';
import { QUESTIONS_DATA } from '../data/questions';
import type { Question } from '../types';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeQuestionIds: number[];
  answeredQuestionIds: number[];
  onSelectQuestion: (question: Question) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  activeQuestionIds,
  answeredQuestionIds,
  onSelectQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'answered'>('all');

  if (!isOpen) return null;

  const filteredQuestions = QUESTIONS_DATA.filter((q) => {
    const isAnswered = answeredQuestionIds.includes(q.id);
    const isActive = activeQuestionIds.includes(q.id);

    if (selectedFilter === 'active' && !isActive) return false;
    if (selectedFilter === 'answered' && !isAnswered) return false;

    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      q.id.toString().includes(lower) ||
      q.question.toLowerCase().includes(lower) ||
      q.answer.toLowerCase().includes(lower) ||
      (q.topicTag && q.topicTag.toLowerCase().includes(lower))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl text-white flex flex-col gap-5 max-h-[90vh] ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>📚 Banco Oficial: 45 Preguntas Nivel Estándar</span>
            </h3>
            <p className="text-xs text-slate-400">
              Matriz completa de preguntas del conversatorio ORIS IES Nariño 2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por número, palabra clave o tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedFilter === 'all'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todas ({QUESTIONS_DATA.length})
            </button>
            <button
              onClick={() => setSelectedFilter('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedFilter === 'active'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              En Ruleta ({activeQuestionIds.length})
            </button>
            <button
              onClick={() => setSelectedFilter('answered')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedFilter === 'answered'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Entregadas ({answeredQuestionIds.length})
            </button>
          </div>
        </div>

        {/* Questions Grid / List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[55vh]">
          {filteredQuestions.map((q) => {
            const isAnswered = answeredQuestionIds.includes(q.id);
            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isAnswered
                    ? 'bg-amber-950/20 border-amber-500/20 opacity-80'
                    : 'bg-slate-800/40 border-white/5 hover:border-sky-500/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
                      isAnswered
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    #{q.id}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                      {q.question}
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong className="text-slate-300">R:</strong> {q.answer}
                    </p>
                    {q.topicTag && (
                      <span className="self-start text-[10px] font-medium text-sky-400/80 px-2 py-0.5 rounded bg-sky-950/40 border border-sky-500/20 mt-0.5">
                        {q.topicTag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {isAnswered ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Entregada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10">
                      <Circle className="w-2.5 h-2.5 fill-emerald-400" /> Disponible
                    </span>
                  )}

                  <button
                    onClick={() => {
                      onSelectQuestion(q);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 text-xs font-bold border border-sky-400/30 transition active:scale-95"
                    title="Lanzar esta pregunta en pantalla"
                  >
                    <Play className="w-3 h-3" />
                    Lanzar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
          <span>Mostrando {filteredQuestions.length} de 45 preguntas</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
