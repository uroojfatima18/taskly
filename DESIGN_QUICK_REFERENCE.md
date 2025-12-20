# Taskly Design System - Quick Reference

## Color Quick Lookup

### Dark Theme Backgrounds
```
bg-dark-bg        #0a0e1a  Main background
bg-dark-surface   #0f1419  Standard surface
bg-dark-elevated  #1a1f2e  Card backgrounds
bg-dark-border    #1e293b  Border color
bg-dark-hover     #141b2d  Hover state
```

### Brand Colors
```
Primary:  #7c3aed  text-primary-600, bg-primary-600
Cyan:     #06b6d4  text-accent-500, bg-accent-500
Success:  #10b981  text-success-500, bg-success-500
```

### Text Colors
```
text-neutral-100  White headings
text-neutral-400  Body text
text-neutral-500  Secondary text
text-neutral-600  Subtle text
```

---

## Common Component Patterns

### Hero Section with Gradient
```tsx
<div className="bg-dark-bg">
  <h1 className="text-5xl font-bold">
    <span className="text-neutral-100">Normal Text </span>
    <span className="gradient-text">Gradient Text</span>
  </h1>
</div>
```

### Card with Glass Effect
```tsx
<GlassCard variant="gradient">
  <div className="p-6">
    <h3 className="text-neutral-100 font-semibold">Title</h3>
    <p className="text-neutral-400">Description</p>
  </div>
</GlassCard>
```

### Icon with Circle Background
```tsx
<IconCircle
  icon={<CheckIcon />}
  color="primary"
  size="lg"
/>
```

### Feature with Icon & Text
```tsx
<div className="flex gap-4">
  <IconCircle icon={<icon />} color="primary" size="md" />
  <div>
    <h3 className="text-neutral-100">Feature</h3>
    <p className="text-neutral-400">Description</p>
  </div>
</div>
```

### Button Variants
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Minimal</Button>
```

### Status Badge
```tsx
{/* Pending */}
<span className="badge-primary">Pending</span>

{/* Completed */}
<span className="badge-success">Done</span>

{/* Neutral */}
<span className="badge-neutral">Neutral</span>
```

---

## Tailwind Classes Quick Reference

### Backgrounds
```
bg-dark-bg         Main background
bg-dark-surface    Surface level
bg-dark-elevated   Cards/Modals
bg-primary-600     Purple
bg-accent-500      Cyan
bg-success-500     Green
```

### Text Colors
```
text-neutral-100   White (headings)
text-neutral-300   Light (buttons)
text-neutral-400   Normal body
text-primary-400   Purple text
text-accent-400    Cyan text
```

### Borders
```
border-dark-border           Standard border
border-dark-border/30        Subtle border
border-primary-500/50        Purple border
border-success-500/30        Green border
```

### Shadows & Glows
```
shadow-sm-elevated           Subtle shadow
shadow-elevated              Medium shadow
shadow-lifted                High shadow
shadow-glow-purple           Purple glow
shadow-glow-cyan             Cyan glow
```

### Rounded Corners
```
rounded-lg        Standard (1rem)
rounded-xl        Large (1.25rem)
rounded-2xl       Extra large (1.5rem)
rounded-full      Circle
```

---

## Component Import Quick Reference

```tsx
// UI Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { IconCircle } from '@/components/ui/IconCircle';

// Page Components
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Task Components
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
```

---

## Gradient Definitions

```css
/* Available gradient classes */
bg-gradient-taskly    /* Purple → Cyan (brand) */
bg-gradient-hero      /* Purple → Purple (buttons) */
bg-gradient-hero-alt  /* Purple → Cyan (alternative) */
bg-gradient-subtle    /* Navy gradient (subtle) */
bg-gradient-card      /* Transparent purple-cyan */
```

### Apply Gradient to Text
```tsx
<div className="bg-gradient-taskly bg-clip-text text-transparent">
  Your Text
</div>

{/* Or use the class */}
<div className="gradient-text">Your Text</div>
```

---

## Focus & Interaction States

### Focus Ring (Purple)
```css
focus:outline-2
focus:outline-primary-600
focus:outline-offset-2
```

### Hover Effects
```
hover:bg-dark-hover         Hover background
hover:border-primary-500    Hover border
hover:shadow-glow-purple    Purple glow
hover:shadow-lifted         Lifted shadow
hover:text-neutral-100      Text highlight
```

### Active States
```
active:scale-95             Press effect
active:shadow-md            Pressed shadow
disabled:opacity-50         Disabled
disabled:cursor-not-allowed Disabled cursor
```

---

## Responsive Breakpoints

```
sm: 640px   (tablets)
md: 768px   (small laptops)
lg: 1024px  (laptops)
xl: 1280px  (desktops)
```

### Mobile-First Example
```tsx
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive Text
</div>
```

---

## Spacing Scale

```
p-2, p-3, p-4, p-5, p-6   Padding
m-2, m-3, m-4, m-5, m-6   Margin
gap-2, gap-3, gap-4, gap-6 Gaps (flexbox)
```

---

## Animation Classes

```
animate-fade-in        Fade in (0.3s)
animate-slide-up       Slide up (0.4s)
animate-slide-in-right Slide right (0.4s)
animate-scale-in       Scale in (0.3s)
animate-stagger-in     Stagger (0.4s)
animate-bounce-in      Bounce (0.5s)
```

---

## Dark Theme Text Contrast Map

```
Background          Use This Color        Contrast
─────────────────────────────────────────────────────
#0a0e1a (dark-bg)   #ffffff (white)       ✅ AA
#0a0e1a (dark-bg)   #cbd5e1 (light gray)  ✅ AA
#1a1f2e (elevated)  #ffffff (white)       ✅ AA
#1a1f2e (elevated)  #cbd5e1 (light gray)  ✅ AA
```

---

## Common Component Combinations

### Feature Card
```tsx
<GlassCard>
  <div className="flex gap-4">
    <IconCircle icon={icon} color="primary" size="lg" />
    <div>
      <h3 className="text-neutral-100 font-semibold">
        <GradientText>Title</GradientText>
      </h3>
      <p className="text-neutral-400">Description here</p>
    </div>
  </div>
</GlassCard>
```

### Task Item
```tsx
<GlassCard variant="elevated">
  <div className="flex gap-3">
    <button className="w-8 h-8 rounded-lg border-2 border-dark-border
                       hover:border-primary-500 flex items-center justify-center">
      ✓
    </button>
    <div className="flex-1">
      <h3 className="text-neutral-100 font-semibold">Task Title</h3>
      <p className="text-neutral-400 text-sm">Description</p>
    </div>
    <span className="badge-primary">Pending</span>
  </div>
</GlassCard>
```

### Call-to-Action Section
```tsx
<div className="bg-dark-elevated rounded-2xl p-8 border border-dark-border/30">
  <h2 className="text-4xl font-bold mb-4">
    Ready to <GradientText>Get Started</GradientText>?
  </h2>
  <p className="text-neutral-400 mb-6">Join thousands of users</p>
  <Button variant="primary" size="lg">Sign Up Free</Button>
</div>
```

---

## Debugging Tips

### Check Color
```tsx
{/* Temporary border to visualize */}
<div className="border-2 border-primary-600">
  Content
</div>
```

### Check Spacing
```tsx
{/* Temporary background to visualize */}
<div className="bg-primary-600/20">
  Content
</div>
```

### Check Focus
```tsx
{/* Ensure focus ring visible */}
<button className="focus:outline-2 focus:outline-primary-600">
  Button
</button>
```

---

## Color Swatches

### Dark Theme Palette
```
███ #0a0e1a  bg-dark-bg
███ #0f1419  bg-dark-surface
███ #1a1f2e  bg-dark-elevated
███ #1e293b  bg-dark-border
███ #141b2d  bg-dark-hover
```

### Brand Colors
```
███ #7c3aed  Primary Purple
███ #8b5cf6  Light Purple
███ #06b6d4  Cyan Accent
███ #0ea5e9  Light Cyan
███ #10b981  Success Green
```

### Text Colors
```
███ #ffffff  Neutral 100 (white)
███ #cbd5e1  Neutral 300 (light)
███ #94a3b8  Neutral 400 (normal)
███ #475569  Neutral 600 (subtle)
```

---

## Style Migration Guide

### Old → New
```
Light theme    → Dark theme (bg-dark-*)
Blue accents   → Purple primary + Cyan accent
Flat cards     → Glass cards with subtle borders
Standard text  → Better text hierarchy
Old colors     → Unified color palette
```

### Migration Example
```tsx
// Before
<div className="bg-white border-gray-300">
  <h3 className="text-gray-900">Title</h3>
</div>

// After
<GlassCard variant="elevated">
  <h3 className="text-neutral-100">Title</h3>
</GlassCard>
```

---

## Performance Notes

✅ All colors are Tailwind utilities (tree-shaken)
✅ No additional fonts required
✅ Gradients are CSS (no images)
✅ Shadows are optimized
✅ Animations use transform/opacity (GPU accelerated)

---

**Last Updated**: December 20, 2025
**Design System Version**: 1.0
