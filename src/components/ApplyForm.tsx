import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, LoaderCircle, X } from "lucide-react";
import { closeApplyForm, useApplyFormOpen } from "../lib/applyModal";
import { APPLY_URL } from "../lib/apply";
import { applyOutcome, type ApplyOutcome, type YN } from "../lib/qualify";
import { US_STATES } from "../lib/states";
import { getUtms } from "../lib/utm";
import { markApplied } from "../lib/sessionFlags";
import { trackLead } from "../tracking/metaPixel";

const EASE = [0.23, 1, 0.32, 1] as const;

export function ApplyForm() {
  const open = useApplyFormOpen();
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<ApplyOutcome | null>(null);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeApplyForm();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open && submitted) {
      const t = window.setTimeout(() => {
        setSubmitted(null);
        setForm(EMPTY);
        setErrors({});
        setSubmitError(null);
        setSending(false);
      }, 250);
      return () => window.clearTimeout(t);
    }
  }, [open, submitted]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      panelRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }
    setSending(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          licensed: form.licensed,
          bedside: form.bedside,
          state: form.state,
          desktop: form.desktop,
          consent: form.consent,
          utm: getUtms(),
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; outcome?: ApplyOutcome; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        setSubmitError(data?.error || "Could not save your application. Please try again.");
        return;
      }
      const outcome = data.outcome ?? applyOutcome(form.licensed, form.bedside, form.desktop);
      markApplied();
      trackLead();
      setSubmitted(outcome);
    } catch {
      setSubmitError("Could not save your application. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const title = submitted
    ? submitted === "not_qualified"
      ? "Thanks for reaching out"
      : submitted === "qualified_mobile"
        ? "Check your email"
        : "Your application link"
    : "Quick check before you apply";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/55 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onMouseDown={(e) => e.target === e.currentTarget && closeApplyForm()}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-title"
            className="flex max-h-[calc(100dvh-1rem)] w-full max-w-[580px] flex-col overflow-hidden rounded-t-2xl bg-paper shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-2xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 pb-5 pt-6 sm:px-8">
              <div>
                <h2 id="apply-title" className="font-serif text-[28px] font-medium leading-tight">
                  {title}
                </h2>
                {!submitted && (
                  <p className="mt-1.5 text-[15px] text-muted">
                    Takes under a minute. We’ll route you based on whether this role is a fit.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeApplyForm}
                aria-label="Close"
                className="-mr-2 -mt-1 grid size-10 shrink-0 place-items-center rounded-full text-soft transition-colors duration-150 ease-out hover:bg-paper-2"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            {submitted ? (
              <Success firstName={form.firstName} outcome={submitted} />
            ) : (
              <form noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6 sm:px-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First name" required error={errors.firstName} htmlFor="af-first">
                      <input
                        ref={firstRef}
                        id="af-first"
                        data-field="firstName"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        aria-invalid={!!errors.firstName}
                        className={inputCls(!!errors.firstName)}
                      />
                    </Field>
                    <Field label="Email" required error={errors.email} htmlFor="af-email">
                      <input
                        id="af-email"
                        data-field="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        aria-invalid={!!errors.email}
                        className={inputCls(!!errors.email)}
                      />
                    </Field>
                  </div>

                  <div>
                    <Field label="Phone" hint="Optional" error={errors.phone} htmlFor="af-phone">
                      <input
                        id="af-phone"
                        data-field="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={inputCls(false)}
                      />
                    </Field>
                  </div>

                  <div className="space-y-5 border-t border-line pt-7">
                    <YesNo
                      name="licensed"
                      label="Are you a US-licensed RN?"
                      required
                      value={form.licensed}
                      onChange={(v) => set("licensed", v)}
                      error={errors.licensed}
                    />
                    <YesNo
                      name="bedside"
                      label="Do you have inpatient/bedside experience in the last 2 years?"
                      required
                      value={form.bedside}
                      onChange={(v) => set("bedside", v)}
                      error={errors.bedside}
                    />
                    <Field label="State of licensure" htmlFor="af-state">
                      <div className="relative">
                        <select
                          id="af-state"
                          value={form.state}
                          onChange={(e) => set("state", e.target.value)}
                          className={`${inputCls(false)} appearance-none pr-10 ${form.state ? "" : "text-muted"}`}
                        >
                          <option value="">Select a state</option>
                          <option value="Compact (multistate)">Compact / multistate license</option>
                          {US_STATES.map((s) => (
                            <option key={s} value={s} className="text-ink">
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-soft" aria-hidden />
                      </div>
                    </Field>
                    <YesNo
                      name="desktop"
                      label="Are you on a laptop/desktop right now?"
                      required
                      value={form.desktop}
                      onChange={(v) => set("desktop", v)}
                      error={errors.desktop}
                    />
                  </div>

                  <div className="border-t border-line pt-6">
                    <Checkbox
                      checked={form.consent}
                      onChange={(v) => set("consent", v)}
                      invalid={!!errors.consent}
                      dataField="consent"
                    >
                      I agree TalentBridge may email me about this and similar remote opportunities.
                    </Checkbox>
                    {errors.consent && <ErrorText className="ml-9">{errors.consent}</ErrorText>}
                  </div>
                </div>

                <div className="border-t border-line bg-paper px-6 py-5 sm:px-8">
                  {submitError && (
                    <p className="mb-3 text-[14px] font-medium text-[#b42318]" role="alert">
                      {submitError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-lime px-8 text-[18px] font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover active:translate-y-px disabled:opacity-70"
                  >
                    {sending ? (
                      <>
                        <LoaderCircle size={20} className="animate-spin" aria-hidden />
                        Saving…
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Success({ firstName, outcome }: { firstName: string; outcome: ApplyOutcome }) {
  const name = firstName.trim() || "there";

  if (outcome === "not_qualified") {
    return (
      <div className="px-6 pb-8 pt-6 sm:px-8">
        <p className="text-[17px] leading-relaxed text-soft">
          Thanks, {name}. This role isn’t a fit, but we’ll email you other remote roles.
        </p>
        <button
          type="button"
          onClick={closeApplyForm}
          className="mt-7 inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-ink px-8 text-[16px] font-medium text-ink transition-colors duration-150 ease-out hover:bg-paper-2"
        >
          Close
        </button>
      </div>
    );
  }

  if (outcome === "qualified_mobile") {
    return (
      <div className="px-6 pb-8 pt-6 sm:px-8">
        <p className="text-[17px] leading-relaxed text-soft">
          Thanks, {name}. We’ve emailed you the link so you can apply from your laptop later.
        </p>
        <p className="mt-5 border-l-2 border-ink pl-4 text-[15px] leading-relaxed text-soft">
          The application and AI interview work best in Chrome on a laptop or desktop with camera and mic.
          Plan for up to about 50 minutes.
        </p>
        <button
          type="button"
          onClick={closeApplyForm}
          className="mt-7 inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-lime px-8 text-[18px] font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-6 sm:px-8">
      <p className="text-[17px] leading-relaxed text-soft">
        Thanks, {name}. Next step is the micro1 application — new account with this email, then an AI
        interview.
      </p>
      <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-soft">
        <li className="flex gap-2">
          <Check size={18} className="mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden />
          Create a new micro1 account with this same email
        </li>
        <li className="flex gap-2">
          <Check size={18} className="mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden />
          AI interview takes up to about 50 minutes
        </li>
        <li className="flex gap-2">
          <Check size={18} className="mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden />
          Use Chrome on a laptop with camera and microphone
        </li>
      </ul>
      <a
        href={APPLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={closeApplyForm}
        className="mt-7 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-lime px-8 text-[18px] font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover active:translate-y-px"
      >
        Start your micro1 application
        <ArrowUpRight size={20} strokeWidth={2.5} aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline gap-2 text-[15px] font-medium text-ink">
        {label}
        {required && (
          <span className="text-muted" aria-hidden>
            *
          </span>
        )}
        {hint && <span className="text-[13px] font-normal text-muted">{hint}</span>}
      </label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function YesNo({
  name,
  label,
  required,
  value,
  onChange,
  error,
}: {
  name: string;
  label: string;
  required?: boolean;
  value: YN;
  onChange: (v: YN) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[15px] font-medium leading-snug text-ink">
        {label}
        {required && (
          <span className="ml-2 text-muted" aria-hidden>
            *
          </span>
        )}
      </legend>
      <div className="flex gap-2.5">
        {(["yes", "no"] as const).map((opt, i) => {
          const selected = value === opt;
          return (
            <label
              key={opt}
              className={`flex min-h-[46px] min-w-[96px] cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 text-[15px] font-medium transition-colors duration-150 ease-out has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                selected
                  ? "border-ink bg-ink text-paper"
                  : error
                    ? "border-[#b42318] bg-card text-ink hover:border-ink"
                    : "border-line bg-card text-ink hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={selected}
                onChange={() => onChange(opt)}
                data-field={i === 0 ? name : undefined}
                aria-invalid={!!error}
                className="sr-only"
              />
              {selected && <Check size={16} strokeWidth={2.75} aria-hidden />}
              {opt === "yes" ? "Yes" : "No"}
            </label>
          );
        })}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </fieldset>
  );
}

function Checkbox({
  checked,
  onChange,
  invalid,
  dataField,
  className = "",
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  invalid?: boolean;
  dataField?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 ${className}`}>
      <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          data-field={dataField}
          aria-invalid={invalid}
          className={`peer size-6 cursor-pointer appearance-none rounded-md border bg-card transition-colors duration-150 ease-out checked:border-ink checked:bg-ink ${
            invalid ? "border-[#b42318]" : "border-line hover:border-ink"
          }`}
        />
        <Check size={15} strokeWidth={3} className="pointer-events-none absolute text-paper opacity-0 peer-checked:opacity-100" aria-hidden />
      </span>
      <span className="text-[14px] leading-relaxed text-soft">{children}</span>
    </label>
  );
}

function ErrorText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`mt-1.5 text-[13px] font-medium text-[#b42318] ${className}`}>{children}</p>;
}

function inputCls(invalid: boolean) {
  return `block min-h-[48px] w-full rounded-lg border bg-card px-3.5 text-[16px] text-ink transition-colors duration-150 ease-out focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
    invalid ? "border-[#b42318]" : "border-line"
  }`;
}

type FormState = {
  firstName: string;
  email: string;
  phone: string;
  licensed: YN;
  bedside: YN;
  state: string;
  desktop: YN;
  consent: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  firstName: "",
  email: "",
  phone: "",
  licensed: "",
  bedside: "",
  state: "",
  desktop: "",
  consent: false,
};

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.firstName.trim()) e.firstName = "Enter your first name.";
  if (!f.email.trim()) e.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!f.licensed) e.licensed = "Choose Yes or No.";
  if (!f.bedside) e.bedside = "Choose Yes or No.";
  if (!f.desktop) e.desktop = "Choose Yes or No.";
  if (!f.consent) e.consent = "Please agree to continue.";
  return e;
}
