import { ref, computed, watch } from 'vue';
import type { Todo, FilterType, SortType } from '../types/todo';

const STORAGE_KEY = 'vue-todos';

export function useTodos() {
  const todos = ref<Todo[]>([]);
  const filter = ref<FilterType>('all');
  const sortBy = ref<SortType>('createdAt');
  const searchQuery = ref('');
  const isDarkMode = ref(false);

  // Load todos from localStorage
  const loadTodos = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        todos.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  // Save todos to localStorage
  const saveTodos = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  };

  // Watch for changes and save
  watch(todos, saveTodos, { deep: true });

  // Load dark mode preference
  const loadDarkMode = () => {
    try {
      const stored = localStorage.getItem('vue-todos-dark-mode');
      if (stored !== null) {
        isDarkMode.value = stored === 'true';
      }
    } catch (error) {
      console.error('Failed to load dark mode:', error);
    }
  };

  // Save dark mode preference
  watch(isDarkMode, (value) => {
    try {
      localStorage.setItem('vue-todos-dark-mode', value.toString());
      document.documentElement.classList.toggle('dark', value);
    } catch (error) {
      console.error('Failed to save dark mode:', error);
    }
  });

  // Add a new todo
  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    todos.value.push(newTodo);
  };

  // Update a todo
  const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      const currentTodo = todos.value[index];
      if (currentTodo) {
        todos.value[index] = {
          ...currentTodo,
          ...updates,
          id: currentTodo.id,
          createdAt: currentTodo.createdAt,
          updatedAt: new Date().toISOString(),
        };
      }
    }
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    todos.value = todos.value.filter((t) => t.id !== id);
  };

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      updateTodo(id, { completed: !todo.completed });
    }
  };

  // Delete all completed todos
  const clearCompleted = () => {
    todos.value = todos.value.filter((t) => !t.completed);
  };

  // Filtered and sorted todos
  const filteredTodos = computed(() => {
    let result = todos.value;

    // Apply filter
    if (filter.value === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filter.value === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply sort
    result = [...result].sort((a, b) => {
      switch (sortBy.value) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  });

  // Statistics
  const stats = computed(() => ({
    total: todos.value.length,
    active: todos.value.filter((t) => !t.completed).length,
    completed: todos.value.filter((t) => t.completed).length,
    highPriority: todos.value.filter((t) => t.priority === 'high' && !t.completed).length,
    overdue: todos.value.filter((t) => {
      if (!t.dueDate || t.completed) return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  }));

  // Initialize
  loadTodos();
  loadDarkMode();

  return {
    todos,
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
  };
}
