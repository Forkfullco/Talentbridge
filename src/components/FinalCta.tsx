import { ApplyButton } from "./ApplyButton";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-h" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1080px] rounded-[28px] bg-ink px-6 py-16 text-center text-paper md:px-16 md:py-24">
        <h2 id="cta-h" className="mx-auto max-w-[720px] font-serif text-[36px] font-medium leading-[1.06] tracking-[-0.02em] md:text-[58px]">
          Ready to put your nursing experience to work <span className="italic">remotely?</span>
        </h2>
        <ApplyButton className="mt-10 w-full sm:w-auto sm:min-w-[320px]" />
        <p className="mt-4 font-mono text-[13px] text-paper/70">Application takes about 15–20 minutes.</p>
      </div>
    </section>
  );
}
