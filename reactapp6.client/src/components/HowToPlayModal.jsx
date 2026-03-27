export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-bg-card border border-border-medium rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]"
        style={{ animation: 'fade-in-scale 200ms ease-out' }}
        onClick={e => e.stopPropagation()}
      >
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
          How to Play
        </h2>

        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
          <p>
            Guess the mystery sports team in <span className="text-white font-semibold">8 tries</span>.
            Each guess reveals clues about how close you are.
          </p>

          <p className="text-text-muted text-xs">
            Teams from the Big 4: MLB, NBA, NFL, NHL
          </p>

          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Color Clues</h3>

            {/* Green example */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-10 rounded-lg bg-feedback-green flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                NFL
              </div>
              <span><span className="text-feedback-green font-semibold">Green</span> = Exact match</span>
            </div>

            {/* Yellow example */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-10 rounded-lg bg-feedback-yellow flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                East
              </div>
              <span><span className="text-feedback-yellow font-semibold">Yellow</span> = Close (same conf, diff division; champs within 2)</span>
            </div>

            {/* Gray example */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-10 rounded-lg bg-feedback-gray flex items-center justify-center text-xs font-bold text-white">
                NHL
              </div>
              <span><span className="text-text-muted font-semibold">Gray</span> = Not a match</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-semibold text-sm">Categories</h3>
            <ul className="space-y-1 text-xs">
              <li><span className="text-white">League</span> — MLB, NBA, NFL, or NHL</li>
              <li><span className="text-white">Conference</span> — AL/NL, East/West, AFC/NFC</li>
              <li><span className="text-white">Division</span> — Yellow if same conference</li>
              <li><span className="text-white">Championships</span> — ▲/▼ arrows hint higher or lower</li>
              <li><span className="text-white">Team</span> — Green only when you nail it!</li>
            </ul>
          </div>

          <p className="text-xs text-text-muted pt-2 border-t border-border-subtle">
            A new puzzle is available every day at midnight.
          </p>
        </div>
      </div>
    </div>
  );
}
