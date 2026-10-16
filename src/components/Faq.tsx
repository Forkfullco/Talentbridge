import { Fragment, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Is this a real job?",
    a: "Yes. The role is posted by our hiring partner, a company that supplies expert training data to leading AI labs. You apply directly with them, complete a short AI-led interview, and if you’re matched you’re paid $60–70 an hour for the work you do. TalentBridge never asks you for money, bank details or payment of any kind to apply.",
  },
  {
    q: "Do I need tech experience?",
    a: "Not at all. You don’t need any background in AI, coding or data. What matters is your clinical judgment as a registered nurse: reading an AI-written answer to a patient-care question, spotting what’s wrong or unsafe, and writing what a good nurse would actually say. If you can use a web browser and type up your reasoning, you have the technical skills you need.",
  },
  {
    q: "How many hours?",
    a: "Hours are flexible, so you can fit the work around your shifts rather than the other way round. The work is remote and done from home, which suits nurses picking up extra income on days off or between rotations. The application itself takes about 15–20 minutes.",
  },
  {
    q: "Who is TalentBridge?",
    a: "An independent company that shares remote expert roles with qualified professionals. We aren’t the employer: the hiring company makes all hiring decisions and pays you directly. We may earn a fee if you’re hired, but it’s paid by them and never comes out of your pay, so it costs you nothing.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="faq-h" className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:grid md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-8 md:py-24">
        <h2 id="faq-h" className="font-serif text-[36px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[52px]">
          Questions
        </h2>
        <div className="mt-6 border-t border-ink md:mt-0">
          {FAQS.map((f, i) => (
            <Fragment key={f.q}>
              <FaqItem q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex min-h-[68px] w-full items-center justify-between gap-4 py-5 text-left font-serif text-[22px] font-medium leading-[1.25]"
        >
          {q}
          <Plus
            size={22}
            aria-hidden
            className={`flex-none text-ink transition-transform duration-200 ease-out ${open ? "rotate-45" : ""}`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[560px] pb-6 text-[17px] leading-[1.6] text-soft">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
