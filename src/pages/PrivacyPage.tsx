import { useEffect } from "react";
import { LegalLayout } from "./LegalLayout";

const UPDATED = "October 17, 2026";

export function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | Talent Bridge";
  }, []);

  return (
    <LegalLayout title="Privacy Policy">
      <p className="font-mono text-[13px] text-muted">Last updated: {UPDATED}</p>

      <p>
        TalentBridge (“we,” “us,” or “our”) operates the website at talentbridgeremote.com and related pages
        (the “Site”). This Privacy Policy explains what information we collect when you visit the Site, how we
        use it, and the choices you have. The Site promotes remote registered-nurse opportunities, collects a
        short pre-qualification form, and — when the role is a fit — links you to an external application
        hosted by a hiring partner (currently Micro1).
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Information we collect</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-medium text-ink">Usage data.</span> When you browse the Site, we and our
          providers may collect standard log and device information such as IP address, browser type, pages
          viewed, referring URL, and approximate location derived from IP.
        </li>
        <li>
          <span className="font-medium text-ink">Cookies and similar technologies.</span> We use cookies, pixels,
          and similar tools for site function, analytics, and advertising measurement. See “Google Analytics,”
          “Microsoft Clarity,” and “Meta Pixel” below.
        </li>
        <li>
          <span className="font-medium text-ink">Information you choose to share.</span> If you submit the Apply
          form we collect your first name, email, optional phone number, RN license and bedside-experience
          answers, optional state of licensure, whether you are on a laptop/desktop, email-consent, and campaign
          tags (UTM parameters) from the link you used. That record is stored in a Google Sheet we control.
        </li>
      </ul>

      <h2 className="font-serif text-[24px] font-medium text-ink">How we use information</h2>
      <p>We use information to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Operate, secure, and improve the Site</li>
        <li>
          Measure traffic, engagement, and campaign performance (including Google Analytics, Microsoft Clarity,
          and Meta ads)
        </li>
        <li>Understand whether visitors submit Apply and related conversion events</li>
        <li>
          Email you the application link and a short reminder sequence when you qualify, and tell you about
          similar remote roles
        </li>
        <li>Comply with law and enforce our Terms</li>
      </ul>

      <h2 className="font-serif text-[24px] font-medium text-ink">Google Analytics</h2>
      <p>
        We use Google Analytics (gtag.js, measurement ID G-CW1HP8BX8B) to understand how visitors use the Site
        (for example pages viewed, sessions, and approximate geography). Google may process this data under{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink underline underline-offset-4"
        >
          Google’s Privacy Policy
        </a>
        . When you successfully submit the Apply form we may also send a{" "}
        <span className="font-medium text-ink">generate_lead</span> event to Google Analytics for conversion
        measurement. You can limit Google Analytics via browser controls or Google’s opt-out tools where
        available.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Microsoft Clarity</h2>
      <p>
        We use Microsoft Clarity (project ID yysg03c2b0) to understand how visitors interact with the Site,
        including session recordings, heatmaps, and aggregated usage metrics. Clarity may collect device and
        interaction data and process it under{" "}
        <a
          href="https://privacy.microsoft.com/privacystatement"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink underline underline-offset-4"
        >
          Microsoft’s Privacy Statement
        </a>
        . You can limit this via browser controls or Clarity/Microsoft privacy settings where available.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Meta Pixel and advertising</h2>
      <p>
        We use the Meta (Facebook) Pixel on the Site. The Pixel helps us measure PageViews and “Lead” events
        when you successfully submit the Apply form, and may help Meta deliver or measure ads. Meta may receive
        identifiers and event data and combine them with other information it holds under{" "}
        <a
          href="https://www.facebook.com/privacy/policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink underline underline-offset-4"
        >
          Meta’s Privacy Policy
        </a>
        . You can control ad preferences in your Meta account and through browser or device settings.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Google Sheets, email follow-ups, and Pixel Lead</h2>
      <p>
        Form submissions are stored in Google Sheets (Google may process that data under{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink underline underline-offset-4"
        >
          Google’s Privacy Policy
        </a>
        ). If you qualify, we use Gmail (via Google Apps Script) to send an immediate application link and up
        to two reminders (about 24 hours and 3 days later). Each of those emails includes an “I’ve applied”
        link that updates your Sheet status to Applied and stops further reminders. Unqualified submissions are
        stored with status “Not qualified” and are not sent the micro1 application link. A Meta Pixel{" "}
        <span className="font-medium text-ink">Lead</span> event and a Google Analytics{" "}
        <span className="font-medium text-ink">generate_lead</span> event fire after a successful form save.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Outbound apply / hiring partner</h2>
      <p>
        Qualified applicants may open a third-party application (for example, on jobs.micro1.ai). We do not
        control that site. Information you submit there is governed by the hiring partner’s privacy policy and
        terms, not this one. We may learn that you started or confirmed an application (for follow-up and
        measurement) without receiving your full application package.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Sharing</h2>
      <p>
        We may share limited data with service providers who help us host the Site (such as Cloudflare), store
        form records and send follow-up email (Google Sheets and Gmail), run analytics or ads (such as Google
        Analytics, Microsoft Clarity, and Meta), or operate our business—under appropriate confidentiality
        obligations. We may also disclose information if required by law or to protect rights and safety. We
        do not sell your personal information for money.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Retention &amp; security</h2>
      <p>
        We retain information only as long as needed for the purposes above or as required by law. We use
        reasonable technical and organizational measures to protect data, but no method of transmission or
        storage is fully secure.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Your choices (US)</h2>
      <p>
        Depending on where you live, you may have rights to request access, correction, or deletion of
        personal information we hold about you, or to opt out of certain targeted advertising. To exercise
        these rights, contact us using the details below. You can also block cookies in your browser; some
        Site features may not work as intended if you do.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Children</h2>
      <p>
        The Site is intended for adults seeking professional nursing work. We do not knowingly collect
        personal information from children under 16.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Changes</h2>
      <p>
        We may update this Policy from time to time. The “Last updated” date at the top will change when we
        do. Continued use of the Site after an update means you accept the revised Policy.
      </p>

      <h2 className="font-serif text-[24px] font-medium text-ink">Contact</h2>
      <p>
        Questions about this Policy: email{" "}
        <a href="mailto:privacy@talentbridgeremote.com" className="font-medium text-ink underline underline-offset-4">
          privacy@talentbridgeremote.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}
