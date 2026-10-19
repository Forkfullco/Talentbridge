export function Chips({
  options,
  isOn,
  onToggle,
  big,
}: {
  options: string[];
  isOn: (o: string) => boolean;
  onToggle: (o: string) => void;
  big?: boolean;
}) {
  return (
    <div className={big ? "grid grid-cols-2 gap-3 md:grid-cols-4" : "flex flex-wrap gap-2"}>
      {options.map((o) => {
        const on = isOn(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o)}
            className={`whitespace-nowrap rounded-full border font-medium transition-[border-color,background-color,color] duration-[120ms] ${
              big ? "px-4 py-5 text-[17px]" : "px-4 py-2.5 text-[15px]"
            } ${on ? "border-qz-acc bg-qz-acc text-qz-bg" : "border-qz-line bg-qz-card-2 text-qz-soft hover:border-qz-line-2"}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
