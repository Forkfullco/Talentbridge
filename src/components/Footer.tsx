import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer({ variant = "nurse" }: { variant?: "nurse" | "data" }) {
  return (
    <footer className={`border-t border-line ${variant === "nurse" ? "pb-28 md:pb-10" : "pb-10"}`}>
      <div className="mx-auto max-w-[1080px] px-5 pt-10 md:flex md:items-start md:justify-between md:gap-12 md:px-8">
        <div>
          <Link to="/" aria-label="TalentBridge home">
            <Logo size={32} />
          </Link>
          <p className="mt-5 max-w-[620px] text-[15px] leading-[1.6] text-muted">
            {variant === "nurse"
              ? "TalentBridge is independent and is not affiliated with or employed by the hiring company. We may receive a fee if you are hired."
              : "TalentBridge connects businesses with AI labs that license de-identified operational data. Valuations are estimates, not offers."}
          </p>
        </div>
        <nav aria-label="Footer" className="mt-6 flex flex-col gap-3 md:mt-1 md:items-end">
          {variant === "nurse" ? (
            <Link to="/data" className="text-[15px] font-medium text-ink underline underline-offset-4 hover:text-soft">
              Business data
            </Link>
          ) : (
            <Link to="/" className="text-[15px] font-medium text-ink underline underline-offset-4 hover:text-soft">
              Remote RN roles
            </Link>
          )}
          <Link
            to="/contact"
            className="text-[15px] font-medium text-ink underline underline-offset-4 hover:text-soft"
          >
            Contact
          </Link>
          <Link
            to="/privacy"
            className="text-[15px] font-medium text-ink underline underline-offset-4 hover:text-soft"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-[15px] font-medium text-ink underline underline-offset-4 hover:text-soft"
          >
            Terms &amp; Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
