import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", message: "" };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Enter your name.";
  if (!f.email.trim()) e.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!f.message.trim()) e.message = "Enter a message.";
  return e;
}

function inputCls(invalid: boolean) {
  return `block min-h-[48px] w-full rounded-lg border bg-card px-3.5 text-[16px] text-ink transition-colors duration-150 ease-out focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
    invalid ? "border-[#b42318]" : "border-line"
  }`;
}

export function ContactPage() {
  const [form, setForm] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Contact | Talent Bridge";
  }, []);

  const set = (key: keyof Fields, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setSubmitError(data?.error || "Could not send your message. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setSubmitError("Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-paper font-sans text-ink">
      <Header />
      <main id="main" className="mx-auto max-w-[720px] px-5 py-12 md:px-8 md:py-16">
        <p className="font-mono text-[13px] text-muted">
          <Link to="/" className="hover:text-ink hover:underline">
            Home
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          Contact
        </p>
        <h1 className="mt-4 font-serif text-[36px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[48px]">
          Contact us
        </h1>
        <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.65] text-soft">
          Questions about the remote RN role, or something else we should know? Send a note and we’ll reply from
          TalentBridge.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-line bg-card p-6" role="status">
            <h2 className="font-serif text-[28px] font-medium">Message sent</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-soft">
              Thanks, {form.name.trim()}. We’ll reply to {form.email.trim()}.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-lime px-6 text-[16px] font-semibold text-ink hover:bg-lime-hover"
              onClick={() => {
                setForm(EMPTY);
                setSent(false);
              }}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-[14px] font-medium">Name</span>
              <input
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={!!errors.name}
                className={inputCls(!!errors.name)}
              />
              {errors.name && <p className="mt-1.5 text-[13px] font-medium text-[#b42318]">{errors.name}</p>}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[14px] font-medium">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={!!errors.email}
                className={inputCls(!!errors.email)}
              />
              {errors.email && <p className="mt-1.5 text-[13px] font-medium text-[#b42318]">{errors.email}</p>}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[14px] font-medium">Message</span>
              <textarea
                name="message"
                rows={6}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={!!errors.message}
                className={`${inputCls(!!errors.message)} min-h-[160px] py-3`}
              />
              {errors.message && <p className="mt-1.5 text-[13px] font-medium text-[#b42318]">{errors.message}</p>}
            </label>
            {submitError && (
              <p role="alert" className="text-[14px] font-medium text-[#b42318]">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-lime px-7 text-[17px] font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover active:translate-y-px disabled:opacity-70"
            >
              {sending && <LoaderCircle className="animate-spin" size={18} aria-hidden />}
              {sending ? "Sending" : "Send message"}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
