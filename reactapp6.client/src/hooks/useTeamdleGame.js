// src/hooks/useTeamdleGame.js
import { useState } from 'react';
import { getDailyTargetTeam } from '../data/dailyPuzzleConfig';
import { compareTeams } from '../utils/comparisonLogic';

export const useTeamdleGame = () => {
    const [targetTeam, setTargetTeam] = useState(getDailyTargetTeam());
    const [guesses, setGuesses] = useState([]); // Array of { team: {}, feedback: [] }
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWin, setIsWin] = useState(false);

    const submitGuess = (guessTeam) => {
        if (isGameOver) return;

        const feedback = compareTeams(guessTeam, targetTeam);
        const newGuess = { team: guessTeam, feedback: feedback };

        setGuesses(prev => [...prev, newGuess]);

        // Check for a win (GREEN in the last feedback element: Team Name)
        if (feedback[4] === 'GREEN') {
            setIsWin(true);
            setIsGameOver(true);
        } else if (guesses.length >= 5) { // Assuming 6 total guesses (0-5)
            setIsGameOver(true);
        }
        return newGuess;
    };

    return { targetTeam, guesses, isGameOver, isWin, submitGuess };
};