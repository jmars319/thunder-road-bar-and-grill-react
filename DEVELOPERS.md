DEVELOPERS.md — Thunder Road (frontend)

Purpose
-------
This document is a short onboarding and reference for developers working on the
Thunder Road frontend. It summarizes the runtime theming system, global toast
API, admin module contract, common API endpoints the frontend expects, testing
commands, and a short checklist for tokenizing Tailwind color classes.

Quick start
-----------
- Frontend folder: `frontend/` (Create React App)
- Run tests (single run):

```bash
cd frontend
npm install
npm test -- --watchAll=false
```

Theme system
------------
- Theming is implemented with CSS variables and a small React context:
  - `frontend/src/contexts/ThemeContext.js` exposes `{ theme, setTheme }` where
    `theme` is one of `"light" | "dark" | "system"`.
  - The provider sets `data-theme` on `<html>` to `light` or `dark` or removes
    the attribute for `system` so CSS can use `prefers-color-scheme`.
- Design tokens are exposed as CSS variables (look in custom styles / Tailwind
  config). Components should use token-aware classes (e.g. `bg-surface`,
  `text-text-primary`) rather than literal color classes.

Toast API
---------
- `frontend/src/contexts/ToastContext.js` provides a small API:
  - `add(message, options)` -> id
  - `remove(id)`
  - `toasts` array
- Options supported: `type` (info|success|warning|error), `duration` (ms),
  `persistent` (bool).
- Visual styling is in the provider; replace icons or container classes there to
  alter appearance globally.

Admin module contract
---------------------
- Admin modules are registered in `frontend/src/pages/AdminPanel.js` via the
  `AdminModules` object. Each entry is a module object with shape:

```js
{ component: <React component>, name: 'Human Name', icon: IconComponent }
```

- Modules are expected to be self-contained components that fetch and manage
  their own data. Keep the API contract narrow and predictable (e.g., endpoints
  described in module header comments).

Common API endpoints (frontend expectations)
-------------------------------------------
Below are the primary endpoints the frontend calls; confirm exact payloads
against the backend code in `backend/routes/`.

- GET /api/menu
- GET /api/about
- GET /api/footer-columns
- GET /api/newsletter/subscribers
- DELETE /api/newsletter/subscribers/:id
- GET /api/media
- POST /api/upload (multipart/form-data)
- POST /api/reservations
- POST /api/login
- GET /api/business-hours

DEVELOPMENT NOTES
-----------------
- API base in many files is `const API_BASE = 'http://localhost:5001/api'`.
  Replace with `process.env.REACT_APP_API_BASE` or a small config module for
  production deployments.

- Accessibility:
  - Most pages now include labels and `aria-live` for error toasts. Ensure
    child components maintain accessible landmarks (nav, main, footer).

- Testing:
  - A representative Jest test exists at `frontend/src/App.test.js`. Use
    `npm test -- --watchAll=false` for CI-style single runs.

Tokenization checklist (Tailwind refactor to design tokens)
----------------------------------------------------------
1. Identify literal color classes (e.g. `bg-[#123456]` or `bg-blue-500`) and
   replace with semantic token classes (`bg-primary`, `bg-surface`,
   `text-text-primary`).
2. Ensure CSS variables backing tokens exist in `src/custom-styles.css` and
   `tailwind.config.js` reads them via `var(--token-name)`.
3. Run the app and visually spot-check admin and public pages at light/dark
   modes.
4. For high-risk changes (forms, admin tables), create a quick screenshot test
   or manual QA checklist.

Small migration tips
--------------------
- Start with low-risk areas: footer, navbar, and public hero.
- Keep admin layout untouched while updating tokens.
- When in doubt, add a new token and map it to the existing color; do not
  remove old classes until everything is migrated.

Contact / next steps
--------------------
If you want, I can:
- Run a final pass to replace literal Tailwind color classes with token
  classes (I will do this file-by-file and run tests after batches).
- Create small visual QA steps or snapshot tests for critical admin pages.

Consolidated backend reference (quick)
------------------------------------
This is a short, actionable summary of server endpoints and shapes. Always
confirm exact inputs/outputs by checking the route files in `backend/routes` —
these are kept intentionally small and documented at the top of each file.

Auth & sessions
- POST /api/login  — { email, password } -> 200 { user, token } | 401
- POST /api/logout — clears server-side session/cookie (if used)

Menu & content
- GET /api/menu — returns array of menu items/categories
- GET /api/about — page content for About section
- GET /api/footer-columns — array of footer column objects

Newsletter & subscribers
- GET /api/newsletter/subscribers — array of subscriber objects
- DELETE /api/newsletter/subscribers/:id — removes subscriber

Media and uploads
- GET /api/media — list media entries (url, type, id)
- POST /api/upload — multipart/form-data, file field `file`. Server uses
  multer with a 5MB limit and MIME filtering. Returns saved media metadata.

Reservations & business hours
- POST /api/reservations — reservation payload (name, partySize, time,
  contact) -> 200 success or 400 validation errors
- GET /api/business-hours — returns weekly business-hours object

Jobs, contact, settings
- POST /api/jobs (contact form / job application flow, may include file)
- POST /api/contact — contact form submission
- GET/POST/PUT /api/settings — site settings; check `backend/routes/settings.js`

Runtime & environment notes
---------------------------
- Backend: the server attaches a DB connection and the upload middleware to
  requests (check `server.js` for how `req.db` and `app.get('upload')` are
  configured). Avoid assuming ORM behavior — queries use `mysql2`.
- Frontend: default API base is `http://localhost:5001/api`. Prefer reading
  from `process.env.REACT_APP_API_BASE` or `public/config.json` for deploys.

Developer checklist (final pass)
--------------------------------
1. Sweep the frontend for literal Tailwind color usages and replace with
   token classes (e.g. `bg-primary`, `text-muted`). Keep changes small and
   test after each batch (5–10 files).
2. Confirm every `backend/routes/*.js` file contains a short top-level
   header describing endpoints and payload shapes.
3. Add (or update) small snapshot tests for critical admin modules
   (DashboardModule, InboxModule, JobsModule) before changing layout tokens.
4. Ensure `REACT_APP_API_BASE` is set for CI and production builds.

How to run locally (concise)
----------------------------
- Start the backend:

```bash
cd backend
npm install
npm start
```

- Start the frontend (dev server):

```bash
cd frontend
npm install
npm start
```

- Run frontend tests (single CI-style run):

```bash
cd frontend
npm test -- --watchAll=false
```

Where to next (I can do these if you want)
----------------------------------------
- Finish the repo sweep and add any remaining `Purpose:` headers (I can run
  one more pass and mark modified files).  
- Generate a condensed `API_REFERENCE.md` from the headers in
  `backend/routes/` (machine-assistable — I can extract and assemble it).
- Convert inline Tailwind color literals to tokens in a safe, staged PR.

---

Completed: Update this file with the consolidated backend summary and run
steps.

Recent frontend theming/tokenization updates
-------------------------------------------
- Files updated in the latest batch:
  - `frontend/src/pages/AdminPanel.js`
  - `frontend/src/components/admin/MenuModule.js`
  - `frontend/src/pages/LoginPage.js`
  - `frontend/src/components/public/PublicFooter.js`
  - `frontend/src/components/admin/SettingsModule.js`

These small changes standardize the runtime `API_BASE` usage and swap a few
literal/backdrop classes for token-aware helpers (`modal-backdrop`,
`text-text-inverse`, etc.).

