import { Check } from "lucide-react";

const CRITERIA = [
  "Active US RN license",
  "Recent inpatient / bedside experience",
  "Based in the United States",
  "No AI or tech background needed",
];

export function Qualify() {
  return (
    <section id="qualify" aria-labelledby="qualify-h" className="scroll-mt-20">
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:grid md:grid-cols-[1fr_1.3fr] md:gap-16 md:px-8 md:py-24">
        <h2 id="qualify-h" className="font-serif text-[36px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[52px]">
          Who this is for
        </h2>
        <div className="mt-6 md:mt-0">
          <ul className="border-t border-ink">
            {CRITERIA.map((c) => (
              <li key={c} className="flex items-center gap-4 border-b border-line py-5 text-[19px]">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-lime">
                  <Check size={18} strokeWidth={3} aria-hidden />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[15px] text-muted">Not a fit for LPNs or students.</p>
        </div>
      </div>
    </section>
  );
}
