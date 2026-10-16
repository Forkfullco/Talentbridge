import { useEffect } from "react";
import { LegalLayout } from "./LegalLayout";

const UPDATED = "October 16, 2026";

export function TermsPage() {
  useEffect(() => {
    document.title = "Terms & Conditions | Talent Bridge";
  }, []);

  return (
    <LegalLayout title="Terms & Conditions">
      <p className="font-mono text-[13px] text-muted">Last updated: {UPDATED}</p>

      <p>
        These Terms &amp; Conditions (“Terms”) govern your use of the TalentBridge website at
        talentbridgeremote.com and related pages (the “Site”). By using the Site, you agree to these Terms. If
        you do not agree, do not use the Site.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Who we are</h2>
      <p>
        TalentBridge provides information about remote registered-nurse and related professional opportunities
        and may link you to third-party application flows. We are not the employer for roles promoted on the
        Site unless we expressly say otherwise. Hiring decisions, interviews, pay, scheduling, and employment
        terms are controlled by the hiring company or platform you apply to (for example, Micro1 or its
        customers).
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Eligibility</h2>
      <p>
        The Site is directed at adults in the United States who hold (or are pursuing) appropriate
        professional credentials, such as an active US RN license where a role requires it. You are
        responsible for confirming that you meet any stated qualifications before applying.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Informational only — no job guarantee</h2>
      <p>
        Content on the Site—including pay ranges, hours, and role descriptions—is for general information and
        may change. We do not guarantee that any position is available, that you will be hired, or that pay or
        conditions will match estimates shown. Always verify details on the hiring partner’s application pages.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Outbound applications</h2>
      <p>
        When you select Apply, you may be taken to a third-party site to complete an application or interview.
        Your use of that site is subject to the third party’s terms and privacy policy. TalentBridge is not
        responsible for the content, security, or hiring outcomes of third-party sites.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Acceptable use</h2>
      <p>You agree not to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Misrepresent your identity, credentials, or eligibility</li>
        <li>Scrape, overload, or attempt to disrupt the Site</li>
        <li>Use the Site for unlawful purposes or to harm others</li>
        <li>Copy or reuse Site content except for personal, non-commercial use</li>
      </ul>

      <h2 className="font-serif text-[24px] font-medium text-ink">Intellectual property</h2>
      <p>
        The Site’s text, design, logos, and other materials are owned by TalentBridge or its licensors and are
        protected by intellectual-property laws. You may not use our marks without prior written permission.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Disclaimers</h2>
      <p>
        THE SITE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM
        ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL
        COMPONENTS.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, TALENTBRIDGE AND ITS AFFILIATES WILL NOT BE LIABLE FOR ANY
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR
        OPPORTUNITY, ARISING FROM YOUR USE OF THE SITE OR FROM ANY APPLICATION OR EMPLOYMENT PROCESS WITH A
        THIRD PARTY. OUR TOTAL LIABILITY FOR CLAIMS RELATING TO THE SITE WILL NOT EXCEED ONE HUNDRED US DOLLARS
        (US $100).
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Indemnity</h2>
      <p>
        You agree to indemnify and hold TalentBridge harmless from claims arising out of your misuse of the
        Site, your application materials, or your violation of these Terms or applicable law.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Privacy</h2>
      <p>
        Our collection and use of personal information is described in our{" "}
        <a href="/privacy" className="font-medium text-ink underline underline-offset-4">
          Privacy Policy
        </a>
        , which is incorporated by reference.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Changes</h2>
      <p>
        We may revise these Terms by posting an updated version on the Site. The “Last updated” date will
        change when we do. Continued use after changes means you accept the new Terms.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Governing law</h2>
      <p>
        These Terms are governed by the laws of the United States and the State of Delaware, without regard to
        conflict-of-law rules, except where mandatory consumer protections in your state require otherwise.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Contact</h2>
      <p>
        Questions about these Terms: email{" "}
        <a href="mailto:legal@talentbridgeremote.com" className="font-medium text-ink underline underline-offset-4">
          legal@talentbridgeremote.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}
