const STEPS: { title: string; meta?: string }[] = [
  { title: "Apply online", meta: "About 15–20 minutes" },
  { title: "Complete a short AI-led interview" },
  { title: "Get matched and start working remotely" },
];

export function Steps() {
  return (
    <section aria-labelledby="steps-h">
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:px-8 md:py-24">
        <h2 id="steps-h" className="font-serif text-[36px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[52px]">
          How it works
        </h2>
        {/* Timeline: vertical on phones, one rule across on desktop */}
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
