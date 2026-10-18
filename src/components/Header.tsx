import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { openApplyForm } from "../lib/applyModal";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="TalentBridge home">
          <Logo />
        </Link>
        <div className="flex items-center gap-3 md:gap-5">
          <Link to="/contact" className="text-[15px] font-medium text-ink underline-offset-4 hover:underline">
            Contact
          </Link>
          <button
            type="button"
            onClick={openApplyForm}
            aria-haspopup="dialog"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-lime px-4 text-[15px] font-semibold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-lime-hover active:translate-y-px md:px-5"
          >
            Apply now
          </button>
        </div>
      </div>
    </header>
  );
}
