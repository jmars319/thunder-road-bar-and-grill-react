# Copilot Instructions: Component Updates

**⚠️ Update components gradually. Check each before modifying.**

## Common Updates

### Button Classes

**Find:** `bg-blue-600 text-white`
**Replace:** `bg-primary text-text-inverse`

**Find:** `hover:bg-blue-700`
**Replace:** `hover:bg-primary-dark transition`

### Text Colors

**Find:** `text-gray-700`
**Replace:** `text-text-primary`

**Find:** `text-gray-600`
**Replace:** `text-text-secondary`

### Backgrounds

**Find:** `bg-white`
**Replace:** `bg-surface`

**Find:** `bg-gray-50`
**Replace:** `bg-surface-warm`

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
@workspace Update all bg-white to bg-surface in admin components
```

Use REFERENCE_examples.md for examples