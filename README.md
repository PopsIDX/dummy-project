# Vue Todo App ✨

A modern, feature-rich todo application built with Vue 3, TypeScript, Vite, and Vitest.

![Vue Todo App](https://github.com/user-attachments/assets/4671ee82-be63-49f1-a597-5db3a51fa338)

## 🚀 Features

### Core Functionality
- ✅ Add todos with title, description, priority, due date, and tags
- ✏️ Edit todos inline with full form support
- 🗑️ Delete todos
- ✔️ Toggle completion status
- 🧹 Clear completed todos in bulk

### Advanced Features
- 🔍 **Search & Filter** - Search by title, description, or tags
- 📊 **Smart Filtering** - View all, active, or completed todos
- 🔄 **Multiple Sort Options** - Sort by created date, due date, priority, or title
- 📈 **Live Statistics** - Track total, active, completed, high priority, and overdue todos
- 🎨 **Priority Levels** - Low, medium, and high with color coding
- 📅 **Due Dates** - Set and track deadlines with overdue detection
- 🏷️ **Tags** - Organize todos with custom tags
- 💾 **Local Storage** - Automatic persistence across sessions
- 🌓 **Dark Mode** - Beautiful dark theme with smooth transitions

## 🛠️ Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast dev server and build tool
- **Vitest** - Fast unit testing (39 tests passing ✅)
- **@vue/test-utils** - Component testing utilities

## 📦 Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

The app includes comprehensive test coverage:
- **17 tests** for the `useTodos` composable
- **10 tests** for the `TodoForm` component
- **12 tests** for the `TodoItem` component

All tests pass successfully! ✅

## 📁 Project Structure

```
src/
├── components/
│   ├── TodoForm.vue      # Add new todos
│   ├── TodoItem.vue      # Individual todo display/edit
│   └── TodoFilters.vue   # Statistics, search, and filters
├── composables/
│   └── useTodos.ts       # Todo state management
├── types/
│   └── todo.ts           # TypeScript interfaces
├── __tests__/
│   ├── useTodos.test.ts
│   ├── TodoForm.test.ts
│   └── TodoItem.test.ts
├── App.vue               # Main app component
├── main.ts               # App entry point
└── style.css             # Global styles & theming
```

## 🎨 Screenshots

### Light Mode
![Light Mode](https://github.com/user-attachments/assets/4671ee82-be63-49f1-a597-5db3a51fa338)

### Dark Mode
![Dark Mode](https://github.com/user-attachments/assets/764b499f-46ff-47bf-9344-da6ef258fed2)

### Search & Filter
![Search Filter](https://github.com/user-attachments/assets/b01095ac-2eb1-4f6d-bbf3-fffd4ce88287)

## 📝 License

MIT

---

Made with ❤️ using Vue 3, TypeScript, and Vite
