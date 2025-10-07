// src/utils/comparisonLogic.js

/**
 * Compares a guess object against the target object and returns color-coded feedback.
 * @param {object} guess - The guessed team data.
 * @param {object} target - The target team data.
 * @returns {string[]} An array of 5 feedback colors: ['GREEN', 'YELLOW', 'GRAY']
 */
export const compareTeams = (guess, target) => {
    const feedback = [];

    // 1. League Logic
    feedback.push(guess.League === target.League ? 'GREEN' : 'GRAY');

    // 2. Conf./League Logic
    if (guess.ConfLeague === target.ConfLeague) {
        feedback.push('GREEN');
    } else if (guess.League === target.League) {
        // If Leagues match but Conferences don't, it's GRAY, not YELLOW (per the rules, this is redundant if League logic is first)
        // The rules state: If Conf/League = Target.Conf/League -> GRAY ?. This looks like an error in the provided rules table.
        // Assuming the rule is: Conf/League only GREEN if exact match, otherwise GRAY.
        feedback.push('GRAY');
    } else {
        feedback.push('GRAY');
    }

    // 3. Division Logic (Complex)
    if (guess.Division === target.Division) {
        feedback.push('GREEN');
    } else if (guess.ConfLeague === target.ConfLeague) {
        // YELLOW: Conf./League matches, but Division doesn't
        feedback.push('YELLOW');
    } else {
        feedback.push('GRAY');
    }

    // 4. Championships Logic
    const guessChamps = guess.Championships;
    const targetChamps = target.Championships;

    if (guessChamps === targetChamps) {
        feedback.push('GREEN');
    } else if (Math.abs(guessChamps - targetChamps) <= 2) {
        // YELLOW: Within +/- 2 (excluding exact match handled above)
        feedback.push('YELLOW');
    } else {
        feedback.push('GRAY');
    }

    // 5. Team Name Logic
    feedback.push(guess.TeamName === target.TeamName ? 'GREEN' : 'GRAY');

    return feedback;
};