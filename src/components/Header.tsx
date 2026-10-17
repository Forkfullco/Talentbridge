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
        <button
          type="button"
          onClick={openApplyForm}
          aria-haspopup="dialog"
          className="text-[15px] font-medium text-ink underline-offset-4 hover:underline"
        >
          Apply now
        </button>
      </div>
    </header>
  );
}
