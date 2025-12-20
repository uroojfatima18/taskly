---
name: ui-component-design
description: Skill for designing polished UI components with clear visual hierarchy, natural element integration, and purposeful feedback. Use when creating or improving todo app components.
---

# UI Component Design Skill

## Core Principles

### 1. Clear Visual Opening
Every component should immediately communicate its purpose.

**Patterns:**
- Primary action/content has highest visual weight
- Clear title or label establishes context
- Visual hierarchy guides the eye (size, color, spacing)

```tsx
// Good: Clear hierarchy
<div className="space-y-2">
  <h3 className="text-lg font-semibold text-gray-900">Task Title</h3>
  <p className="text-sm text-gray-500">Supporting details here</p>
</div>

// Avoid: Flat, unclear hierarchy
<div>
  <span>Task Title</span>
  <span>Supporting details here</span>
</div>
```

### 2. Natural Element Integration
UI elements should flow together, not feel bolted on.

**Patterns:**
- Group related elements with consistent spacing
- Use subtle separators (borders, backgrounds) not harsh lines
- Icons complement text, don't compete
- Actions appear contextually, not as afterthoughts

```tsx
// Good: Integrated design
<div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
  <div className="flex-1 min-w-0">
    <p className="font-medium truncate">{task.title}</p>
    <p className="text-sm text-gray-500">{task.dueDate}</p>
  </div>
  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
    <MoreHorizontal className="w-4 h-4" />
  </button>
</div>
```

### 3. Purposeful Feedback & Completion
Every interaction should connect back to the user's goal.

**Patterns:**
- State changes are visible and immediate
- Success/error feedback is contextual
- Completed actions feel satisfying
- Loading states maintain layout stability

```tsx
// Checkbox with satisfying completion
<button
  onClick={toggleComplete}
  className={cn(
    "w-5 h-5 rounded-full border-2 transition-all duration-200",
    isComplete
      ? "bg-green-500 border-green-500 scale-110"
      : "border-gray-300 hover:border-green-400"
  )}
>
  {isComplete && <Check className="w-3 h-3 text-white" />}
</button>
```

## Component Templates

### Task Card
```tsx
interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <div className="group flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
      {/* Status indicator - Clear opening */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          task.completed
            ? "bg-green-500 border-green-500"
            : "border-gray-300 hover:border-green-400"
        )}
      >
        {task.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Content - Natural integration */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium transition-colors",
          task.completed && "text-gray-400 line-through"
        )}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Actions - Contextual completion */}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
```

### Empty State
```tsx
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
      <p className="mt-1 text-sm text-gray-500">Create your first task to get started</p>
    </div>
  );
}
```

## Spacing & Sizing Guidelines

| Element | Spacing | Size |
|---------|---------|------|
| Card padding | `p-4` (16px) | - |
| Element gaps | `gap-3` (12px) | - |
| Icons | - | `w-4 h-4` to `w-6 h-6` |
| Touch targets | `p-2` minimum | 44px minimum |
| Text: Title | - | `text-base` or `text-lg` |
| Text: Secondary | - | `text-sm` |

## Transition Standards

```css
/* Quick feedback (hover, active) */
transition-all duration-150

/* State changes (expand, show/hide) */
transition-all duration-200

/* Entrance animations */
transition-all duration-300

/* Always use ease-out for natural feel */
ease-out
```

## Checklist
- [ ] Clear visual hierarchy established
- [ ] Elements feel integrated, not bolted on
- [ ] All states handled (default, hover, active, disabled, loading)
- [ ] Feedback connects to user's intended action
- [ ] Consistent spacing and sizing
- [ ] Touch-friendly targets (44px+)
