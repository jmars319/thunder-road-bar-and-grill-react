# Thunder Road Font Reference

Complete guide to typography in the design system.

---

## Font Families

### Body Font (Default)
**Family:** Roboto, Open Sans, -apple-system, system-ui  
**Tailwind:** `font-sans`  
**Usage:** Body text, UI elements, forms, buttons
```jsx
<p className="font-sans">Regular body text</p>
```

---

### Heading Font
**Family:** Impact, Anton, Arial Black  
**Tailwind:** `font-heading`  
**Usage:** H1-H6, page titles, section headers
```jsx
<h1 className="font-heading">Main Heading</h1>
<h2 className="font-heading">Subheading</h2>
```

---

### Accent Font (Decorative)
**Family:** Pacifico, Brush Script MT, cursive  
**Tailwind:** `font-accent`  
**Usage:** Decorative text, "Since 2008", special callouts
```jsx
<span className="font-accent">Since 2008</span>
```

---

### Monospace Font (Numbers)
**Family:** Roboto Mono, ui-monospace, monospace  
**Tailwind:** `font-mono`  
**Usage:** Prices, numbers, codes
```jsx
<span className="font-mono">$12.99</span>
<span className="price-badge">$12.99</span> {/* Also uses mono */}
```

---

## Font Sizes

| Size | Class | Rem | Pixels | Usage |
|------|-------|-----|--------|-------|
| XS | `text-xs` | 0.75rem | 12px | Captions, badges |
| SM | `text-sm` | 0.875rem | 14px | Small text, labels |
| Base | `text-base` | 1rem | 16px | Body text (default) |
| LG | `text-lg` | 1.125rem | 18px | Emphasized text |
| XL | `text-xl` | 1.25rem | 20px | Small headings |
| 2XL | `text-2xl` | 1.5rem | 24px | H3 headings |
| 3XL | `text-3xl` | 1.875rem | 30px | H2 headings |
| 4XL | `text-4xl` | 2.25rem | 36px | H1 headings |
| 5XL | `text-5xl` | 3rem | 48px | Hero text |

---

## Font Weights

| Weight | Class | Value | Usage |
|--------|-------|-------|-------|
| Normal | `font-normal` | 400 | Body text |
| Medium | `font-medium` | 500 | Navigation, labels |
| Semibold | `font-semibold` | 600 | Subheadings |
| Bold | `font-bold` | 700 | Headings, emphasis |
| Extrabold | `font-extrabold` | 800 | Hero text |

---

## Typography Hierarchy

### Hero Section
```jsx
<h1 className="font-heading font-extrabold text-5xl md:text-6xl text-text-inverse">
  Welcome to Thunder Road
</h1>
<p className="text-xl md:text-2xl text-text-muted opacity-90">
  Great Food. Cold Drinks. Good Times.
</p>
```

### Page Headings
```jsx
<h1 className="font-heading font-bold text-4xl text-text-primary">
  Main Page Title
</h1>
<h2 className="font-heading font-bold text-3xl text-text-primary">
  Section Title
</h2>
<h3 className="font-heading font-semibold text-2xl text-text-primary">
  Subsection
</h3>
```

### Body Text
```jsx
<p className="text-base text-text-primary leading-relaxed">
  Regular paragraph text with comfortable line height.
</p>
<p className="text-sm text-text-secondary">
  Supporting or secondary information.
</p>
<small className="text-xs text-text-muted">
  Fine print or captions.
</small>
```

### Prices
```jsx
<span className="font-mono text-2xl font-bold text-text-primary">
  $12.99
</span>
{/* Or use price badge */}
<span className="price-badge">$12.99</span>
```

### Decorative Text
```jsx
<span className="font-accent text-lg text-accent">
  Since 2008
</span>
```

---

## Loading Google Fonts

Fonts are loaded in `custom-styles.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Roboto+Mono:wght@700&family=Pacifico&display=swap');
```

**Fonts loaded:**
- Roboto: 400, 500, 700, 900
- Roboto Mono: 700
- Pacifico: (default weight)

---

## Common Patterns

### Card Title
```jsx
<h3 className="font-heading font-bold text-xl text-text-primary mb-4">
  Card Title
</h3>
```

### Button Text
```jsx
<button className="font-sans font-bold text-base">
  Click Me
</button>
```

### Menu Item
```jsx
<h4 className="font-heading font-semibold text-lg text-text-primary">
  Burger Name
</h4>
<p className="font-sans text-sm text-text-secondary mt-1">
  Description
</p>
<span className="font-mono text-2xl font-bold text-primary">
  $9.99
</span>
```

### Admin Header
```jsx
<h1 className="font-heading font-bold text-2xl text-text-primary">
  Dashboard
</h1>
```

---

## Responsive Typography

Use responsive classes for better mobile experience:
```jsx
<h1 className="text-3xl md:text-4xl lg:text-5xl font-heading">
  Responsive Heading
</h1>

<p className="text-sm md:text-base lg:text-lg">
  Responsive body text
</p>
```

---

## Line Heights

| Class | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.25 | Headings |
| `leading-normal` | 1.5 | UI text |
| `leading-relaxed` | 1.625 | Body text |
| `leading-loose` | 2 | Spacious paragraphs |

---

## Best Practices

✅ **Use font-heading for all H1-H6**  
✅ **Use font-mono for all prices**  
✅ **Use font-accent sparingly for special text**  
✅ **Body text defaults to font-sans (no need to specify)**  
✅ **Combine size + weight for hierarchy**  

❌ **Don't mix heading and body fonts arbitrarily**  
❌ **Don't use accent font for long text**  
❌ **Don't forget responsive classes on hero text**
```