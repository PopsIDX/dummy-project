import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TodoItem from "@/components/TodoItem.vue";
import type { Todo } from "@/types/todo";

function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "test-id-1",
    text: "Test todo",
    completed: false,
    createdAt: Date.now(),
    ...overrides,
  };
}

describe("TodoItem", () => {
  it("renders todo text", () => {
    const wrapper = mount(TodoItem, {
      props: { todo: createTodo({ text: "Buy milk" }), editing: false },
    });
    expect(wrapper.text()).toContain("Buy milk");
  });

  it("shows checkbox as unchecked for active todo", () => {
    const wrapper = mount(TodoItem, {
      props: { todo: createTodo({ completed: false }), editing: false },
    });
    const checkbox = wrapper.find<HTMLInputElement>('input[type="checkbox"]');
    expect(checkbox.element.checked).toBe(false);
  });

  it("shows checkbox as checked for completed todo", () => {
    const wrapper = mount(TodoItem, {
      props: { todo: createTodo({ completed: true }), editing: false },
    });
    const checkbox = wrapper.find<HTMLInputElement>('input[type="checkbox"]');
    expect(checkbox.element.checked).toBe(true);
  });

  it("applies completed class when todo is completed", () => {
    const wrapper = mount(TodoItem, {
      props: { todo: createTodo({ completed: true }), editing: false },
    });
    expect(wrapper.find(".todo-item").classes()).toContain("completed");
  });

  it("emits toggle event when checkbox is clicked", async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo, editing: false },
    });
    await wrapper.find('input[type="checkbox"]').trigger("change");
    expect(wrapper.emitted("toggle")).toEqual([["test-id-1"]]);
  });

  it("emits remove event when delete button is clicked", async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo, editing: false },
    });
    await wrapper.find(".delete-btn").trigger("click");
    expect(wrapper.emitted("remove")).toEqual([["test-id-1"]]);
  });

  it("emits startEdit event on double-click", async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo, editing: false },
    });
    await wrapper.find(".todo-text").trigger("dblclick");
    expect(wrapper.emitted("startEdit")).toEqual([["test-id-1"]]);
  });

  it("shows edit input when in editing mode", () => {
    const wrapper = mount(TodoItem, {
      props: { todo: createTodo(), editing: true },
    });
    expect(wrapper.find(".edit-input").exists()).toBe(true);
    expect(wrapper.find(".todo-view").exists()).toBe(false);
  });

  it("hides edit input when not in editing mode", () => {
    const wrapper = mount(TodoItem, {
      props: { todo: createTodo(), editing: false },
    });
    expect(wrapper.find(".edit-input").exists()).toBe(false);
    expect(wrapper.find(".todo-view").exists()).toBe(true);
  });

  it("emits finishEdit on Enter key in edit mode", async () => {
    const todo = createTodo({ text: "Original" });
    const wrapper = mount(TodoItem, {
      props: { todo, editing: true },
    });
    const input = wrapper.find<HTMLInputElement>(".edit-input");
    await input.setValue("Updated text");
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("finishEdit")).toEqual([
      ["test-id-1", "Updated text"],
    ]);
  });

  it("emits cancelEdit on Escape key in edit mode", async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo, editing: true },
    });
    await wrapper.find(".edit-input").trigger("keydown", { key: "Escape" });
    expect(wrapper.emitted("cancelEdit")).toBeTruthy();
  });

  it("emits finishEdit on blur in edit mode", async () => {
    const todo = createTodo();
    const wrapper = mount(TodoItem, {
      props: { todo, editing: true },
    });
    await wrapper.find(".edit-input").trigger("blur");
    expect(wrapper.emitted("finishEdit")).toBeTruthy();
  });

  it("has proper aria-label on checkbox", () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: createTodo({ text: "Accessible todo", completed: false }),
        editing: false,
      },
    });
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.attributes("aria-label")).toBe(
      "Mark 'Accessible todo' as complete",
    );
  });

  it("has proper aria-label on delete button", () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: createTodo({ text: "Delete me" }),
        editing: false,
      },
    });
    const btn = wrapper.find(".delete-btn");
    expect(btn.attributes("aria-label")).toBe("Delete 'Delete me'");
  });
});
