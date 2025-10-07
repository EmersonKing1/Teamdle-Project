import React, { useState, useEffect } from 'react';
import teamData from '../data/Teamdle_Database.json';
import { compareTeams } from '../utils/comparisonLogic';

const leagueLogos = {
    MLB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Major_League_Baseball_logo.svg/345px-Major_League_Baseball_logo.svg.png',
    NBA: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/158px-National_Basketball_Association_logo.svg.png',
    NFL: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/National_Football_League_logo.svg/263px-National_Football_League_logo.svg.png',
    NHL: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/05_NHL_Shield.svg/285px-05_NHL_Shield.svg.png',
    MLS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/MLS_crest_logo_RGB_gradient.svg/330px-MLS_crest_logo_RGB_gradient.svg.png',
};

function getDailyTeam(teams) {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return teams[seed % teams.length];
}

function normalizeTeamName(name) {
    return name.trim().toLowerCase();
}

function findTeamByName(name) {
    return teamData.find(
        t => normalizeTeamName(t["Team Name"]) === normalizeTeamName(name)
    );
}

const howToPlayText = `How to Play Teamdle

Guess the daily team from the 5 major American sports leagues (MLB, NBA, NFL, NHL, MLS).

You have 10 guesses. For each guess, you'll get feedback on these categories:

- League: GREEN if exact, GRAY otherwise.
- Conference: GREEN if exact, GRAY otherwise.
- Division: GREEN if exact, YELLOW if the conference matches but division does not, GRAY otherwise.
- # of championships: GREEN if exact, YELLOW if your guess is within 1 (plus or minus) of the target, GRAY otherwise.

GREEN = exact match
YELLOW = close match (see above)
GRAY = not close

Type a team name and submit your guess!`;

const feedbackLabels = ['League', 'Conference', 'Division', '# of championships'];

const TeamdleGame = () => {
    const [targetTeam, setTargetTeam] = useState(null);
    const [guessInput, setGuessInput] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const maxGuesses = 10;

    useEffect(() => {
        setTargetTeam(getDailyTeam(teamData));
    }, []);

    useEffect(() => {
        if (guessInput.trim() === '') {
            setFilteredTeams([]);
            setShowDropdown(false);
            return;
        }
        const input = normalizeTeamName(guessInput);
        const matches = teamData.filter(t => normalizeTeamName(t["Team Name"]).includes(input));
        setFilteredTeams(matches.slice(0, 8));
        setShowDropdown(matches.length > 0);
    }, [guessInput]);

    const handleGuess = (e) => {
        e.preventDefault();
        if (gameOver || !guessInput.trim()) return;
        const team = findTeamByName(guessInput);
        if (!team) {
            alert('Team not found!');
            return;
        }
        const guessObj = {
            League: team.League,
            ConfLeague: team.Conference,
            Division: team.Division,
            Championships: team.Championships,
            TeamName: team["Team Name"],
        };
        const targetObj = {
            League: targetTeam.League,
            ConfLeague: targetTeam.Conference,
            Division: targetTeam.Division,
            Championships: targetTeam.Championships,
            TeamName: targetTeam["Team Name"],
        };
        const feedback = compareTeams(guessObj, targetObj);
        setGuesses([...guesses, team["Team Name"]]);
        setFeedbacks([...feedbacks, feedback.slice(0, 4)]);
        setGuessInput('');
        setShowDropdown(false);
        if (
            feedback[4] === 'GREEN' ||
            guesses.length + 1 >= maxGuesses
        ) {
            setGameOver(true);
        }
    };

    const handleDropdownClick = (teamName) => {
        setGuessInput(teamName);
        setShowDropdown(false);
    };

    const handlePlayAgain = () => {
        window.location.reload();
    };

    const colors = {
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        card: 'rgba(30,30,34,0.98)',
        input: '#262729',
        border: '#3a3a3c',
        text: '#fff',
        green: '#6aaa64',
        yellow: '#c9b458',
        gray: '#787c7e',
        accent: '#538d4e',
        modalBg: 'rgba(30,40,60,0.45)',
        shadow: '0 4px 24px #222',
        hover: 'rgba(255,255,255,0.08)',
    };

    // Helper to abbreviate values
    function abbreviate(label, value) {
        if (label === 'League') return value;
        if (label === 'Conference') {
            // Use first 3 letters or common abbreviations
            if (value === 'American League') return 'AL';
            if (value === 'National League') return 'NL';
            if (value === 'American Football Conference') return 'AFC';
            if (value === 'National Football Conference') return 'NFC';
            if (value === 'Eastern Conference') return 'East';
            if (value === 'Western Conference') return 'West';
            return value.length > 4 ? value.slice(0, 4) : value;
        }
        if (label === 'Division') {
            // Use first word and first letter of second word, or first 5 letters
            const parts = value.split(' ');
            if (parts.length === 2) return parts[0][0] + parts[1][0];
            return value.length > 5 ? value.slice(0, 5) : value;
        }
        if (label === '# of championships') return String(value);
        return value;
    }

    return (
        <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.background, transition: 'background 1s' }}>
            <div style={{ maxWidth: 520, width: '100%', margin: 'auto', padding: '32px 16px', borderRadius: 18, boxShadow: colors.shadow, background: colors.card, position: 'relative' }}>
                {/* Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginBottom: 24 }}>
                    {Object.entries(leagueLogos).map(([league, url]) => (
                        <img key={league} src={url} alt={league} style={{ height: 36, width: 'auto', filter: 'drop-shadow(0 2px 4px #222)', borderRadius: 6, background: '#fff', padding: 2 }} />
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginBottom: 18 }}>
                    <h1 style={{ margin: 0, fontWeight: 800, letterSpacing: 2, color: colors.text, fontSize: 36, textShadow: '0 2px 8px #222' }}>Teamdle</h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
                    <button
                        onClick={() => setShowHowToPlay(true)}
                        style={{ background: colors.accent, color: colors.text, border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: colors.shadow, transition: 'background 0.2s', letterSpacing: 1 }}
                        onMouseOver={e => e.currentTarget.style.background = colors.green}
                        onMouseOut={e => e.currentTarget.style.background = colors.accent}
                    >
                        How to play
                    </button>
                </div>
                {/* Search/Guess Card */}
                <div style={{ background: colors.input, borderRadius: 14, boxShadow: colors.shadow, padding: 20, marginBottom: 24, transition: 'box-shadow 0.2s' }}>
                    <form onSubmit={handleGuess} style={{ display: 'flex', flexDirection: 'row', gap: 10, position: 'relative', alignItems: 'center', width: '100%' }}>
                        <div style={{ flex: '0 1 100%', position: 'relative', minWidth: 250, maxWidth: 1000 }}>
                            <input
                                type="text"
                                value={guessInput}
                                onChange={e => setGuessInput(e.target.value)}
                                disabled={gameOver}
                                placeholder="Enter team name"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${colors.border}`, fontSize: 16, background: colors.card, color: colors.text, boxShadow: colors.shadow, outline: 'none', transition: 'border 0.2s' }}
                                autoComplete="off"
                            />
                            {showDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '110%',
                                    left: 0,
                                    right: 0,
                                    background: colors.card,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 8,
                                    boxShadow: colors.shadow,
                                    zIndex: 10,
                                    maxHeight: 220,
                                    overflowY: 'auto',
                                }}>
                                    {filteredTeams.map(team => (
                                        <div
                                            key={team["Team Name"]}
                                            onMouseDown={() => handleDropdownClick(team["Team Name"])}
                                            style={{
                                                padding: '10px 14px',
                                                cursor: 'pointer',
                                                color: colors.text,
                                                background: colors.card,
                                                borderBottom: `1px solid ${colors.border}`,
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = colors.hover}
                                            onMouseOut={e => e.currentTarget.style.background = colors.card}
                                        >
                                            {team["Team Name"]}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={gameOver}
                            style={{ flex: '0 0 auto', background: colors.green, color: colors.text, border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: colors.shadow, transition: 'background 0.2s', whiteSpace: 'nowrap', minWidth: 80, marginLeft: '125px' }}
                            onMouseOver={e => e.currentTarget.style.background = colors.accent}
                            onMouseOut={e => e.currentTarget.style.background = colors.green}
                        >
                            Guess
                        </button>
                    </form>
                    <div style={{ marginTop: 20 }}>
                        <h4 style={{ marginBottom: 10, color: colors.text, fontWeight: 700, fontSize: 17 }}>Guesses</h4>
                        {guesses.length === 0 && <div style={{ color: colors.gray, fontSize: 15 }}>No guesses yet.</div>}
                        {guesses.map((g, i) => (
                            <div key={i} style={{ marginBottom: 10, background: colors.card, borderRadius: 8, padding: '8px 10px', boxShadow: colors.shadow, transition: 'background 0.2s', maxWidth: 370, marginLeft: 'auto', marginRight: 'auto' }}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: colors.text, marginBottom: 8 }}>{g}</div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap', justifyContent: 'flex-start', overflowX: 'auto' }}>
                                    {feedbacks[i].map((color, idx) => {
                                        // Get guessed value for this category
                                        const team = findTeamByName(g);
                                        let value;
                                        if (idx === 0) value = team.League;
                                        else if (idx === 1) value = team.Conference;
                                        else if (idx === 2) value = team.Division;
                                        else if (idx === 3) value = team.Championships;
                                        return (
                                            <span
                                                key={idx}
                                                style={{
                                                    display: 'inline-block',
                                                    minWidth: 80,
                                                    maxWidth: 100,
                                                    padding: '8px 0',
                                                    background: color === 'GREEN' ? colors.green : color === 'YELLOW' ? colors.yellow : colors.gray,
                                                    color: color === 'YELLOW' ? '#222' : colors.text,
                                                    textAlign: 'center',
                                                    borderRadius: 6,
                                                    fontWeight: 600,
                                                    fontSize: 13,
                                                    boxShadow: color === 'GREEN' ? colors.shadow : color === 'YELLOW' ? colors.shadow : colors.shadow,
                                                    transition: 'background 0.2s',
                                                    marginBottom: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <span>{feedbackLabels[idx]}</span>
                                                <span style={{ fontWeight: 700, fontSize: 12, marginTop: 2 }}>{abbreviate(feedbackLabels[idx], value)}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    {gameOver && (
                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            {feedbacks[feedbacks.length - 1]?.every(f => f === 'GREEN') ? (
                                <>
                                    <h3 style={{ color: colors.green, fontWeight: 800, fontSize: 22 }}>Congratulations! You guessed the team!</h3>
                                    <div style={{ marginTop: 16 }}>
                                        <img src={leagueLogos[targetTeam.League]} alt={targetTeam.League} style={{ height: 48, width: 'auto', borderRadius: 8, background: '#fff', padding: 4, boxShadow: colors.shadow }} />
                                        <div style={{ color: colors.text, fontWeight: 700, fontSize: 18, marginTop: 8 }}>{targetTeam["Team Name"]}</div>
                                    </div>
                                    <button onClick={handlePlayAgain} style={{ marginTop: 18, background: colors.accent, color: colors.text, border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: colors.shadow, transition: 'background 0.2s' }}>Play Again</button>
                                </>
                            ) : (
                                <>
                                    <h3 style={{ color: colors.yellow, fontWeight: 800, fontSize: 22 }}>Out of guesses!</h3>
                                    <div style={{ marginTop: 16 }}>
                                        <img src={leagueLogos[targetTeam.League]} alt={targetTeam.League} style={{ height: 48, width: 'auto', borderRadius: 8, background: '#fff', padding: 4, boxShadow: colors.shadow }} />
                                        <div style={{ color: colors.text, fontWeight: 700, fontSize: 18, marginTop: 8 }}>The team was: <span style={{ color: colors.green }}>{targetTeam["Team Name"]}</span></div>
                                    </div>
                                    <button onClick={handlePlayAgain} style={{ marginTop: 18, background: colors.accent, color: colors.text, border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: colors.shadow, transition: 'background 0.2s' }}>Play Again</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {/* How to play modal */}
                {showHowToPlay && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: colors.modalBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: colors.card, borderRadius: 14, boxShadow: colors.shadow, padding: 32, maxWidth: 420, width: '90%', position: 'relative', color: colors.text }}>
                            <button
                                onClick={() => setShowHowToPlay(false)}
                                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 28, color: colors.gray, cursor: 'pointer', fontWeight: 700 }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <h3 style={{ marginTop: 0, marginBottom: 16, color: colors.green, fontWeight: 700 }}>How to play</h3>
                            <div style={{ whiteSpace: 'pre-line', color: colors.text, fontSize: 15 }}>{howToPlayText}</div>
                        </div>
                    </div>
                )}
                {/* Footer */}
                <div style={{ textAlign: 'center', fontSize: 13, color: colors.gray, marginTop: 32, fontWeight: 500 }}>
                    <span>Made by emkin | <a href="https://github.com/emkin" target="_blank" rel="noopener noreferrer" style={{ color: colors.green, textDecoration: 'none', fontWeight: 700 }}>GitHub</a></span>
                </div>
                {/* Feedback legend */}
                <div style={{ textAlign: 'center', fontSize: 15, color: colors.text, marginTop: 16, fontWeight: 500 }}>
                    <div>Guess the daily team from the 5 major American sports leagues.</div>
                    <div style={{ marginTop: 6 }}>
                        Feedback:&nbsp;
                        <span style={{ color: colors.green, fontWeight: 700 }}>GREEN</span> = exact,&nbsp;
                        <span style={{ color: colors.yellow, fontWeight: 700 }}>YELLOW</span> = close,&nbsp;
                        <span style={{ color: colors.gray, fontWeight: 700 }}>GRAY</span> = not close.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamdleGame;
