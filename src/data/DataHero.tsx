import { Link } from "react-router-dom";
import { ActivityBars } from "./ActivityBars";

export function DataHero() {
  return (
    <section>
      <div className="mx-auto max-w-[1080px] px-5 pb-12 pt-12 md:px-8 md:pb-16 md:pt-24">
        <h1 className="max-w-[900px] font-serif text-[42px] font-medium leading-[1.04] tracking-[-0.025em] md:text-[76px]">
          Monetize the data supply only you have
        </h1>
        <p className="mt-6 max-w-[720px] text-[22px] font-medium leading-[1.35] md:text-[28px]">
          Your company’s data could be worth <span className="whitespace-nowrap bg-lime px-1.5">$20K–$5M.</span>
        </p>
        <Link
          to="/valuation"
          className="mt-8 inline-flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-lime px-9 text-[19px] font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover active:translate-y-px sm:w-auto"
        >
          Get a free valuation <span aria-hidden>→</span>
        </Link>
        <p className="mt-3 font-mono text-[13px] text-muted">A few minutes · nothing uploaded</p>
      </div>
      <div className="mx-auto max-w-[1080px] px-5 pb-14 md:px-8 md:pb-20">
        <ActivityBars />
      </div>
    </section>
  );
}
