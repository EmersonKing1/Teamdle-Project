const STATS_KEY = 'teamdle-stats';
const GAME_STATE_PREFIX = 'teamdle-game-';

const DEFAULT_STATS = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
};

export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS, guessDistribution: { ...DEFAULT_STATS.guessDistribution } };
    return JSON.parse(raw);
  } catch {
    return { ...DEFAULT_STATS, guessDistribution: { ...DEFAULT_STATS.guessDistribution } };
  }
}

export function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordWin(guessNumber) {
  const stats = loadStats();
  stats.gamesPlayed += 1;
  stats.wins += 1;
  stats.currentStreak += 1;
  stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  stats.guessDistribution[guessNumber] = (stats.guessDistribution[guessNumber] || 0) + 1;
  saveStats(stats);
  return stats;
}

export function recordLoss() {
  const stats = loadStats();
  stats.gamesPlayed += 1;
  stats.losses += 1;
  stats.currentStreak = 0;
  saveStats(stats);
  return stats;
}

export function loadGameState(dateKey) {
  try {
    const raw = localStorage.getItem(GAME_STATE_PREFIX + dateKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGameState(dateKey, state) {
  localStorage.setItem(GAME_STATE_PREFIX + dateKey, JSON.stringify(state));
}
