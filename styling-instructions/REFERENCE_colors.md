# Thunder Road Color Reference

Quick reference for all colors in the design system.

---

## Primary Colors

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Primary Red | `#dc2626` | `bg-primary` `text-primary` | Main buttons, links, headers |
| Primary Dark | `#b91c1c` | `bg-primary-dark` | Button hover states |
| Secondary Brown | `#92400e` | `bg-secondary` `text-secondary` | Gradients, supporting elements |
| Accent Orange | `#f59e0b` | `bg-accent` `text-accent` | Highlights, badges, calls-to-action |

---

## Status Colors

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Success | `#059669` | `bg-success` `text-success` | Success messages, confirmations |
| Warning | `#f59e0b` | `bg-warning` `text-warning` | Warnings, alerts |
| Error | `#ef4444` | `bg-error` `text-error` | Errors, delete actions |
| Error Muted | `#ef5b5b` | `bg-error-muted` | Softer destructive actions |

---

## Background Colors

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Background | `#fef7ed` | `bg-background` | Page background (warm cream) |
| Background Light | `#fffbfa` | `bg-background-light` | Admin page background |
| Surface | `#ffffff` | `bg-surface` | Cards, panels (white) |
| Surface Warm | `#fff7f2` | `bg-surface-warm` | Admin cards (warm cream) |

---

## Text Colors

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Primary Text | `#1c1917` | `text-text-primary` | Main body text |
| Secondary Text | `#78716c` | `text-text-secondary` | Supporting text, captions |
| Muted Text | `#94a3b8` | `text-text-muted` | Disabled, placeholder text |
| Inverse Text | `#ffffff` | `text-text-inverse` | Text on dark backgrounds |

---

## Border & Divider

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Border | `#e2e8f0` | `border-border` | Input borders, card borders |
| Divider | `#f1f5f9` | `border-divider` | Section dividers, separators |

---

## Admin Specific

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Admin Gradient 1 | `#dc2626` | `bg-admin-grad1` | Admin accent stripe (start) |
| Admin Gradient 2 | `#92400e` | `bg-admin-grad2` | Admin accent stripe (end) |
| Admin Card BG | `#fff7f2` | `bg-admin-cardBg` | Admin card background |
| Admin Page BG | `#fffbfa` | `bg-admin-pageBg` | Admin page background |

---

## Dark Mode Colors

Colors automatically adjust in dark mode:

| Light Mode | Dark Mode | Tailwind Class |
|------------|-----------|----------------|
| `#fef7ed` | `#0f172a` | `bg-background` |
| `#ffffff` | `#1e293b` | `bg-surface` |
| `#1c1917` | `#f1f5f9` | `text-text-primary` |
| `#78716c` | `#94a3b8` | `text-text-secondary` |
| `#e2e8f0` | `#334155` | `border-border` |

---

## Quick Usage Examples

### Buttons
```jsx
<button className="bg-primary text-text-inverse">Primary</button>
<button className="bg-secondary text-text-inverse">Secondary</button>
<button className="bg-accent text-text-primary">Accent</button>
```

### Text
```jsx
<h1 className="text-text-primary">Heading</h1>
<p className="text-text-secondary">Body text</p>
<small className="text-text-muted">Caption</small>
```

### Backgrounds
```jsx
<div className="bg-background">Page</div>
<div className="bg-surface">Card</div>
<div className="bg-surface-warm">Admin Card</div>
```

### Status
```jsx
<div className="bg-success text-text-inverse">Success!</div>
<div className="bg-error text-text-inverse">Error!</div>
<div className="bg-warning text-text-inverse">Warning!</div>
```