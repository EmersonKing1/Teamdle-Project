import { useState, useEffect, useCallback } from 'react';
import { useTeamdleGame } from '../hooks/useTeamdleGame';
import Header from './Header';
import SearchInput from './SearchInput';
import GuessGrid from './GuessGrid';
import HowToPlayModal from './HowToPlayModal';
import StatsModal from './StatsModal';
import Toast from './Toast';

export default function TeamdleGame() {
  const {
    targetTeam,
    guesses,
    feedbacks,
    gameOver,
    won,
    submitGuess,
    availableTeams,
    latestIndex,
    maxGuesses,
  } = useTeamdleGame();

  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Show stats modal automatically after game ends (delayed for flip animation)
  useEffect(() => {
    if (gameOver && latestIndex >= 0) {
      const timer = setTimeout(() => setShowStats(true), 1600);
      return () => clearTimeout(timer);
    }
  }, [gameOver, latestIndex]);

  const handleToast = useCallback((msg) => {
    setToastMessage(msg);
    setToastVisible(true);
  }, []);

  const handleToastDismiss = useCallback(() => {
    setToastVisible(false);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center">
      <div className="w-full max-w-xl px-3 sm:px-4 flex flex-col items-center">
        <Header
          onHelpClick={() => setShowHelp(true)}
          onStatsClick={() => setShowStats(true)}
        />

        {/* Guess grid */}
        <div className="mt-4 mb-4 w-full flex justify-center">
          <GuessGrid
            guesses={guesses}
            feedbacks={feedbacks}
            latestIndex={latestIndex}
            maxGuesses={maxGuesses}
          />
        </div>

        {/* Game over message */}
        {gameOver && (
          <div className="mb-4 text-center">
            {won ? (
              <p className="text-feedback-green font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                You got it!
              </p>
            ) : (
              <div>
                <p className="text-feedback-yellow font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  Better luck tomorrow!
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  The answer was <span className="text-white font-semibold">{targetTeam['Team Name']}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search input */}
        <div className="w-full mb-6">
          <SearchInput
            availableTeams={availableTeams}
            onSubmit={submitGuess}
            disabled={gameOver}
          />
        </div>

        {/* Guess counter */}
        {!gameOver && (
          <p className="text-xs text-text-muted">
            {guesses.length} / {maxGuesses} guesses
          </p>
        )}
      </div>

      {/* Modals */}
      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        showShare={gameOver}
        feedbacks={feedbacks}
        won={won}
        maxGuesses={maxGuesses}
        onToast={handleToast}
      />

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onDismiss={handleToastDismiss}
      />
    </div>
  );
}
