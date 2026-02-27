import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import App from "@/App.vue";

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

let uuidCounter = 0;
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => `uuid-${++uuidCounter}`,
  },
});

describe("App", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    uuidCounter = 0;
  });

  it("renders the app title", () => {
    const wrapper = mount(App);
    expect(wrapper.find(".title").text()).toBe("todos");
  });

  it("shows empty state when no todos exist", () => {
    const wrapper = mount(App);
    expect(wrapper.find(".empty-state").exists()).toBe(true);
    expect(wrapper.text()).toContain("No todos yet");
  });

  it("adds a todo via the input form", async () => {
    const wrapper = mount(App);
    const input = wrapper.find<HTMLInputElement>(".new-todo");
    await input.setValue("New task");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.text()).toContain("New task");
    expect(input.element.value).toBe("");
  });

  it("shows item count in footer after adding todos", async () => {
    const wrapper = mount(App);
    await wrapper.find<HTMLInputElement>(".new-todo").setValue("Task 1");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.find(".footer").exists()).toBe(true);
    expect(wrapper.text()).toContain("1 item left");
  });

  it("uses plural for multiple items", async () => {
    const wrapper = mount(App);
    const input = wrapper.find<HTMLInputElement>(".new-todo");

    await input.setValue("Task 1");
    await wrapper.find("form").trigger("submit");
    await input.setValue("Task 2");
    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("2 items left");
  });

  it("shows filter buttons in footer", async () => {
    const wrapper = mount(App);
    await wrapper.find<HTMLInputElement>(".new-todo").setValue("Task");
    await wrapper.find("form").trigger("submit");

    const buttons = wrapper.findAll(".filters button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0].text()).toBe("All");
    expect(buttons[1].text()).toBe("Active");
    expect(buttons[2].text()).toBe("Completed");
  });

  it("highlights the selected filter", async () => {
    const wrapper = mount(App);
    await wrapper.find<HTMLInputElement>(".new-todo").setValue("Task");
    await wrapper.find("form").trigger("submit");

    const buttons = wrapper.findAll(".filters button");
    expect(buttons[0].classes()).toContain("selected");

    await buttons[1].trigger("click");
    expect(buttons[1].classes()).toContain("selected");
  });

  it("has an autofocus input", () => {
    const wrapper = mount(App);
    const input = wrapper.find(".new-todo");
    expect(input.attributes("autofocus")).toBeDefined();
  });

  it("shows the instruction subtitle", () => {
    const wrapper = mount(App);
    expect(wrapper.find(".subtitle").text()).toContain("Double-click");
  });
});
