import { useEffect, useState } from "react";

/** Swaps words every 2.8s with a 200ms fade-and-drop. Static under reduced motion. */
export function RotatingWord({ words, offset = 0 }: { words: string[]; offset?: number }) {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval: number | undefined;
    const swaps: number[] = [];
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setOut(true);
        swaps.push(
          window.setTimeout(() => {
            setI((n) => (n + 1) % words.length);
            setOut(false);
          }, 200),
        );
      }, 2800);
    }, offset * 500);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
      swaps.forEach(window.clearTimeout);
    };
  }, [words.length, offset]);

  return (
    <span
      className={`inline-block transition-[opacity,transform] duration-200 ease-out ${out ? "translate-y-1.5 opacity-0" : "translate-y-0 opacity-100"}`}
    >
      {words[i]}
    </span>
  );
}
