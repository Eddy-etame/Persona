# EduSystemDesign — Project Guidelines

## Language

All user-facing text must be in **French**. Code (variables, functions, comments) should be in **English**.

## Tech Stack

| Layer         | Technology                                  |
|---------------|---------------------------------------------|
| Framework     | React 18 + TypeScript (TSX)                 |
| Bundler       | Vite 6                                      |
| Routing       | React Router 7 (`createBrowserRouter`)      |
| Styling       | Tailwind CSS 4 + CSS variables (`theme.css`)|
| UI Components | shadcn/ui (Radix primitives + CVA)          |
| Icons         | lucide-react                                |
| Toasts        | sonner                                      |
| Charts        | recharts                                    |
| PDF Export    | html2canvas + jspdf (dynamic imports)       |
| Persistence   | Browser localStorage                        |
| Package Mgr   | pnpm                                        |

## Project Structure

```
src/
  app/
    pages/              # Route-level page components
    components/
      ui/               # shadcn/ui primitives (button, card, etc.)
      persona/          # PersonaEditor sub-components
      ThemeToggle.tsx    # Dark mode toggle
      SaveStatus.tsx     # Autosave status indicator
    lib/
      schoolStore.ts    # localStorage CRUD, School interface, export/import
      types.ts          # Shared interfaces (Persona, JourneyStep)
      useAutosave.ts    # Autosave hook
      ThemeProvider.tsx  # Dark mode context provider
    routes.ts           # React Router configuration
    App.tsx             # Root component (ThemeProvider + Router + Toaster)
  styles/
    index.css           # Entry CSS (imports fonts, tailwind, theme)
    fonts.css           # Font imports
    tailwind.css        # Tailwind directives
    theme.css           # CSS custom properties + dark mode tokens
```

## Coding Conventions

### Components
- One component per file. File name matches the default export.
- Page components go in `pages/`. Reusable components go in `components/`.
- Keep page components under 300 lines. Extract sub-components when a file grows beyond that.
- Props interfaces are defined in the same file as the component, unless shared.

### Tailwind
- **Never use dynamic class interpolation** (e.g. `` bg-${color}-500 ``). Tailwind purges classes at build time and cannot detect these. Use a static map instead.
- Keep utility classes in JSX. Extract to `@apply` only for truly repeated patterns.
- Use CSS variables from `theme.css` for theming (colors, border-radius, etc.).

### State Management
- Use React `useState` + `useCallback` for local state.
- Use `localStorage` via helpers in `schoolStore.ts` for persistence.
- Use the `useAutosave` hook for any editor page with user input.
- No global state library is needed at current scale.

### Types
- Shared interfaces (`Persona`, `JourneyStep`, `School`) live in `lib/types.ts` or `lib/schoolStore.ts`.
- Always use `import type { ... }` for type-only imports.
- Do not define interfaces inside page components if they are used elsewhere.

### Imports
- Remove unused imports before committing.
- Group imports: React → third-party → local components → local lib → types.
- Use the `@/` path alias (maps to `src/`).

### Toasts
- Always use `toast` from `sonner`. Never create custom DOM-based toast elements.
- Use `toast.success()`, `toast.error()`, `toast.info()` for semantic feedback.

### French Content
- All labels, placeholders, button text, and error messages must be in French.
- Variable names and function names remain in English.
- Template data (persona examples) is in French.

## Git & Workflow
- Commit messages in English, imperative mood: "Add dark mode toggle", "Fix dynamic Tailwind classes".
- One logical change per commit.
- Test the dev server (`pnpm dev`) before committing to verify no build errors.
