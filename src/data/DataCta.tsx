import { Link } from "react-router-dom";

export function DataCta() {
  return (
    <section id="value" aria-labelledby="dcta-h" className="scroll-mt-20 px-4 pb-16 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1080px] rounded-[28px] bg-ink px-6 py-16 text-center text-paper md:px-16 md:py-24">
        <h2 id="dcta-h" className="mx-auto max-w-[720px] font-serif text-[36px] font-medium leading-[1.06] tracking-[-0.02em] md:text-[58px]">
          Find out what your data is <span className="italic">worth.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.6] text-paper/75">
          Companies can earn $1M+ from their data. Get a free, private estimate — no files, no calls and no commitment
          until you decide.
        </p>
        <Link
          to="/valuation"
          className="mt-10 inline-flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-lime px-9 text-[19px] font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover active:translate-y-px sm:w-auto sm:min-w-[320px]"
        >
          Get a free valuation <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
