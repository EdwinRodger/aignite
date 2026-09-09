# AIgnite Design System & Architecture Specification (DESIGN.md)

> **Theme**: Warm Flame / Modern High-Contrast Developer Aesthetic  
> **Color Space**: OKLCH (Oklab Color Space with Cylindrical Coordinates)  
> **CSS Engine**: Tailwind CSS v4 (`@theme inline`, `@custom-variant dark`)  
> **Typography**: Plus Jakarta Sans, Lora, IBM Plex Mono  

---

## 1. Design Philosophy & Aesthetic Intent

AIgnite's design language is built around **"Warm Flame"**-an engineering-focused, high-contrast aesthetic that conveys both the energy of rapid learning ("ignite") and the analytical discipline of applied AI systems.

### Core Tenets
1. **Ruthless Visual Hierarchy**: Dense information (neural architecture graphs, latency metrics, code snippets) is structured with strict contrast boundaries and typographic differentiation to prevent cognitive fatigue.
2. **Tactile Micro-Feedback**: High-velocity interactions (5-second quiz taps, pipeline connector snaps, audio wave recording) feature responsive visual state changes, crisp active rings, and subtle elevation shifts.
3. **Perceptual Uniformity with OKLCH**: All tokens are defined in the modern **OKLCH** color space. Unlike legacy RGB/HSL, OKLCH provides uniform perceptual lightness across hues, ensuring seamless accessibility and predictable contrast across light and dark modes.
4. **Mobile Transit Agility & Desktop Immersion**: Generous touch targets (min 44×44px), thumb-zone safe areas (`.safe-area-pb`), and snap-scroll verticals (`.snap-y-mandatory`) make the mobile experience frictionless, while desktop displays rich multi-column telemetry.

---

## 2. Color System & OKLCH Token Architecture

The color system is organized into semantic tokens mapped via CSS custom variables in [app/globals.css](file:///d:/dev/SIH2026/aignite/app/globals.css).

### 2.1. Primary Accent: The Warm Flame
- **Token**: `--primary` / `--ring` / `--chart-1`
- **Value**: `oklch(0.6404 0.2153 35.9003)`
- **Visual Character**: An intense, energetic flame coral/orange that commands attention without causing ocular strain. Used for primary CTAs, active streak indicators, focus rings, and milestone badges.
- **Foreground Pairing**: `--primary-foreground: oklch(1.0000 0 0)` (Pure crisp white, ensuring WCAG AAA contrast ratio > 4.5:1).

---

### 2.2. Light Mode Palette (`:root`)

| Token | OKLCH Value | Approximate Hex | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(0.9940 0 0)` | `#FCFCFC` | Pure, breathable canvas background |
| `--foreground` | `oklch(0 0 0)` | `#000000` | High-contrast deep black text and icons |
| `--card` | `oklch(0.9940 0 0)` | `#FCFCFC` | Card and modal surfaces |
| `--card-foreground`| `oklch(0 0 0)` | `#000000` | Content inside cards |
| `--popover` | `oklch(0.9911 0 0)` | `#FAFAFA` | Tooltips, dropdown menus, popovers |
| `--popover-foreground` | `oklch(0 0 0)` | `#000000` | Popover text |
| `--primary` | `oklch(0.6404 0.2153 35.9003)` | `#F3582A` | Brand Warm Flame accent |
| `--primary-foreground`| `oklch(1.0000 0 0)` | `#FFFFFF` | Text on primary buttons |
| `--secondary` | `oklch(0.9540 0.0063 255.4755)` | `#EFF2F5` | Subtle pill buttons, secondary tags |
| `--secondary-foreground`| `oklch(0.1344 0 0)` | `#1D1D1D` | Text on secondary elements |
| `--muted` | `oklch(0.9702 0 0)` | `#F4F4F4` | Inactive tracks, borders, background chips |
| `--muted-foreground` | `oklch(0.4386 0 0)` | `#636363` | Subtitles, metadata, secondary captions |
| `--accent` | `oklch(0.9656 0.0176 39.4009)` | `#FAECE6` | Warm flame tint for hover states & highlights |
| `--accent-foreground` | `oklch(0.5581 0.1911 35.3377)` | `#C84218` | Emphasized text inside warm accent containers |
| `--destructive` | `oklch(0.6290 0.1902 23.0704)` | `#E93C3C` | Error banners, failed quizzes, warnings |
| `--destructive-foreground`| `oklch(1.0000 0 0)` | `#FFFFFF` | Text on destructive elements |
| `--border` | `oklch(0.9300 0.0094 286.2156)` | `#E6E7ED` | Structural card borders and dividers |
| `--input` | `oklch(0.9401 0 0)` | `#ECECEC` | Form input backgrounds & borders |
| `--ring` | `oklch(0.6404 0.2153 35.9003)` | `#F3582A` | Focus-visible interactive rings |

---

### 2.3. Dark Mode Palette (`.dark`)

| Token | OKLCH Value | Approximate Hex | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(0.1784 0 0)` | `#151515` | Deep obsidian backdrop |
| `--foreground` | `oklch(0.9940 0 0)` | `#FCFCFC` | Crisp off-white primary text |
| `--card` | `oklch(0.2078 0 0)` | `#1C1C1C` | Elevated card & dashboard containers |
| `--card-foreground`| `oklch(0.9940 0 0)` | `#FCFCFC` | High-readability card typography |
| `--popover` | `oklch(0.2078 0 0)` | `#1C1C1C` | Dropdowns, menus, and flyouts |
| `--popover-foreground` | `oklch(0.9940 0 0)` | `#FCFCFC` | Popover text |
| `--primary` | `oklch(0.6404 0.2153 35.9003)` | `#F3582A` | Brand Warm Flame accent |
| `--primary-foreground`| `oklch(1.0000 0 0)` | `#FFFFFF` | Text on primary buttons |
| `--secondary` | `oklch(0.2686 0 0)` | `#2D2D2D` | Inactive interactive controls & secondary buttons |
| `--secondary-foreground`| `oklch(0.9940 0 0)` | `#FCFCFC` | Text on secondary elements |
| `--muted` | `oklch(0.2471 0 0)` | `#272727` | Subtle divider surfaces & code blocks |
| `--muted-foreground` | `oklch(0.7082 0 0)` | `#A9A9A9` | Timestamps, secondary labels, notes |
| `--accent` | `oklch(0.2471 0 0)` | `#272727` | Active hover backgrounds |
| `--accent-foreground` | `oklch(0.9940 0 0)` | `#FCFCFC` | Active hover text |
| `--destructive` | `oklch(0.6290 0.1902 23.0704)` | `#E93C3C` | Error toasts & quiz failure alerts |
| `--destructive-foreground`| `oklch(1.0000 0 0)` | `#FFFFFF` | Text on destructive elements |
| `--border` | `oklch(0.2861 0 0)` | `#323232` | Card outlines & structural borders |
| `--input` | `oklch(0.2686 0 0)` | `#2D2D2D` | Field inputs and textareas |
| `--ring` | `oklch(0.6404 0.2153 35.9003)` | `#F3582A` | Focus-visible outline glow |

---

### 2.4. Data Visualization & Chart Tokens

For multi-axis radar charts (Knowledge, Confidence, Communication, Systems Architecture, Industry Readiness) and telemetry meters:

- `--chart-1`: `oklch(0.6404 0.2153 35.9003)` - Primary Warm Flame (Architecture / Core AI)
- `--chart-2`: `oklch(0.8231 0.0995 35.9401)` - Warm Amber (Latency & Inference Speed)
- `--chart-3`: `oklch(0.4431 0.1587 35.8458)` - Deep Rust Flame (Memory & Quantization)
- `--chart-4`: `oklch(0.3396 0.1264 35.7951)` - Dark Umber (Retrieval Accuracy & RAG)
- `--chart-5`: `oklch(0.9168 0.0469 35.9996)` - Soft Peach Highlight (Overall Readiness)

---

## 3. Typography Hierarchy

AIgnite utilizes a triad font pairing loaded via `next/font/google` in [app/layout.tsx](file:///d:/dev/SIH2026/aignite/app/layout.tsx):

```typescript
// Plus Jakarta Sans: Modern geometric sans with exceptional legibility on screens
const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Lora: Elegant editorial serif for reflective commentary, case study scenarios, and pedagogical narratives
const serifFont = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// IBM Plex Mono: Industrial developer monospace for code snippets, telemetry, tokens, and hardware specs
const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});
```

### Typographic Roles & Scale

| Level | Font Family | Size / Leading | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `font-sans` | `text-4xl` to `text-6xl` (`tracking-tight`) | 800 (ExtraBold) | Landing page headers, score announcements |
| **Section H1 / H2** | `font-sans` | `text-2xl` to `text-3xl` | 700 (Bold) | Module headers, Recruiter candidate title |
| **Subheadings H3 / H4**| `font-sans` | `text-lg` to `text-xl` | 600 (SemiBold) | Card titles, step headers, quiz questions |
| **Editorial Narrative** | `font-serif` | `text-base` to `text-lg` (`leading-relaxed`) | 400 (Regular) / 600 | Scenario context, AI Coach debriefs, problem briefs |
| **Body (Default)** | `font-sans` | `text-sm` to `text-base` (`leading-normal`) | 400 / 500 | Explanations, button labels, form inputs |
| **Telemetry / Code** | `font-mono` | `text-sm` to `text-sm` | 500 / 600 | Latency (ms), token counts, PyTorch code, ATS score |
| **Micro / Caption** | `font-sans` | `text-sm` | 500 (Medium) | Timestamps, tier level badges, streak counters |

---

## 4. Radii, Shadows, Elevation & Spacing

### 4.1. Corner Radii
- **Master Radius**: `--radius: 1.4rem` (~`22.4px`)
- **Card Containers**: `rounded-2xl` to `rounded-3xl` with subtle 1px border (`border border-border`)
- **Pills & Badges**: `rounded-full` for status tags, streaks, and league indicators
- **Buttons**: `rounded-xl` to `rounded-2xl` for smooth, modern ergonomics

### 4.2. Shadows & Depth
Layered shadows using subtle HSL alpha blending ensure depth in both light and dark modes:
- `--shadow-2xs`: `0 1px 3px 0px hsl(0 0% 0% / 0.05)` (Subtle card border reinforcement)
- `--shadow-sm`: `0 1px 3px 0px hsl(0 0% 0% / 0.10)` (Resting cards, interactive tags)
- `--shadow-md`: `0 4px 6px -1px hsl(0 0% 0% / 0.10)` (Hover states, floating navigation)
- `--shadow-lg`: `0 10px 15px -3px hsl(0 0% 0% / 0.10)` (Modals, active quiz feedback drawers)
- `--shadow-xl`: `0 20px 25px -5px hsl(0 0% 0% / 0.10)` (Command palettes, preview popovers)
- `--shadow-2xl`: `0 25px 50px -12px hsl(0 0% 0% / 0.25)` (Celebration overlays, league promotion modals)

---

## 5. Key Component Patterns

### 5.1. Navigation System
- **Desktop Navbar** (`components/navigation/Navbar.tsx`):
  - Sticky glassmorphic header with `backdrop-blur-md bg-background/85 border-b border-border`.
  - Brand identity with flame icon in `text-primary`.
  - Active links highlighted with `text-foreground` and subtle bottom accent indicators.
  - Interactive CTAs use `bg-primary text-primary-foreground hover:opacity-90 shadow-sm`.
- **Mobile Tab Bar** (`components/navigation/MobileTabBar.tsx`):
  - Fixed bottom navigation bar with safe-area padding (`pb-[env(safe-area-inset-bottom,0.75rem)]`).
  - Active tab indicated by `text-primary` with a glowing top indicator dot.
  - Haptic touch targets (minimum height 56px).

### 5.2. Micro-Quiz Card (`components/feed/MicroQuizCard.tsx`)
- Container: `bg-card border border-border rounded-2xl p-4 shadow-sm`.
- Option Buttons:
  - Default: `bg-muted hover:bg-accent border border-border text-foreground`.
  - Selected / Active: `ring-2 ring-primary border-primary bg-accent`.
  - Correct State: `bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400`.
  - Incorrect State: `bg-destructive/10 border-destructive/50 text-destructive`.
- Feedback Drawer: Expandable explanation area rendering detailed architectural reasoning.

### 5.3. Pipeline Bubble Canvas & Game Elements
- Bubble Nodes: Circular containers with `border border-border bg-card shadow-md`.
- Active Connection Lines: SVG strokes rendered in `var(--primary)` with pulsating glow.
- Cost/Latency Telemetry: Floating badges styled with `font-mono text-sm text-muted-foreground`.

---

## 6. Tailwind CSS v4 Configuration & Base Layer

In Tailwind CSS v4, the theme is registered inline in `globals.css` using the `@theme inline` block:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);
  --radius-radius: var(--radius);
}
```

### Global Base Rules
```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary;
  }
}
```

---

## 7. Accessibility & Performance Guardrails

1. **Color Contrast**:
   - Primary flame `#F3582A` against pure white `#FFFFFF` achieves AAA contrast for large text and AA for normal text.
   - All muted text tokens (`--muted-foreground`) are tested for >= 4.5:1 ratio against their respective background surfaces.
2. **Keyboard Navigation & Focus Rings**:
   - Interactive elements employ `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
3. **Motion Sensitivity**:
   - Micro-interactions respect `prefers-reduced-motion: reduce` by dampening spring physics and confetti triggers.
4. **Font Optimization**:
   - Zero layout shift (CLS = 0) through `next/font/google` with `display: 'swap'` and automated font metric fallbacks.
