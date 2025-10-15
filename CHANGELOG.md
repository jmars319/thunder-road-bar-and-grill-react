# Changelog

All notable changes to this repository are documented in this file.

## [Unreleased] - 2025-10-14

### Added
- Runtime theming support (light/dark/system) using CSS variables and a `ThemeContext`.
- `ThemeToggle` component with Sun/Moon/Monitor icons and reduced-motion-safe animation.
- Tailwind color mapping to CSS variables so utilities respond to runtime theme changes.
- `CHANGELOG.md` (this file).

### Changed
- Replaced many literal Tailwind color utilities (e.g., `bg-white`, `text-gray-*`, direct hex usage) with design tokens across the frontend to centralize brand colors.
- Tokenized toast variants and improved global `ToastContext` appearance.
- Admin components: audited and updated text color tokens for both dark and light modes; ensured headings, labels, and table text use appropriate `text-text-primary`/`text-text-secondary` or `text-text-inverse` depending on context.
- Improved `.form-input` styles for better contrast and placeholder readability in login and admin forms.
- Mapped Tailwind theme values to CSS variables in `tailwind.config.js` so runtime changes apply to utility classes.

### Fixed
- Fixed low-contrast issues in admin panels for dark mode by correcting dark-mode variables (notably `--text-inverse`) and applying explicit token classes where needed.
- Fixed light-mode contrast issues by updating text tokens on light surfaces (`bg-surface`, `bg-surface-warm`).
- Removed temporary CSS override that forced `.bg-surface-dark .text-*` to `--text-inverse` when explicit fixes were in place.

### Maintenance
- Created a non-destructive `main-clean` branch containing a single cleaned commit for review before replacing `main`. The cleaned branch is available at `origin/main-clean`.
- Pushed the finalized changes to `main` and removed the temporary feature branch `adopt-layout/from-php` from the remote.

### Notes / How to review
- The `main-clean` branch is pushed and a PR can be created from it (or merged directly). Review the PR to confirm the squashed history and file changes.
- To test locally:
  - Install dependencies and build the frontend: `cd frontend && npm install && npm run build`.
  - Start the dev server for visual QA: `cd frontend && npm start` and visit the admin pages; use the ThemeToggle to test Light/Dark/System.

### Next steps (suggested)
- Visual QA: capture screenshots for main admin pages in both themes and verify toasts, modals, and forms.
- Optionally replace `main` with the cleaned history (`main-clean`) after review (force-push) or merge the PR using GitHub's squash merge.
- Add release tag if you're ready to publish.

---

For a complete commit history, refer to `git log` or the GitHub commits page.
