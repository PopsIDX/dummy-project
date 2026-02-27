<script setup lang="ts">
import { ref } from "vue";
import { useTodos } from "@/composables/useTodos";
import TodoItem from "@/components/TodoItem.vue";

const {
  filter,
  editingId,
  filteredTodos,
  activeCount,
  completedCount,
  allCompleted,
  addTodo,
  removeTodo,
  toggleTodo,
  toggleAll,
  clearCompleted,
  startEditing,
  finishEditing,
  cancelEditing,
} = useTodos();

const newTodoText = ref("");

function handleAddTodo() {
  addTodo(newTodoText.value);
  newTodoText.value = "";
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">todos</h1>
      <p class="subtitle">Double-click a todo to edit. Press Escape to cancel.</p>
    </header>

    <main class="main-card">
      <!-- Input -->
      <form class="input-section" @submit.prevent="handleAddTodo">
        <button
          v-if="filteredTodos.length > 0"
          type="button"
          class="toggle-all"
          :class="{ active: allCompleted }"
          @click="toggleAll"
          aria-label="Toggle all todos"
        >
          &#x276F;
        </button>
        <input
          v-model="newTodoText"
          class="new-todo"
          placeholder="What needs to be done?"
          autofocus
        />
      </form>

      <!-- List -->
      <TransitionGroup name="list" tag="ul" class="todo-list">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          :editing="editingId === todo.id"
          @toggle="toggleTodo"
          @remove="removeTodo"
          @start-edit="startEditing"
          @finish-edit="finishEditing"
          @cancel-edit="cancelEditing"
        />
      </TransitionGroup>

      <!-- Empty state -->
      <div v-if="filteredTodos.length === 0" class="empty-state">
        <span v-if="filter === 'all'">No todos yet. Add one above!</span>
        <span v-else-if="filter === 'active'">No active todos.</span>
        <span v-else>No completed todos.</span>
      </div>

      <!-- Footer -->
      <footer v-if="activeCount > 0 || completedCount > 0" class="footer">
        <span class="count">
          <strong>{{ activeCount }}</strong>
          {{ activeCount === 1 ? "item" : "items" }} left
        </span>

        <div class="filters">
          <button
            :class="{ selected: filter === 'all' }"
            @click="filter = 'all'"
          >
            All
          </button>
          <button
            :class="{ selected: filter === 'active' }"
            @click="filter = 'active'"
          >
            Active
          </button>
          <button
            :class="{ selected: filter === 'completed' }"
            @click="filter = 'completed'"
          >
            Completed
          </button>
        </div>

        <button
          v-if="completedCount > 0"
          class="clear-completed"
          @click="clearCompleted"
        >
          Clear completed
        </button>
        <span v-else class="clear-placeholder" />
      </footer>
    </main>
  </div>
</template>

<style>
:root {
  --bg: #f5f5f7;
  --surface: #ffffff;
  --text: #1d1d1f;
  --text-muted: #8e8e93;
  --border: #e5e5ea;
  --hover: #f9f9fb;
  --accent: #007aff;
  --danger: #ff3b30;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped>
.app {
  max-width: 520px;
  margin: 0 auto;
  padding: 48px 16px 32px;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 48px;
  font-weight: 200;
  letter-spacing: -1px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.subtitle {
  font-size: 12px;
  color: var(--text-muted);
  opacity: 0.7;
}

.main-card {
  background: var(--surface);
  border-radius: 16px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.input-section {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding: 0 16px;
}

.toggle-all {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-muted);
  cursor: pointer;
  transform: rotate(90deg);
  padding: 8px 4px;
  transition: color 0.2s;
  flex-shrink: 0;
}

.toggle-all.active {
  color: var(--accent);
}

.new-todo {
  flex: 1;
  padding: 18px 12px;
  font-size: 15px;
  border: none;
  background: transparent;
  color: var(--text);
  outline: none;
  font-family: inherit;
}

.new-todo::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty-state {
  padding: 32px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
  gap: 8px;
}

.count {
  flex: 1;
  white-space: nowrap;
}

.filters {
  display: flex;
  gap: 4px;
}

.filters button {
  background: none;
  border: 1px solid transparent;
  color: var(--text-muted);
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: all 0.15s ease;
}

.filters button:hover {
  border-color: var(--border);
}

.filters button.selected {
  border-color: var(--accent);
  color: var(--accent);
}

.clear-completed {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  text-align: right;
  flex: 1;
  transition: color 0.15s ease;
}

.clear-completed:hover {
  color: var(--danger);
}

.clear-placeholder {
  flex: 1;
}

/* List transitions */
.list-enter-active {
  transition: all 0.25s ease;
}

.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.25s ease;
}
</style>
