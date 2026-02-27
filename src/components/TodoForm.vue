<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '../types/todo';

interface Emits {
  (e: 'add', todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): void;
}

const emit = defineEmits<Emits>();

const title = ref('');
const description = ref('');
const priority = ref<'low' | 'medium' | 'high'>('medium');
const dueDate = ref('');
const tags = ref('');
const showForm = ref(false);

const addTodo = () => {
  if (!title.value.trim()) return;

  emit('add', {
    title: title.value.trim(),
    description: description.value.trim(),
    completed: false,
    priority: priority.value,
    dueDate: dueDate.value || null,
    tags: tags.value.split(',').map((t) => t.trim()).filter(Boolean),
  });

  // Reset form
  title.value = '';
  description.value = '';
  priority.value = 'medium';
  dueDate.value = '';
  tags.value = '';
  showForm.value = false;
};

const toggleForm = () => {
  showForm.value = !showForm.value;
};
</script>

<template>
  <div class="todo-form-container">
    <button v-if="!showForm" @click="toggleForm" class="btn-add-todo">
      ➕ Add New Todo
    </button>

    <div v-else class="todo-form">
      <h2 class="form-title">Create New Todo</h2>

      <input
        v-model="title"
        type="text"
        placeholder="What needs to be done?"
        class="input-title"
        @keyup.enter="addTodo"
        @keyup.escape="toggleForm"
        autofocus
      />

      <textarea
        v-model="description"
        placeholder="Add a description (optional)"
        class="input-description"
        rows="3"
      />

      <div class="form-row">
        <div class="form-group">
          <label>Priority</label>
          <select v-model="priority" class="input-priority">
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div class="form-group">
          <label>Due Date</label>
          <input v-model="dueDate" type="date" class="input-date" />
        </div>
      </div>

      <div class="form-group">
        <label>Tags</label>
        <input
          v-model="tags"
          type="text"
          placeholder="personal, work, urgent (comma separated)"
          class="input-tags"
        />
      </div>

      <div class="form-actions">
        <button @click="addTodo" :disabled="!title.trim()" class="btn btn-add">
          ✅ Add Todo
        </button>
        <button @click="toggleForm" class="btn btn-cancel">❌ Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-form-container {
  margin-bottom: 2rem;
}

.btn-add-todo {
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-add-todo:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.todo-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  margin: 0 0 1.25rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.input-title,
.input-description,
.input-priority,
.input-date,
.input-tags {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-primary);
  font-family: inherit;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.input-title {
  font-weight: 600;
  font-size: 1.125rem;
}

.input-title:focus,
.input-description:focus,
.input-priority:focus,
.input-date:focus,
.input-tags:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.input-description {
  resize: vertical;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add {
  background: var(--primary);
  color: white;
}

.btn-add:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: var(--secondary);
  color: var(--text-primary);
}

.btn-cancel:hover {
  background: var(--secondary-hover);
}
</style>
