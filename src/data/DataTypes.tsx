import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const TYPES = [
  {
    name: "Conversations",
    body: "Email and chat threads where decisions get made — the questions, the pushback and the final call.",
    tools: "Slack · Teams · Gmail · Outlook",
  },
  {
    name: "Tickets and requests",
    body: "Work followed from intake to resolution, with every handoff and note along the way.",
    tools: "Zendesk · Jira · ServiceNow · Intercom",
  },
  {
    name: "Financial records",
    body: "Invoices, ledgers and closes that show outcomes. Records with a result attached are worth the most.",
    tools: "QuickBooks · Xero · NetSuite",
  },
  {
    name: "Sales and CRM",
    body: "Pipelines, call notes and deal history that show how a sale was actually won or lost.",
    tools: "Salesforce · HubSpot · Pipedrive",
  },
  {
    name: "Code and docs",
    body: "Repositories with their reviews and history, plus the specs and playbooks your team writes.",
    tools: "GitHub · GitLab · Notion · Google Drive",
  },
];

/** The one dark section. An accordion on phones keeps the list short; desktop shows a detail panel. */
export function DataTypes() {
  const [active, setActive] = useState(0);
  const t = TYPES[active];

  return (
    <section aria-labelledby="types-h" className="bg-ink text-paper">
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:px-8 md:py-24">
        <h2 id="types-h" className="max-w-[700px] font-serif text-[36px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[52px]">
          What buyers <span className="italic">pay for</span>
        </h2>
        <p className="mt-5 max-w-[620px] text-[18px] leading-[1.6] text-paper/75">
          Connected read-only. Names, contact details and anything identifying are stripped before data leaves processing.
        </p>

        <ul className="mt-10 border-t border-line-dark md:hidden">
          {TYPES.map((x, i) => {
            const open = i === active;
            return (
              <li key={x.name} className="border-b border-line-dark">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(i)}
                  className="flex min-h-[64px] w-full items-center justify-between gap-4 py-4 text-left font-serif text-[24px] font-medium"
                >
                  {x.name}
                  <Plus size={22} aria-hidden className={`flex-none transition-transform duration-200 ease-out ${open ? "rotate-45 text-lime" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-2 text-[17px] leading-[1.55] text-paper/80">{x.body}</p>
                      <p className="pb-5 font-mono text-[13px] text-lime">{x.tools}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 hidden grid-cols-[340px_1fr] gap-12 md:grid">
          <ul className="border-t border-line-dark">
            {TYPES.map((x, i) => (
              <li key={x.name}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center justify-between border-b border-line-dark py-5 text-left font-serif text-[24px] font-medium transition-colors duration-150 ${
                    i === active ? "text-paper" : "text-paper/50 hover:text-paper"
                  }`}
                >
                  {x.name}
                  <span className={`h-2 w-2 rounded-full bg-lime transition-opacity duration-150 ${i === active ? "opacity-100" : "opacity-0"}`} />
                </button>
              </li>
            ))}
          </ul>
          <div className="min-h-[280px] rounded-[20px] bg-ink-2 p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                className="flex h-full flex-col"
              >
                <p className="max-w-[520px] font-serif text-[28px] leading-[1.3]">{t.body}</p>
                <p className="mt-auto pt-10 font-mono text-[14px] text-lime">{t.tools}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
