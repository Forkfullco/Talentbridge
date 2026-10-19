import { TEAM } from "../model";

export function TeamSlider({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  const fill = (100 * value) / (TEAM.length - 1);
  return (
    <div className="rounded-2xl border border-qz-line bg-qz-card px-6 pb-8 pt-8 md:px-12 md:pb-10 md:pt-10">
      <p className="text-center font-serif text-[48px] md:text-[64px] font-medium leading-none tracking-[-0.02em]">
        {TEAM[value].label}
        <span className="ml-3 font-sans text-[18px] text-qz-muted">people</span>
      </p>
      <div className="mt-10">
        <input
          type="range"
          min={0}
          max={TEAM.length - 1}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          aria-label="Number of people"
          aria-valuetext={`${TEAM[value].label} people`}
          className="qz-range"
          style={{ ["--fill" as string]: `${fill}%` }}
        />
        <div className="mt-4 flex justify-between">
          {TEAM.map((t, j) => (
            <span key={j} className={`flex w-0 justify-center font-mono text-[13px] ${j === value ? "text-qz-text" : "text-qz-muted"}`}>
              {t.tick}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
