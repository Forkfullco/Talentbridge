# TalentBridge

Landing page for the remote RN / AI-training role. Apply opens a pre-qualification modal. Leads are stored in Cloudflare D1 (`talentbridge-leads`). Email reminders are scheduled on the row (`email_status = needs_provider`) and are not sent until a provider such as Resend or Brevo is connected.

## Live

- Site: https://talentbridge-4pb.pages.dev/ (custom domain: talentbridgeremote.com)
- Cloudflare Pages project: `talentbridge`
- Leads: `GET /api/leads?secret=APPLY_SECRET` (HTML, or `&format=json` / `&format=csv`)

## Local

```bash
npm install
npm run dev    # http://127.0.0.1:18741/
```

Local `/api/apply` is a Vite middleware so the form is previewable. Production writes D1.

## Production deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=talentbridge --branch=main
npx wrangler pages secret put APPLY_SECRET --project-name=talentbridge
npx wrangler d1 execute talentbridge-leads --remote --file=d1/schema.sql
```

View leads:

```bash
npx wrangler d1 execute talentbridge-leads --remote --command "SELECT id, timestamp, first_name, email, status, email_status FROM leads ORDER BY id DESC"
```

Routes:

- `POST /api/apply` — insert the lead into D1 (`stored: true`) and send the first follow-up when Resend is configured.
- `GET|POST /api/applied` — set status `Applied` and stop the scheduled sequence (`?t=` or JSON `{ token }`)
- `GET /api/leads?secret=` — HTML table; add `format=json` or `format=csv`
- `POST /api/contact` — email the message to talent@talentbridgeremote.com (Reply-To is the visitor)
- `/contact` — contact form

Unqualified (RN = No) is stored as `Not qualified`. Bedside experience is stored and preferred, and a No there still gets status New and the qualified follow-up. Qualified applicants on a phone still get the application link by email.
