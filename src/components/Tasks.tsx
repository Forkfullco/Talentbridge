import { MessageSquareText, ShieldAlert, PenLine } from "lucide-react";

const TASKS = [
  { icon: MessageSquareText, title: "Review AI answers to clinical questions" },
  { icon: ShieldAlert, title: "Flag errors and unsafe advice" },
  { icon: PenLine, title: "Write better responses using your expertise" },
];

/** The one dark section, as on the Grepped and Tracework pages. */
export function Tasks() {
  return (
    <section aria-labelledby="tasks-h" className="bg-ink text-paper">
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:px-8 md:py-24">
        <h2 id="tasks-h" className="font-serif text-[36px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[52px]">
          What you’ll <span className="italic">do</span>
        </h2>
        <ul className="mt-10 grid gap-3 md:grid-cols-3 md:gap-4">
          {TASKS.map(({ icon: Icon, title }) => (
            <li key={title} className="flex items-center gap-4 rounded-[20px] bg-ink-2 p-5 md:min-h-[200px] md:flex-col md:items-start md:justify-between md:p-7">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-lime text-ink">
                <Icon size={24} aria-hidden />
              </span>
              <p className="font-serif text-[22px] font-medium leading-[1.25] md:text-[26px]">{title}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
