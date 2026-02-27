<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '../types/todo';

interface Props {
  todo: Todo;
}

interface Emits {
  (e: 'toggle', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'edit', todo: Todo): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isEditing = ref(false);
const editTitle = ref(props.todo.title);
const editDescription = ref(props.todo.description);
const editPriority = ref(props.todo.priority);
const editDueDate = ref(props.todo.dueDate || '');
const editTags = ref(props.todo.tags.join(', '));

const startEdit = () => {
  isEditing.value = true;
  editTitle.value = props.todo.title;
  editDescription.value = props.todo.description;
  editPriority.value = props.todo.priority;
  editDueDate.value = props.todo.dueDate || '';
  editTags.value = props.todo.tags.join(', ');
};

const saveEdit = () => {
  if (!editTitle.value.trim()) return;

  const updatedTodo: Todo = {
    ...props.todo,
    title: editTitle.value.trim(),
    description: editDescription.value.trim(),
    priority: editPriority.value,
    dueDate: editDueDate.value || null,
    tags: editTags.value.split(',').map((t) => t.trim()).filter(Boolean),
  };

  emit('edit', updatedTodo);
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const formatDate = (date: string | null) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

const isOverdue = (date: string | null) => {
  if (!date || props.todo.completed) return false;
  return new Date(date) < new Date();
};

const getPriorityClass = (priority: string) => {
  return `priority-${priority}`;
};
</script>

<template>
  <div :class="['todo-item', { completed: todo.completed, editing: isEditing }]">
    <div v-if="!isEditing" class="todo-content">
      <div class="todo-header">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="emit('toggle', todo.id)"
          class="todo-checkbox"
        />
        <h3 :class="['todo-title', { 'line-through': todo.completed }]">
          {{ todo.title }}
        </h3>
        <span :class="['priority-badge', getPriorityClass(todo.priority)]">
          {{ todo.priority }}
        </span>
      </div>

      <p v-if="todo.description" class="todo-description">{{ todo.description }}</p>

      <div class="todo-meta">
        <span v-if="todo.dueDate" :class="['due-date', { overdue: isOverdue(todo.dueDate) }]">
          📅 {{ formatDate(todo.dueDate) }}
        </span>
        <div v-if="todo.tags.length" class="tags">
          <span v-for="tag in todo.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="todo-actions">
        <button @click="startEdit" class="btn btn-edit">✏️ Edit</button>
        <button @click="emit('delete', todo.id)" class="btn btn-delete">🗑️ Delete</button>
      </div>
    </div>

    <div v-else class="edit-form">
      <input
        v-model="editTitle"
        type="text"
        placeholder="Todo title"
        class="input-title"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
      />
      <textarea
        v-model="editDescription"
        placeholder="Description (optional)"
        class="input-description"
        rows="3"
      />
      <div class="edit-row">
        <select v-model="editPriority" class="input-priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input v-model="editDueDate" type="date" class="input-date" />
      </div>
      <input
        v-model="editTags"
        type="text"
        placeholder="Tags (comma separated)"
        class="input-tags"
      />
      <div class="edit-actions">
        <button @click="saveEdit" class="btn btn-save">💾 Save</button>
        <button @click="cancelEdit" class="btn btn-cancel">❌ Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.todo-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.todo-item.completed {
  opacity: 0.7;
  background: var(--surface-dim);
}

.todo-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.todo-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: var(--primary);
}

.todo-title {
  flex: 1;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.todo-title.line-through {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.priority-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-low {
  background: var(--priority-low-bg);
  color: var(--priority-low);
}

.priority-medium {
  background: var(--priority-medium-bg);
  color: var(--priority-medium);
}

.priority-high {
  background: var(--priority-high-bg);
  color: var(--priority-high);
}

.todo-description {
  color: var(--text-secondary);
  margin: 0.5rem 0 0.75rem 2rem;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.75rem 0 0 2rem;
  flex-wrap: wrap;
}

.due-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.due-date.overdue {
  color: var(--danger);
  font-weight: 600;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--tag-bg);
  color: var(--tag-text);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  margin-left: 2rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-edit {
  background: var(--secondary);
  color: var(--text-primary);
}

.btn-edit:hover {
  background: var(--secondary-hover);
}

.btn-delete {
  background: var(--danger-bg);
  color: var(--danger);
}

.btn-delete:hover {
  background: var(--danger);
  color: white;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-title,
.input-description,
.input-priority,
.input-date,
.input-tags {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--text-primary);
  font-family: inherit;
}

.input-title {
  font-weight: 600;
  font-size: 1.125rem;
}

.input-description {
  resize: vertical;
}

.edit-row {
  display: flex;
  gap: 0.75rem;
}

.input-priority,
.input-date {
  flex: 1;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-save {
  background: var(--primary);
  color: white;
  flex: 1;
}

.btn-save:hover {
  background: var(--primary-hover);
}

.btn-cancel {
  background: var(--secondary);
  color: var(--text-primary);
}

.btn-cancel:hover {
  background: var(--secondary-hover);
}
</style>
