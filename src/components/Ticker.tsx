const PHRASES = ["Fully remote", "Flexible hours", "$60–70/hr", "US-licensed RNs"];

/** Marquee band, borrowed from the Grepped and Tracework sites. */
export function Ticker() {
  const items = [...PHRASES, ...PHRASES];
  return (
    <div aria-hidden className="overflow-hidden bg-lime py-4">
      <div className="ticker-track flex w-max items-center gap-8 font-serif text-[30px] font-medium italic leading-none tracking-[-0.01em] md:text-[44px]">
        {[...items, ...items].map((p, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            {p}
            <span className="h-2 w-2 rounded-full bg-ink" />
          </span>
        ))}
      </div>
    </div>
  );
}
