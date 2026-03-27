import { useEffect } from 'react';

export default function Toast({ message, isVisible, onDismiss }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl bg-bg-elevated border border-border-medium text-text-primary text-sm font-semibold shadow-xl shadow-black/50"
      style={{ animation: 'toast-in 300ms ease-out' }}
    >
      {message}
    </div>
  );
}
