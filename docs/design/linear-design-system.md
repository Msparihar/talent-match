# Linear-Inspired Design System

A production-ready, comprehensive design system for building beautiful, fast, and accessible applications inspired by Linear's design philosophy.

## Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [Animations](#animations)
8. [Accessibility](#accessibility)
9. [Responsive Design](#responsive-design)
10. [Implementation Guide](#implementation-guide)

---

## Overview

This design system is inspired by Linear's exceptional UX and can be used across all your applications. It emphasizes:

- **Speed & Performance** - Instant feedback, optimistic updates
- **Minimal Aesthetics** - Monochrome palette with strategic color usage
- **Keyboard-First** - Comprehensive shortcuts and navigation
- **Dark Mode Native** - Designed for dark mode, light mode as alternative
- **Accessible by Default** - WCAG 2.1 AA compliant

---

## Color Schema

### Core Color Palette

Linear's palette is intentionally minimal and monochromatic, built on five key shades:

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Woodsmoke** | `#0C0D0F` | rgb(12, 13, 15) | Primary dark background |
| **Oslo Gray** | `#818988` | rgb(129, 137, 136) | Mid-tone neutral gray |
| **Black Haze** | `#F4F4F5` | rgb(244, 244, 245) | Very light gray |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Text and highlights |
| **Indigo** (Accent) | Custom Blue | - | Signature brand color (used sparingly) |

### Alternative Gray Scale References

```css
/* Woodsmoke variations */
--woodsmoke: #0C0D0F;
--woodsmoke-alt: #2B3230; /* Alternative: rgb(43, 50, 48) */

/* Oslo Gray */
--oslo-gray: #818988;

/* Light neutrals */
--black-haze: #F4F4F5;
--white: #FFFFFF;
```

### Color Philosophy

1. **Extreme Minimalism** - Use very few colors, primarily monochrome (black/white/gray)
2. **Strategic Accent Usage** - Only use brand color for critical actions and highlights
3. **High Contrast** - Dark backgrounds with bright text for reduced eye strain
4. **No Unnecessary Color** - Linear deliberately moved from colorful UI to nearly monochrome

---

## Design Principles

### 1. LCH Color System

Linear uses **LCH (Lightness, Chroma, Hue)** instead of traditional HSL/RGB.

**Why LCH?**
- **Perceptually uniform** - Colors with the same lightness value appear equally light to the human eye
- **Consistent generation** - Automatically creates better-looking themes
- **Simplified theming** - Only requires 3 base variables instead of 98 specific color tokens

**Implementation:**
```javascript
// Linear's theme system uses just 3 variables:
{
  base: "lch(10% 5 240)",      // Base background color
  accent: "lch(60% 80 270)",    // Accent/brand color
  contrast: 1.5                 // Contrast multiplier for accessibility
}
```

**Benefits:**
- Automatic high-contrast themes for accessibility
- Consistent light and dark theme generation
- Designers and engineers share the same color language

### 2. Typography

**Primary Fonts:**
- **Inter** - Body text and UI elements (regular weight)
- **Inter Display** - Headings and emphasis (adds expression)

**Typography Principles:**
- Bold, clear hierarchy
- Generous spacing and line heights
- Excellent readability at all sizes
- Consistent weight usage across the application

**Tailwind Config Example:**
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Inter Display', 'Inter', 'sans-serif'],
}
```

### 3. Visual Design Elements

#### Glassmorphism & Depth
- Subtle backdrop blur effects (`backdrop-filter: blur()`)
- Layered surfaces with transparency
- Soft shadows and elevation
- Card-based layouts with depth

```css
/* Glassmorphism example */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

#### Complex Gradients
- Sophisticated background gradients (dark to slightly darker)
- Purple/blue gradient spheres for brand elements
- Subtle gradient overlays

```css
/* Linear-style gradient */
background: linear-gradient(
  135deg,
  hsl(240, 15%, 9%) 0%,
  hsl(240, 20%, 6%) 100%
);
```

#### Layout Philosophy
- **Sequential flow** - Left-to-right, top-to-bottom reading pattern
- **High information density** - Without feeling cluttered
- **Clear visual hierarchy** - Important elements stand out
- **Pixel-perfect alignment** - Icons, labels, and buttons precisely aligned

### 4. Interaction Design

#### Keyboard-First Interface
- Comprehensive keyboard shortcuts throughout the app
- **Cmd/Ctrl + K** - Command palette (primary navigation)
- Tab navigation for all interactive elements
- Visual keyboard focus indicators

#### Performance & Feedback
- **Instant feedback** - No perceived latency
- **Optimistic UI updates** - Changes appear immediately
- **Smooth animations** - 60fps, physics-based motion
- **Loading states** - Skeleton screens and progressive loading

#### Micro-interactions
```css
/* Smooth, natural transitions */
.interactive-element {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.interactive-element:active {
  transform: translateY(0);
}
```

### 5. Dark Mode Excellence

**Why Dark Mode First:**
- Based on coding environments engineers prefer
- Reduces battery drain on OLED screens
- Reduces eye strain during extended use
- Professional aesthetic for technical users

**Implementation Principles:**
- Not just inverted colors - carefully designed contrast ratios
- Warm blacks (slight blue tint) instead of pure black
- Adjusted color vibrancy for dark backgrounds
- Consistent shadows and elevation cues

```css
/* Dark mode color example */
:root[data-theme="dark"] {
  --background: #0C0D0F;
  --foreground: #F4F4F5;
  --muted: #27272A;
  --border: #3F3F46;
}
```

---

## Implementation Strategy

### Step 1: Set Up Color System

**Option A: Tailwind CSS Configuration**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        woodsmoke: '#0C0D0F',
        oslo: '#818988',
        haze: '#F4F4F5',
        accent: {
          DEFAULT: '#5B5FCF', // Example indigo
          hover: '#4A4EB8',
          active: '#3A3EA0',
        },
      },
    },
  },
}
```

**Option B: CSS Variables (LCH-based)**
```css
:root {
  /* Base colors using LCH */
  --base-bg: lch(10% 5 240);
  --base-fg: lch(98% 0 0);
  --accent: lch(60% 80 270);

  /* Semantic tokens */
  --background: var(--base-bg);
  --foreground: var(--base-fg);
  --primary: var(--accent);
  --border: lch(25% 5 240);
  --muted: lch(20% 5 240);
}
```

### Step 2: Typography Setup

```css
/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Display:wght@600;700&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3 {
  font-family: 'Inter Display', 'Inter', sans-serif;
}
```

### Step 3: Apply Glassmorphism

```css
.card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Step 4: Smooth Animations

```css
/* Default transition */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Motion preference respect */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 5: Keyboard Navigation

```typescript
// Implement command palette
function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // ... render command palette
}
```

---

## Component Patterns

### Button Components

```typescript
// Linear-style button variants
const buttonVariants = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-muted text-foreground hover:bg-muted/80',
  ghost: 'text-foreground/70 hover:bg-muted hover:text-foreground',
};
```

### Card Components

```typescript
// Elevated card with glassmorphism
<div className="
  bg-white/[0.03]
  backdrop-blur-xl
  border border-white/[0.08]
  rounded-xl
  p-6
  shadow-lg
  hover:shadow-xl
  transition-shadow
  duration-200
">
  {children}
</div>
```

### Navigation Sidebar

```typescript
// Linear-style sidebar with proper hierarchy
<aside className="
  w-64
  bg-woodsmoke
  border-r border-white/[0.08]
  flex flex-col
  h-screen
">
  {/* Logo and primary nav */}
  {/* Project list */}
  {/* Settings */}
</aside>
```

---

## Best Practices

### Do's ✅

- Use color sparingly - stick to monochrome with minimal accent usage
- Implement keyboard shortcuts for all major actions
- Keep animations smooth and physics-based (60fps)
- Maintain pixel-perfect alignment across all elements
- Use Inter font family for consistency
- Implement proper loading and skeleton states
- Design for dark mode first, light mode second
- Use LCH color space for theme generation

### Don'ts ❌

- Don't use excessive colors or rainbow palettes
- Don't add animations that exceed 300ms
- Don't ignore keyboard navigation
- Don't use pure black (#000000) - use warm blacks
- Don't mix too many font families
- Don't create jarring transitions or jumps
- Don't forget high-contrast mode for accessibility
- Don't rely only on color to convey information

---

## Resources

### Official Linear Resources
- [Linear UI Redesign Blog Post](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Method](https://linear.app/method) - Project management methodology

### Community Resources
- [linear.style](https://linear.style/) - Community theme collection
- [Linear Design System (Figma)](https://www.figma.com/community/file/1222872653732371433/linear-design-system)
- [Radix UI Case Study](https://www.radix-ui.com/primitives/case-studies/linear) - Linear's component library choice

### Design Tools
- [Inter Font Family](https://rsms.me/inter/)
- [LCH Color Picker](https://lch.oklch.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) - Compatible component library

---

## Conclusion

Linear's design success comes from:
1. **Extreme restraint** in color usage
2. **Obsessive attention** to performance and speed
3. **Thoughtful interactions** that feel natural
4. **Consistent visual language** across all surfaces
5. **Keyboard-first philosophy** for power users

The key is not to copy Linear exactly, but to understand and apply these principles to create fast, focused, and beautifully minimal interfaces.

---

*Last updated: 2025-11-24*
