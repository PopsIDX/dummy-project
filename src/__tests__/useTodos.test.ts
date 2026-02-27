import { describe, it, expect, beforeEach } from 'vitest';
import { useTodos } from '../composables/useTodos';

describe('useTodos', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('addTodo', () => {
    it('should add a new todo', () => {
      const { todos, addTodo } = useTodos();
      
      addTodo({
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      expect(todos.value).toHaveLength(1);
      expect(todos.value[0].title).toBe('Test Todo');
      expect(todos.value[0].description).toBe('Test Description');
      expect(todos.value[0].priority).toBe('medium');
      expect(todos.value[0].completed).toBe(false);
    });

    it('should generate unique IDs for todos', () => {
      const { todos, addTodo } = useTodos();
      
      addTodo({
        title: 'Todo 1',
        description: '',
        completed: false,
        priority: 'low',
        dueDate: null,
        tags: [],
      });

      addTodo({
        title: 'Todo 2',
        description: '',
        completed: false,
        priority: 'high',
        dueDate: null,
        tags: [],
      });

      expect(todos.value[0].id).not.toBe(todos.value[1].id);
    });

    it('should add createdAt and updatedAt timestamps', () => {
      const { todos, addTodo } = useTodos();
      
      addTodo({
        title: 'Test Todo',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      expect(todos.value[0].createdAt).toBeDefined();
      expect(todos.value[0].updatedAt).toBeDefined();
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', () => {
      const { todos, addTodo, updateTodo } = useTodos();
      
      addTodo({
        title: 'Original Title',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      const id = todos.value[0].id;
      updateTodo(id, { title: 'Updated Title' });

      expect(todos.value[0].title).toBe('Updated Title');
    });

    it('should update updatedAt timestamp', () => {
      const { todos, addTodo, updateTodo } = useTodos();
      
      addTodo({
        title: 'Test Todo',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      const id = todos.value[0].id;
      const originalUpdatedAt = todos.value[0].updatedAt;
      
      // Wait a bit to ensure timestamp changes
      setTimeout(() => {
        updateTodo(id, { title: 'Updated' });
        expect(todos.value[0].updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      const { todos, addTodo, deleteTodo } = useTodos();
      
      addTodo({
        title: 'Test Todo',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      const id = todos.value[0].id;
      expect(todos.value).toHaveLength(1);

      deleteTodo(id);
      expect(todos.value).toHaveLength(0);
    });

    it('should not affect other todos', () => {
      const { todos, addTodo, deleteTodo } = useTodos();
      
      addTodo({
        title: 'Todo 1',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      addTodo({
        title: 'Todo 2',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      const id = todos.value[0].id;
      deleteTodo(id);

      expect(todos.value).toHaveLength(1);
      expect(todos.value[0].title).toBe('Todo 2');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion status', () => {
      const { todos, addTodo, toggleTodo } = useTodos();
      
      addTodo({
        title: 'Test Todo',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      const id = todos.value[0].id;
      expect(todos.value[0].completed).toBe(false);

      toggleTodo(id);
      expect(todos.value[0].completed).toBe(true);

      toggleTodo(id);
      expect(todos.value[0].completed).toBe(false);
    });
  });

  describe('filteredTodos', () => {
    beforeEach(() => {
      const { addTodo } = useTodos();
      
      addTodo({
        title: 'Active Todo 1',
        description: '',
        completed: false,
        priority: 'high',
        dueDate: null,
        tags: ['work'],
      });

      addTodo({
        title: 'Completed Todo',
        description: '',
        completed: true,
        priority: 'low',
        dueDate: null,
        tags: ['personal'],
      });

      addTodo({
        title: 'Active Todo 2',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });
    });

    it('should filter active todos', () => {
      const { filter, filteredTodos } = useTodos();
      filter.value = 'active';

      expect(filteredTodos.value).toHaveLength(2);
      expect(filteredTodos.value.every(t => !t.completed)).toBe(true);
    });

    it('should filter completed todos', () => {
      const { filter, filteredTodos } = useTodos();
      filter.value = 'completed';

      expect(filteredTodos.value).toHaveLength(1);
      expect(filteredTodos.value[0].completed).toBe(true);
    });

    it('should show all todos', () => {
      const { filter, filteredTodos } = useTodos();
      filter.value = 'all';

      expect(filteredTodos.value).toHaveLength(3);
    });

    it('should search todos by title', () => {
      const { searchQuery, filteredTodos } = useTodos();
      searchQuery.value = 'Active Todo 1';

      expect(filteredTodos.value).toHaveLength(1);
      expect(filteredTodos.value[0].title).toBe('Active Todo 1');
    });

    it('should search todos by tags', () => {
      const { searchQuery, filteredTodos } = useTodos();
      searchQuery.value = 'work';

      expect(filteredTodos.value).toHaveLength(1);
      expect(filteredTodos.value[0].tags).toContain('work');
    });

    it('should sort by priority', () => {
      const { sortBy, filteredTodos } = useTodos();
      sortBy.value = 'priority';

      expect(filteredTodos.value[0].priority).toBe('high');
      expect(filteredTodos.value[2].priority).toBe('low');
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos', () => {
      const { todos, addTodo, clearCompleted } = useTodos();
      
      addTodo({
        title: 'Active Todo',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      addTodo({
        title: 'Completed Todo',
        description: '',
        completed: true,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      expect(todos.value).toHaveLength(2);

      clearCompleted();

      expect(todos.value).toHaveLength(1);
      expect(todos.value[0].completed).toBe(false);
    });
  });

  describe('stats', () => {
    it('should calculate correct statistics', () => {
      const { stats, addTodo } = useTodos();
      
      addTodo({
        title: 'Active Todo',
        description: '',
        completed: false,
        priority: 'high',
        dueDate: null,
        tags: [],
      });

      addTodo({
        title: 'Completed Todo',
        description: '',
        completed: true,
        priority: 'medium',
        dueDate: null,
        tags: [],
      });

      expect(stats.value.total).toBe(2);
      expect(stats.value.active).toBe(1);
      expect(stats.value.completed).toBe(1);
      expect(stats.value.highPriority).toBe(1);
    });

    it('should identify overdue todos', () => {
      const { stats, addTodo } = useTodos();
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      addTodo({
        title: 'Overdue Todo',
        description: '',
        completed: false,
        priority: 'medium',
        dueDate: yesterday.toISOString().split('T')[0],
        tags: [],
      });

      expect(stats.value.overdue).toBe(1);
    });
  });
});
