import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { QuestionFlow } from "./QuestionFlow";
import { ContactForm, type Contact } from "./ContactForm";
import { Result } from "./Result";
import { estimate, REFERRER, type Answers, type Estimate } from "./model";
import { Logo } from "../components/Logo";

const STATE_KEY = "tb_valuation_answers";
type Screen = "flow" | "contact" | "result";

export function QuotePage() {
  const [params] = useSearchParams();
  const incomingRef = params.get("ref");
  const [answers, setAnswers] = useState<Answers>(() => load() ?? {});
  const [screen, setScreen] = useState<Screen>("flow");
  const [startAtEnd, setStartAtEnd] = useState(false);
  const [outcome, setOutcome] = useState<{ q: Estimate; contact: Contact; refLink: string | null } | null>(null);

  useEffect(() => {
    document.title = "Free valuation | Talent Bridge";
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers]);

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };
  const isRef = answers.role === REFERRER;

  return (
    <div className="bg-qz-bg font-sans text-qz-text">
      <header className="border-b border-qz-line">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-12">
          <Link to="/data" aria-label="TalentBridge business data">
            <Logo />
          </Link>
          <Link to="/data" className="text-[14px] text-qz-muted transition-colors duration-150 hover:text-qz-text">
            Save and exit
          </Link>
        </div>
      </header>

      <main className="mx-auto min-h-[680px] max-w-[1120px] px-5 pb-20 pt-8 md:px-12 md:pb-24 md:pt-14">
        {screen === "flow" && (
          <QuestionFlow answers={answers} setAnswers={setAnswers} startAtEnd={startAtEnd} onDone={() => go("contact")} />
        )}
        {screen === "contact" && (
          <ContactForm
            isRef={isRef}
            answers={answers}
            incomingRef={incomingRef}
            onBack={() => {
              setStartAtEnd(true);
              go("flow");
            }}
            onSubmit={(contact, refLink) => {
              setOutcome({ q: estimate(answers), contact, refLink });
              try {
                sessionStorage.removeItem(STATE_KEY);
              } catch {
                /* ignore */
              }
              go("result");
            }}
          />
        )}
        {screen === "result" && outcome && (
          <Result q={outcome.q} isRef={isRef} contact={outcome.contact} refLink={outcome.refLink} />
        )}
      </main>

      <footer className="border-t border-qz-line">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-7 text-[13px] md:px-12 text-qz-muted">
          <p>Read-only access · de-identified in processing · you approve every sale</p>
          <p>© {new Date().getFullYear()} TalentBridge</p>
        </div>
      </footer>
    </div>
  );
}

function load(): Answers | null {
  try {
    return JSON.parse(sessionStorage.getItem(STATE_KEY) || "null");
  } catch {
    return null;
  }
}
