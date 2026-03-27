import FeedbackCell from './FeedbackCell';

const COLUMNS = [
  { key: 'League', label: 'League' },
  { key: 'Conference', label: 'Conference' },
  { key: 'Division', label: 'Division' },
  { key: 'Championships', label: 'Championships' },
  { key: 'Team Name', label: 'Team Name' },
];

function abbreviate(value, key) {
  if (key === 'Conference') {
    if (typeof value === 'string') {
      const abbrevMap = {
        'National League (NL)': 'NL',
        'American League (AL)': 'AL',
        'Eastern Conference': 'East',
        'Western Conference': 'West',
        'National Football Conf': 'NFC',
        'American Football Conf': 'AFC',
      };
      return abbrevMap[value] || value;
    }
  }
  if (key === 'Team Name') {
    // Show last word (mascot) for brevity on small screens
    const parts = value.split(' ');
    return parts.length > 2 ? parts.slice(-1)[0] : value;
  }
  if (key === 'Championships') {
    return String(value);
  }
  return value;
}

export default function GuessRow({ guess, feedback, isNew }) {
  return (
    <div className="flex gap-1.5 sm:gap-2">
      {COLUMNS.map((col, colIndex) => (
        <FeedbackCell
          key={col.key}
          value={abbreviate(guess[col.key], col.key)}
          feedback={feedback[colIndex]}
          delay={colIndex * 150}
          animate={isNew}
        />
      ))}
    </div>
  );
}
