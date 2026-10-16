import { Clock, DollarSign, Home } from "lucide-react";
import { ApplyButton } from "./ApplyButton";

const BADGES = [
  { icon: Home, label: "Fully remote" },
  { icon: Clock, label: "Flexible hours" },
  { icon: DollarSign, label: "$60–70/hr" },
];

export function Hero() {
  return (
    <section id="hero">
      <div className="mx-auto max-w-[1080px] px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-24">
        <p className="font-mono text-[13px] text-muted">Remote Registered Nurse – AI Training</p>
        <h1 className="mt-4 max-w-[860px] font-serif text-[42px] font-medium leading-[1.04] tracking-[-0.025em] md:text-[76px]">
          Get paid{" "}
          <span className="whitespace-nowrap bg-lime px-1.5 [box-decoration-break:clone]">$60–70/hr</span>{" "}
          to help train medical AI — <span className="italic">from home</span>
        </h1>
        <p className="mt-6 max-w-[600px] text-[18px] leading-[1.55] text-soft md:text-[20px]">
          Remote, flexible work for US-licensed RNs. Use your clinical judgment to improve how AI handles patient care.
        </p>

        <ApplyButton label="Apply now" className="mt-8 w-full sm:w-auto" />

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6" aria-label="Role highlights">
          {BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2 text-[16px] font-medium">
              <Icon size={17} className="text-muted" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
