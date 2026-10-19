const STEPS = [
  { title: "Tell us what you have", meta: "A few minutes", body: "Answer a handful of questions about your systems and history. You’ll see an estimated range before connecting anything." },
  { title: "We clean and package it", meta: "A few days", body: "Read-only access, identifying details removed, and a sample buyers can review without seeing the rest." },
  { title: "Labs license it, you get paid", meta: "When you approve", body: "Vetted AI labs make offers. Nothing is sold without your sign-off, and payment goes straight to you." },
];

export function DataSteps() {
  return (
    <section aria-labelledby="dsteps-h">
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:px-8 md:py-24">
        <h2 id="dsteps-h" className="max-w-[720px] font-serif text-[36px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[52px]">
          How it works
        </h2>
        <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-ink md:bottom-auto md:left-0 md:right-0 md:top-[19px] md:h-px md:w-auto" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 md:flex-col">
              <span
                className={`relative grid h-10 w-10 flex-none place-items-center rounded-full border-2 border-ink font-mono text-[15px] ${
                  i === 2 ? "bg-lime" : "bg-paper"
                }`}
              >
                {i + 1}
              </span>
              <div className="pt-1 md:pt-0">
                <p className="font-mono text-[13px] text-muted">{s.meta}</p>
                <h3 className="mt-1 font-serif text-[24px] font-medium leading-[1.2] md:text-[28px]">{s.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.6] text-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
