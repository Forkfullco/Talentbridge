import { RotatingWord } from "./RotatingWord";

const PRIVATE = ["support tickets", "quote approvals", "job notes", "month-end closes", "code reviews", "intake forms"];
const PUBLIC = ["blog posts", "news articles", "forum threads", "product pages", "wiki entries", "social posts"];

export function WhyData() {
  return (
    <section aria-labelledby="why-h" className="border-t border-line">
      <div className="mx-auto max-w-[1080px] px-5 py-16 md:px-8 md:py-24">
        <div className="md:grid md:grid-cols-2 md:gap-16">
          <h2 id="why-h" className="font-serif text-[36px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[52px]">
            AI has read the web. It hasn’t seen <span className="italic">your</span> work.
          </h2>
          <p className="mt-5 text-[18px] leading-[1.6] text-soft md:mt-0 md:self-end">
            Today’s models still struggle with real, multi-step business tasks. To improve, labs need examples of how people
            actually take a job from request to done — and those examples live inside private company systems. We buy that
            data from closed businesses too. A company that has shut down can still license what it left behind.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-[3fr_2fr] md:gap-4">
          <div className="flex min-h-[220px] flex-col justify-between rounded-[20px] bg-ink p-7 text-paper md:min-h-[280px] md:p-10">
            <p className="font-mono text-[13px] text-lime">Inside your business</p>
            <div>
              <p className="text-[15px] text-paper/70">Scarce, and labs are buying</p>
              <p className="mt-2 font-serif text-[34px] font-medium leading-[1.1] md:text-[46px]">
                <RotatingWord words={PRIVATE} offset={0} />
              </p>
            </div>
          </div>
          <div className="flex min-h-[200px] flex-col justify-between rounded-[20px] bg-paper-2 p-7 md:min-h-[280px] md:p-10">
            <p className="font-mono text-[13px] text-muted">On the open web</p>
            <div>
              <p className="text-[15px] text-muted">Already used to train every model</p>
              <p className="mt-2 font-serif text-[28px] font-medium leading-[1.1] text-muted line-through decoration-1 md:text-[34px]">
                <RotatingWord words={PUBLIC} offset={1} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
