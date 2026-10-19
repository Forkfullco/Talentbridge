import { SOURCES } from "../model";

export function SystemCards({ selected, onToggle }: { selected: string[]; onToggle: (k: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {SOURCES.map((s) => {
        const on = selected.includes(s.key);
        return (
          <button
            key={s.key}
            type="button"
            role="checkbox"
            aria-checked={on}
            onClick={() => onToggle(s.key)}
            className={`flex h-full flex-col items-start gap-3 rounded-2xl border px-5 py-4 text-left transition-[background-color,border-color] duration-[120ms] ${
              on ? "border-qz-acc bg-qz-acc-bg" : "border-qz-line bg-qz-card hover:border-qz-line-2 hover:bg-qz-card-2"
            }`}
          >
            <i className={`grid h-[18px] w-[18px] place-items-center rounded-[5px] border-[1.5px] ${on ? "border-qz-acc bg-qz-acc" : "border-qz-line-2"}`}>
              {on && (
                <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
                  <path d="m2.5 6.2 2.3 2.3 4.7-5" fill="none" stroke="var(--color-qz-bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </i>
            <span>
              <b className="block text-[16px] font-medium leading-snug">{s.label}</b>
              <small className="mt-1 block text-[13px] text-qz-muted">{s.eg}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
