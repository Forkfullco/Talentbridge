import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { APPLY_URL } from "../lib/apply";
import { trackLead } from "../tracking/metaPixel";
import { markApplied } from "../lib/sessionFlags";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="TalentBridge home">
          <Logo />
        </Link>
        <a
          href={APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            markApplied();
            trackLead();
          }}
          className="text-[15px] font-medium text-ink underline-offset-4 hover:underline"
        >
          Apply now
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </header>
  );
}
