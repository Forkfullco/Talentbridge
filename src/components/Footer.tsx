import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line pb-28 md:pb-10">
      <div className="mx-auto max-w-[1080px] px-5 pt-10 md:flex md:items-start md:justify-between md:gap-12 md:px-8">
        <div>
          <Logo size={32} />
        </div>
        <nav aria-label="Legal" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:mt-1">
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
