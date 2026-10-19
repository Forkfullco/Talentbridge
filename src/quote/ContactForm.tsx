import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { estimate, fmt, type Answers } from "./model";

export type Contact = { name: string; company: string; email: string; phone: string };

const EMPTY: Contact = { name: "", company: "", email: "", phone: "" };

/** Short contact step: the range is computed, this emails it and unlocks it. */
export function ContactForm({
  isRef,
  answers,
  incomingRef,
  onBack,
  onSubmit,
}: {
  isRef: boolean;
  answers: Answers;
  incomingRef: string | null;
  onBack: () => void;
  onSubmit: (c: Contact, refLink: string | null) => void;
}) {
  const [c, setC] = useState<Contact>(EMPTY);
  const [invalid, setInvalid] = useState<Partial<Record<keyof Contact, boolean>>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const field = (k: keyof Contact) => ({
    name: k,
    value: c[k],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setC({ ...c, [k]: e.target.value });
      setInvalid({ ...invalid, [k]: false });
    },
    invalid: !!invalid[k],
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const bad = {
      name: !c.name.trim(),
      company: !c.company.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim()),
    };
    setInvalid(bad);
    const first = (Object.keys(bad) as (keyof typeof bad)[]).find((k) => bad[k]);
    if (first) {
      setError("We need a name, a company and an email that works.");
      document.querySelector<HTMLInputElement>(`input[name="${first}"]`)?.focus();
      return;
    }
    setError(null);
    setBusy(true);
    const q = estimate(answers);
    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            name: c.name.trim(),
            company: c.company.trim(),
            email: c.email.trim(),
            phone: c.phone.trim(),
          },
          answers,
          range: `${fmt(q.low)}–${fmt(q.high)}`,
          tier: q.tier,
          isRef,
          incomingRef,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; refLink?: string | null } | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Could not send your valuation. Please try again.");
        return;
      }
      onSubmit(c, data.refLink ?? null);
    } catch {
      setError("Could not send your valuation. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-[960px] grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
      <div className="pt-4">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-qz-acc">Range calculated</p>
        <h2 className="mt-4 font-serif text-[36px] md:text-[52px] font-medium leading-[1.04] tracking-[-0.02em]">
          {isRef ? "Their number is ready." : "Your number is ready."}
        </h2>
        <p className="mt-5 text-[17px] leading-[1.6] text-qz-muted">
          {isRef
            ? "Tell us who you are and which company you’re introducing. You’ll see the range and get a personal link to send the owner."
            : "Tell us where to send the full breakdown and we’ll show your range right away."}
        </p>
        <button type="button" onClick={onBack} className="mt-8 text-[14px] text-qz-muted transition-colors duration-150 hover:text-qz-text">
          ← Change my answers
        </button>
      </div>

      <form onSubmit={submit} noValidate className="grid gap-4 rounded-2xl border border-qz-line bg-qz-card p-6 md:p-8">
        <Field label="Your name" placeholder="Full name" autoComplete="name" {...field("name")} />
        <Field label={isRef ? "Company you’re introducing" : "Company"} placeholder="Company name" autoComplete="organization" {...field("company")} />
        <Field label={isRef ? "Your email" : "Work email"} type="email" placeholder="name@company.com" autoComplete="email" {...field("email")} />
        <Field label="Phone" optional type="tel" placeholder="Optional" autoComplete="tel" {...field("phone")} />

        {error && (
          <p role="alert" className="text-[14px] text-qz-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="press mt-2 inline-flex w-full items-center justify-center rounded-full bg-qz-acc px-7 py-4 text-[16px] font-medium leading-none text-qz-bg hover:bg-qz-acc-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Pricing it…" : "Show my range"}
        </button>
        <p className="text-center text-[13px] text-qz-muted">Used for your valuation only. No marketing lists.</p>
      </form>
    </section>
  );
}

function Field({
  label,
  optional,
  invalid,
  ...input
}: { label: string; optional?: boolean; invalid: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2">
      <span className="text-[14px] font-medium">
        {label} {optional && <em className="font-normal not-italic text-qz-muted">(optional)</em>}
      </span>
      <input
        type="text"
        {...input}
        className={`rounded-xl border bg-qz-field px-4 py-3.5 text-[16px] text-qz-text placeholder:text-qz-line-2 focus:border-qz-acc focus:outline-none ${
          invalid ? "border-qz-invalid" : "border-qz-line"
        }`}
      />
    </label>
  );
}
