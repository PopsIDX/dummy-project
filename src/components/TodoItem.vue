<script setup lang="ts">
import { ref, watchEffect, nextTick } from "vue";
import type { Todo } from "@/types/todo";

const props = defineProps<{
  todo: Todo;
  editing: boolean;
}>();

const emit = defineEmits<{
  toggle: [id: string];
  remove: [id: string];
  startEdit: [id: string];
  finishEdit: [id: string, text: string];
  cancelEdit: [];
}>();

const editText = ref(props.todo.text);
const editInput = ref<HTMLInputElement | null>(null);

watchEffect(() => {
  if (props.editing) {
    editText.value = props.todo.text;
    nextTick(() => editInput.value?.focus());
  }
});

function handleFinishEdit() {
  emit("finishEdit", props.todo.id, editText.value);
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    handleFinishEdit();
  } else if (e.key === "Escape") {
    emit("cancelEdit");
  }
}
</script>

<template>
  <li class="todo-item" :class="{ completed: todo.completed, editing }">
    <div v-if="!editing" class="todo-view">
      <label class="checkbox-wrapper">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="emit('toggle', todo.id)"
          class="checkbox"
          :aria-label="`Mark '${todo.text}' as ${todo.completed ? 'incomplete' : 'complete'}`"
        />
        <span class="checkmark" />
      </label>
      <span class="todo-text" @dblclick="emit('startEdit', todo.id)" v-html="todo.text" />
      <button
        class="delete-btn"
        @click="emit('remove', todo.id)"
        :aria-label="`Delete '${todo.text}'`"
      >
        &times;
      </button>
    </div>
    <div v-else class="todo-edit">
      <input
        ref="editInput"
        v-model="editText"
        class="edit-input"
        @blur="handleFinishEdit"
        @keydown="handleKeydown"
      />
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  border-bottom: 1px solid var(--border);
  transition: background-color 0.15s ease;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background-color: var(--hover);
}

.todo-view {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 12px;
}

.checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  cursor: pointer;
}

.checkbox {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  margin: 0;
}

.checkmark {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark::after {
  content: "";
  display: none;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.completed .checkmark {
  background-color: var(--accent);
  border-color: var(--accent);
}

.completed .checkmark::after {
  display: block;
}

.todo-text {
  flex: 1;
  font-size: 15px;
  color: var(--text);
  cursor: default;
  user-select: none;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.completed .todo-text {
  text-decoration: line-through;
  color: var(--text-muted);
}

.delete-btn {
  opacity: 0;
  background: none;
  border: none;
  color: var(--danger);
  font-size: 22px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
}

.todo-item:hover .delete-btn {
  opacity: 1;
}

.todo-edit {
  padding: 4px;
}

.edit-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 2px solid var(--accent);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}
</style>
