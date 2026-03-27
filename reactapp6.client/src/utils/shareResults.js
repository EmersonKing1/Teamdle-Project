import { getPuzzleNumber } from './dailyTeam';

const STATUS_EMOJI = { GREEN: '🟩', YELLOW: '🟨', GRAY: '⬛' };

export function generateShareText(feedbacks, won, maxGuesses) {
  const puzzleNum = getPuzzleNumber();
  const score = won ? `${feedbacks.length}/${maxGuesses}` : `X/${maxGuesses}`;
  const header = `Teamdle #${puzzleNum} ${score}`;
  const grid = feedbacks
    .map(row => row.map(cell => STATUS_EMOJI[cell.status]).join(''))
    .join('\n');
  return `${header}\n\n${grid}`;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
