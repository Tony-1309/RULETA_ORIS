import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';
import { soundEngine } from '../audio/SoundEngine';
import confetti from 'canvas-confetti';
import { Eye, Trophy, XCircle, RotateCcw, Play, Pause, X, Clock, Sparkles } from 'lucide-react';

interface QuestionModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onCorrectAnswer: (questionId: number) => void;
  onWrongAnswer: () => void;
  remainingPrizes: number;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  question,
  onClose,
  onCorrectAnswer,
  onWrongAnswer,
  remainingPrizes,
}) => {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  // 15-second timer state
  const TIMER_INITIAL = 15;
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_INITIAL);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Trigger dramatic suspense audio on open
  useEffect(() => {
    if (isOpen && question) {
      soundEngine.playQuestionDramaticReveal();
    }
  }, [isOpen, question]);

  // Timer tick interval
  useEffect(() => {
    if (!isTimerRunning) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          timerIntervalRef.current = null;
          setIsTimerRunning(false);
          soundEngine.playCountdownTick(true);
          return 0;
        }

        const isUrgent = prev <= 4;
        soundEngine.playCountdownTick(isUrgent);
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning]);

  // Handle Reveal Answer
  const handleRevealAnswer = () => {
    if (!isAnswerRevealed) {
      setIsAnswerRevealed(true);
      soundEngine.playAnswerReveal();
    }
  };

  // Handle Winner (Tecla G)
  const handleWinner = () => {
    if (!question) return;

    soundEngine.playWinnerFanfare();

    // Trigger multi-angle celebration confetti cannon
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f59e0b', '#38bdf8', '#e11d48', '#10b981', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    onCorrectAnswer(question.id);
  };

  // Handle Wrong Buzzer (Tecla B)
  const handleWrong = () => {
    soundEngine.playWrongBuzzer();
    onWrongAnswer();
  };

  if (!isOpen || !question) return null;

  const timerProgress = (timeLeft / TIMER_INITIAL) * 100;
  const isUrgent = timeLeft <= 3 && timeLeft > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-sky-500/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(30,58,138,0.6)] p-6 sm:p-8 flex flex-col gap-6 max-h-[92vh] overflow-y-auto text-white select-none ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 transition-all border border-white/5 active:scale-95"
          title="Cerrar modal (Esc)"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges & Timer Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 border border-sky-400/40">
              <span className="text-base">🌐</span> PREGUNTA OFICIAL #{question.id}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              {question.category}
            </span>
            {question.topicTag && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs text-amber-300/90 bg-amber-950/40 border border-amber-500/20">
                {question.topicTag}
              </span>
            )}
          </div>

          {/* 15-second Interactive TV Timer */}
          <div className="flex items-center gap-2 bg-slate-950/70 border border-white/10 px-3 py-1.5 rounded-2xl shadow-inner">
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-500 animate-ping' : 'text-sky-400'}`} />
            <div className="flex items-center gap-1">
              <span
                className={`font-mono text-lg sm:text-xl font-black tabular-nums transition-colors ${
                  timeLeft === 0
                    ? 'text-rose-500 font-extrabold'
                    : isUrgent
                    ? 'text-rose-400 animate-pulse'
                    : 'text-amber-300'
                }`}
              >
                {timeLeft.toString().padStart(2, '0')}s
              </span>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-1 ml-1 border-l border-white/10 pl-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
                title={isTimerRunning ? 'Pausar Reloj' : 'Iniciar Reloj'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimeLeft(TIMER_INITIAL);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95"
                title="Reiniciar a 15 segundos"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Timer progress line */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden -mt-3">
          <div
            className={`h-full transition-all duration-300 ease-linear rounded-full ${
              isUrgent ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-sky-400 to-blue-600'
            }`}
            style={{ width: `${timerProgress}%` }}
          />
        </div>

        {/* Clean Giant Question for Auditorium Projection (STRICT: ZERO HINTS) */}
        <div className="my-2 p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/60 border border-white/10 shadow-inner flex flex-col justify-center min-h-[140px]">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug sm:leading-tight text-white tracking-normal text-center drop-shadow-md">
            "{question.question}"
          </h2>
        </div>

        {/* Official Answer Section (Hidden until revealed) */}
        <div className="transition-all duration-300">
          {!isAnswerRevealed ? (
            <div className="p-4 rounded-2xl border border-dashed border-sky-400/30 bg-sky-950/20 text-center flex flex-col items-center justify-center gap-2">
              <p className="text-sm sm:text-base text-slate-300 font-medium">
                🔒 La respuesta oficial permanece oculta para el público del auditorio.
              </p>
              <button
                onClick={handleRevealAnswer}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 active:scale-95 transition-all border border-sky-300/30"
              >
                <Eye className="w-4 h-4" />
                👁️ Revelar Respuesta Oficial
                <kbd className="ml-1 px-1.5 py-0.5 rounded text-[11px] font-mono bg-black/30 border border-white/20">
                  R
                </kbd>
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-emerald-950/60 border border-emerald-500/40 text-center shadow-lg animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> RESPUESTA OFICIAL VERIFICADA
              </div>
              <p className="text-lg sm:text-2xl font-black text-emerald-200 leading-relaxed drop-shadow">
                {question.answer}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons for Auditorio Operator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
          {/* Winner button */}
          <button
            onClick={handleWinner}
            className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/20 active:scale-95 transition-all border border-yellow-200"
          >
            <Trophy className="w-5 h-5 text-slate-950" />
            <span>🏆 ¡Respuesta Correcta! Entregar 1 Premio</span>
            <kbd className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-black/20 border border-black/30">
              G
            </kbd>
          </button>

          {/* Wrong buzzer button */}
          <button
            onClick={handleWrong}
            className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-rose-950/80 to-slate-900 border border-rose-600/40 hover:border-rose-500 hover:bg-rose-900/40 text-rose-200 active:scale-95 transition-all"
          >
            <XCircle className="w-5 h-5 text-rose-400" />
            <span>❌ Respuesta Incorrecta / Pasar Turno</span>
            <kbd className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-white/10 border border-white/20">
              B
            </kbd>
          </button>
        </div>

        {/* Footer info pill */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pt-1">
          <span>
            🏆 Premios en juego: <strong className="text-amber-400">{remainingPrizes}</strong> disponibles
          </span>
          <span>Atajos de teclado: [R] Revelar • [G] Ganador • [B] Error • [Esc] Cerrar</span>
        </div>
      </div>
    </div>
  );
};
