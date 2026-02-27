import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTodos } from "@/composables/useTodos";
import { nextTick } from "vue";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

// Mock crypto.randomUUID
let uuidCounter = 0;
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => `uuid-${++uuidCounter}`,
  },
});

describe("useTodos", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    uuidCounter = 0;
  });

  it("starts with an empty list", () => {
    const { todos, activeCount, completedCount } = useTodos();
    expect(todos.value).toEqual([]);
    expect(activeCount.value).toBe(0);
    expect(completedCount.value).toBe(0);
  });

  it("adds a todo", () => {
    const { todos, addTodo, activeCount } = useTodos();
    addTodo("Buy groceries");
    expect(todos.value).toHaveLength(1);
    expect(todos.value[0].text).toBe("Buy groceries");
    expect(todos.value[0].completed).toBe(false);
    expect(activeCount.value).toBe(1);
  });

  it("trims whitespace from new todos", () => {
    const { todos, addTodo } = useTodos();
    addTodo("  Hello world  ");
    expect(todos.value[0].text).toBe("Hello world");
  });

  it("does not add empty or whitespace-only todos", () => {
    const { todos, addTodo } = useTodos();
    addTodo("");
    addTodo("   ");
    expect(todos.value).toHaveLength(0);
  });

  it("adds new todos at the top of the list", () => {
    const { todos, addTodo } = useTodos();
    addTodo("First");
    addTodo("Second");
    expect(todos.value[0].text).toBe("Second");
    expect(todos.value[1].text).toBe("First");
  });

  it("removes a todo", () => {
    const { todos, addTodo, removeTodo } = useTodos();
    addTodo("Task A");
    addTodo("Task B");
    const idToRemove = todos.value[0].id;
    removeTodo(idToRemove);
    expect(todos.value).toHaveLength(1);
    expect(todos.value[0].text).toBe("Task A");
  });

  it("toggles a todo between completed and active", () => {
    const { todos, addTodo, toggleTodo } = useTodos();
    addTodo("Toggle me");
    const id = todos.value[0].id;

    toggleTodo(id);
    expect(todos.value[0].completed).toBe(true);

    toggleTodo(id);
    expect(todos.value[0].completed).toBe(false);
  });

  it("toggles all todos to completed when not all are done", () => {
    const { todos, addTodo, toggleTodo, toggleAll } = useTodos();
    addTodo("A");
    addTodo("B");
    addTodo("C");
    toggleTodo(todos.value[0].id); // Mark first as completed

    toggleAll();
    expect(todos.value.every((t) => t.completed)).toBe(true);
  });

  it("toggles all todos to active when all are completed", () => {
    const { todos, addTodo, toggleAll } = useTodos();
    addTodo("A");
    addTodo("B");
    // Mark all completed
    toggleAll();
    expect(todos.value.every((t) => t.completed)).toBe(true);

    // Toggle again should mark all active
    toggleAll();
    expect(todos.value.every((t) => !t.completed)).toBe(true);
  });

  it("clears completed todos", () => {
    const { todos, addTodo, toggleTodo, clearCompleted } = useTodos();
    addTodo("Keep");
    addTodo("Remove");
    toggleTodo(todos.value[0].id); // Mark "Remove" as completed

    clearCompleted();
    expect(todos.value).toHaveLength(1);
    expect(todos.value[0].text).toBe("Keep");
  });

  it("filters todos by active", () => {
    const { addTodo, toggleTodo, filter, filteredTodos, todos } = useTodos();
    addTodo("Active");
    addTodo("Done");
    toggleTodo(todos.value[0].id);

    filter.value = "active";
    expect(filteredTodos.value).toHaveLength(1);
    expect(filteredTodos.value[0].text).toBe("Active");
  });

  it("filters todos by completed", () => {
    const { addTodo, toggleTodo, filter, filteredTodos, todos } = useTodos();
    addTodo("Active");
    addTodo("Done");
    toggleTodo(todos.value[0].id);

    filter.value = "completed";
    expect(filteredTodos.value).toHaveLength(1);
    expect(filteredTodos.value[0].text).toBe("Done");
  });

  it("shows all todos with 'all' filter", () => {
    const { addTodo, toggleTodo, filter, filteredTodos, todos } = useTodos();
    addTodo("Active");
    addTodo("Done");
    toggleTodo(todos.value[0].id);

    filter.value = "all";
    expect(filteredTodos.value).toHaveLength(2);
  });

  it("computes allCompleted correctly", () => {
    const { addTodo, toggleAll, allCompleted } = useTodos();
    expect(allCompleted.value).toBe(false); // No todos

    addTodo("A");
    expect(allCompleted.value).toBe(false);

    toggleAll();
    expect(allCompleted.value).toBe(true);
  });

  it("supports inline editing", () => {
    const {
      todos,
      addTodo,
      editingId,
      startEditing,
      finishEditing,
    } = useTodos();
    addTodo("Original");
    const id = todos.value[0].id;

    startEditing(id);
    expect(editingId.value).toBe(id);

    finishEditing(id, "Updated");
    expect(todos.value[0].text).toBe("Updated");
    expect(editingId.value).toBeNull();
  });

  it("cancels editing without changes", () => {
    const { todos, addTodo, editingId, startEditing, cancelEditing } =
      useTodos();
    addTodo("Original");
    const id = todos.value[0].id;

    startEditing(id);
    cancelEditing();
    expect(editingId.value).toBeNull();
    expect(todos.value[0].text).toBe("Original");
  });

  it("removes todo when editing to empty text", () => {
    const { todos, addTodo, finishEditing } = useTodos();
    addTodo("Will be removed");
    const id = todos.value[0].id;

    finishEditing(id, "   ");
    expect(todos.value).toHaveLength(0);
  });

  it("persists todos to localStorage on change", async () => {
    const { addTodo } = useTodos();
    addTodo("Persisted");
    await nextTick();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "vue-todo-app",
      expect.stringContaining("Persisted"),
    );
  });
});
