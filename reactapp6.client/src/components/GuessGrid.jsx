import GuessRow from './GuessRow';

const HEADERS = ['League', 'Conf', 'Division', 'Champs', 'Team'];

export default function GuessGrid({ guesses, feedbacks, latestIndex, maxGuesses }) {
  const emptySlots = maxGuesses - guesses.length;

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex flex-col gap-1.5 sm:gap-2 min-w-fit mx-auto">
        {/* Column headers */}
        <div className="flex gap-1.5 sm:gap-2">
          {HEADERS.map((h) => (
            <div
              key={h}
              className="min-w-[62px] sm:min-w-[72px] md:min-w-[80px] h-8 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Guess rows */}
        {guesses.map((guess, index) => (
          <GuessRow
            key={index}
            guess={guess}
            feedback={feedbacks[index]}
            isNew={index === latestIndex}
          />
        ))}

        {/* Empty placeholder rows */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="flex gap-1.5 sm:gap-2">
            {HEADERS.map((h) => (
              <div
                key={h}
                className="min-w-[62px] sm:min-w-[72px] md:min-w-[80px] h-14 sm:h-16 rounded-lg border border-border-subtle bg-bg-card/30"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
