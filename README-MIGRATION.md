Migration notes and deployment instructions

This branch (`adopt-layout/from-php`) contains the imported PHP site's layout and assets and a serverless function to accept submissions.

What was added
- `src/styles/styles.css` - main stylesheet (trimmed copy). Replace with full file if desired.
- `public/assets/js/main.js` - legacy JS helper (trimmed).
- `src/data/content.json` - site content used by templates.
- `src/components/ReservationForm.tsx` - React component wired to serverless function.
- `src/components/ContactForm.tsx` - React contact form that posts to serverless function.
- `netlify/functions/submit.js` - Netlify function to accept submissions; persists to Airtable when `AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID` are set, and will send an email via SendGrid when `SENDGRID_API_KEY` + `NOTIFY_EMAIL` are set.

Environment variables (set on Netlify or Vercel):
- SENDGRID_API_KEY - optional, for sending notification emails
- SEND_FROM_EMAIL - optional, from email used when sending
- NOTIFY_EMAIL - recipient for form submissions
- AIRTABLE_API_KEY - optional, enable persistence
- AIRTABLE_BASE_ID - optional, enable persistence
- AIRTABLE_TABLE - optional, default depends on submission type

Quick deploy (Netlify)
1. Push this branch to your repo.
2. In Netlify, create a new site and connect your Git repo branch `adopt-layout/from-php`.
3. Add the environment variables mentioned above in Netlify site settings.
4. Netlify will build and serve the React app and expose the serverless function at `/.netlify/functions/submit`.

Local testing
- To test the Netlify function locally, use the Netlify CLI (`netlify dev`) or replace `/.netlify/functions/submit` with `http://localhost:8888/.netlify/functions/submit` when running a local server that exposes the function.

Notes
- This migration intentionally omits PHP server code from the final build. The `php-import` folder contains the original PHP files for reference. After the migration is complete and tested, you can delete `php-import/` and any PHP files to reduce clutter.
