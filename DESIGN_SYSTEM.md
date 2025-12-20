# Taskly Design System

## Overview

The Taskly frontend has been updated with a modern, dark-themed design system featuring purple and cyan accents. This document outlines the visual design, color palette, and component usage.

---

## Color Palette

### Primary Colors

**Dark Navy Background**
- `#0a0e1a` - Main background (very dark navy/blue-black)
- `#0f1419` - Surface layer (slightly lighter)
- `#1a1f2e` - Elevated cards
- `#1e293b` - Subtle borders
- `#141b2d` - Hover states

**Purple/Indigo (Primary Brand Color)**
- `#7c3aed` - Primary 600 (main purple)
- `#8b5cf6` - Primary 500 (lighter purple)
- Used for: Buttons, text accents, focus states, gradients

**Cyan/Sky Blue (Secondary Accent)**
- `#06b6d4` - Accent 500 (main cyan)
- `#0ea5e9` - Accent 400 (lighter cyan)
- Used for: Secondary highlights, icons, accent text

**Success/Completion (Green)**
- `#10b981` - Success 500 (primary green)
- Used for: Completed tasks, positive states

**Text Colors**
- `#ffffff` - White for headings
- `#cbd5e1` - Light gray for body text
- `#94a3b8` - Medium gray for secondary text
- `#475569` - Dark gray for subtle text

### Tailwind Color Classes

The design system uses Tailwind CSS extended colors:

```css
primary: {
  50: '#f5f3ff',
  600: '#7c3aed',    /* Main purple */
  700: '#6d28d9',
}

accent: {
  400: '#38bdf8',
  500: '#0ea5e9',    /* Cyan accent */
  600: '#0284c7',
}

success: {
  500: '#10b981',    /* Green for completion */
}

dark: {
  bg: '#0a0e1a',
  surface: '#0f1419',
  elevated: '#1a1f2e',
  border: '#1e293b',
  hover: '#141b2d',
}
```

---

## Gradients

### Brand Gradients

1. **Taskly Gradient** (90° horizontal)
   ```
   #7c3aed → #8b5cf6 → #06b6d4
   ```
   Used for: Logo, special text highlights

2. **Hero Gradient** (135° diagonal)
   ```
   #7c3aed → #8b5cf6
   (Purple to lighter purple)
   ```
   Used for: Primary buttons, hero sections

3. **Hero Alt Gradient** (135° diagonal)
   ```
   #8b5cf6 → #06b6d4
   (Light purple to cyan)
   ```
   Used for: Alternative accent areas

4. **Subtle Card Gradient**
   ```
   rgba(124, 58, 237, 0.05) → rgba(6, 182, 212, 0.05)
   (Very subtle purple-cyan)
   ```
   Used for: Card backgrounds

---

## Visual Design Elements

### Glassmorphic Cards
- **Background**: `bg-dark-elevated` with `backdrop-blur-sm`
- **Border**: `border border-dark-border/20` to `border-dark-border/50`
- **Shadow**: `shadow-sm-elevated` (subtle elevation)
- **Hover**: `hover:shadow-lifted` with smooth transition
- Used for: Task cards, modals, panels

### Icon Circles
- **Base Class**: `.icon-circle`
- **Variants**:
  - `.icon-circle-primary` - Purple background
  - `.icon-circle-accent` - Cyan background
  - `.icon-circle-success` - Green background
- **Structure**: Circular background with centered icon
- **Badge**: Optional numeric badge in top-right corner

### Buttons

**Primary Button**
```css
bg-gradient-hero text-white rounded-xl font-semibold
shadow-sm-elevated hover:shadow-glow-purple
```
- Uses purple-to-purple gradient
- Glow effect on hover

**Secondary Button**
```css
bg-dark-elevated text-neutral-100 border border-dark-border
hover:bg-dark-hover hover:border-primary-500/50
```
- Subtle dark background
- Border highlight on hover

**Danger Button**
```css
bg-gradient-to-r from-red-600 to-red-700 text-white
hover:shadow-lg hover:shadow-red-600/30
```
- Red gradient for destructive actions

**Ghost Button**
```css
bg-transparent text-neutral-400
hover:bg-dark-elevated hover:text-neutral-100
```
- Transparent with hover background

### Typography

**Gradient Text Classes**
- `.gradient-text` - Purple to cyan gradient
- `.gradient-text-cyan` - Purple to cyan variant

**Heading Styles**
- h1: `text-5xl sm:text-6xl lg:text-7xl font-bold`
- h2: `text-3xl md:text-4xl font-bold`
- h3: `text-2xl md:text-3xl font-semibold`

---

## Reusable Components

### GradientText
A component for gradient text effects.

```tsx
import { GradientText } from '@/components/ui/GradientText';

<GradientText variant="primary">
  Get Things Done
</GradientText>

<GradientText variant="cyan">
  Your Text Here
</GradientText>
```

**Variants**: `primary`, `cyan`, `accent`

### GlassCard
A glassmorphic card component.

```tsx
import { GlassCard } from '@/components/ui/GlassCard';

<GlassCard variant="gradient" hover>
  Card content here
</GlassCard>
```

**Variants**: `elevated`, `gradient`, `subtle`

### IconCircle
A reusable icon with circular background.

```tsx
import { IconCircle } from '@/components/ui/IconCircle';

<IconCircle
  icon={<CheckIcon />}
  size="lg"
  color="success"
  badge={5}
/>
```

**Props**:
- `icon` - SVG or icon component
- `size` - `sm`, `md`, `lg`, `xl`
- `color` - `primary`, `accent`, `success`, `error`
- `badge` - Optional number to display

### Button
Enhanced button component with variants.

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg" isLoading={loading}>
  Create Task
</Button>
```

**Variants**: `primary`, `secondary`, `danger`, `ghost`
**Sizes**: `sm`, `md`, `lg`

---

## Shadows & Glows

### Elevation Shadows
- `shadow-sm-elevated`: `0 2px 8px rgba(0, 0, 0, 0.32)`
- `shadow-elevated`: `0 4px 16px rgba(0, 0, 0, 0.48)`
- `shadow-lifted`: `0 8px 32px rgba(0, 0, 0, 0.64)`

### Glow Effects
- `shadow-glow`: Purple glow `rgba(124, 58, 237, 0.25)`
- `shadow-glow-purple`: Enhanced purple glow
- `shadow-glow-cyan`: Cyan glow for accents
- `shadow-glow-intense`: Strong purple glow

---

## Component Styling Guide

### Task Cards
- Background: `bg-dark-elevated`
- Border: `border-2 border-dark-border` (default)
- Completed state: `border-success-500/30 bg-dark-elevated`
- Hover: `border-primary-500/50 shadow-lg shadow-primary-500/10`

### Forms & Inputs
- Background: `bg-dark-elevated`
- Border: `border-2 border-dark-border`
- Focus: `focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20`
- Text: `text-neutral-100`
- Placeholder: `placeholder-neutral-500`

### Status Badges
- Pending: `bg-primary-500/20 text-primary-300`
- Completed: `bg-success-500/20 text-success-300`
- Neutral: `bg-dark-border text-neutral-400`

---

## Animation & Transitions

### Built-in Animations
- `animate-fade-in`: 0.3s fade
- `animate-slide-up`: 0.4s slide up
- `animate-slide-in-right`: 0.4s slide in
- `animate-scale-in`: 0.3s scale
- `animate-stagger-in`: 0.4s stagger (for lists)
- `animate-bounce-in`: 0.5s bounce

### Transition Classes
- `transition-fast`: 200ms all
- `transition-base`: 300ms all
- `transition-slow`: 500ms all

### Hover Effects
- `hover-lift`: Lifts element with shadow
- `hover-scale`: Scales element on hover

---

## Accessibility

### Focus States
- Focus ring: `2px solid #7c3aed` (purple)
- Outline offset: `2px`
- Applies to all interactive elements via `:focus-visible`

### Semantic HTML
- All buttons use `<button>` elements
- Forms use proper `<label>` associations
- Icon-only buttons have `aria-label`
- Error messages use `role="alert"`

### Color Contrast
- Text on dark backgrounds meets WCAG AA standards
- Gradient text uses sufficient weight for readability
- Buttons have visible focus indicators

---

## Dark Theme Best Practices

1. **Background Layering**: Use dark bg → surface → elevated hierarchy
2. **Border Subtlety**: Use borders with 30-50% opacity for soft appearance
3. **Text Hierarchy**: White for headings, light gray for body, medium gray for secondary
4. **Glow Effects**: Use purple glows for primary actions, cyan for secondary
5. **Gradient Accents**: Apply gradients sparingly for emphasis
6. **Shadow Depth**: Use lifted shadows for elevation, subtle for flat elements

---

## Files Modified

1. **Configuration**
   - `/tailwind.config.ts` - Extended colors, gradients, shadows
   - `/src/app/globals.css` - Global styles and component classes

2. **Components Created**
   - `/src/components/ui/GradientText.tsx`
   - `/src/components/ui/GlassCard.tsx`
   - `/src/components/ui/IconCircle.tsx`

3. **Components Updated**
   - `/src/components/ui/Button.tsx` - Enhanced variants and colors
   - `/src/app/page.tsx` - Hero section dark theme

---

## Usage Examples

### Creating a Themed Card
```tsx
<GlassCard variant="gradient">
  <div className="flex items-center gap-3">
    <IconCircle icon={<StarIcon />} color="primary" size="lg" />
    <div>
      <h3 className="text-neutral-100 font-semibold">
        <GradientText>Feature Name</GradientText>
      </h3>
      <p className="text-neutral-400">Description</p>
    </div>
  </div>
</GlassCard>
```

### Creating a Primary Action
```tsx
<Button variant="primary" size="lg" onClick={handleAction}>
  Get Started Free
</Button>
```

### Status Display
```tsx
<div className="flex items-center gap-2">
  <IconCircle
    icon={<CheckIcon />}
    color="success"
    size="sm"
  />
  <span className="badge-success">Completed</span>
</div>
```

---

## Design System Principles

1. **Clarity**: High contrast between content and background
2. **Hierarchy**: Clear visual weight through color, size, and spacing
3. **Consistency**: Unified color usage across all components
4. **Accessibility**: WCAG compliant colors and interactions
5. **Modern**: Dark theme with gradient accents
6. **Performance**: Optimized shadows and animations

---

## Future Enhancements

- [ ] Add light mode variant
- [ ] Create Storybook documentation
- [ ] Add more animation presets
- [ ] Implement theme toggle
- [ ] Create design tokens export

