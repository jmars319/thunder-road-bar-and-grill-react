# Component Styling Examples

Before and after examples for updating your React components with Thunder Road styling.

---

## 🎨 Buttons

### **Primary Button**

**Before:**
```jsx
<button className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark transition">
  Submit
</button>
```

**After:**
```jsx
<button className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark transition font-bold">
  Submit
</button>
```

**Or use gradient (matches admin style):**
```jsx
<button className="btn-gradient px-4 py-2 rounded-lg text-text-inverse font-bold transition hover:brightness-95">
  Submit
</button>
```

---

### **Secondary/Ghost Button**

**Before:**
```jsx
<button className="bg-surface text-text-primary border border-border px-4 py-2 rounded-lg hover:bg-surface-warm">
  Cancel
</button>
```

**After:**
```jsx
<button className="bg-transparent text-text-primary border border-border px-4 py-2 rounded-lg hover:bg-surface-warm transition">
  Cancel
</button>
```

---

### **Danger Button**

**Before:**
```jsx
<button className="bg-error text-text-inverse px-4 py-2 rounded-lg hover:brightness-95">
  Delete
</button>
```

**After:**
```jsx
<button className="bg-error text-text-inverse px-4 py-2 rounded-lg hover:brightness-95 transition">
  Delete
</button>
```

---

## 🏠 Navbar

### **PublicNavbar.js**

**Before:**
```jsx
<nav className="bg-surface shadow-md header-sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center h-20">
      <div className="text-xl font-bold text-text-primary">
        Thunder Road Bar and Grill
      </div>
      <div className="flex items-center gap-8">
        <a href="#menu" className="text-text-secondary hover:text-primary">
          Menu
        </a>
      </div>
    </div>
  </div>
</nav>
```

**After:**
```jsx
<nav className="bg-surface shadow-md header-sticky top-0 z-50 backdrop-blur-lg">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center h-20">
      <div className="logo-badge">
        <img src={logo} alt="Thunder Road" className="h-11 w-auto" />
      </div>
      <div className="flex items-center gap-8">
        <a href="#menu" className="text-text-secondary hover:text-primary font-medium transition">
          Menu
        </a>
        <button className="bg-primary text-text-inverse px-4 py-2 rounded-lg hover:bg-primary-dark transition font-bold">
          Admin
        </button>
      </div>
    </div>
  </div>
</nav>
```

---

## 🦸 Hero Section

### **HeroSection.js**

**Before:**
```jsx
<div className="hero-gradient text-text-inverse py-32">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6">
      Welcome to Thunder Road
    </h1>
    <p className="text-xl md:text-2xl text-text-muted mb-8">
      Great Food. Cold Drinks. Good Times.
    </p>
    <div className="flex gap-4 justify-center">
      <a href="#menu" className="bg-primary text-text-inverse px-8 py-3 rounded-lg hover:bg-primary-dark transition font-bold shadow-lg">
        View Menu
      </a>
    </div>
  </div>
</div>
```

**After:**
```jsx
<div className="hero-gradient text-text-inverse py-32 relative overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
    <h1 className="hero-title text-5xl md:text-6xl font-heading font-extrabold mb-6">
      Welcome to Thunder Road
    </h1>
    <p className="hero-subtitle text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
      Great Food. Cold Drinks. Good Times.
    </p>
    <div className="flex gap-4 justify-center flex-wrap">
      <a href="#menu" className="bg-primary text-text-inverse px-8 py-3 rounded-lg hover:bg-primary-dark transition font-bold shadow-lg">
        View Menu
      </a>
  <a href="#reservations" className="bg-surface text-primary px-8 py-3 rounded-lg hover:bg-surface-warm transition font-bold shadow-lg">
        Make a Reservation
      </a>
    </div>
  </div>
</div>
```

---

## 🍔 Menu Cards

### **MenuSection.js - Menu Card**

**Before:**
```jsx
  <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
  <div className="aspect-square bg-surface-warm flex items-center justify-center">
    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
  </div>
  <div className="p-6">
  <h3 className="text-2xl font-heading font-bold text-text-primary">{category.name}</h3>
  <p className="text-text-secondary text-sm mt-1">{category.description}</p>
  </div>
</div>
```

**After:**
```jsx
  <div className="menu-card bg-surface rounded-lg shadow-lg overflow-hidden card-hover transition-all">
  <div className="relative">
    <img 
      src={category.image_url} 
      alt={category.name} 
      className="w-full h-40 object-cover" 
    />
    {/* Semi-transparent overlay for better text readability */}
  <div className="absolute inset-0 overlay-gradient"></div>
  </div>
  <div className="p-6">
    <h3 className="text-2xl font-heading font-bold text-text-primary">{category.name}</h3>
    <p className="text-text-secondary text-sm mt-1">{category.description}</p>
  </div>
</div>
```

---

### **Menu Item with Price**

**Before:**
```jsx
  <div className="p-6 flex justify-between items-start">
  <div className="flex-1">
  <h4 className="text-lg font-heading font-semibold text-text-primary">{item.name}</h4>
  <p className="text-text-secondary text-sm mt-1">{item.description}</p>
  </div>
  <div className="ml-4">
  <span className="price-badge font-mono">${item.price.toFixed(2)}</span>
  </div>
</div>
```

**After:**
```jsx
<div className="p-6 flex justify-between items-start hover:bg-surface-warm transition">
  <div className="flex-1">
    <h4 className="text-lg font-heading font-semibold text-text-primary">{item.name}</h4>
    <p className="text-text-secondary text-sm mt-1">{item.description}</p>
  </div>
  <div className="ml-4">
    <span className="price-badge font-mono">${item.price.toFixed(2)}</span>
  </div>
</div>
```

---

## 📝 Forms

### **ReservationSection.js - Form**

**Before:**
```jsx
<div className="bg-surface-warm rounded-lg shadow-lg p-8 space-y-4">
  <div>
    <label className="block text-sm font-medium text-text-primary mb-2">Name *</label>
    <input
      type="text"
      className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
    />
  </div>
</div>
```

**After:**
```jsx
<div className="bg-surface-warm rounded-lg shadow-lg p-8 space-y-4">
  <div>
    <label className="block text-sm font-medium text-text-primary mb-2">Name *</label>
    <input
      type="text"
      className="form-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none transition"
    />
  </div>
  <button className="w-full bg-primary text-text-inverse py-3 px-6 rounded-lg hover:bg-primary-dark transition font-bold text-lg shadow-lg">
    Submit Reservation
  </button>
</div>
```

---

## 🎛️ Admin Panel

### **AdminPanel.js - Sidebar**

**Before:**
```jsx
<div className="w-64 bg-surface-dark text-text-inverse flex flex-col">
  <div className="p-4 border-b border-divider">
    <div className="logo-badge">
      <img src={logo} alt="Thunder Road" className="h-10 w-auto" />
    </div>
  </div>
  <nav className="flex-1 p-4 space-y-2">
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-text-inverse hover:bg-primary-dark transition font-medium">
      <Icon size={20} />
      Dashboard
    </button>
  </nav>
</div>
```

**After:**
```jsx
<div className="w-64 bg-surface-dark text-text-inverse flex flex-col">
  <div className="p-4 border-b border-divider">
    <div className="logo-badge">
      <img src={logo} alt="Thunder Road" className="h-10 w-auto" />
    </div>
  </div>
  <nav className="flex-1 p-4 space-y-2">
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-text-inverse hover:bg-primary-dark transition font-medium">
      <Icon size={20} />
      Dashboard
    </button>
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-surface-dark hover:text-text-inverse transition font-medium">
      <Icon size={20} />
      Menu
    </button>
  </nav>
</div>
```

---

### **Admin Card with Accent Stripe**

**Before:**
```jsx
<div className="admin-card bg-surface-warm rounded-xl shadow-xxl p-6 relative">
  <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">Dashboard</h2>
  {/* Content */}
</div>
```

**After:**
```jsx
<div className="admin-card bg-surface-warm rounded-xl shadow-xxl p-6 relative">
  {/* Accent stripe is automatic with .admin-card class */}
  <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">Dashboard</h2>
  {/* Content */}
</div>
```

---

### **Stat Cards**

**Before:**
```jsx
<div className="bg-surface-warm rounded-lg shadow-lg p-6 hover:shadow-xl transition">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-text-secondary text-sm">Pending Reservations</p>
      <p className="text-3xl font-bold font-mono mt-2 text-text-primary">{count}</p>
    </div>
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
      <Icon size={24} className="text-text-inverse" />
    </div>
  </div>
</div>
```

**After:**
```jsx
<div className="bg-surface-warm rounded-lg shadow-lg p-6 hover:shadow-xl transition">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-text-secondary text-sm">Pending Reservations</p>
      <p className="text-3xl font-bold font-mono mt-2 text-text-primary">{count}</p>
    </div>
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
  <Icon size={24} className="text-text-inverse" />
    </div>
  </div>
</div>
```

---

## 📊 Tables

### **Admin Table**

**Before:**
```jsx
<table className="w-full border-collapse">
  <thead>
    <tr>
      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase bg-transparent border-b border-divider">
        Name
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-divider">
    <tr className="hover:bg-surface-warm transition">
      <td className="px-6 py-4 text-sm text-text-primary">{name}</td>
    </tr>
  </tbody>
</table>


**After:**
```jsx
<table className="w-full border-collapse">
  <thead>
    <tr>
      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase bg-transparent border-b border-divider">
        Name
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-divider">
    <tr className="hover:bg-surface-warm transition">
      <td className="px-6 py-4 text-sm text-text-primary">{name}</td>
    </tr>
  </tbody>
</table>
```

---

## 🔔 Alerts & Notifications

### **Success Alert**

**Before:**
```jsx
<div className="bg-surface-warm border border-success/20 rounded-lg p-4 flex items-center gap-3">
  <CheckCircle size={20} className="text-success" />
  <p className="text-success font-medium">Success!</p>
</div>
```

**After:**
```jsx
<div className="bg-surface-warm border border-success/20 rounded-lg p-4 flex items-center gap-3 shadow-sm">
  <CheckCircle size={20} className="text-success" />
  <p className="text-success font-medium">Success!</p>
</div>
```

---

### **Error Alert**

**Before:**
```jsx
<div className="bg-surface-warm border border-error/20 rounded-lg p-4 flex items-center gap-3">
  <AlertCircle size={20} className="text-error" />
  <p className="text-error font-medium">Error!</p>
</div>
```

**After:**
```jsx
<div className="bg-surface-warm border border-error/20 rounded-lg p-4 flex items-center gap-3 shadow-sm">
  <AlertCircle size={20} className="text-error" />
  <p className="text-error font-medium">Error!</p>
</div>
```

---

## 🎨 Cards

### **Basic Card**

**Before:**
```jsx
<div className="bg-surface rounded-lg shadow-lg p-6 card-hover">
  <h3 className="text-xl font-heading font-bold text-text-primary mb-2">Title</h3>
  <p className="text-text-secondary leading-relaxed">Content here</p>
</div>
```

---

## 🌙 Dark Mode Examples

**Colors automatically adjust in dark mode!**

**Light Mode:**
- Background: `#fef7ed` (warm cream)
- Surface: `#ffffff` (white)
- Text: `#1c1917` (dark brown)

**Dark Mode (automatic):**
- Background: `#0f172a` (dark blue)
- Surface: `#1e293b` (slate)
- Text: `#f1f5f9` (light gray)

**No code changes needed** - it follows system preference!

---

## 🚀 Quick Tips

### **Use Consistent Spacing:**
```jsx
// Standard component spacing
<div className="py-16"> {/* Section padding */}
<div className="mb-6">  {/* Element margin */}
<div className="gap-4"> {/* Flex/grid gap */}
```

### **Consistent Text Hierarchy:**
```jsx
<h1 className="text-5xl font-heading font-extrabold text-text-primary">
<h2 className="text-4xl font-heading font-bold text-text-primary">
<h3 className="text-2xl font-heading font-semibold text-text-primary">
<p className="text-base text-text-secondary">
<small className="text-sm text-text-muted">
```

### **Hover States:**
```jsx
// Always include transition
className="hover:bg-primary-dark transition"
className="hover:shadow-xl transition-all"
className="hover:scale-105 transition-transform"
```

---

## ✅ Final Checklist

After updating components:

* [ ] All buttons use `bg-primary` (not legacy color classes)
- [ ] Text uses `text-text-primary/secondary/muted`
- [ ] Borders use `border-border`
- [ ] Shadows use `shadow-sm/md/lg/xl`
- [ ] Headings use `font-heading`
- [ ] Prices use `font-mono` or `.price-badge`
- [ ] Logo has `.logo-badge` wrapper
- [ ] Hero uses `.hero-gradient` and `.hero-title`
- [ ] Transitions on all hover states
- [ ] Admin cards use `.admin-card`

---

**You now have exact styling from your PHP project!** 🎉