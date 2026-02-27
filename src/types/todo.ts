export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterMode = "all" | "active" | "completed";
