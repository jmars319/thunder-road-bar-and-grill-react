Unreleased (docs & minor robustness) - 2025-10-14

Added
- `DEVELOPERS.md` — concise developer onboarding and reference for the frontend
  (theme tokens, ToastContext, AdminModule contract, API endpoints, testing notes).

Changed
- Annotated many frontend files with developer-friendly comments to clarify
  data shapes and expected API behavior.

Fixed
- `frontend/src/components/admin/NewsletterModule.js`: export now wrapped in
  try/catch and delete failures log to console for easier debugging.
