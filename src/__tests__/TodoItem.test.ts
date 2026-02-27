import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoItem from '../components/TodoItem.vue';
import type { Todo } from '../types/todo';

describe('TodoItem', () => {
  const createTodo = (overrides?: Partial<Todo>): Todo => ({
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    ...overrides,
  });

  it('renders todo title', () => {
    const todo = createTodo({ title: 'My Test Todo' });
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    expect(wrapper.text()).toContain('My Test Todo');
  });

  it('renders todo description', () => {
    const todo = createTodo({ description: 'My Description' });
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    expect(wrapper.text()).toContain('My Description');
  });

  it('shows priority badge', () => {
    const todo = createTodo({ priority: 'high' });
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    expect(wrapper.text()).toContain('high');
  });

  it('applies completed class when todo is completed', () => {
    const todo = createTodo({ completed: true });
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    expect(wrapper.find('.todo-item').classes()).toContain('completed');
  });

  it('emits toggle event when checkbox is clicked', async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    await wrapper.find('.todo-checkbox').setValue(true);

    expect(wrapper.emitted('toggle')).toBeTruthy();
    expect(wrapper.emitted('toggle')?.[0]).toEqual([todo.id]);
  });

  it('emits delete event when delete button is clicked', async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    await wrapper.find('.btn-delete').trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.[0]).toEqual([todo.id]);
  });

  it('enters edit mode when edit button is clicked', async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    await wrapper.find('.btn-edit').trigger('click');

    expect(wrapper.find('.edit-form').exists()).toBe(true);
  });

  it('displays tags', () => {
    const todo = createTodo({ tags: ['work', 'urgent'] });
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    expect(wrapper.text()).toContain('work');
    expect(wrapper.text()).toContain('urgent');
  });

  it('displays due date', () => {
    const todo = createTodo({ dueDate: '2024-12-31' });
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    expect(wrapper.find('.due-date').exists()).toBe(true);
  });

  it('marks overdue todos', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const todo = createTodo({ dueDate: yesterday.toISOString().split('T')[0] });
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    expect(wrapper.find('.due-date.overdue').exists()).toBe(true);
  });

  it('emits edit event with updated data when save is clicked', async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    // Enter edit mode
    await wrapper.find('.btn-edit').trigger('click');

    // Update the title
    const titleInput = wrapper.find('.input-title');
    await titleInput.setValue('Updated Title');

    // Save
    await wrapper.find('.btn-save').trigger('click');

    expect(wrapper.emitted('edit')).toBeTruthy();
    const emittedTodo = wrapper.emitted('edit')?.[0][0] as Todo;
    expect(emittedTodo.title).toBe('Updated Title');
  });

  it('cancels edit mode when cancel button is clicked', async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo },
    });

    // Enter edit mode
    await wrapper.find('.btn-edit').trigger('click');
    expect(wrapper.find('.edit-form').exists()).toBe(true);

    // Cancel
    await wrapper.find('.btn-cancel').trigger('click');
    expect(wrapper.find('.edit-form').exists()).toBe(false);
  });
});
