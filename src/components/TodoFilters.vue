<script setup lang="ts">
import type { FilterType, SortType } from '../types/todo';

interface Props {
  filter: FilterType;
  sortBy: SortType;
  searchQuery: string;
  stats: {
    total: number;
    active: number;
    completed: number;
    highPriority: number;
    overdue: number;
  };
}

interface Emits {
  (e: 'update:filter', value: FilterType): void;
  (e: 'update:sortBy', value: SortType): void;
  (e: 'update:searchQuery', value: string): void;
  (e: 'clearCompleted'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="filters-container">
    <!-- Statistics -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.active }}</div>
          <div class="stat-label">Active</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completed }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>
      <div class="stat-card priority">
        <div class="stat-icon">🔴</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.highPriority }}</div>
          <div class="stat-label">High Priority</div>
        </div>
      </div>
      <div class="stat-card overdue">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.overdue }}</div>
          <div class="stat-label">Overdue</div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        :value="searchQuery"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Search todos..."
        class="search-input"
      />
    </div>

    <!-- Filters and Sort -->
    <div class="controls">
      <div class="filter-buttons">
        <button
          :class="['filter-btn', { active: filter === 'all' }]"
          @click="emit('update:filter', 'all')"
        >
          All
        </button>
        <button
          :class="['filter-btn', { active: filter === 'active' }]"
          @click="emit('update:filter', 'active')"
        >
          Active
        </button>
        <button
          :class="['filter-btn', { active: filter === 'completed' }]"
          @click="emit('update:filter', 'completed')"
        >
          Completed
        </button>
      </div>

      <div class="sort-control">
        <label for="sort-select">Sort by:</label>
        <select
          id="sort-select"
          :value="sortBy"
          @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value as SortType)"
          class="sort-select"
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <button
        v-if="stats.completed > 0"
        @click="emit('clearCompleted')"
        class="btn-clear"
      >
        🗑️ Clear Completed
      </button>
    </div>
  </div>
</template>

<style scoped>
.filters-container {
  margin-bottom: 2rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.priority {
  border-color: var(--priority-high);
}

.stat-card.overdue {
  border-color: var(--danger);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.search-box {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--surface);
  color: var(--text-primary);
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.25rem;
}

.filter-btn {
  padding: 0.5rem 1.25rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: var(--secondary);
  color: var(--text-primary);
}

.filter-btn.active {
  background: var(--primary);
  color: white;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-control label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-clear {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: var(--danger-bg);
  color: var(--danger);
  border: 1px solid var(--danger);
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: var(--danger);
  color: white;
}

@media (max-width: 768px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    width: 100%;
  }

  .filter-btn {
    flex: 1;
  }

  .sort-control {
    width: 100%;
    justify-content: space-between;
  }

  .btn-clear {
    margin-left: 0;
    width: 100%;
  }
}
</style>
