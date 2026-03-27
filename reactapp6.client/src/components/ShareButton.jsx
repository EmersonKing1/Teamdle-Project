import { generateShareText, copyToClipboard } from '../utils/shareResults';

export default function ShareButton({ feedbacks, won, maxGuesses, onToast }) {
  async function handleShare() {
    const text = generateShareText(feedbacks, won, maxGuesses);
    const success = await copyToClipboard(text);
    onToast(success ? 'Results copied to clipboard!' : 'Failed to copy');
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-feedback-green text-white font-bold text-sm hover:bg-feedback-green/80 active:scale-95 transition-all cursor-pointer"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      Share Results
    </button>
  );
}
