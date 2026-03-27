import { useState, useEffect } from 'react';

const STATUS_COLORS = {
  GREEN: {
    bg: 'bg-feedback-green',
    glow: '0 0 14px rgba(34, 197, 94, 0.5)',
  },
  YELLOW: {
    bg: 'bg-feedback-yellow',
    glow: '0 0 14px rgba(234, 179, 8, 0.4)',
  },
  GRAY: {
    bg: 'bg-feedback-gray',
    glow: 'none',
  },
};

export default function FeedbackCell({ value, feedback, delay = 0, animate = false }) {
  const [revealed, setRevealed] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    const timer = setTimeout(() => setRevealed(true), delay + 250);
    return () => clearTimeout(timer);
  }, [animate, delay]);

  const status = feedback?.status || 'GRAY';
  const direction = feedback?.direction;
  const colorConfig = STATUS_COLORS[status];

  const directionArrow = direction === 'UP' ? ' ▲' : direction === 'DOWN' ? ' ▼' : '';

  return (
    <div
      className="min-w-[62px] sm:min-w-[72px] md:min-w-[80px] h-14 sm:h-16 flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold text-white select-none"
      style={{
        perspective: '600px',
      }}
    >
      <div
        className={`w-full h-full flex items-center justify-center rounded-lg border transition-colors duration-200 ${
          revealed ? `${colorConfig.bg} border-transparent` : 'bg-bg-card border-border-subtle'
        }`}
        style={{
          animation: animate ? `flip-in 500ms ease-in-out ${delay}ms both` : 'none',
          boxShadow: revealed ? colorConfig.glow : 'none',
        }}
      >
        {revealed ? (
          <span className="px-1 text-center leading-tight">
            {value}{directionArrow}
          </span>
        ) : (
          <span className="text-text-muted">?</span>
        )}
      </div>
    </div>
  );
}
