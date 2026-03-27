import { useState, useEffect, useCallback, useMemo } from 'react';
import teams from '../data/teams.json';
import { getDailyTeam, getTodayKey } from '../utils/dailyTeam';
import { compareTeams } from '../utils/comparisonLogic';
import { loadGameState, saveGameState, recordWin, recordLoss } from '../utils/storage';

const MAX_GUESSES = 8;

export function useTeamdleGame() {
  const todayKey = getTodayKey();
  const targetTeam = useMemo(() => getDailyTeam(teams), []);

  const [guesses, setGuesses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [latestIndex, setLatestIndex] = useState(-1);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadGameState(todayKey);
    if (saved) {
      setGuesses(saved.guesses);
      setFeedbacks(saved.feedbacks);
      setGameOver(saved.gameOver);
      setWon(saved.won);
      setLatestIndex(-1);
    }
  }, [todayKey]);

  // Save state on every change
  useEffect(() => {
    if (guesses.length > 0) {
      saveGameState(todayKey, { guesses, feedbacks, gameOver, won });
    }
  }, [guesses, feedbacks, gameOver, won, todayKey]);

  const submitGuess = useCallback((team) => {
    if (gameOver) return null;

    const feedback = compareTeams(team, targetTeam);
    const newGuesses = [...guesses, team];
    const newFeedbacks = [...feedbacks, feedback];

    setGuesses(newGuesses);
    setFeedbacks(newFeedbacks);
    setLatestIndex(newGuesses.length - 1);

    const isWin = feedback[4].status === 'GREEN';
    const isMaxGuesses = newGuesses.length >= MAX_GUESSES;

    if (isWin) {
      setWon(true);
      setGameOver(true);
      recordWin(newGuesses.length);
    } else if (isMaxGuesses) {
      setGameOver(true);
      recordLoss();
    }

    return { feedback, isWin, isGameOver: isWin || isMaxGuesses };
  }, [gameOver, guesses, feedbacks, targetTeam]);

  const guessedNames = useMemo(
    () => new Set(guesses.map(g => g['Team Name'])),
    [guesses]
  );

  const availableTeams = useMemo(
    () => teams.filter(t => !guessedNames.has(t['Team Name'])),
    [guessedNames]
  );

  return {
    targetTeam,
    guesses,
    feedbacks,
    gameOver,
    won,
    submitGuess,
    availableTeams,
    latestIndex,
    maxGuesses: MAX_GUESSES,
  };
}
