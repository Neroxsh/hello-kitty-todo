export type FilterType = "all" | "active" | "completed" | "favorite";

export type SortMode = "manual" | "importance" | "deadline" | "smart";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  favorite: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
  deadline?: number;
  importance: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface AppState {
  items: TodoItem[];
  filter: FilterType;
  sortMode: SortMode;
  alwaysOnTop: boolean;
  theme: "pink";
  widgetPosition?: WidgetPosition;
  widgetHeight?: number;
}
