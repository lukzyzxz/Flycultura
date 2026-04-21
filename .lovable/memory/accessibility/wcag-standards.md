---
name: WCAG 2.1 AA Standards
description: Accessibility rules to follow in every new component (focus, ARIA, contrast, motion, semantics)
type: preference
---
Apply WCAG 2.1 AA in every new component:

- Use semantic HTML (`<main>`, `<nav>`, `<section>` with heading or aria-label, `<button>` for actions, `<a>` for navigation).
- Every page must have one `<h1>` and a `<main id="main-content">` landmark (already provided in App.tsx).
- Icon-only buttons require `aria-label`; decorative icons get `aria-hidden="true"`.
- Toggle buttons (theme, pause, favorite, filter chips) use `aria-pressed`.
- Active nav links use `aria-current="page"`.
- Custom tabs follow APG: `role="tablist"` / `role="tab"` + `aria-selected` + `aria-controls`, panel uses `role="tabpanel"` + `aria-labelledby`.
- Comboboxes (autocomplete) follow APG: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, `aria-activedescendant`; arrow keys / Enter / Escape navigation.
- Form inputs need an associated `<label>` (visible or `sr-only`); errors use `role="alert"` and `aria-invalid`.
- Color contrast ≥ 4.5:1 for normal text. Use semantic tokens — never raw colors.
- Auto-rotating carousels must respect `prefers-reduced-motion` and provide a pause control.
- Use SmartImage with meaningful `alt`; pass `alt=""` only when truly decorative.
- Modal dialogs use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- Never remove the global `:focus-visible` ring defined in index.css.
