import { useMemo, useRef, type PointerEvent } from "react";

/**
 * Years of company activity as thin bars. Bars under the pointer jump and
 * turn lime, then settle back.
 */
export function ActivityBars() {
  const ref = useRef<HTMLDivElement>(null);
  const bars = useMemo(build, []);

  const onMove = (e: PointerEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const i = Math.floor(((e.clientX - box.left) / box.width) * COUNT);
    [i - 1, i, i + 1].forEach((k) => {
      const el = ref.current?.children[k] as HTMLElement | undefined;
      if (!el || el.dataset.hot) return;
      el.dataset.hot = "1";
      el.style.transition = "none";
      el.style.transform = "scaleY(1.6)";
      el.style.backgroundColor = "var(--color-lime)";
      window.setTimeout(() => {
        el.style.transition = "transform .28s cubic-bezier(0.23,1,0.32,1), background-color .28s ease-out";
        el.style.transform = "";
        el.style.backgroundColor = "";
        delete el.dataset.hot;
      }, 70);
    });
  };

  return (
    <div>
      <div
        ref={ref}
        aria-hidden
        onPointerMove={onMove}
        className="flex h-[140px] items-end gap-[2px] border-b border-ink md:h-[200px] md:gap-[3px]"
      >
        {bars.map((h, i) => (
          <i key={i} className="block flex-1 origin-bottom bg-ink" style={{ height: `${h}%`, opacity: 0.35 + (i / COUNT) * 0.65 }} />
        ))}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[12px] text-muted">
        <span>10 years ago</span>
        <span className="hidden sm:inline">Every week your systems record more</span>
        <span>Today</span>
      </div>
    </div>
  );
}

const COUNT = 96;

function build() {
  let seed = 5;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: COUNT }, (_, i) => {
    const t = i / COUNT;
    const v = 0.15 + 0.6 * t + 0.1 * Math.sin(t * Math.PI * 16) + (rand() - 0.5) * 0.18 + (rand() < 0.05 ? 0.2 : 0);
    return Math.round(Math.min(0.98, Math.max(0.06, v)) * 100);
  });
}
