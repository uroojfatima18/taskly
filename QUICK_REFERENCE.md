# Quick Reference - UI Design System

## Key Colors

```
PRIMARY:    #7C3AED (purple-600)     - Brand, buttons, focus
ACCENT:     #0284C7 (accent-600)     - Secondary highlights
SUCCESS:    #22C55E (success-500)    - Completion, success
NEUTRAL:    #171717 (neutral-900)    - Text, #fafafa (neutral-50) background
```

## Component Quick Lookup

### Button
```tsx
<Button variant="primary">Create Task</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Learn More</Button>
```

### Input
```tsx
<Input label="Task Title" placeholder="What needs to be done?" />
<Input label="Email" type="email" error="Invalid email" />
```

### Card
```tsx
<div className="card-elevated">
  {/* Content */}
</div>

<div className="card-gradient">
  {/* Gradient content */}
</div>
```

### Badge
```tsx
<span className="badge-primary">Pending</span>
<span className="badge-success">Complete</span>
<span className="badge-neutral">Info</span>
```

### Checkbox/Toggle
```tsx
<button className="h-8 w-8 rounded-xl border-2 border-neutral-300
                   hover:border-primary-500 hover:scale-110">
  {isChecked && <span className="animate-bounce-in">✓</span>}
</button>
```

## Common Tailwind Classes

### Colors
```
bg-primary-600        text-primary-700      border-primary-200
bg-success-500        text-success-700      border-success-200
bg-neutral-50         text-neutral-900      border-neutral-100
```

### Shadows
```
shadow-sm-elevated    - Light shadow (cards)
shadow-elevated       - Medium shadow (hover)
shadow-lifted         - Large shadow (modals)
shadow-glow           - Purple glow
```

### Spacing
```
p-4  = 16px padding
p-6  = 24px padding
gap-3 = 12px gap
```

### Border Radius
```
rounded-lg   = 16px
rounded-xl   = 20px
rounded-2xl  = 24px
rounded-full = 50%
```

### Transitions
```
transition-fast  = 200ms
transition-base  = 300ms (default)
transition-slow  = 500ms
```

### Animations
```
animate-bounce-in    - Checkmark pop animation
animate-pulse-success - Completion pulse
animate-spin         - Loading spinner
```

## Layout Patterns

### Grid Layout (Statistics)
```tsx
<div className="grid md:grid-cols-4 gap-4">
  <StatisticsCard ... />
  <StatisticsCard ... />
  <StatisticsCard ... />
  <StatisticsCard ... />
</div>
```

### Flex Center
```tsx
<div className="flex items-center justify-center gap-3">
  {/* Content */}
</div>
```

### Card Container
```tsx
<div className="card-elevated p-6">
  <h2 className="text-2xl font-bold text-neutral-900">Title</h2>
  <p className="text-neutral-600 mt-2">Description</p>
</div>
```

## Dark Mode Support

Not currently implemented. To add:
```tsx
// In tailwind.config.ts
darkMode: 'class',

// Add dark variants to components
className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
```

## Responsive Breakpoints

```
sm:  640px   - Small phones
md:  768px   - Tablets
lg:  1024px  - Laptops
xl:  1280px  - Desktops
2xl: 1536px  - Large screens
```

## Mobile-First Examples

```tsx
// Responsive spacing
className="px-4 md:px-8 lg:px-12"

// Responsive grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Responsive text
className="text-base md:text-lg lg:text-xl"
```

## Accessibility Features

### Focus Ring
```tsx
:focus-visible {
  outline: 2px solid primary-600;
  outline-offset: 2px;
}
```

### ARIA Labels
```tsx
<button aria-label="Mark task as complete">
  ✓
</button>

<div role="alert" aria-live="polite">
  Task created successfully
</div>
```

### Skip Links
```tsx
<a href="#main" className="sr-only">Skip to main content</a>
```

## Performance Tips

1. **Use Tailwind classes** - No inline styles
2. **Avoid keyframe animations on many elements** - Max 3-5 simultaneous
3. **Use transform & opacity only** - Not width/height
4. **Enable hardware acceleration** - Use will-change sparingly
5. **Optimize images** - Use next/image component

## Common Patterns

### Loading State
```tsx
{isLoading ? (
  <div className="animate-spin h-6 w-6 border-2 border-primary-200 border-t-primary-600" />
) : (
  <span>Loaded</span>
)}
```

### Error State
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
    {error}
  </div>
)}
```

### Empty State
```tsx
<div className="text-center py-12">
  <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
  <h3 className="text-neutral-900 font-semibold">No items yet</h3>
  <p className="text-neutral-500 text-sm mt-1">Create your first item to get started</p>
</div>
```

### Disabled State
```tsx
<button disabled className="opacity-50 cursor-not-allowed">
  Submit
</button>
```

## CSS Variables

Already set in globals.css:
```css
--primary: 124, 58, 237       (RGB for purple)
--accent: 2, 132, 199         (RGB for blue)
--success: 34, 197, 94        (RGB for green)
--neutral: 23, 23, 23         (RGB for dark gray)
```

## Debugging

### Color not applying?
1. Check Tailwind config has the color
2. Ensure class name is exact
3. Check PurgeCSS doesn't remove the class

### Animation stuttering?
1. Open DevTools Performance tab
2. Check frame rate (should be 60fps)
3. Reduce number of simultaneous animations

### Component looks different on mobile?
1. Check responsive classes (sm:, md:, lg:)
2. Test on actual device
3. Check device pixel ratio

## CSS File Structure

```
globals.css
├── @layer base
│   ├── Root variables
│   ├── Typography
│   └── Focus styles
├── @layer components
│   ├── Glass effect
│   ├── Gradient text
│   ├── Cards
│   ├── Buttons
│   └── Badges
├── @layer utilities
│   ├── Text utilities
│   ├── Transitions
│   ├── Animations
│   ├── Hover effects
│   └── Backdrop blur
└── Reduced motion support
```

## Import Statements

```tsx
// Components
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatisticsCard } from '@/components/StatisticsCard'
import { TaskItem } from '@/components/tasks/TaskItem'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'

// Styles (automatic, no import needed)
// Just use Tailwind classes in className
```

## Common Mistakes to Avoid

1. ❌ Using inline styles - Use Tailwind classes
2. ❌ Mixing color systems - Stick to primary/accent/success/neutral
3. ❌ Forgetting responsive prefixes - Add sm:, md:, lg: as needed
4. ❌ Too many animations - Limit to 2-3 per interaction
5. ❌ Low contrast colors - Always check WCAG AA (4.5:1)
6. ❌ No focus indicators - Always style :focus-visible
7. ❌ Hardcoded colors - Use Tailwind color tokens

## Quick Copy-Paste

### Primary Button
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700
                   text-white rounded-xl font-semibold shadow-sm-elevated
                   hover:shadow-elevated transition-all duration-300">
  Click me
</button>
```

### Task Card
```tsx
<div className="card-elevated p-5 hover:shadow-lg hover:shadow-primary-100
                hover:border-primary-200 transition-all duration-300">
  {/* Content */}
</div>
```

### Gradient Background
```tsx
<div className="bg-gradient-to-r from-primary-50 to-accent-50 p-8 rounded-2xl">
  {/* Content */}
</div>
```

### Glass Effect
```tsx
<div className="glass rounded-2xl p-6 border border-neutral-100/20">
  {/* Content */}
</div>
```

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Current

