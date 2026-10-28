import React, { useRef, useEffect, useCallback, useState } from 'react';
import { soundEngine } from '../audio/SoundEngine';

interface RouletteCanvasProps {
  activeQuestionIds: number[];
  isSpinning: boolean;
  onSpinEnd: (selectedQuestionId: number) => void;
  selectedId: number | null;
}

// TV Game Show color palette for vibrant slices
const SLICE_COLORS = [
  '#1e40af', // Deep Blue
  '#0284c7', // Cyan
  '#0d9488', // Teal
  '#059669', // Emerald
  '#ca8a04', // Amber/Gold
  '#ea580c', // Orange
  '#dc2626', // Crimson Red
  '#9333ea', // Purple
  '#c026d3', // Fuchsia
  '#2563eb', // Royal Blue
  '#0891b2', // Sky Cyan
  '#16a34a', // Green
  '#d97706', // Gold
  '#e11d48', // Rose
  '#7c3aed', // Violet
];

export const RouletteCanvas: React.FC<RouletteCanvasProps> = ({
  activeQuestionIds,
  isSpinning,
  onSpinEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Wheel state refs
  const currentAngleRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const spinStartTimeRef = useRef<number>(0);
  const spinDurationRef = useRef<number>(4500); // 4.5 seconds easeOutCubic
  const startAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const targetQuestionIdRef = useRef<number | null>(null);
  const lastPegIndexRef = useRef<number>(-1);
  const flapperDeflectionRef = useRef<number>(0);

  // Keep latest activeQuestionIds, onSpinEnd and ledPhase in refs for stable animation loop
  const activeQuestionIdsRef = useRef<number[]>(activeQuestionIds);
  const onSpinEndRef = useRef(onSpinEnd);
  const [ledPhase, setLedPhase] = useState<number>(0);
  const ledPhaseRef = useRef<number>(ledPhase);

  useEffect(() => {
    activeQuestionIdsRef.current = activeQuestionIds;
    onSpinEndRef.current = onSpinEnd;
    ledPhaseRef.current = ledPhase;
  }, [activeQuestionIds, onSpinEnd, ledPhase]);

  // Top Pointer Flapper Drawing
  const drawTopPointer = (
    ctx: CanvasRenderingContext2D,
    center: number,
    radius: number,
    rimWidth: number,
    size: number
  ) => {
    const pointerTopY = center - radius - size * 0.02;
    const pointerTipY = center - radius + rimWidth * 1.5;
    const pointerHalfW = size * 0.032;
    const deflection = flapperDeflectionRef.current;

    ctx.save();
    ctx.translate(center, pointerTopY);
    ctx.rotate(deflection); // Dynamic spring bounce from passing pegs

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    // Pointer Body (Crimson / Ruby TV Show Style with Gold Border)
    const pGrad = ctx.createLinearGradient(-pointerHalfW, 0, pointerHalfW, pointerTipY - pointerTopY);
    pGrad.addColorStop(0, '#f43f5e');
    pGrad.addColorStop(0.5, '#e11d48');
    pGrad.addColorStop(1, '#9f1239');

    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.moveTo(0, pointerTipY - pointerTopY); // Sharp tip
    ctx.lineTo(pointerHalfW, 0);
    ctx.arc(0, 0, pointerHalfW, 0, Math.PI, true);
    ctx.lineTo(-pointerHalfW, 0);
    ctx.closePath();
    ctx.fill();

    // Gold outline
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = Math.max(2, size * 0.004);
    ctx.stroke();

    // Center pivot jewel
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, pointerHalfW * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  };

  // Draw the full wheel
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center * 0.94;
    const rimWidth = size * 0.045;
    const innerRadius = radius - rimWidth;

    ctx.clearRect(0, 0, size, size);

    // 1. Draw outer glowing ambient halo
    const haloGrad = ctx.createRadialGradient(center, center, innerRadius, center, center, size / 2);
    haloGrad.addColorStop(0, 'rgba(30, 58, 138, 0.4)');
    haloGrad.addColorStop(0.7, 'rgba(225, 29, 72, 0.15)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(center, center, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Metallic Rim with LED Light Housing
    const rimGrad = ctx.createRadialGradient(center, center, innerRadius, center, center, radius);
    rimGrad.addColorStop(0, '#1e293b');
    rimGrad.addColorStop(0.4, '#0f172a');
    rimGrad.addColorStop(0.8, '#334155');
    rimGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.arc(center, center, innerRadius, 0, Math.PI * 2, true);
    ctx.fill();

    // Subtle 1px gold border lines on the rim
    ctx.strokeStyle = '#f59e0b88';
    ctx.lineWidth = Math.max(1.5, size * 0.003);
    ctx.beginPath();
    ctx.arc(center, center, radius - 1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf888';
    ctx.beginPath();
    ctx.arc(center, center, innerRadius + 1, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Perimeter LED Lights
    const numLeds = 32;
    const ledRadius = (radius + innerRadius) / 2;
    const ledBulbRadius = size * 0.012;
    const curLedPhase = ledPhaseRef.current;

    for (let i = 0; i < numLeds; i++) {
      const ledAngle = (i * 2 * Math.PI) / numLeds;
      const lx = center + Math.cos(ledAngle) * ledRadius;
      const ly = center + Math.sin(ledAngle) * ledRadius;

      const isLit = (i + curLedPhase) % 3 === 0 || (isSpinning && (i + curLedPhase) % 2 === 0);
      const isGold = i % 2 === 0;

      if (isLit) {
        ctx.shadowColor = isGold ? '#fbbf24' : '#38bdf8';
        ctx.shadowBlur = size * 0.02;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = isLit
        ? isGold
          ? '#fef08a'
          : '#bae6fd'
        : '#1e293b';

      ctx.beginPath();
      ctx.arc(lx, ly, ledBulbRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isLit ? (isGold ? '#f59e0b' : '#0284c7') : '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // 4. Rotating Slices
    const questions = activeQuestionIdsRef.current;
    const count = questions.length;
    if (count > 0) {
      const sliceAngle = (Math.PI * 2) / count;
      const currentAngle = currentAngleRef.current;

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(currentAngle);

      for (let i = 0; i < count; i++) {
        const qId = questions[i];
        const startA = i * sliceAngle;
        const endA = startA + sliceAngle;
        const midA = startA + sliceAngle / 2;

        // Slice background
        const color = SLICE_COLORS[i % SLICE_COLORS.length];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, innerRadius, startA, endA);
        ctx.closePath();
        ctx.fill();

        // Subtle slice shine
        const sliceGrad = ctx.createRadialGradient(0, 0, innerRadius * 0.3, 0, 0, innerRadius);
        sliceGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
        sliceGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        sliceGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = sliceGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, innerRadius, startA, endA);
        ctx.closePath();
        ctx.fill();

        // Border between slices
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = Math.max(1, size * 0.002);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(startA) * innerRadius, Math.sin(startA) * innerRadius);
        ctx.stroke();

        // Outer Peg (Pin) on rim
        const pinRadius = size * 0.007;
        const pinX = Math.cos(startA) * (innerRadius - pinRadius * 1.5);
        const pinY = Math.sin(startA) * (innerRadius - pinRadius * 1.5);

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(pinX, pinY, pinRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Question Number text
        ctx.save();
        ctx.rotate(midA);
        const textDist = innerRadius * 0.72;
        ctx.translate(textDist, 0);
        ctx.rotate(Math.PI / 2);

        const fontSize = Math.max(11, Math.min(size * 0.042, (innerRadius * 2 * Math.PI) / count * 0.55));
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${qId}`, 0, 0);

        ctx.restore();
      }

      ctx.restore();
    }

    // 5. Center Hub / Emblem (ORIS CESMAG 2026 Gold Medallion)
    const hubRadius = innerRadius * 0.28;
    const hubGrad = ctx.createRadialGradient(center, center, 0, center, center, hubRadius);
    hubGrad.addColorStop(0, '#fef08a');
    hubGrad.addColorStop(0.3, '#f59e0b');
    hubGrad.addColorStop(0.7, '#b45309');
    hubGrad.addColorStop(0.95, '#1e293b');
    hubGrad.addColorStop(1, '#090d16');

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = size * 0.03;
    ctx.fillStyle = hubGrad;
    ctx.beginPath();
    ctx.arc(center, center, hubRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = Math.max(2, size * 0.005);
    ctx.beginPath();
    ctx.arc(center, center, hubRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = `900 ${Math.max(12, hubRadius * 0.32)}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ORIS', center, center - hubRadius * 0.22);

    ctx.font = `700 ${Math.max(10, hubRadius * 0.22)}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#78350f';
    ctx.fillText('2026', center, center + hubRadius * 0.08);

    ctx.font = `800 ${Math.max(8, hubRadius * 0.16)}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('U. CESMAG', center, center + hubRadius * 0.35);

    ctx.restore();

    // 6. Top Pointer with Spring Flapper
    drawTopPointer(ctx, center, radius, rimWidth, size);
  }, [isSpinning]);

  // Resize canvas according to container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const rect = container.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height > 0 ? rect.height : 600);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    drawWheel();
  }, [drawWheel]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // LED Chaser Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLedPhase((prev) => (prev + 1) % 24);
    }, isSpinning ? 50 : 250);
    return () => clearInterval(interval);
  }, [isSpinning]);

  // Redraw when ledPhase updates
  useEffect(() => {
    if (!isSpinning) {
      drawWheel();
    }
  }, [ledPhase, isSpinning, drawWheel]);

  // Spin physics animation
  useEffect(() => {
    if (!isSpinning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      drawWheel();
      return;
    }

    const questions = activeQuestionIdsRef.current;
    if (questions.length === 0) return;

    const randomIndex = Math.floor(Math.random() * questions.length);
    const targetQId = questions[randomIndex];
    targetQuestionIdRef.current = targetQId;

    const count = questions.length;
    const sliceAngle = (Math.PI * 2) / count;

    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const currentA = currentAngleRef.current % (Math.PI * 2);
    startAngleRef.current = currentAngleRef.current;

    const desiredTargetWheelAngle = (1.5 * Math.PI) - ((randomIndex + 0.5) * sliceAngle);
    let delta = desiredTargetWheelAngle - (currentA % (Math.PI * 2));
    while (delta < 0) {
      delta += Math.PI * 2;
    }
    const finalAngle = currentAngleRef.current + fullSpins * Math.PI * 2 + delta;
    targetAngleRef.current = finalAngle;

    spinStartTimeRef.current = performance.now();
    lastPegIndexRef.current = -1;

    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

    const animate = (time: number) => {
      const elapsed = time - spinStartTimeRef.current;
      const progress = Math.min(elapsed / spinDurationRef.current, 1);
      const eased = easeOutCubic(progress);

      const newAngle = startAngleRef.current + (targetAngleRef.current - startAngleRef.current) * eased;
      currentAngleRef.current = newAngle;

      const relativePointerAngle = (1.5 * Math.PI - (newAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const currentPeg = Math.floor(relativePointerAngle / sliceAngle);

      if (currentPeg !== lastPegIndexRef.current) {
        lastPegIndexRef.current = currentPeg;
        soundEngine.playWheelTick();
        flapperDeflectionRef.current = 0.28 * (1 - progress * 0.7);
      } else {
        flapperDeflectionRef.current *= 0.82;
      }

      drawWheel();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        flapperDeflectionRef.current = 0;
        drawWheel();
        if (targetQuestionIdRef.current !== null) {
          onSpinEndRef.current(targetQuestionIdRef.current);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, drawWheel]);

  // Initial and question change draw
  useEffect(() => {
    drawWheel();
  }, [activeQuestionIds, drawWheel]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[580px] aspect-square mx-auto flex items-center justify-center p-2 select-none"
    >
      <canvas
        ref={canvasRef}
        className="block drop-shadow-[0_20px_50px_rgba(30,58,138,0.45)] transition-transform duration-200"
      />
    </div>
  );
};
