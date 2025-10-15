# Copilot Instructions: Verification Checklist

**⚠️ Run these checks after styling implementation**

## File Checks
```
@workspace Verify these files exist:
- frontend/tailwind.config.js
- frontend/src/custom-styles.css
- frontend/src/hooks/useScrolled.js
- frontend/src/hooks/useActiveSection.js
- frontend/src/hooks/useInView.js
- frontend/src/contexts/ToastContext.js
- frontend/src/components/ui/Button.js
```

## Content Checks
```
@workspace Check tailwind.config.js contains primary color #dc2626
@workspace Check custom-styles.css imports Google Fonts
@workspace Check index.js imports custom-styles.css
```

## Component Checks
```
@workspace Search for "bg-blue-600" in frontend/src/components (replace with `bg-primary`)
@workspace Search for "hover:bg-blue-700" in frontend/src/components (replace with `hover:bg-primary-dark`)
@workspace Search for "text-gray-700" in frontend/src/components (replace with `text-text-primary`)
@workspace Search for "text-gray-600" in frontend/src/components (replace with `text-text-secondary`)
```

If found, these need updating.

## Success Criteria

✅ All config files created
✅ Custom CSS imported
✅ Hooks created
✅ No old color classes remain
✅ Fonts loading correctly

## Report Format

Provide summary:
- Files created: X
- Files skipped (already exist): Y
- Components updated: Z
- Remaining updates needed: [list]
```

---

## 🎯 Copilot Commands to Use

### **Process Everything:**
```
@workspace Read all files in styling-instructions/ folder in numerical order. 
Check if each file exists before creating. 
Skip existing files and report what was skipped. 
Create only missing files. 
Provide a summary of what was created and what needs manual review.
```

### **Process Individual Sections:**
```
@workspace Process styling-instructions/styling_01_tailwind_config.md
@workspace Process styling-instructions/styling_02_custom_css.md
@workspace Process styling-instructions/styling_03_setup_instructions.md
```

### **Verify:**
```
@workspace Check completion of styling-instructions implementation using styling_06_verification.md
```

---

## 📋 Complete File List
```
styling-instructions/
├── 00_STYLING_MASTER.md
├── styling_01_tailwind_config.md
├── styling_02_custom_css.md
├── styling_03_setup_instructions.md
├── styling_04_component_updates.md
├── styling_05_hooks_utilities.md
├── styling_06_verification.md
├── REFERENCE_colors.md (optional)
├── REFERENCE_fonts.md (optional)
└── REFERENCE_examples.md (optional)