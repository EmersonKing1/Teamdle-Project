import { useState, useEffect } from 'react';
import { loadStats } from '../utils/storage';
import ShareButton from './ShareButton';

function getTimeUntilMidnight() {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = tomorrow - now;
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function StatsModal({ isOpen, onClose, showShare, feedbacks, won, maxGuesses, onToast }) {
  const [stats, setStats] = useState(loadStats());
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());

  useEffect(() => {
    if (isOpen) setStats(loadStats());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setCountdown(getTimeUntilMidnight()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const winPct = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const maxDist = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm bg-bg-card border border-border-medium rounded-2xl p-6 shadow-2xl"
        style={{ animation: 'fade-in-scale 200ms ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-text-secondary hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-center mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
          Statistics
        </h2>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { val: stats.gamesPlayed, label: 'Played' },
            { val: winPct, label: 'Win %' },
            { val: stats.currentStreak, label: 'Current' },
            { val: stats.maxStreak, label: 'Max' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold">{item.val}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Guess distribution */}
        <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">
          Guess Distribution
        </h3>
        <div className="space-y-1.5 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            const count = stats.guessDistribution[num] || 0;
            const width = count > 0 ? Math.max((count / maxDist) * 100, 8) : 8;
            const isWinningGuess = showShare && won && feedbacks?.length === num;
            return (
              <div key={num} className="flex items-center gap-2">
                <span className="w-3 text-xs text-text-secondary text-right">{num}</span>
                <div
                  className={`h-6 rounded flex items-center justify-end px-2 text-xs font-bold transition-all ${
                    isWinningGuess ? 'bg-feedback-green' : 'bg-feedback-gray'
                  }`}
                  style={{ width: `${width}%`, minWidth: '24px' }}
                >
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Share section / Countdown */}
        <div className="flex flex-col items-center gap-3 pt-3 border-t border-border-subtle">
          {showShare && (
            <ShareButton
              feedbacks={feedbacks}
              won={won}
              maxGuesses={maxGuesses}
              onToast={onToast}
            />
          )}
          <div className="text-center">
            <div className="text-[10px] text-text-muted uppercase tracking-wider">Next Teamdle</div>
            <div className="text-lg font-bold font-mono tracking-widest">{countdown}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
