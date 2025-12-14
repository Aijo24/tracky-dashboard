# Tracky Design System & Style Guide

## Overview

Tracky uses a **dark glassmorphism** design system with a warm orange accent palette. The design emphasizes:

- **Glass-like transparency** with backdrop blur effects
- **Subtle depth** through layered backgrounds and soft shadows
- **Warm accessibility** using orange/amber tones against cool slate backgrounds
- **Modern minimalism** with generous whitespace and refined typography

The overall aesthetic is premium, professional, and trust-inspiring — ideal for B2B SaaS targeting food safety compliance.

---

## Color Palette

### Primary Brand Colors

| Name | Tailwind Class | Hex (Approx) | Usage |
|------|----------------|--------------|-------|
| **Orange 500** | `orange-500` | `#f97316` | Primary CTA buttons, accent highlights |
| **Orange 600** | `orange-600` | `#ea580c` | Button hover states |
| **Orange 400** | `orange-400` | `#fb923c` | Icon accents, secondary highlights |
| **Amber 400** | `amber-400` | `#fbbf24` | Star ratings, discount badges |
| **Amber 300** | `amber-300` | `#fcd34d` | Warning states, pending items |

### Neutral / Background Colors

| Name | Tailwind Class | Usage |
|------|----------------|-------|
| **Slate 100** | `slate-100` | Primary body text |
| **Slate 200** | `slate-200` | Secondary text, button text |
| **Slate 300** | `slate-300` | Tertiary text, descriptions |
| **Slate 400** | `slate-400` | Muted text, disabled states |
| **White** | `white` | Headings, high-emphasis text |

### Semantic Colors

| Name | Tailwind Class | Usage |
|------|----------------|-------|
| **Emerald 400** | `emerald-400` | Success states, checkmarks, "Conforme" |
| **Emerald 300** | `emerald-300` | Resolved status badges |
| **Red 300** | `red-300` | Critical alerts, errors |
| **Blue 300** | `blue-300` | Security/encryption indicators |
| **Sky 300** | `sky-300` | Support/help indicators |

### Transparency Scale (Glass Effect)

The design uses white with varying opacity levels:

```
white/5   → Very subtle backgrounds
white/10  → Card backgrounds, borders
white/15  → Border highlights, separators
white/20  → Hover states, badges
white/25  → Strong hover borders
white/30  → Active states
```

### Background Gradients

```css
/* Radial gradient overlay */
bg-[radial-gradient(80%_60%_at_10%_10%,rgba(255,255,255,0.06),transparent_60%)]

/* Linear gradient overlay */
bg-[linear-gradient(to_bottom,rgba(2,6,23,0.8),rgba(2,6,23,0.6))]

/* Ambient glow orbs */
bg-orange-500/10  /* blur-3xl, 560px circle */
bg-amber-400/10   /* blur-3xl, 620px circle */
```

---

## Typography

### Font Family

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial;
```

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Font Weights

| Weight | Tailwind Class | Usage |
|--------|----------------|-------|
| 300 | `font-light` | (Available, rarely used) |
| 400 | `font-normal` | Body text (default) |
| 500 | `font-medium` | Navigation, labels, emphasis |
| 600 | `font-semibold` | Stats, strong emphasis |

### Font Sizes

| Size | Tailwind Class | Usage |
|------|----------------|-------|
| **[11px]** | `text-[11px]` | Micro badges, labels, tags |
| **xs** | `text-xs` | Small labels, metadata, footer |
| **sm** | `text-sm` | Body text, buttons, nav links |
| **base** | `text-base` | Logo text (sm:text-base) |
| **lg** | `text-lg` | Card titles, stat numbers |
| **xl–2xl** | — | (Not heavily used) |
| **3xl** | `text-3xl` | Section headings (mobile) |
| **4xl** | `text-4xl` | Section headings, prices |
| **5xl** | `sm:text-5xl` | Hero heading (tablet) |
| **6xl** | `md:text-6xl` | Hero heading (desktop) |

### Text Colors

```
text-white        → Headings, primary emphasis
text-slate-100    → Body default
text-slate-200    → Secondary text, labels
text-slate-300    → Descriptions, helper text
text-slate-400    → Muted, disabled text
text-orange-400   → Accent text (icons)
text-emerald-400  → Success text
text-amber-400    → Warning/highlight text
text-red-300      → Error/critical text
```

### Tracking (Letter Spacing)

| Class | Usage |
|-------|-------|
| `tracking-tight` | Headings, logo, prices, stats |
| (default) | Body text |

### Line Height

| Class | Usage |
|-------|-------|
| `leading-[0.95]` | Hero headline (very tight) |
| `leading-tight` | Compact lists |
| (default) | Body text |

### Typography Examples

```html
<!-- Hero Headline -->
<h1 class="text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[0.95]">
  Tracky simplifie la sécurité alimentaire
</h1>

<!-- Section Heading -->
<h2 class="text-3xl sm:text-4xl tracking-tight text-white">
  Tarifs clairs, sans surprise
</h2>

<!-- Card Title -->
<h3 class="text-lg font-medium tracking-tight text-white">
  Pro
</h3>

<!-- Body Paragraph -->
<p class="text-slate-300 text-sm">
  Description text here...
</p>

<!-- Micro Badge -->
<span class="text-[11px] text-slate-200">
  HACCP en temps réel
</span>
```

---

## Spacing System

### Padding Scale

| Class | Pixels | Usage |
|-------|--------|-------|
| `p-1` | 4px | Toggle button containers |
| `p-2` | 8px | Icon buttons |
| `px-2, py-0.5` | 8px/2px | Tiny badges |
| `px-2.5, py-1` | 10px/4px | Small badges |
| `px-3, py-1` | 12px/4px | Tags, chips |
| `px-3, py-2` | 12px/8px | List items |
| `px-4, py-2` | 16px/8px | Standard buttons |
| `px-4, py-2.5` | 16px/10px | Primary buttons |
| `px-5, py-2.5` | 20px/10px | CTA buttons |
| `px-5, py-3` | 20px/12px | Large buttons |
| `px-6, py-3` | 24px/12px | Hero CTA |
| `p-5` | 20px | Small card padding |
| `p-6` | 24px | Standard card padding |
| `p-7` | 28px | Pricing card padding (sm:) |
| `p-8` | 32px | Featured card padding (sm:) |

### Margin Scale

| Class | Usage |
|-------|-------|
| `mt-1` | Minimal spacing (price period) |
| `mt-2` | Small spacing (descriptions) |
| `mt-3` | Standard element spacing |
| `mt-4` | Section element spacing |
| `mt-5` | Major element spacing |
| `mt-6` | Section dividers |
| `mt-8` | Large section spacing |

### Gap Scale

| Class | Pixels | Usage |
|-------|--------|-------|
| `gap-1` | 4px | Mini chart bars |
| `gap-1.5` | 6px | Icon + label pairs |
| `gap-2` | 8px | List items, tags, badges |
| `gap-3` | 12px | Button groups, small grids |
| `gap-4` | 16px | Card grid (mobile) |
| `gap-5` | 20px | Footer links |
| `gap-6` | 24px | Navigation links, card grid (sm:) |

### Container Widths

```html
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

- `max-w-7xl` → 1280px max width
- `max-w-2xl` → 672px (for text blocks)

### Section Padding

```html
<!-- Page sections -->
py-8 sm:py-10 lg:py-12  → Main content
py-10 sm:py-12          → Pricing section
py-6                    → Footer
py-4                    → Header
py-3                    → Mobile menu
```

---

## Component Styles

### Buttons

#### Primary CTA Button
```html
<a class="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/20 transition">
  Essai gratuit
  <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition">
    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
  </span>
</a>
```

#### Secondary Button (Ghost)
```html
<a class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-slate-200 hover:bg-white/10 hover:border-white/25 transition">
  <i data-lucide="play-circle" class="w-4.5 h-4.5"></i>
  Voir la démo
</a>
```

#### Tertiary Button (Subtle)
```html
<a class="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 border border-white/10 transition">
  <i data-lucide="log-in" class="w-4 h-4"></i>
  Se connecter
</a>
```

#### Full-Width Card Button
```html
<a class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition">
  Essai gratuit
  <i data-lucide="arrow-right" class="w-4 h-4"></i>
</a>
```

### Cards (Bento Grid)

#### Standard Bento Card
```html
<article class="relative rounded-3xl bg-white/10 border border-white/15 backdrop-blur-2xl p-5 sm:p-6 hover:border-white/25 transition">
  <!-- Content -->
</article>
```

#### Featured Card (Large)
```html
<article class="relative col-span-1 lg:col-span-2 lg:row-span-3 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:border-white/25 transition">
  <div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl pointer-events-none"></div>
  <!-- Content -->
</article>
```

#### Highlighted Card (Pricing Pro)
```html
<div class="relative rounded-3xl bg-white/10 border border-orange-400/30 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:border-orange-400/50 transition">
  <div class="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-orange-500/20 border border-orange-500/40 px-2 py-0.5 text-[11px] text-orange-300">
    Populaire
  </div>
  <!-- Content -->
</div>
```

### Badges & Tags

#### Status Badge (Pill)
```html
<!-- Success/Conforme -->
<span class="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2 py-0.5">
  Conforme
</span>

<!-- Warning/À faire -->
<span class="text-[11px] text-amber-300 bg-amber-300/10 border border-amber-300/30 rounded-full px-2 py-0.5">
  À faire
</span>

<!-- Critical -->
<span class="text-[11px] text-red-300 bg-red-300/10 border border-red-300/30 rounded-full px-2 py-0.5">
  Critique
</span>

<!-- Resolved -->
<span class="text-[11px] text-emerald-300 bg-emerald-300/10 border border-emerald-300/30 rounded-full px-2 py-0.5">
  Résolue
</span>
```

#### Feature Badge (With Dot)
```html
<span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-slate-200">
  <span class="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
  HACCP en temps réel
</span>
```

#### "New" Badge
```html
<span class="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 px-2.5 py-0.5 text-[11px]">
  Nouveau
</span>
```

#### Neutral Tag
```html
<span class="text-xs text-slate-200 bg-white/5 border border-white/10 rounded-full px-3 py-1">
  Lot L1021
</span>
```

### List Items

#### Checklist Item with Icon
```html
<li class="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2">
  <span class="text-sm text-slate-200">Nettoyage plan de travail</span>
  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
</li>
```

#### Feature List Item
```html
<li class="flex items-center gap-2 text-sm text-slate-200">
  <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
  Sondes connectées illimitées
</li>

<!-- Disabled/Unavailable -->
<li class="flex items-center gap-2 text-sm text-slate-400">
  <i data-lucide="minus" class="w-4 h-4"></i>
  API & intégrations
</li>
```

### Navigation

#### Desktop Nav Link
```html
<a class="hover:text-white transition-colors" href="#">Aperçu</a>
```

#### Mobile Nav Link
```html
<a class="block rounded-md px-3 py-2 text-slate-200 hover:bg-white/10" href="#">Aperçu</a>
```

### Toggle Buttons

#### Billing Toggle
```html
<div class="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
  <!-- Active State -->
  <button class="px-3 py-1.5 text-xs rounded-full bg-white/10 text-slate-200 border border-white/10">
    Mensuel
  </button>
  <!-- Inactive State -->
  <button class="px-3 py-1.5 text-xs rounded-full text-slate-300 hover:text-white">
    Annuel
  </button>
</div>
```

### Progress Bar
```html
<div class="h-2 w-full rounded-full bg-white/10 overflow-hidden">
  <div class="h-full bg-orange-500 rounded-full" style="width: 98%"></div>
</div>
```

### Mini Bar Chart
```html
<div class="grid grid-cols-12 gap-1 items-end h-16">
  <span class="h-6 bg-orange-500/70 rounded-sm"></span>
  <span class="h-8 bg-orange-500/60 rounded-sm"></span>
  <span class="h-10 bg-orange-500/70 rounded-sm"></span>
  <!-- ... -->
  <span class="h-14 bg-orange-500 rounded-sm"></span>
  <!-- ... -->
</div>
```

### Avatar Stack
```html
<div class="flex -space-x-2">
  <img class="h-8 w-8 rounded-full object-cover ring-2 ring-white/10" src="..." alt="Utilisateur">
  <img class="h-8 w-8 rounded-full object-cover ring-2 ring-white/10" src="..." alt="Utilisateur">
  <img class="h-8 w-8 rounded-full object-cover ring-2 ring-white/10" src="..." alt="Utilisateur">
</div>
```

### Star Rating
```html
<div class="flex items-center gap-1 text-amber-400">
  <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 stroke-amber-400"></i>
  <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 stroke-amber-400"></i>
  <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 stroke-amber-400"></i>
  <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 stroke-amber-400"></i>
  <i data-lucide="star-half" class="w-3.5 h-3.5"></i>
  <span class="ml-1 text-slate-300">4,8/5</span>
</div>
```

---

## Shadows & Elevation

### Box Shadows

| Class | Usage |
|-------|-------|
| `shadow-lg shadow-orange-500/20` | Primary CTA buttons |
| `shadow-lg shadow-orange-600/20` | Button hover state |
| `shadow-[0_10px_30px_rgba(0,0,0,0.25)]` | Featured cards, highlighted cards |

### Blur Effects

| Class | Usage |
|-------|-------|
| `blur-3xl` | Background ambient orbs (560px-620px) |
| `backdrop-blur-xl` | Header, footer, mobile menu |
| `backdrop-blur-2xl` | Cards, content areas |

### Ambient Glow (Background Orbs)

```html
<!-- Top-left warm glow -->
<div class="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-orange-500/10 blur-3xl"></div>

<!-- Bottom-right warm glow -->
<div class="absolute -bottom-40 -right-40 h-[620px] w-[620px] rounded-full bg-amber-400/10 blur-3xl"></div>

<!-- Card accent glow -->
<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl pointer-events-none"></div>
```

---

## Animations & Transitions

### Custom Keyframe Animation

```css
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```

### Animation Usage (Staggered Entry)

```html
<!-- Animation delays create staggered reveal effect -->
style="animation: fadeSlideIn 0.9s ease-out 0.05s both;"  /* Featured card */
style="animation: fadeSlideIn 0.8s ease-out 0.12s both;"  /* Card 1 */
style="animation: fadeSlideIn 0.8s ease-out 0.16s both;"  /* Card 2 */
style="animation: fadeSlideIn 0.8s ease-out 0.2s both;"   /* Card 3 */
style="animation: fadeSlideIn 0.8s ease-out 0.24s both;"  /* Card 4 */
style="animation: fadeSlideIn 0.8s ease-out 0.28s both;"  /* Card 5 */
style="animation: fadeSlideIn 0.9s ease-out 0.32s both;"  /* Bottom CTA */
```

### Transition Classes

| Class | Usage |
|-------|-------|
| `transition` | General purpose (colors, backgrounds, borders) |
| `transition-colors` | Text color changes only |

**Default transition applies to:** `background-color`, `border-color`, `color`, `fill`, `stroke`, `opacity`, `box-shadow`, `transform`

---

## Border Radius

| Class | Pixels | Usage |
|-------|--------|-------|
| `rounded-sm` | 2px | Mini chart bars |
| `rounded-md` | 6px | Mobile nav links, logo container |
| `rounded-lg` | 8px | List items, mobile toggle button |
| `rounded-full` | 9999px | Buttons, badges, pills, avatars, toggles |
| `rounded-3xl` | 24px | Cards, bento grid items |

### Border Radius Patterns

```
Cards & Panels    → rounded-3xl (24px)
Buttons & Pills   → rounded-full
List Items        → rounded-lg (8px)
Small Elements    → rounded-md or rounded-full
Avatar Images     → rounded-full
```

---

## Opacity & Transparency

### Background Opacity Scale

```
bg-white/5    → 5% white   → Very subtle fill
bg-white/10   → 10% white  → Standard glass background
bg-white/20   → 20% white  → Highlighted/hover background
bg-white/30   → 30% white  → Active states
```

### Border Opacity Scale

```
border-white/10  → 10% white  → Subtle borders
border-white/15  → 15% white  → Standard card borders
border-white/20  → 20% white  → Badge borders
border-white/25  → 25% white  → Hover borders
```

### Color with Opacity (Semantic)

```
bg-orange-500/10   → Orange tint backgrounds
bg-orange-500/20   → Stronger orange tint
bg-orange-500/70   → Semi-transparent orange bars
bg-emerald-400/10  → Success backgrounds
bg-amber-300/10    → Warning backgrounds
bg-red-300/10      → Error backgrounds
bg-black/20        → Dark overlay backgrounds
```

### Shadow Opacity

```
shadow-orange-500/20  → 20% orange shadow
rgba(0,0,0,0.25)      → 25% black shadow
```

---

## Common Tailwind CSS Usage Patterns

### Glass Card Pattern
```html
class="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-2xl"
```

### Responsive Padding Pattern
```html
class="p-5 sm:p-6"      /* Small cards */
class="p-6 sm:p-7"      /* Pricing cards */
class="p-6 sm:p-8"      /* Featured cards */
```

### Responsive Text Pattern
```html
class="text-3xl sm:text-4xl"           /* Section headings */
class="text-4xl sm:text-5xl md:text-6xl" /* Hero heading */
```

### Flex Center Pattern
```html
class="inline-flex items-center gap-2"
class="flex items-center justify-between"
class="inline-flex items-center justify-center"
```

### Grid Responsive Pattern
```html
class="grid grid-cols-1 lg:grid-cols-3"
class="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-3"
class="grid grid-cols-2 sm:grid-cols-3"
```

### Hover State Pattern
```html
/* Background hover */
class="bg-white/5 hover:bg-white/10"

/* Border hover */
class="border-white/15 hover:border-white/25"

/* Combined */
class="hover:bg-white/10 hover:border-white/25 transition"
```

### Hidden/Shown Responsive Pattern
```html
class="hidden sm:inline-flex"   /* Show on sm+ */
class="md:hidden"               /* Hide on md+ */
class="hidden md:flex"          /* Show on md+ */
```

---

## Icon System

### Library: Lucide Icons
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

### Initialization
```javascript
lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
```

### Icon Sizes

| Class | Size | Usage |
|-------|------|-------|
| `w-3 h-3` | 12px | Tiny inline icons |
| `w-3.5 h-3.5` | 14px | Badge icons, stars |
| `w-4 h-4` | 16px | Button icons, list icons |
| `w-4.5 h-4.5` | 18px | Play button icon |
| `w-5 h-5` | 20px | Mobile menu icons |

### Commonly Used Icons

```
arrow-right       → CTAs, links
log-in            → Login button
menu / x          → Mobile toggle
thermometer       → Temperature feature
clipboard-check   → Checklists
scan-line         → Traceability
alert-triangle    → Alerts
line-chart        → Reports
check-circle-2    → Completed items
check             → Feature list checks
minus             → Unavailable features
shield-check      → Compliance
shield            → Security
lock              → Encryption
cloud             → Real-time
star / star-half  → Ratings
play-circle       → Demo button
calendar          → Schedule demo
message-square    → Contact
badge-percent     → Discount indicator
life-buoy         → Support
```

---

## Selection Styles

```html
class="selection:bg-orange-500/30 selection:text-white"
```

---

## Z-Index Layers

| Value | Usage |
|-------|-------|
| `-z-10` | Background canvas |
| `z-30` | Sticky header |

---

## Complete Component Examples

### Feature Card (Medium Size)
```html
<article class="relative col-span-1 lg:col-span-2 lg:row-span-1 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-2xl p-5 sm:p-6 hover:border-white/25 transition" style="animation: fadeSlideIn 0.8s ease-out 0.12s both;">
  <div class="flex items-start justify-between">
    <div>
      <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200">
        <i data-lucide="thermometer" class="w-3.5 h-3.5 text-orange-400"></i>
        Températures sous contrôle
      </div>
      <p class="mt-3 text-slate-300 text-sm">
        Sondes connectées, alertes instantanées et traçabilité par équipement.
      </p>
    </div>
    <span class="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2 py-0.5">Conforme</span>
  </div>
  <!-- Mini chart -->
  <div class="mt-5 grid grid-cols-12 gap-1 items-end h-16">
    <span class="h-6 bg-orange-500/70 rounded-sm"></span>
    <span class="h-8 bg-orange-500/60 rounded-sm"></span>
    <span class="h-10 bg-orange-500/70 rounded-sm"></span>
    <span class="h-12 bg-orange-500/60 rounded-sm"></span>
    <span class="h-9 bg-orange-500/70 rounded-sm"></span>
    <span class="h-11 bg-orange-500/60 rounded-sm"></span>
    <span class="h-7 bg-orange-500/70 rounded-sm"></span>
    <span class="h-10 bg-orange-500/60 rounded-sm"></span>
    <span class="h-14 bg-orange-500 rounded-sm"></span>
    <span class="h-9 bg-orange-500/60 rounded-sm"></span>
    <span class="h-12 bg-orange-500/70 rounded-sm"></span>
    <span class="h-8 bg-orange-500/60 rounded-sm"></span>
  </div>
  <div class="mt-3 text-[11px] text-slate-400">Plage cible: 0–4°C (Chambre froide 2)</div>
</article>
```

### Pricing Card (Highlighted)
```html
<div class="relative rounded-3xl bg-white/10 border border-orange-400/30 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:border-orange-400/50 transition">
  <div class="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-orange-500/20 border border-orange-500/40 px-2 py-0.5 text-[11px] text-orange-300">
    Populaire
  </div>
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-medium tracking-tight text-white">Pro</h3>
    <span class="text-[11px] text-slate-300 border border-white/10 bg-white/5 rounded-full px-2 py-0.5">Multi-sites</span>
  </div>
  <p class="mt-1 text-sm text-slate-300">Automatisation avancée, alertes et traçabilité complète.</p>
  <div class="mt-5 flex items-baseline gap-2">
    <span class="text-4xl tracking-tight text-white priceAmount" data-monthly="99" data-annual="79">99€</span>
    <span class="text-sm text-slate-400 pricePeriod">/mois HT</span>
  </div>
  <div class="annualNote hidden mt-1 text-xs text-slate-400">Facturé annuellement — −20%</div>
  <a href="#" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition">
    Essai gratuit
    <i data-lucide="arrow-right" class="w-4 h-4"></i>
  </a>
  <ul class="mt-5 space-y-2">
    <li class="flex items-center gap-2 text-sm text-slate-200">
      <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
      Sondes connectées illimitées
    </li>
    <li class="flex items-center gap-2 text-sm text-slate-200">
      <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
      Traçabilité lots & DLC
    </li>
    <li class="flex items-center gap-2 text-sm text-slate-200">
      <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
      Alertes en temps réel
    </li>
    <li class="flex items-center gap-2 text-sm text-slate-200">
      <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
      Rapports & audits avancés
    </li>
  </ul>
</div>
```

### Sticky Header
```html
<header class="sticky top-0 z-30 backdrop-blur-xl border-b border-white/10">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between py-4">
      <!-- Logo -->
      <a href="#" class="inline-flex items-center gap-2 group">
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/90 text-white font-medium tracking-tight">T</span>
        <span class="text-sm sm:text-base text-white font-medium tracking-tight">Tracky</span>
      </a>
      <!-- Nav -->
      <nav class="hidden md:flex items-center gap-6 text-sm text-slate-300">
        <a class="hover:text-white transition-colors" href="#">Aperçu</a>
        <a class="hover:text-white transition-colors" href="#">Produit</a>
        <a class="hover:text-white transition-colors" href="#tarifs">Tarifs</a>
        <a class="hover:text-white transition-colors" href="#">Docs</a>
      </nav>
      <!-- Actions -->
      <div class="flex items-center gap-3">
        <a href="#" class="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 border border-white/10 transition">
          <i data-lucide="log-in" class="w-4 h-4"></i>
          Se connecter
        </a>
        <a href="#" class="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition">
          Commencer
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
      </div>
    </div>
  </div>
</header>
```

---

## Best Practices Summary

1. **Glass Effect**: Use `bg-white/10 border border-white/15 backdrop-blur-2xl` for glass cards
2. **Buttons**: Always use `rounded-full` and include `transition`
3. **Spacing**: Use consistent padding scales (`p-5 sm:p-6` for cards)
4. **Text**: Use `text-white` for headings, `text-slate-200/300` for body
5. **Hover States**: Increase opacity on hover (`white/5 → white/10`, `white/15 → white/25`)
6. **Animations**: Use staggered `fadeSlideIn` for page entry
7. **Shadows**: Add colored shadows (`shadow-orange-500/20`) to primary actions
8. **Icons**: Use Lucide with `stroke-width: 1.5` at `w-4 h-4` default size
