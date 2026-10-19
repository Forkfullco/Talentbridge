import type { Option } from "../model";

export function RadioCards({
  options,
  value,
  onPick,
  cols,
}: {
  options: Option[];
  value?: string;
  onPick: (v: string) => void;
  cols?: boolean;
}) {
  return (
    <div role="radiogroup" className={`grid ${cols ? "grid-cols-1 gap-3 sm:grid-cols-2" : "gap-3"}`}>
      {options.map((o) => {
        const label = Array.isArray(o) ? o[0] : o;
        const hint = Array.isArray(o) ? o[1] : "";
        const on = value === label;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onPick(label)}
            className={`flex w-full items-center justify-between gap-5 rounded-2xl border text-left transition-[background-color,border-color] duration-[120ms] ${
              cols ? "px-5 py-4" : "px-6 py-5"
            } ${on ? "border-qz-acc bg-qz-acc-bg" : "border-qz-line bg-qz-card hover:border-qz-line-2 hover:bg-qz-card-2"}`}
          >
            <span>
              <b className={`block font-medium ${cols ? "text-[16px]" : "text-[18px]"}`}>{label}</b>
              {hint && <small className="mt-1 block text-[15px] text-qz-muted">{hint}</small>}
            </span>
            <i className={`grid h-5 w-5 flex-none place-items-center rounded-full border-[1.5px] ${on ? "border-qz-acc" : "border-qz-line-2"}`}>
              {on && <span className="h-2.5 w-2.5 rounded-full bg-qz-acc" />}
            </i>
          </button>
        );
      })}
    </div>
  );
}
