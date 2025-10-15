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

