# Theme Changes Reference Guide

## Color Mapping: Light Theme → Dark Theme

### Backgrounds
| Light | Dark | Usage |
|-------|------|-------|
| `bg-white` | `bg-dark-surface` | Cards, sections |
| `bg-white/80` | `bg-dark-surface` | Semi-transparent areas |
| `bg-white/90` | `bg-dark-surface` | Backdrops |
| (implicit white) | `bg-dark-bg` | Full page/body |
| (implicit white) | `bg-dark-elevated` | Nested elements |

### Text Colors
| Light | Dark | Usage |
|-------|------|-------|
| `text-neutral-900` | `text-neutral-100` | Primary text |
| `text-neutral-600` | `text-neutral-300` | Secondary text |
| `text-neutral-500` | `text-neutral-400` | Tertiary text |
| `text-gray-700` | `text-neutral-300` | Form labels |
| `text-neutral-700` | `text-neutral-200` | Strong labels |

### Borders
| Light | Dark | Usage |
|-------|------|-------|
| `border-neutral-200` | `border-dark-border` | Standard borders |
| `border-neutral-300` | `border-dark-border` | Thicker borders |
| `border-neutral-100/20` | `border-dark-border` | Subtle borders |

### Interactive Elements
| Light | Dark | Usage |
|-------|------|-------|
| `hover:bg-neutral-100` | `hover:bg-dark-hover` | Hover states |
| `hover:bg-gray-200` | `hover:bg-dark-hover` | Secondary hover |
| `focus:ring-gray-400` | `focus:ring-primary-600` | Focus indicators |

## Component-Specific Changes

### Navbar
```diff
- bg-white/80 backdrop-blur-md border-neutral-100/20
+ bg-dark-surface border-dark-border

- text-neutral-600
+ text-neutral-300

- text-white hover:text-primary-200
+ text-neutral-100 (already good)
```

### Dashboard Page
```diff
- bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50
+ bg-dark-surface rounded-2xl shadow-elevated border border-dark-border

- text-neutral-900
+ text-neutral-100

- bg-gradient-to-r from-blue-50 to-indigo-50
+ bg-gradient-subtle
```

### Task Cards
```diff
- bg-white/90 backdrop-blur-sm rounded-xl border-2 p-4 border-neutral-200
+ bg-dark-surface rounded-xl border p-4 border-dark-border

- hover:border-blue-300 hover:shadow-lg
+ hover:border-primary-600 hover:shadow-glow

- text-neutral-900 (completed state)
+ text-neutral-100 (completed state)

- text-neutral-600 (description)
+ text-neutral-400 (description)
```

### Input Fields
```diff
- bg-neutral-50 border-2 border-neutral-200
+ bg-dark-elevated border border-dark-border

- focus:border-blue-500 focus:ring-2 focus:ring-blue-200
+ focus:border-primary-600 focus:ring-2 focus:ring-primary-600/30

- text-neutral-900 placeholder:text-neutral-500
+ text-neutral-100 placeholder:text-neutral-500
```

### Buttons
```diff
Primary Button:
- bg-gradient-to-r from-blue-600 to-blue-700
+ bg-gradient-hero (from-primary-600 to-primary-700)

- shadow-md hover:shadow-lg
+ shadow-glow hover:shadow-lifted

Secondary Button:
- bg-white/80 text-neutral-600
+ bg-dark-surface text-neutral-300

- hover:bg-neutral-100
+ hover:bg-dark-hover
```

### Modal
```diff
- bg-white rounded-2xl shadow-2xl
+ bg-dark-surface rounded-2xl shadow-lifted

- border-neutral-200/50
+ border-dark-border

- text-neutral-900 text-neutral-600
+ text-neutral-100 text-neutral-400
```

## Class Usage Patterns

### Surfaces (in priority order)
1. `bg-dark-bg` - Full screen background
2. `bg-dark-surface` - Primary card/section container
3. `bg-dark-elevated` - Nested elements, inputs
4. `bg-dark-hover` - Interactive hover states

### Text (in priority order)
1. `text-neutral-100` - Primary body text
2. `text-neutral-300` - Secondary helper text
3. `text-neutral-400` - Tertiary/disabled text
4. `text-neutral-500` - Placeholder text

### Accents
- `bg-gradient-to-br from-primary-600 to-accent-500` - Hero elements
- `shadow-glow` - Prominent components
- `shadow-lifted` - Modal/overlay elements
- `focus:ring-primary-600` - Focus states

### Borders
- `border-dark-border` - All borders
- `border-primary-600/50` - Highlight borders
- `border-red-500/30` - Error borders
- `border-success-300/30` - Success borders

## Global CSS Classes to Use

These are available from `globals.css`:

```css
.gradient-text           /* Logo/branding text */
.card-elevated          /* Elevated card styling */
.btn-primary            /* Primary button */
.btn-secondary          /* Secondary button */
.btn-ghost              /* Ghost/transparent button */
.badge-primary          /* Primary badge */
.badge-success          /* Success badge */
.input-base             /* Base input styling */
```

## Migration Checklist for New Components

When creating new components, use this checklist:

- [ ] Use `bg-dark-surface` for containers
- [ ] Use `bg-dark-elevated` for nested inputs
- [ ] Use `text-neutral-100` for primary text
- [ ] Use `text-neutral-300` for secondary text
- [ ] Use `border-dark-border` for all borders
- [ ] Use `hover:bg-dark-hover` for hover states
- [ ] Use `focus:ring-primary-600` for focus states
- [ ] Apply `shadow-glow` to hero elements
- [ ] Apply `shadow-elevated` to cards
- [ ] Use gradient-text for branding
- [ ] Verify contrast ratios (WCAG AA minimum)
- [ ] Test with dark theme assumptions

## Design System Constants

These should be referenced in all styling:

```typescript
// Colors
const darkBg = 'bg-dark-bg'           // #0B1020
const darkSurface = 'bg-dark-surface' // #11162A
const darkElevated = 'bg-dark-elevated' // #161B33
const darkBorder = 'border-dark-border' // #2A2F4A
const darkHover = 'hover:bg-dark-hover' // #1C2140

// Text
const textPrimary = 'text-neutral-100'
const textSecondary = 'text-neutral-300'
const textTertiary = 'text-neutral-400'

// Accents
const accentPrimary = 'from-primary-600'     // #7C7CFF
const accentSecondary = 'to-accent-500'      // #4F46E5
const accentSuccess = 'text-success-300'     // #22D3EE
```

## Verification Commands

```bash
# Find any remaining light theme references
grep -r "bg-white\|text-neutral-900\|border-neutral-200" src --include="*.tsx"

# Should return 0 results (all updated)

# Verify build
npm run build

# Check no TypeScript errors
npm run build -- --no-lint
```

## Common Mistakes to Avoid

❌ **Don't use:**
- `bg-white` - Use `bg-dark-surface`
- `bg-gray-100` - Use `bg-dark-elevated`
- `text-neutral-900` - Use `text-neutral-100`
- `text-gray-700` - Use `text-neutral-300`
- `border-neutral-200` - Use `border-dark-border`

✅ **Do use:**
- `bg-dark-surface` - For containers
- `bg-dark-elevated` - For inputs/nested
- `text-neutral-100` - For primary text
- `text-neutral-300` - For secondary text
- `border-dark-border` - For all borders

## Notes
- All colors are available in Tailwind config
- No inline styles - use Tailwind classes
- All transitions use 300ms duration
- All shadows use proper opacity
- All text has sufficient contrast
