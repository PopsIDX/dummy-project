<script setup lang="ts">
import { useTodos } from './composables/useTodos';
import TodoForm from './components/TodoForm.vue';
import TodoFilters from './components/TodoFilters.vue';
import TodoItem from './components/TodoItem.vue';
import type { Todo } from './types/todo';

const {
  filter,
  sortBy,
  searchQuery,
  isDarkMode,
  filteredTodos,
  stats,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  clearCompleted,
} = useTodos();

const handleEdit = (updatedTodo: Todo) => {
  updateTodo(updatedTodo.id, updatedTodo);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">✨ Vue Todo App</h1>
        <button @click="toggleDarkMode" class="theme-toggle" :title="isDarkMode ? 'Light mode' : 'Dark mode'">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </div>
      <p class="app-subtitle">A modern, feature-rich todo application</p>
    </header>

    <main class="app-main">
      <TodoForm @add="addTodo" />

      <TodoFilters
        :filter="filter"
        :sortBy="sortBy"
        :searchQuery="searchQuery"
        :stats="stats"
        @update:filter="filter = $event"
        @update:sortBy="sortBy = $event"
        @update:searchQuery="searchQuery = $event"
        @clearCompleted="clearCompleted"
      />

      <div v-if="filteredTodos.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>{{ filter === 'completed' ? 'No completed todos yet' : filter === 'active' ? 'No active todos' : 'No todos yet' }}</h3>
        <p>{{ filter === 'all' ? 'Start by adding a new todo!' : 'Try changing the filter.' }}</p>
      </div>

      <div v-else class="todo-list">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @toggle="toggleTodo"
          @delete="deleteTodo"
          @edit="handleEdit"
        />
      </div>
    </main>

    <footer class="app-footer">
      <p>Made with ❤️ using Vue 3, TypeScript, and Vite</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: var(--background);
  transition: background 0.3s ease;
}

.app-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.app-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-toggle {
  padding: 0.5rem;
  font-size: 1.5rem;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-subtitle {
  margin: 0.5rem 0 0 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.todo-list {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface);
  border: 2px dashed var(--border);
  border-radius: 12px;
  margin-top: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.app-footer {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }

  .app-main {
    padding: 1.5rem 1rem;
  }
}
</style>
