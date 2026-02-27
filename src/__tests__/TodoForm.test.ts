import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoForm from '../components/TodoForm.vue';

describe('TodoForm', () => {
  it('renders add todo button initially', () => {
    const wrapper = mount(TodoForm);

    expect(wrapper.find('.btn-add-todo').exists()).toBe(true);
    expect(wrapper.text()).toContain('Add New Todo');
  });

  it('shows form when add button is clicked', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('.btn-add-todo').trigger('click');

    expect(wrapper.find('.todo-form').exists()).toBe(true);
    expect(wrapper.find('.input-title').exists()).toBe(true);
  });

  it('emits add event with correct data', async () => {
    const wrapper = mount(TodoForm);

    // Show form
    await wrapper.find('.btn-add-todo').trigger('click');

    // Fill in the form
    await wrapper.find('.input-title').setValue('New Todo');
    await wrapper.find('.input-description').setValue('New Description');
    await wrapper.find('.input-priority').setValue('high');
    await wrapper.find('.input-date').setValue('2024-12-31');
    await wrapper.find('.input-tags').setValue('work, urgent');

    // Submit
    await wrapper.find('.btn-add').trigger('click');

    expect(wrapper.emitted('add')).toBeTruthy();
    const emittedData = wrapper.emitted('add')?.[0][0] as any;
    expect(emittedData.title).toBe('New Todo');
    expect(emittedData.description).toBe('New Description');
    expect(emittedData.priority).toBe('high');
    expect(emittedData.dueDate).toBe('2024-12-31');
    expect(emittedData.tags).toEqual(['work', 'urgent']);
    expect(emittedData.completed).toBe(false);
  });

  it('resets form after adding todo', async () => {
    const wrapper = mount(TodoForm);

    // Show form
    await wrapper.find('.btn-add-todo').trigger('click');

    // Fill and submit
    await wrapper.find('.input-title').setValue('New Todo');
    await wrapper.find('.btn-add').trigger('click');

    // Form should be hidden
    expect(wrapper.find('.todo-form').exists()).toBe(false);
    expect(wrapper.find('.btn-add-todo').exists()).toBe(true);
  });

  it('does not emit add event with empty title', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('.btn-add-todo').trigger('click');
    await wrapper.find('.btn-add').trigger('click');

    expect(wrapper.emitted('add')).toBeFalsy();
  });

  it('trims whitespace from title', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('.btn-add-todo').trigger('click');
    await wrapper.find('.input-title').setValue('  Spaced Title  ');
    await wrapper.find('.btn-add').trigger('click');

    const emittedData = wrapper.emitted('add')?.[0][0] as any;
    expect(emittedData.title).toBe('Spaced Title');
  });

  it('hides form when cancel is clicked', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('.btn-add-todo').trigger('click');
    expect(wrapper.find('.todo-form').exists()).toBe(true);

    await wrapper.find('.btn-cancel').trigger('click');
    expect(wrapper.find('.todo-form').exists()).toBe(false);
  });

  it('parses tags correctly', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('.btn-add-todo').trigger('click');
    await wrapper.find('.input-title').setValue('Test');
    await wrapper.find('.input-tags').setValue('tag1, tag2,  tag3  ');
    await wrapper.find('.btn-add').trigger('click');

    const emittedData = wrapper.emitted('add')?.[0][0] as any;
    expect(emittedData.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('sets default priority to medium', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('.btn-add-todo').trigger('click');
    await wrapper.find('.input-title').setValue('Test');
    await wrapper.find('.btn-add').trigger('click');

    const emittedData = wrapper.emitted('add')?.[0][0] as any;
    expect(emittedData.priority).toBe('medium');
  });

  it('disables add button when title is empty', async () => {
    const wrapper = mount(TodoForm);

    await wrapper.find('.btn-add-todo').trigger('click');

    const addButton = wrapper.find('.btn-add');
    expect(addButton.attributes('disabled')).toBeDefined();
  });
});
