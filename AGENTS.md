# AGENTS.md

Instructions for AI agents working on this codebase.

## Project overview

A minimalist todo application built with **Vue 3**, **TypeScript**, and **Vite**. State is managed through a Vue composable and persisted to `localStorage`. There is no backend -- this is a fully client-side SPA.

## Tech stack

| Layer      | Technology                |
|------------|---------------------------|
| Framework  | Vue 3 (Composition API, `<script setup>`) |
| Language   | TypeScript (strict mode)  |
| Bundler    | Vite 6                    |
| Tests      | Vitest 2 + @vue/test-utils 2 |
| Test env   | jsdom                     |

## Directory structure

```
.
├── index.html                  # Vite entry HTML
├── vite.config.ts              # Vite config (plugins, aliases)
├── vitest.config.ts            # Vitest config (merges vite config, adds jsdom)
├── tsconfig.json               # Root TS config (references app + node)
├── tsconfig.app.json           # TS config for src/ (strict, path aliases)
├── tsconfig.node.json          # TS config for config files (vite, vitest)
├── public/                     # Static assets served as-is
│   └── vite.svg
└── src/
    ├── main.ts                 # App entry point (createApp + mount)
    ├── App.vue                 # Root component (input, list, filters, footer)
    ├── types/
    │   └── todo.ts             # Todo interface and FilterMode type
    ├── composables/
    │   └── useTodos.ts         # All todo logic (CRUD, filtering, persistence)
    ├── components/
    │   └── TodoItem.vue        # Single todo row (view + edit mode)
    └── __tests__/
        ├── useTodos.test.ts    # Unit tests for the composable (18 tests)
        ├── TodoItem.test.ts    # Component tests for TodoItem (14 tests)
        └── App.test.ts         # Integration tests for the full App (9 tests)
```

## Architecture

### Data flow

All state lives in the `useTodos` composable (`src/composables/useTodos.ts`). There is no global store (Pinia/Vuex). The composable is called once in `App.vue` and the returned refs/functions are passed down to child components via props and events.

```
App.vue
  └─ calls useTodos() → gets reactive state + actions
  └─ renders TodoItem.vue for each todo (props down, events up)
```

### Types (`src/types/todo.ts`)

- `Todo` -- `{ id: string, text: string, completed: boolean, createdAt: number }`
- `FilterMode` -- `"all" | "active" | "completed"`

### Composable (`src/composables/useTodos.ts`)

This is where all business logic lives. It exposes:

| Reactive state    | Purpose                              |
|-------------------|--------------------------------------|
| `todos`           | Full list of todos                   |
| `filter`          | Current filter mode                  |
| `editingId`       | ID of the todo being edited (or null)|
| `filteredTodos`   | Computed: todos filtered by `filter` |
| `activeCount`     | Computed: number of incomplete todos |
| `completedCount`  | Computed: number of completed todos  |
| `allCompleted`    | Computed: true when all are done     |

| Action            | Purpose                              |
|-------------------|--------------------------------------|
| `addTodo(text)`   | Add a new todo (trims, rejects empty)|
| `removeTodo(id)`  | Delete a todo by ID                  |
| `toggleTodo(id)`  | Toggle completed state               |
| `toggleAll()`     | Mark all complete or all incomplete  |
| `clearCompleted()`| Remove all completed todos           |
| `startEditing(id)`| Enter edit mode for a todo           |
| `finishEditing(id, text)` | Save edit (or delete if empty) |
| `cancelEditing()` | Exit edit mode without saving        |

Persistence: a `watch(..., { deep: true })` serializes the todo array to `localStorage` under the key `"vue-todo-app"` on every mutation.

### Components

- **`App.vue`** -- Shell component. Owns the input form, renders the todo list via `<TransitionGroup>`, shows filter buttons and a footer with counts. Global CSS variables for theming are declared here in an unscoped `<style>` block.
- **`TodoItem.vue`** -- Renders a single todo. Has two modes: view (checkbox + text + delete button) and edit (text input). Communicates upward exclusively through emitted events (`toggle`, `remove`, `startEdit`, `finishEdit`, `cancelEdit`).

### Styling

- CSS custom properties defined on `:root` in `App.vue` (unscoped style block).
- Component styles use `<style scoped>`.
- No CSS preprocessor or utility framework -- plain CSS only.
- Design tokens: `--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--hover`, `--accent`, `--danger`, `--shadow`.

## Commands

| Command            | What it does                                        |
|--------------------|-----------------------------------------------------|
| `npm run dev`      | Start Vite dev server with HMR                      |
| `npm run build`    | Type-check with `vue-tsc -b` then production build  |
| `npm run preview`  | Serve the `dist/` build locally                     |
| `npm test`         | Run all tests once (`vitest run`)                   |
| `npm run test:watch` | Run tests in watch mode (`vitest`)                |

## Path aliases

`@` is aliased to `src/` in both Vite (`vite.config.ts`) and TypeScript (`tsconfig.app.json`). Always use `@/` imports for source files:

```ts
import { useTodos } from "@/composables/useTodos";
import type { Todo } from "@/types/todo";
```

## Testing conventions

- Test files go in `src/__tests__/` and are named `<subject>.test.ts`.
- Tests for composables call the composable directly and assert on the returned refs.
- Tests for components use `@vue/test-utils` `mount()` and assert on rendered output + emitted events.
- `localStorage` and `crypto.randomUUID` must be mocked in tests (jsdom does not provide them). Each test file sets up its own mocks in a `beforeEach` block.
- Tests run against jsdom (configured in `vitest.config.ts`).
- Vitest globals (`describe`, `it`, `expect`, `vi`, `beforeEach`) are enabled -- no need to import them.

## Conventions for making changes

1. **All business logic belongs in composables**, not in components. Components should only handle rendering and event forwarding.
2. **Types go in `src/types/`**. Do not inline interfaces in components or composables.
3. **New components go in `src/components/`**. Use `<script setup lang="ts">` with typed `defineProps` and `defineEmits`.
4. **Use scoped styles** in components. Only `App.vue` may have unscoped global styles (for CSS variables and resets).
5. **Always run `npm run build`** after making changes to verify there are no type errors. The build script runs `vue-tsc` before bundling.
6. **Always run `npm test`** after making changes and ensure all tests pass. Add new tests for any new functionality.
7. **Do not introduce new dependencies** without justification. The project deliberately has zero runtime dependencies beyond Vue itself.
