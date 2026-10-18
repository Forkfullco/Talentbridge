import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const STEPS: { title: string; meta?: string }[] = [
  { title: "Apply online", meta: "About 15–20 minutes" },
  { title: "Complete a short AI-led interview" },
  { title: "Get matched and start working remotely" },
];

/** How many circles have reached the lime trigger. Earlier steps stay filled. */
function litCount(section: HTMLElement, items: HTMLElement[], desktop: boolean) {
  const vh = window.innerHeight;
  if (!desktop) {
    const line = vh * 0.72;
    let n = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].getBoundingClientRect().top < line) n = i + 1;
    }
    return n;
  }
  const top = section.getBoundingClientRect().top;
  const start = vh * 0.88;
  const end = vh * 0.42;
  const progress = (start - top) / (start - end);
  if (progress >= 0.72) return 3;
  if (progress >= 0.38) return 2;
  if (progress > 0.05) return 1;
  return 0;
}

export function Steps() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    let frame = 0;
    const update = () => {
      const items = itemRefs.current.filter((el): el is HTMLLIElement => el !== null);
      if (items.length !== STEPS.length) return;
      const next = litCount(section, items, desktopQuery.matches);
      setLit((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktopQuery.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktopQuery.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="steps-h">
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:px-8 md:py-24">
        <h2 id="steps-h" className="font-serif text-[36px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[52px]">
          How it works
        </h2>
        {/* Timeline: vertical on phones, one rule across on desktop */}
        <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-ink md:bottom-auto md:left-0 md:right-0 md:top-[19px] md:h-px md:w-auto" />
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative flex gap-5 md:flex-col"
            >
              <span
                className={`relative grid h-10 w-10 flex-none place-items-center rounded-full border-2 border-ink font-mono text-[15px] ${
                  reduce ? "" : "transition-colors duration-200 ease-out"
                } ${i < lit ? "bg-lime" : "bg-paper"}`}
              >
                {i + 1}
              </span>
              <div className="pt-1 md:pt-0">
                <h3 className="font-serif text-[24px] font-medium leading-[1.2] md:text-[28px]">{s.title}</h3>
                {s.meta && <p className="mt-1.5 font-mono text-[13px] text-muted">{s.meta}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
