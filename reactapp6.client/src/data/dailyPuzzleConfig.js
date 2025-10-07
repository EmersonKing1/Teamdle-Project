// src/data/dailyPuzzleConfig.js
import teams from './Teamdle_Database.json'; // Make sure the path is correct

export const getDailyTargetTeam = () => {
    // **TODO: Implement future daily rotation logic.**
    // For now, let's pick a known team for initial testing:
    const targetName = "New York Yankees";
    const targetTeam = teams.find(team => team.TeamName === targetName);

    if (!targetTeam) {
        console.error("Target team not found. Check teams.json structure.");
    }
    return targetTeam;
};