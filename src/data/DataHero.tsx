import { Link } from "react-router-dom";
import { ActivityBars } from "./ActivityBars";

export function DataHero() {
  return (
    <section>
      <div className="mx-auto max-w-[1080px] px-5 pb-12 pt-12 md:px-8 md:pb-16 md:pt-24">
        <p className="font-mono text-[13px] text-muted">For business owners</p>
        <h1 className="mt-4 max-w-[900px] font-serif text-[42px] font-medium leading-[1.04] tracking-[-0.025em] md:text-[76px]">
          Your company’s records are worth{" "}
          <span className="whitespace-nowrap bg-lime px-1.5">real money</span> to <span className="italic">AI labs.</span>
        </h1>
        <p className="mt-6 max-w-[620px] text-[18px] leading-[1.55] text-soft md:text-[20px]">
          The tickets, threads and ledgers your team creates every day show how real work gets done — exactly what AI models
          can’t learn from the public internet. We help you price it and license it safely.
        </p>
        <p className="mt-5 text-[20px] font-medium md:text-[22px]">
          Companies can earn <span className="bg-lime px-1.5 font-semibold">$1M+</span> from data they already have.
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
