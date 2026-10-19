import { useState } from "react";
import { Link } from "react-router-dom";
import { fmt, round5, SPREAD, type Estimate } from "./model";
import type { Contact } from "./ContactForm";

export function Result({ q, isRef, contact, refLink }: { q: Estimate; isRef: boolean; contact: Contact; refLink: string | null }) {
  const max = Math.max(...q.sources.map((s) => s.points), 1);
  const rows = [...q.sources].sort((x, y) => y.points - x.points);

  return (
    <section className="mx-auto grid max-w-[1000px] grid-cols-1 gap-10 md:grid-cols-[1.35fr_1fr]">
      <div className="rounded-[24px] bg-qz-card p-6 md:p-10">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-qz-muted">
          {isRef ? `Estimated value · ${contact.company}` : "Estimated value per license"}
        </p>
        <p className="mt-5 font-serif text-[48px] md:text-[76px] font-medium leading-none tracking-[-0.03em] tabular-nums">
          {fmt(q.low)}<span className="text-qz-muted">–</span>{fmt(q.high)}
        </p>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex gap-1.5" aria-label={`Score ${q.score} of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={`h-2 w-10 rounded-full ${n <= q.score ? "bg-qz-acc" : "bg-qz-line"}`} />
            ))}
          </div>
          <span className="text-[15px] font-medium">{q.tier}</span>
        </div>

        <div className="mt-10 border-t border-qz-line pt-7">
          <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-qz-muted">Where the value comes from</p>
          <ul className="mt-5 grid gap-4">
            {rows.map((s) => {
              const lo = s.points * q.share;
              return (
                <li key={s.key} className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[180px_1fr_auto] items-center gap-4 text-[15px]">
                  <span>{s.label}</span>
                  <span className="order-last col-span-2 h-1.5 rounded-full bg-qz-line md:order-none md:col-span-1">
                    <span className="block h-full rounded-full bg-qz-acc" style={{ width: `${Math.round((100 * s.points) / max)}%` }} />
                  </span>
                  <span className="font-mono text-[13px] text-qz-muted">
                    {fmt(round5(lo))}–{fmt(round5(lo * SPREAD))}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-8 text-[13px] leading-[1.6] text-qz-muted">
          Indicative only, based on your answers. Final pricing follows a review of a de-identified sample and often rises
          for long histories and records tied to outcomes.
        </p>
      </div>

      {isRef ? <IntroLink link={refLink} /> : <OwnerNext name={contact.name} />}
    </section>
  );
}

function OwnerNext({ name }: { name: string }) {
  const first = name.trim().split(" ")[0];
  return (
    <div className="pt-4">
      <h2 className="font-serif text-[36px] font-medium leading-[1.1] tracking-[-0.02em]">
        {first ? `${first}, here’s what happens next.` : "Here’s what happens next."}
      </h2>
      <ol className="mt-8 grid gap-6">
        {[
          ["Today", "Your breakdown lands in your inbox."],
          ["Within 2 days", "A specialist walks through the estimate with you."],
          ["When you’re ready", "Connect read-only and we prepare a sample for buyers."],
        ].map(([when, what]) => (
          <li key={when} className="border-l-2 border-qz-line pl-5">
            <p className="font-mono text-[13px] text-qz-acc">{when}</p>
            <p className="mt-1 text-[16px] leading-[1.5]">{what}</p>
          </li>
        ))}
      </ol>
      <Link
        to="/contact"
        className="press mt-10 inline-flex items-center gap-3 rounded-full bg-qz-acc px-7 py-4 text-[16px] font-medium leading-none text-qz-bg hover:bg-qz-acc-2"
      >
        Book a walkthrough →
      </Link>
    </div>
  );
}

function IntroLink({ link }: { link: string | null }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!link) return;
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="pt-4">
      <h2 className="font-serif text-[36px] font-medium leading-[1.1] tracking-[-0.02em]">Send this to the owner.</h2>
      <p className="mt-4 text-[16px] leading-[1.6] text-qz-muted">
        When they request a valuation through your link, the introduction is credited to you. You earn 10% of every deal
        that closes, paid the same day they are.
      </p>
      <div className="mt-6 flex gap-2">
        <input
          readOnly
          value={link ?? ""}
          aria-label="Your introduction link"
          className="min-w-0 flex-1 rounded-full border border-qz-line bg-qz-field px-5 py-3.5 font-mono text-[14px] text-qz-text"
        />
        <button
          type="button"
          onClick={copy}
          className="press rounded-full bg-qz-acc px-6 py-3.5 text-[15px] font-medium text-qz-bg hover:bg-qz-acc-2"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
