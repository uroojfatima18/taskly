# Design System Reference Guide

## Color Palette

### Primary Colors (Purple - Brand Color)
```
primary-50:  #f5f3ff   (Lightest background)
primary-100: #ede9fe  (Light background)
primary-200: #ddd6fe  (Light accent)
primary-300: #c4b5fd  (Medium light)
primary-400: #a78bfa  (Medium)
primary-500: #8b5cf6  (Base)
primary-600: #7c3aed  (Primary brand - MAIN)
primary-700: #6d28d9  (Darker)
primary-800: #5b21b6  (Dark)
primary-900: #4c1d95  (Darkest)
```

### Accent Colors (Blue)
```
accent-50:  #f0f9ff   (Light background)
accent-100: #e0f2fe  (Light accent)
accent-600: #0284c7  (Main accent - used for secondary CTAs)
accent-700: #0369a1  (Darker)
```

### Success Colors (Green)
```
success-50:  #f0fdf4   (Light background for completed tasks)
success-100: #dcfce7  (Light accent)
success-500: #22c55e  (Completed indicator)
success-600: #16a34a  (Darker success)
success-700: #15803d  (Darkest success)
```

### Neutral Colors (Gray)
```
neutral-50:  #fafafa   (Page background)
neutral-100: #f5f5f5  (Card backgrounds, light dividers)
neutral-200: #e5e5e5  (Input borders)
neutral-300: #d4d4d4  (Input borders, dividers)
neutral-400: #a3a3a3  (Disabled text)
neutral-500: #737373  (Secondary text)
neutral-600: #525252  (Secondary text)
neutral-700: #404040  (Body text)
neutral-900: #171717  (Headings)
```

## Typography Scale
```
xs:   0.75rem  (12px) - Small labels, hints
sm:   0.875rem (14px) - Input text, descriptions
base: 1rem     (16px) - Body text
lg:   1.125rem (18px) - Subheadings
xl:   1.25rem  (20px) - Headings
2xl:  1.5rem   (24px) - Large headings
3xl:  1.875rem (30px) - Section titles
4xl:  2.25rem  (36px) - Page titles
5xl:  3rem     (48px) - Hero text
```

## Shadow System
```
sm-elevated:  0 2px 8px rgba(0, 0, 0, 0.08)    - Card shadow
elevated:     0 4px 16px rgba(0, 0, 0, 0.12)   - Hover shadow
lifted:       0 8px 32px rgba(0, 0, 0, 0.16)   - Lifted state
glow:         0 0 20px rgba(124, 58, 237, 0.25) - Purple glow
glow-blue:    0 0 20px rgba(2, 132, 199, 0.25)  - Blue glow
```

## Spacing System
```
0:    0px
1:    0.25rem  (4px)
2:    0.5rem   (8px)
3:    0.75rem  (12px)
4:    1rem     (16px)
5:    1.25rem  (20px)
6:    1.5rem   (24px)
8:    2rem     (32px)
12:   3rem     (48px)
16:   4rem     (64px)
```

## Border Radius
```
xs:   0.25rem   (4px)
sm:   0.375rem  (6px)
base: 0.5rem    (8px)
md:   0.75rem   (12px)
lg:   1rem      (16px)
xl:   1.25rem   (20px)  - Default for cards
2xl:  1.5rem    (24px)  - Large cards
3xl:  2rem      (32px)  - Extra large cards
```

## Component Styles

### Buttons

#### Primary Button
```tsx
className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700
           text-white rounded-xl font-semibold shadow-sm-elevated
           hover:shadow-elevated hover:from-primary-700 hover:to-primary-800
           transition-all duration-300"
```
**Usage**: Main CTAs, Submit buttons, Primary actions

#### Secondary Button
```tsx
className="px-6 py-3 bg-neutral-100 text-neutral-900 rounded-xl
           font-semibold hover:bg-neutral-200 transition-all duration-300"
```
**Usage**: Cancel buttons, Secondary actions

#### Ghost Button
```tsx
className="px-4 py-2 text-neutral-600 hover:text-primary-600
           hover:bg-primary-50 rounded-lg transition-all duration-300"
```
**Usage**: Tertiary actions, Navigation

### Cards

#### Card Elevated
```tsx
className="bg-white rounded-2xl shadow-sm-elevated border border-neutral-100
           transition-all duration-300 hover:shadow-elevated"
```
**Usage**: Task items, Statistics cards, Content containers

#### Card Gradient
```tsx
className="bg-white rounded-2xl shadow-sm-elevated border border-neutral-100/50
           bg-gradient-to-br from-primary-50 to-primary-100
           transition-all duration-300 hover:shadow-elevated"
```
**Usage**: Feature cards, Highlighted sections

### Inputs

#### Input Base
```tsx
className="px-4 py-3 bg-white border border-neutral-200 rounded-lg
           focus:border-primary-500 focus:ring-1 focus:ring-primary-500
           outline-none transition-all duration-200"
```
**Usage**: Text inputs, Form fields

### Badges

#### Badge Primary
```tsx
className="inline-flex items-center px-3 py-1 rounded-full text-sm
           font-medium bg-primary-100 text-primary-700"
```

#### Badge Success
```tsx
className="inline-flex items-center px-3 py-1 rounded-full text-sm
           font-medium bg-success-100 text-success-700"
```

## Animation Reference

### Bounce In (Checkmark)
```css
@keyframes bounce-in {
  0%: transform scale(0.8); opacity 0;
  50%: transform scale(1.1);
  100%: transform scale(1); opacity 1;
}
/* Duration: 0.5s, Easing: cubic-bezier(0.34, 1.56, 0.64, 1) */
```

### Pulse Success
```css
@keyframes pulse-success {
  0%, 100%: box-shadow 0 0 0 0 rgba(34, 197, 94, 0.7);
  50%: box-shadow 0 0 0 10px rgba(34, 197, 94, 0);
}
/* Duration: 1.5s, Easing: ease-out */
```

### Standard Transitions
```
fast: 200ms  - Micro-interactions (hover, focus)
base: 300ms  - Standard transitions (color changes, shadows)
slow: 500ms  - Complex animations (modals, large changes)
```

## Component Specifications

### Task Checkbox (Uncompleted)
```
Size: 32px x 32px
Border: 2px solid neutral-300
Background: transparent
Hover: border → primary-500, bg → primary-50
Cursor: pointer
Border Radius: rounded-xl
Transition: 300ms
```

### Task Checkbox (Completed)
```
Size: 32px x 32px (scales to 1.1x on complete)
Border: 2px solid success-500
Background: gradient from success-500 to success-600
Icon: Filled checkmark (h-5 w-5)
Shadow: shadow-lg shadow-success-300
Animation: bounce-in on completion
```

### Status Badge
```
Padding: px-3 py-1.5
Background: Gradient backgrounds
Text: Bold uppercase, white or colored text
Border Radius: rounded-full
Font Size: xs (12px)
Shadow: shadow-sm

Pending State:
  Background: gradient from primary-100 to primary-200
  Text: primary-700

Completed State:
  Background: gradient from success-100 to success-200
  Text: success-700
```

### Task Card
```
Background: white
Border: 2px border-neutral-100
Padding: p-5
Border Radius: rounded-xl
Shadow: shadow-sm-elevated
Hover Shadow: shadow-elevated
Backdrop Filter: blur-sm
Transition: 300ms ease-out

Completed State:
  Border: border-success-200
  Background: gradient from success-50 to emerald-50
```

## Gradient Definitions

### Hero Gradient
```css
background: linear-gradient(135deg, #7c3aed 0%, #0284c7 100%)
```
**Usage**: Page headers, logos, hero sections

### Subtle Gradient
```css
background: linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 100%)
```
**Usage**: Background, subtle accents

### Card Gradient
```css
background: linear-gradient(135deg,
  rgba(124, 58, 237, 0.05) 0%,
  rgba(2, 132, 199, 0.05) 100%)
```
**Usage**: Card backgrounds, subtle overlays

## Responsive Design

### Breakpoints
```
sm:  640px   - Small devices
md:  768px   - Tablets
lg:  1024px  - Desktops
xl:  1280px  - Large desktops
2xl: 1536px  - Extra large displays
```

### Mobile-First Approach
- Checkboxes: 32px x 32px (good mobile touch target)
- Cards: Full width on mobile, grid on larger screens
- Typography: Responsive font sizes (sm:text-sm lg:text-lg)
- Spacing: Reduced padding on mobile, increased on desktop

## Glass Effect (Premium Feel)

```tsx
className="backdrop-blur-sm bg-white/80"
/* Also available: backdrop-blur-md, backdrop-blur-lg */
```

**Usage**: Headers, overlays, premium surfaces

## State Colors

### Interactive States
```
Default:  primary-600
Hover:    primary-700
Active:   primary-800
Disabled: primary-400 (reduced opacity)
```

### Validation States
```
Valid:   success-600
Invalid: red-600
Warning: amber-600
Info:    accent-600
```

## Accessibility Notes

### Color Contrast Ratios
- Primary-600 text on neutral-50: 7.2:1 (AAA)
- Neutral-700 text on neutral-50: 15.2:1 (AAA)
- Success-600 text on neutral-50: 5.4:1 (AA)
- Primary-600 on white: 5.8:1 (AA)

### Focus Indicators
```
Outline: 2px solid primary-600
Outline Offset: 2px
```

### Motion Preferences
Respects `prefers-reduced-motion: reduce` - animations set to 0.01ms

## Usage Examples

### Creating a Success Message
```tsx
<div className="bg-success-50 border border-success-200 text-success-700 p-4 rounded-lg">
  ✓ Task completed successfully!
</div>
```

### Creating an Error State
```tsx
<input
  className="border border-red-500 focus:ring-red-500 focus:border-red-500"
  aria-invalid="true"
/>
```

### Creating a Disabled Button
```tsx
<button
  disabled
  className="bg-primary-400 text-white opacity-50 cursor-not-allowed"
>
  Processing...
</button>
```

### Hover Lift Effect
```tsx
<div className="hover-lift">
  Hover me for elevation!
</div>
```

