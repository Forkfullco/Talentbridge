# TalentBridge lead email + Sheet backend

Google Apps Script web app that:

- Appends each apply to [TalentBridge Apply Leads](https://docs.google.com/spreadsheets/d/1hy0KYNqXzk3nwBDJq5YsuEomNCQb4bCdPNGoujA_Mec/edit)
- Emails qualified leads immediately, at +24 hours, and at +3 days (Gmail)
- Stops the sequence when they open **I’ve applied** (`/applied?t=…`)

## Deploy

1. Open the Sheet → **Extensions → Apps Script**.
2. Replace `Code.gs` with this folder’s `Code.gs`. (Optional: paste `appsscript.json` via Project Settings.)
3. **Project Settings → Script properties**

   | Key | Value |
   | --- | --- |
   | `APPLY_SECRET` | Same as Cloudflare Pages secret `APPLY_SECRET` |
   | `SITE_URL` | `https://talentbridge-4pb.pages.dev` (or `https://talentbridgeremote.com` once DNS is green) |
   | `APPLY_URL` | Micro1 job URL |
   | `FROM_NAME` | `TalentBridge` |

4. Run `setup()` (authorize Gmail + Sheets). This installs an hourly reminder trigger.
5. **Deploy → New deployment → Web app**: execute as **Me**, who has access **Anyone**.
6. Copy the web app URL into Cloudflare secret `APPS_SCRIPT_URL`.

Cloudflare Pages Functions `/api/apply` and `/api/applied` proxy to this web app so the Sheet credential never sits in the static site.
