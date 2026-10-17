# TalentBridge

Landing page for the remote RN / AI-training role. Apply opens a pre-qualification modal; leads go to a Google Sheet and qualified applicants get a Gmail sequence.

## Live

- Site: https://talentbridge-4pb.pages.dev/ (custom domain: talentbridgeremote.com)
- Cloudflare Pages project: `talentbridge`
- Leads sheet: https://docs.google.com/spreadsheets/d/1hy0KYNqXzk3nwBDJq5YsuEomNCQb4bCdPNGoujA_Mec/edit

## Local

```bash
npm install
npm run dev    # http://127.0.0.1:18741/
```

Local `/api/apply` is a Vite middleware so the form is previewable. It only writes the Google Sheet / sends email when `APPS_SCRIPT_URL` and `APPLY_SECRET` are set in the environment.

## Production deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=talentbridge --branch=main
npx wrangler pages secret put APPLY_SECRET --project-name=talentbridge
npx wrangler pages secret put APPS_SCRIPT_URL --project-name=talentbridge
```

Worker/Pages routes:

- `POST /api/apply` — save lead, fire email 1 if qualified
- `GET|POST /api/applied` — mark Sheet status `Applied` and stop reminders (`?t=` or JSON `{ token }`)

Google Apps Script (Gmail + Sheet + hourly reminders): see [`apps-script/README.md`](apps-script/README.md). Unqualified (RN = No **or** inpatient/bedside = No) is stored as `Not qualified` and never shown the micro1 CTA.
