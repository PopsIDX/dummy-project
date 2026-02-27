import { ref, computed, watch } from "vue";
import type { Todo, FilterMode } from "@/types/todo";

const STORAGE_KEY = "vue-todo-app";

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const todos = ref<Todo[]>(loadTodos());
  const filter = ref<FilterMode>("all");
  const editingId = ref<string | null>(null);

  // Persist to localStorage on every change
  watch(todos, (val) => saveTodos(val), { deep: true });

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case "active":
        return todos.value.filter((t) => !t.completed);
      case "completed":
        return todos.value.filter((t) => t.completed);
      default:
        return todos.value;
    }
  });

  const activeCount = computed(
    () => todos.value.filter((t) => !t.completed).length,
  );

  const completedCount = computed(
    () => todos.value.filter((t) => t.completed).length,
  );

  const allCompleted = computed(
    () => todos.value.length > 0 && activeCount.value === 0,
  );

  function addTodo(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.value.unshift({
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    });
  }

  function removeTodo(id: string): void {
    todos.value = todos.value.filter((t) => t.id !== id);
  }

  function toggleTodo(id: string): void {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) todo.completed = !todo.completed;
  }

  function toggleAll(): void {
    const allDone = allCompleted.value;
    todos.value.forEach((t) => (t.completed = !allDone));
  }

  function clearCompleted(): void {
    todos.value = todos.value.filter((t) => !t.completed);
  }

  function startEditing(id: string): void {
    editingId.value = id;
  }

  function finishEditing(id: string, newText: string): void {
    const trimmed = newText.trim();
    if (!trimmed) {
      removeTodo(id);
    } else {
      const todo = todos.value.find((t) => t.id === id);
      if (todo) todo.text = trimmed;
    }
    editingId.value = null;
  }

  function cancelEditing(): void {
    editingId.value = null;
  }

  return {
    todos,
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
  };
}
