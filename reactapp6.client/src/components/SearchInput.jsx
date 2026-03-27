import { useState, useRef, useEffect } from 'react';

export default function SearchInput({ availableTeams, onSubmit, disabled }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) {
      const filtered = availableTeams
        .filter(t => t['Team Name'].toLowerCase().includes(val.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
      setHighlightIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }

  function selectTeam(team) {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    onSubmit(team);
  }

  function handleKeyDown(e) {
    if (!isOpen) {
      if (e.key === 'Enter') {
        const exact = availableTeams.find(
          t => t['Team Name'].toLowerCase() === query.toLowerCase()
        );
        if (exact) selectTeam(exact);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        selectTeam(suggestions[highlightIndex]);
      } else if (suggestions.length === 1) {
        selectTeam(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  const leagueBadgeColor = {
    MLB: 'bg-red-500/20 text-red-400',
    NBA: 'bg-orange-500/20 text-orange-400',
    NFL: 'bg-blue-500/20 text-blue-400',
    NHL: 'bg-cyan-500/20 text-cyan-400',
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          disabled={disabled}
          placeholder={disabled ? 'Game over!' : 'Search for a team...'}
          className="flex-1 h-12 px-4 rounded-xl bg-bg-input border border-border-medium text-text-primary placeholder:text-text-muted text-sm font-medium outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          autoComplete="off"
        />
        <button
          onClick={() => {
            if (highlightIndex >= 0 && suggestions[highlightIndex]) {
              selectTeam(suggestions[highlightIndex]);
            } else if (suggestions.length === 1) {
              selectTeam(suggestions[0]);
            } else {
              const exact = availableTeams.find(
                t => t['Team Name'].toLowerCase() === query.toLowerCase()
              );
              if (exact) selectTeam(exact);
            }
          }}
          disabled={disabled || query.trim().length === 0}
          className="h-12 px-5 rounded-xl bg-accent-blue text-white font-semibold text-sm hover:bg-accent-blue/80 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Guess
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border-medium bg-bg-elevated shadow-xl shadow-black/40 overflow-hidden z-50"
          style={{ animation: 'slide-down 150ms ease-out' }}
        >
          {suggestions.map((team, i) => (
            <button
              key={team['Team Name']}
              onClick={() => selectTeam(team)}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                i === highlightIndex
                  ? 'bg-accent-blue/15 text-white'
                  : 'text-text-primary hover:bg-white/5'
              }`}
            >
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${leagueBadgeColor[team.League] || ''}`}>
                {team.League}
              </span>
              <span className="font-medium">{team['Team Name']}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
