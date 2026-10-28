import React, { useState, useEffect, useCallback } from 'react';
import { QUESTIONS_DATA } from './data/questions';
import type { Question, AwardedPrize } from './types';
import { soundEngine } from './audio/SoundEngine';
import { RouletteCanvas } from './components/RouletteCanvas';
import { QuestionModal } from './components/QuestionModal';
import { Header } from './components/Header';
import { PrizeConfigModal } from './components/PrizeConfigModal';
import { GrandFinaleModal } from './components/GrandFinaleModal';
import { PanelistsModal } from './components/PanelistsModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import {
  Play,
  Trophy,
  HelpCircle,
  Users,
  Grid,
  CheckCircle,
  PartyPopper,
} from 'lucide-react';

const STORAGE_KEY = 'RULETA_ORIS_STATE_V1';

export const App: React.FC = () => {
  // Load saved state or default
  const [totalPrizes, setTotalPrizes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.totalPrizes === 'number' ? parsed.totalPrizes : 7;
      }
    } catch {
      // fallback
    }
    return 7;
  });

  const [remainingPrizes, setRemainingPrizes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.remainingPrizes === 'number' ? parsed.remainingPrizes : 7;
      }
    } catch {
      // fallback
    }
    return 7;
  });

  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed.answeredQuestionIds) ? parsed.answeredQuestionIds : [];
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [history, setHistory] = useState<AwardedPrize[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed.history) ? parsed.history : [];
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Calculate active questions in the roulette (from 1 to 45 that have not been answered)
  const activeQuestionIds = QUESTIONS_DATA.map((q) => q.id).filter(
    (id) => !answeredQuestionIds.includes(id)
  );

  // Gameplay & UI state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState<boolean>(false);
  const [isFinaleModalOpen, setIsFinaleModalOpen] = useState<boolean>(false);
  const [isPanelistsModalOpen, setIsPanelistsModalOpen] = useState<boolean>(false);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState<boolean>(false);
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          totalPrizes,
          remainingPrizes,
          answeredQuestionIds,
          history,
        })
      );
    } catch {
      // ignore
    }
  }, [totalPrizes, remainingPrizes, answeredQuestionIds, history]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      soundEngine.setMuted(nextMuted);
      return nextMuted;
    });
  }, []);

  // Spin Roulette Trigger
  const handleSpinStart = useCallback(() => {
    if (isSpinning) return;

    if (remainingPrizes <= 0) {
      setIsFinaleModalOpen(true);
      return;
    }

    if (activeQuestionIds.length === 0) {
      alert('¡Todas las 45 preguntas han sido respondidas en este conversatorio!');
      return;
    }

    // Close any open modals
    setIsQuestionModalOpen(false);
    setIsPrizeModalOpen(false);
    setIsPanelistsModalOpen(false);
    setIsQuestionBankOpen(false);
    setIsKeyboardHelpOpen(false);

    setIsSpinning(true);
  }, [isSpinning, remainingPrizes, activeQuestionIds]);

  // Spin Roulette Completed
  const handleSpinEnd = useCallback((selectedQuestionId: number) => {
    setIsSpinning(false);
    const targetQ = QUESTIONS_DATA.find((q) => q.id === selectedQuestionId);
    if (targetQ) {
      setCurrentQuestion(targetQ);
      setIsQuestionModalOpen(true);
    }
  }, []);

  // Correct Answer Handled (G button or key)
  const handleCorrectAnswer = useCallback((questionId: number) => {
    // 1. Decrement remaining prizes
    const nextRemaining = Math.max(0, remainingPrizes - 1);
    setRemainingPrizes(nextRemaining);

    // 2. Remove question from roulette by adding to answeredQuestionIds
    if (!answeredQuestionIds.includes(questionId)) {
      setAnsweredQuestionIds((prev) => [...prev, questionId]);
    }

    // 3. Record into prize history
    const qObj = QUESTIONS_DATA.find((q) => q.id === questionId);
    const newAward: AwardedPrize = {
      id: `${Date.now()}-${questionId}`,
      questionId,
      questionText: qObj ? qObj.question : `Pregunta #${questionId}`,
      answerText: qObj ? qObj.answer : '',
      timestamp: Date.now(),
      prizeNumber: totalPrizes - nextRemaining,
    };
    setHistory((prev) => [...prev, newAward]);

    // 4. Close question modal
    setIsQuestionModalOpen(false);

    // 5. If remaining prizes reached 0, trigger grand finale!
    if (nextRemaining === 0) {
      setTimeout(() => {
        setIsFinaleModalOpen(true);
      }, 1200);
    }
  }, [remainingPrizes, answeredQuestionIds, totalPrizes]);

  // Wrong Answer Handled (B button or key)
  const handleWrongAnswer = useCallback(() => {
    // Keep modal open or allow operator to decide
  }, []);

  // Quick Prize Counter Adjusters
  const handleIncrementPrize = () => {
    setTotalPrizes((prev) => Math.min(prev + 1, 45));
    setRemainingPrizes((prev) => Math.min(prev + 1, 45));
  };

  const handleDecrementPrize = () => {
    if (totalPrizes > 1) {
      setTotalPrizes((prev) => prev - 1);
      setRemainingPrizes((prev) => Math.max(0, Math.min(prev, totalPrizes - 1)));
    }
  };

  const handleAddExtraPrize = (extra: number = 1) => {
    setTotalPrizes((prev) => prev + extra);
    setRemainingPrizes((prev) => prev + extra);
    soundEngine.playAnswerReveal();
  };

  const handleResetPrizesOnly = () => {
    if (window.confirm('¿Deseas reiniciar el contador de premios disponibles al total actual?')) {
      setRemainingPrizes(totalPrizes);
    }
  };

  const handleResetFullGame = () => {
    if (
      window.confirm(
        '¿Deseas reiniciar COMPLETAMENTE el sorteo? (Se restablecerán todas las preguntas a la ruleta y el contador de premios)'
      )
    ) {
      setAnsweredQuestionIds([]);
      setRemainingPrizes(totalPrizes);
      setHistory([]);
      setIsFinaleModalOpen(false);
      setIsQuestionModalOpen(false);
    }
  };

  const handleSaveTotalPrizes = (newTotal: number, resetCounter: boolean) => {
    setTotalPrizes(newTotal);
    if (resetCounter) {
      setRemainingPrizes(newTotal);
    } else {
      const delivered = totalPrizes - remainingPrizes;
      setRemainingPrizes(Math.max(0, newTotal - delivered));
    }
  };

  // Direct question launch from question bank
  const handleSelectDirectQuestion = (q: Question) => {
    setCurrentQuestion(q);
    setIsQuestionModalOpen(true);
  };

  // Keyboard Shortcuts Listener for Operator in Auditorium
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      // Escape: Close any open modal
      if (e.key === 'Escape') {
        if (isQuestionModalOpen) setIsQuestionModalOpen(false);
        else if (isPrizeModalOpen) setIsPrizeModalOpen(false);
        else if (isFinaleModalOpen) setIsFinaleModalOpen(false);
        else if (isPanelistsModalOpen) setIsPanelistsModalOpen(false);
        else if (isQuestionBankOpen) setIsQuestionBankOpen(false);
        else if (isKeyboardHelpOpen) setIsKeyboardHelpOpen(false);
        return;
      }

      // Space: Spin Roulette
      if (e.code === 'Space') {
        e.preventDefault();
        if (
          !isSpinning &&
          !isQuestionModalOpen &&
          !isPrizeModalOpen &&
          !isFinaleModalOpen &&
          !isPanelistsModalOpen &&
          !isQuestionBankOpen &&
          !isKeyboardHelpOpen
        ) {
          handleSpinStart();
        }
        return;
      }

      // P: Toggle Prize Modal
      if (key === 'P' && !isQuestionModalOpen) {
        e.preventDefault();
        setIsPrizeModalOpen((prev) => !prev);
        return;
      }

      // M: Toggle Mute
      if (key === 'M') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // F: Toggle Fullscreen
      if (key === 'F' && !isQuestionModalOpen) {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Modal specific keys when QuestionModal is open
      if (isQuestionModalOpen && currentQuestion) {
        if (key === 'R') {
          e.preventDefault();
          const revealBtn = document.querySelector('button:has(kbd)') as HTMLButtonElement;
          if (revealBtn) revealBtn.click();
        } else if (key === 'G') {
          e.preventDefault();
          handleCorrectAnswer(currentQuestion.id);
        } else if (key === 'B') {
          e.preventDefault();
          soundEngine.playWrongBuzzer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSpinning,
    isQuestionModalOpen,
    isPrizeModalOpen,
    isFinaleModalOpen,
    isPanelistsModalOpen,
    isQuestionBankOpen,
    isKeyboardHelpOpen,
    currentQuestion,
    handleSpinStart,
    handleCorrectAnswer,
    toggleMute,
    toggleFullscreen,
  ]);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Background TV Game Show Ambient Radial Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] bg-rose-600/15 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Persistent Header */}
      <Header
        totalPrizes={totalPrizes}
        remainingPrizes={remainingPrizes}
        onIncrementPrize={handleIncrementPrize}
        onDecrementPrize={handleDecrementPrize}
        onAddExtraPrize={() => handleAddExtraPrize(1)}
        onResetPrizes={handleResetPrizesOnly}
        onOpenPrizeModal={() => setIsPrizeModalOpen(true)}
        onOpenPanelistsModal={() => setIsPanelistsModalOpen(true)}
        onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
        onOpenKeyboardHelp={() => setIsKeyboardHelpOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main 16:9 Stage Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Interactive Roulette (Canvas) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[560px] flex flex-col items-center">
              {/* Roulette Wheel Component */}
              <RouletteCanvas
                activeQuestionIds={activeQuestionIds}
                isSpinning={isSpinning}
                onSpinEnd={handleSpinEnd}
                selectedId={currentQuestion?.id || null}
              />

              {/* Main Spin Button */}
              <div className="w-full max-w-md mt-4 flex flex-col items-center gap-2">
                <button
                  onClick={handleSpinStart}
                  disabled={isSpinning || remainingPrizes <= 0}
                  className={`w-full py-4 sm:py-5 px-8 rounded-3xl font-black text-base sm:text-xl tracking-wider uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 border shadow-2xl ${
                    isSpinning
                      ? 'bg-slate-800 text-slate-400 border-white/10 cursor-not-allowed animate-pulse'
                      : remainingPrizes <= 0
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border-yellow-300 shadow-amber-500/30'
                      : 'bg-gradient-to-r from-sky-500 via-blue-600 to-rose-600 hover:from-sky-400 hover:via-blue-500 hover:to-rose-500 text-white border-white/20 shadow-sky-500/30 animate-pulse-glow'
                  }`}
                >
                  {isSpinning ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>¡Girando Ruleta Conectando Fronteras...!</span>
                    </>
                  ) : remainingPrizes <= 0 ? (
                    <>
                      <Trophy className="w-6 h-6 text-yellow-300 animate-bounce" />
                      <span>¡Premios Agotados! Ver Gran Final</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 fill-white text-white" />
                      <span>¡Girar Ruleta Ahora!</span>
                      <kbd className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-black/30 border border-white/20 hidden sm:inline">
                        Espacio
                      </kbd>
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                  <span>💡 Presiona la barra <strong>Espacio</strong> para girar rápidamente</span>
                  <span>•</span>
                  <span>{activeQuestionIds.length} preguntas activas</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Event Monitor & Stats Dashboard */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Live Progress Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                      Estado del Conversatorio
                    </h2>
                    <p className="text-xs text-slate-400">Auditorio San Francisco 2 • U. CESMAG</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFinaleModalOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-amber-500/30 transition active:scale-95"
                  title="Ver pantalla de cierre"
                >
                  <PartyPopper className="w-3.5 h-3.5" />
                  Finalizar
                </button>
              </div>

              {/* Progress Counters Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-center flex flex-col justify-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Premios Entregados
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-amber-400 mt-0.5">
                    {totalPrizes - remainingPrizes} <span className="text-sm text-slate-500 font-normal">/ {totalPrizes}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
                    {remainingPrizes === 0 ? '¡Meta completada!' : `${remainingPrizes} restantes por sortear`}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-center flex flex-col justify-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Preguntas en Ruleta
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-sky-400 mt-0.5">
                    {activeQuestionIds.length} <span className="text-sm text-slate-500 font-normal">/ 45</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                    {answeredQuestionIds.length} respondidas
                  </div>
                </div>
              </div>

              {/* Active Questions Visual Matrix (Numbers 1 to 45) */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-sky-400" />
                    <span>Matriz de Preguntas (1 a 45):</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Clic en cualquier número para ver
                  </span>
                </div>

                <div className="grid grid-cols-9 sm:grid-cols-9 gap-1.5 p-2.5 rounded-2xl bg-slate-950/80 border border-white/5 max-h-48 overflow-y-auto">
                  {QUESTIONS_DATA.map((q) => {
                    const isAnswered = answeredQuestionIds.includes(q.id);
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleSelectDirectQuestion(q)}
                        disabled={isSpinning}
                        className={`h-8 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center border ${
                          isAnswered
                            ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 opacity-60'
                            : 'bg-slate-800/80 hover:bg-sky-600 hover:text-white border-white/10 text-slate-200 active:scale-95'
                        }`}
                        title={`Pregunta #${q.id}${isAnswered ? ' (Entregada)' : ' (Disponible)'}`}
                      >
                        {isAnswered ? '✓' : q.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Institutional Badges & Shortcuts Pills */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setIsPanelistsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold border border-white/5 transition"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>10 Panelistas & 7 IES</span>
                </button>

                <button
                  onClick={() => setIsQuestionBankOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold border border-white/5 transition"
                >
                  <Grid className="w-3.5 h-3.5 text-sky-400" />
                  <span>Banco de Preguntas</span>
                </button>

                <button
                  onClick={() => setIsKeyboardHelpOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold border border-white/5 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Atajos</span>
                </button>
              </div>
            </div>

            {/* Recent Delivered Prizes Log if any */}
            {history.length > 0 && (
              <div className="p-4 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Último Premio Entregado:</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Premio #{history.length}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                  <div className="font-bold text-amber-200">
                    Pregunta #{history[history.length - 1].questionId}
                  </div>
                  <div className="text-slate-300 truncate text-[11px]">
                    {history[history.length - 1].questionText}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-slate-950/80 py-2.5 px-4 text-center text-xs text-slate-400 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 <strong>Red ORIS IES Nariño</strong> • Universidad CESMAG (Auditorio San Francisco 2)
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Conversatorio "Conectando Fronteras"</span>
            <span>•</span>
            <span className="text-sky-400">Moderación: Sofía Vallejos (U. Mariana)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QuestionModal
        key={currentQuestion ? `q-${currentQuestion.id}` : 'no-question'}
        isOpen={isQuestionModalOpen}
        question={currentQuestion}
        onClose={() => setIsQuestionModalOpen(false)}
        onCorrectAnswer={handleCorrectAnswer}
        onWrongAnswer={handleWrongAnswer}
        remainingPrizes={remainingPrizes}
      />

      <PrizeConfigModal
        key={isPrizeModalOpen ? `prize-open-${totalPrizes}-${remainingPrizes}` : 'prize-closed'}
        isOpen={isPrizeModalOpen}
        onClose={() => setIsPrizeModalOpen(false)}
        totalPrizes={totalPrizes}
        remainingPrizes={remainingPrizes}
        onSaveTotalPrizes={handleSaveTotalPrizes}
      />

      <GrandFinaleModal
        isOpen={isFinaleModalOpen}
        onClose={() => setIsFinaleModalOpen(false)}
        history={history}
        totalDelivered={totalPrizes - remainingPrizes}
        onAddExtraPrizes={handleAddExtraPrize}
        onResetGame={handleResetFullGame}
      />

      <PanelistsModal
        isOpen={isPanelistsModalOpen}
        onClose={() => setIsPanelistsModalOpen(false)}
      />

      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        activeQuestionIds={activeQuestionIds}
        answeredQuestionIds={answeredQuestionIds}
        onSelectQuestion={handleSelectDirectQuestion}
      />

      <KeyboardShortcutsModal
        isOpen={isKeyboardHelpOpen}
        onClose={() => setIsKeyboardHelpOpen(false)}
      />
    </div>
  );
};

export default App;
