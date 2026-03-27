/**
 * Compares a guessed team against the target team.
 * @param {object} guess - Team object from teams.json
 * @param {object} target - Target team object
 * @returns {Array<{status: 'GREEN'|'YELLOW'|'GRAY', direction?: 'UP'|'DOWN'}>}
 *   [0] League, [1] Conference, [2] Division, [3] Championships, [4] Team Name
 */
export function compareTeams(guess, target) {
  const feedback = [];

  // League
  feedback.push({ status: guess.League === target.League ? 'GREEN' : 'GRAY' });

  // Conference
  feedback.push({ status: guess.Conference === target.Conference ? 'GREEN' : 'GRAY' });

  // Division: GREEN exact, YELLOW if same conference but different division, GRAY otherwise
  if (guess.Division === target.Division) {
    feedback.push({ status: 'GREEN' });
  } else if (guess.Conference === target.Conference) {
    feedback.push({ status: 'YELLOW' });
  } else {
    feedback.push({ status: 'GRAY' });
  }

  // Championships: GREEN exact, YELLOW within +/-2, GRAY otherwise; always show direction
  const gChamp = guess.Championships;
  const tChamp = target.Championships;
  if (gChamp === tChamp) {
    feedback.push({ status: 'GREEN' });
  } else if (Math.abs(gChamp - tChamp) <= 2) {
    feedback.push({ status: 'YELLOW', direction: gChamp < tChamp ? 'UP' : 'DOWN' });
  } else {
    feedback.push({ status: 'GRAY', direction: gChamp < tChamp ? 'UP' : 'DOWN' });
  }

  // Team Name
  feedback.push({ status: guess['Team Name'] === target['Team Name'] ? 'GREEN' : 'GRAY' });

  return feedback;
}
