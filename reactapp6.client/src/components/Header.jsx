import { getPuzzleNumber } from '../utils/dailyTeam';

export default function Header({ onHelpClick, onStatsClick }) {
  const puzzleNum = getPuzzleNumber();

  return (
    <header className="w-full flex items-center justify-between py-4 px-2">
      {/* Help button */}
      <button
        onClick={onHelpClick}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-border-subtle hover:border-border-medium hover:bg-white/5 transition-all cursor-pointer"
        aria-label="How to play"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {/* Title */}
      <div className="text-center">
        <h1
          className="text-3xl sm:text-4xl tracking-wider"
          style={{
            fontFamily: 'var(--font-heading)',
            textShadow: '0 0 24px rgba(59, 130, 246, 0.4), 0 0 48px rgba(59, 130, 246, 0.15)',
          }}
        >
          TEAMDLE
        </h1>
        <p className="text-[10px] sm:text-xs text-text-muted tracking-widest mt-0.5">
          PUZZLE #{puzzleNum}
        </p>
      </div>

      {/* Stats button */}
      <button
        onClick={onStatsClick}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-border-subtle hover:border-border-medium hover:bg-white/5 transition-all cursor-pointer"
        aria-label="Statistics"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </button>
    </header>
  );
}
