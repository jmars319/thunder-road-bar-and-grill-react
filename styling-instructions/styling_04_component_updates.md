# Copilot Instructions: Component Updates

**⚠️ Update components gradually. Check each before modifying.**

## Common Updates

### Button Classes

Use tokens for button backgrounds and text. Example replacements:

- Primary: `bg-primary text-text-inverse` (hover: `hover:bg-primary-dark transition`)
- Ghost/transparent: `bg-transparent text-text-primary border border-border`

### Text Colors

**Text color guidance:** Replace legacy gray text classes with tokens:

- `text-text-primary` — main body text
- `text-text-secondary` — secondary/supporting text

### Backgrounds

Use surface tokens for backgrounds:

- Page background / warm: `bg-background` / `bg-surface-warm`
- Cards and panels: `bg-surface`

## Components to Update

Process these in order:

1. PublicNavbar.js
2. HeroSection.js
3. MenuSection.js
4. ReservationSection.js
5. AboutSection.js
6. PublicFooter.js
7. AdminPanel.js
8. All admin modules

## Copilot Commands
```
@workspace Update PublicNavbar.js button colors from blue to primary
@workspace Replace gray text colors with text-primary/secondary in HeroSection.js
Note: When updating admin components, use surface tokens such as `bg-surface` or `bg-surface-warm` for card and panel backgrounds.
```

Use REFERENCE_examples.md for examples