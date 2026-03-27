const EPOCH = new Date(2024, 0, 1);

export function getPuzzleNumber() {
  const today = new Date();
  const todayNorm = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const epochNorm = new Date(EPOCH.getFullYear(), EPOCH.getMonth(), EPOCH.getDate());
  return Math.floor((todayNorm - epochNorm) / (1000 * 60 * 60 * 24));
}

export function getDailyTeam(teams) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = ((seed * 2654435761) >>> 0) % teams.length;
  return teams[index];
}

export function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}
