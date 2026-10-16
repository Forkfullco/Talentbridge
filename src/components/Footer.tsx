import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line pb-28 md:pb-10">
      <div className="mx-auto max-w-[1080px] px-5 pt-10 md:flex md:items-start md:justify-between md:gap-12 md:px-8">
        <div>
          <Logo size={32} />
          <p className="mt-5 max-w-[620px] text-[15px] leading-[1.6] text-muted">
            TalentBridge is independent and is not affiliated with or employed by the hiring company. We may receive a fee if
            you are hired.
          </p>
        </div>
        <nav aria-label="Legal" className="mt-6 md:mt-1">
          <a href="#privacy" className="text-[15px] font-medium text-ink underline underline-offset-4 hover:text-soft">
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
