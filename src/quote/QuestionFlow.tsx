import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RadioCards } from "./fields/RadioCards";
import { Chips } from "./fields/Chips";
import { TeamSlider } from "./fields/TeamSlider";
import { SystemCards } from "./fields/SystemCards";
import { Panel } from "./fields/Panel";
import {
  CUSTOMERS, HISTORY, LANGUAGES, PLATFORMS, REFERRER, REVENUE, RIGHTS, ROLES, SECTORS, SOFTWARE, SOURCES, TEAM_START, TIMING,
  type Answers,
} from "./model";

type Props = {
  answers: Answers;
  setAnswers: (fn: (a: Answers) => Answers) => void;
  startAtEnd: boolean;
  onDone: () => void;
};

type Step = {
  id: string;
  group: string;
  title: string;
  sub?: string;
  auto?: boolean;
  when?: () => boolean;
  done: () => boolean;
  hint?: string;
  body: ReactNode;
};

const GROUPS = ["You", "The company", "The data", "Next steps"];

export function QuestionFlow({ answers: a, setAnswers, startAtEnd, onDone }: Props) {
  const isRef = a.role === REFERRER;
  const t = (you: string, them: string) => (isRef ? them : you);
  const set = (patch: Partial<Answers>) => setAnswers((prev) => ({ ...prev, ...patch }));
  const toggle = (list: string[] | undefined, v: string) => {
    const l = list || [];
    return l.includes(v) ? l.filter((x) => x !== v) : [...l, v];
  };
  const pickAndGo = (patch: Partial<Answers>) => {
    set(patch);
    window.setTimeout(() => goNext(true), 200);
  };

  const all: Step[] = [
    {
      id: "role", group: "You", title: "First, what’s your seat at the table?", sub: "Open companies and closed ones. We also buy data from businesses that have shut down.", auto: true, done: () => !!a.role,
      body: <RadioCards options={ROLES} value={a.role} onPick={(v) => pickAndGo({ role: v })} />,
    },
    {
      id: "sector", group: "The company", title: t("What sector are you in?", "What sector are they in?"), sub: "Buyers price sectors differently.", auto: true, done: () => !!a.sector,
      body: <RadioCards cols options={SECTORS} value={a.sector} onPick={(v) => pickAndGo(v === "Software" ? { sector: v } : { sector: v, software: undefined })} />,
    },
    {
      id: "software", group: "The company", title: "What kind of software?", auto: true, when: () => a.sector === "Software", done: () => !!a.software,
      body: <RadioCards options={SOFTWARE} value={a.software} onPick={(v) => pickAndGo({ software: v })} />,
    },
    {
      id: "team", group: "The company", title: "How many people work there?", sub: "Count regular contractors too.", done: () => true, hint: "Drag, or use arrow keys",
      body: <TeamSlider value={a.team ?? TEAM_START} onChange={(i) => set({ team: i })} />,
    },
    {
      id: "scale", group: "The company", title: "And how much activity runs through it?", sub: "Rough is fine — this never leaves your browser until you submit.",
      done: () => !!a.customers && !!a.revenue,
      body: (
        <>
          <Panel title="Customers or active users">
            <Chips options={CUSTOMERS} isOn={(o) => a.customers === o} onToggle={(o) => set({ customers: o })} />
          </Panel>
          <Panel title="Annual revenue">
            <Chips options={REVENUE} isOn={(o) => a.revenue === o} onToggle={(o) => set({ revenue: o })} />
          </Panel>
        </>
      ),
    },
    {
      id: "history", group: "The data", title: "How far back do the records go?", sub: "Longer history is one of the strongest price signals.", auto: true, done: () => !!a.history,
      body: <RadioCards options={HISTORY.map((h) => h[1])} value={a.history} onPick={(v) => pickAndGo({ history: v })} />,
    },
    {
      id: "systems", group: "The data", title: "Which systems hold the work?", sub: "Pick every one that’s in daily use.",
      done: () => (a.sources || []).length > 0,
      hint: (a.sources || []).length ? `${(a.sources || []).length} picked` : "Pick at least one",
      body: <SystemCards selected={a.sources || []} onToggle={(k) => set({ sources: toggle(a.sources, k) })} />,
    },
    {
      id: "platforms", group: "The data", title: "Any specific tools?", sub: "Optional. Named tools let buyers judge format and export quality.",
      done: () => true, hint: "Skip if unsure",
      body: (
        <>
          {SOURCES.filter((s) => (a.sources || []).includes(s.key)).map((s) => {
            const picked = a.platforms?.[s.key] || [];
            return (
              <Fragment key={s.key}>
                <Panel title={s.label}>
                  <Chips
                    options={[...(PLATFORMS[s.key] || []), "Something else"]}
                    isOn={(o) => picked.includes(o)}
                    onToggle={(o) => set({ platforms: { ...a.platforms, [s.key]: toggle(picked, o) } })}
                  />
                </Panel>
              </Fragment>
            );
          })}
        </>
      ),
    },
    {
      id: "languages", group: "The data", title: "Which languages is it written in?", sub: "Non-English records are scarce, and buyers pay for that.",
      done: () => (a.languages || []).length > 0,
      body: <Chips options={LANGUAGES} isOn={(o) => (a.languages || []).includes(o)} onToggle={(o) => set({ languages: toggle(a.languages, o) })} />,
    },
    {
      id: "rights", group: "Next steps", title: t("Is it yours to license?", "Is it theirs to license?"), sub: "Assume it’s de-identified first. This is about ownership only.", auto: true, done: () => !!a.rights,
      body: <RadioCards options={RIGHTS} value={a.rights} onPick={(v) => pickAndGo({ rights: v })} />,
    },
    {
      id: "timing", group: "Next steps", title: t("When would you want to move?", "When might they want to move?"), auto: true, done: () => !!a.timing,
      body: <Chips big options={TIMING} isOn={(o) => a.timing === o} onToggle={(o) => pickAndGo({ timing: o })} />,
    },
  ];

  const steps = all.filter((s) => !s.when || s.when());
  const [pos, setPos] = useState(() => (startAtEnd ? steps.length - 1 : 0));
  const p = Math.min(pos, steps.length - 1);
  const step = steps[p];

  const latest = useRef({ p, len: steps.length });
  latest.current = { p, len: steps.length };

  function goNext(fromAuto = false) {
    const { p: cur, len } = latest.current;
    if (!fromAuto && !step.done()) return;
    if (step.id === "team" && a.team == null) set({ team: TEAM_START });
    if (cur < len - 1) {
      setPos(cur + 1);
      window.scrollTo(0, 0);
    } else onDone();
  }
  const back = () => {
    if (p === 0) return;
    setPos(p - 1);
    window.scrollTo(0, 0);
  };

  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [p]);

  const groupIdx = GROUPS.indexOf(step.group);

  return (
    <section className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-16">
      <aside className="pt-2">
        <p className="font-serif text-[22px] font-medium leading-tight md:text-[26px]">Free valuation</p>
        <ol className="mt-4 flex flex-wrap gap-x-4 gap-y-2 md:mt-8 md:grid md:gap-4">
          {GROUPS.map((g, i) => (
            <li key={g} className="flex items-center gap-3 text-[15px]">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] font-mono transition-colors duration-200 ${
                  i < groupIdx ? "border-qz-acc bg-qz-acc text-qz-bg" : i === groupIdx ? "border-qz-acc text-qz-acc" : "border-qz-line-2 text-qz-muted"
                }`}
              >
                {i < groupIdx ? "✓" : i + 1}
              </span>
              <span className={`${i === groupIdx ? "text-qz-text" : "hidden text-qz-muted md:inline"}`}>{g}</span>
            </li>
          ))}
        </ol>
      </aside>

      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="mb-6 md:mb-8">
              <h2 ref={titleRef} tabIndex={-1} className="font-serif text-[30px] font-medium leading-[1.12] tracking-[-0.02em] outline-none md:text-[44px]">
                {step.title}
              </h2>
              {step.sub && <p className="mt-2 text-[16px] text-qz-muted">{step.sub}</p>}
            </div>

            {step.body}

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={back}
                disabled={p === 0}
                className="press inline-flex min-h-[52px] min-w-[120px] items-center justify-center rounded-full border border-qz-line px-6 text-[16px] font-medium text-qz-text hover:border-qz-line-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>
              <div className="flex items-center gap-5">
                {step.hint && <span className="font-mono text-[13px] text-qz-muted">{step.hint}</span>}
                <button
                  type="button"
                  onClick={() => goNext()}
                  disabled={!step.done()}
                  className="press inline-flex min-h-[52px] min-w-[160px] items-center justify-center rounded-full bg-qz-acc px-7 text-[16px] font-medium leading-none text-qz-bg hover:bg-qz-acc-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
